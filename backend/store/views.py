from rest_framework import generics, status
from django.db import IntegrityError, DatabaseError
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, ProductColorSize
from .serializers import ProductSerializer, ProductColorSizeSerializer
from rest_framework.viewsets import ModelViewSet
import json
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        query = Product.objects.all()
        request = self.request

        view_type = request.GET.get('type')
        if view_type:
            if view_type == 'New Arrival':
                query = query.order_by('-created_at')
            elif view_type == 'Best Sells':
                query = query.order_by('-sold_count')
            elif view_type == 'Featured':
                query = query.filter(is_featured=True)
            elif view_type != 'All Products':
                query = Product.objects.none()

        ordering = request.GET.get('ordering')
        if ordering:
            mapping = {
                'Name: A to Z': 'name',
                'Name: Z to A': '-name',
                'Price: Low to High': 'price',
                'Price: High to Low': '-price',
                'Date: Oldest First': 'created_at',
                'Date: Newest First': '-created_at',
            }
            query = query.order_by(mapping.get(ordering, 'created_at'))

        filters_json = request.GET.get("filters")
        if filters_json:
            try:
                filters = json.loads(filters_json)
                sizes = filters.get("sizes", [])
                colors = filters.get("colors", [])
                price_range = filters.get("priceRange", [])

                if sizes:
                    query = query.filter(
                        productcolor__productcolorsize__size__in=sizes
                    ).distinct()
                if colors:
                    colors=self.convert_color(colors)
                    print(colors)
                    query = query.filter(
                        productcolor__color__in=colors
                    ).distinct()
                if price_range and len(price_range) == 2:
                    query = query.filter(
                        price__gte=price_range[0], price__lte=price_range[1]
                    )
            except json.JSONDecodeError:
                query = Product.objects.none()

        query = query.filter(productcolor__productcolorsize__stock__gt=0).distinct()
        return query

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Products fetched successfully",
            "status": status.HTTP_200_OK,
            "data": serializer.data
        })
    
    @staticmethod
    def convert_color(colors):
        availebel_colors=[
            { "name": "#000000", "value": "Black" },
            { "name": "#ffffff", "value": "White" },
            { "name": "#ff0000", "value": "Red" },
            { "name": "#0000ff", "value": "Blue" },
            { "name": "#00ff00", "value": "Green" },
            { "name": "#ffff00", "value": "Yellow" },
            { "name": "#ffc0cb", "value": "Pink" },
            { "name": "#800080", "value": "Purple" },
            { "name": "#808080", "value": "Gray" },
            { "name": "#8B4513", "value": "Brown" },
            { "name": "#ffa500", "value": "Orange" },
            { "name": "#008080", "value": "Teal" }
        ]
        code_to_name = {c["name"].lower(): c["value"] for c in availebel_colors}
        return [code_to_name.get(code.lower(), "Unknown") for code in colors]
    
class AddProduct(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)  

class getProductById(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        request = self.request
        id = request.GET.get('id')
        query = Product.objects.filter(id=id)
        return query
    
class HandleProducts(ModelViewSet):
    queryset = ProductColorSize.objects.all()
    serializer_class = ProductColorSizeSerializer

    @action(detail=False, methods=['patch'])
    def UpdateStock(self, request):
        quantity = request.data.get('quantity')
        option = request.data.get('option')
        id = request.data.get('id')

        if quantity is None or option is None or id is None:
            return Response({'success': False, 'message': 'Error: missing fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
            size = get_object_or_404(ProductColorSize, pk=id)

            if option == "add":
                size.stock += quantity
            elif option == "decrease":
                size.stock -= quantity
            else:
                return Response({'success': False, 'message': 'Error: invalid option'}, status=status.HTTP_400_BAD_REQUEST)
            
            size.save()
            serializer = ProductColorSizeSerializer(size)
            return Response({'success': True, 'message': 'Updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({"success": False, "message": "Database constraints error."}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({"success": False, "message": "Database error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"success": False, "message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def DeleteProduct(self, request, pk=None):
        if (pk == None):
            return Response({'success': False, 'message': 'Error: missing fields'}, status=status.HTTP_400_BAD_REQUEST) 

        try:
            product = get_object_or_404(Product, pk=pk)
            product.delete()
            return Response({'success' : True, 'message' : 'Deleted with success'},status=status.HTTP_200_OK)
          
        except Http404:
            return Response({'success': False, 'message': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({"success": False, "message": "Cannot delete the product due to database constraints."}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({"success": False, "message": "A database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"success": False, "message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
