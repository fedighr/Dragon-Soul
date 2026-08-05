from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db import IntegrityError, DatabaseError
from django.db.models import Prefetch
import json

from .models import Product, ProductColor, ProductColorSize
from .serializers import ProductSerializer, ProductColorSizeSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        request = self.request

        query = Product.objects.prefetch_related(
            Prefetch(
                "productcolor_set",
                queryset=ProductColor.objects.prefetch_related(
                    "productcolorsize_set"
                )
            )
        )

        view_type = request.GET.get("type")

        if view_type == "New Arrival":
            query = query.order_by("-created_at")
        elif view_type == "Best Sells":
            query = query.order_by("-sold_count")
        elif view_type == "Featured":
            query = query.filter(is_featured=True)
        elif view_type and view_type != "All Products":
            return Product.objects.none()

        ordering_map = {
            'Name: A to Z': 'name',
            'Name: Z to A': '-name',
            'Price: Low to High': 'price',
            'Price: High to Low': '-price',
            'Date: Oldest First': 'created_at',
            'Date: Newest First': '-created_at',
        }

        ordering = request.GET.get("ordering")
        if ordering:
            query = query.order_by(ordering_map.get(ordering, "-created_at"))

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
                    )

                if colors:
                    colors = self.convert_color(colors)
                    query = query.filter(
                        productcolor__color__in=colors
                    )

                if price_range and len(price_range) == 2:
                    query = query.filter(
                        price__range=(price_range[0], price_range[1])
                    )

            except json.JSONDecodeError:
                return Product.objects.none()

        query = query.filter(
            productcolor__productcolorsize__stock__gt=0
        )

        return query.distinct()

    @staticmethod
    def convert_color(colors):
        available = {
            "#000000": "Black",
            "#ffffff": "White",
            "#ff0000": "Red",
            "#0000ff": "Blue",
            "#00ff00": "Green",
            "#ffff00": "Yellow",
            "#ffc0cb": "Pink",
            "#800080": "Purple",
            "#808080": "Gray",
            "#8B4513": "Brown",
            "#ffa500": "Orange",
            "#008080": "Teal",
        }
        return [available.get(code.lower(), "Unknown") for code in colors]


class AddProduct(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class GetProductById(ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        pid = self.request.GET.get("id")
        return Product.objects.filter(id=pid).prefetch_related(
            "productcolor_set__productcolorsize_set"
        )


class HandleProducts(ModelViewSet):
    queryset = ProductColorSize.objects.all()
    serializer_class = ProductColorSizeSerializer

    @action(detail=False, methods=['patch'])
    def UpdateStock(self, request):
        quantity = request.data.get('quantity')
        option = request.data.get('option')
        pid = request.data.get('id')

        if quantity is None or option is None or pid is None:
            return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
            size = get_object_or_404(ProductColorSize, pk=pid)

            if option == "add":
                size.stock += quantity
            elif option == "decrease":
                size.stock -= quantity
            else:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            size.save()
            return Response(
                {'success': True, 'data': ProductColorSizeSerializer(size).data},
                status=status.HTTP_200_OK
            )

        except IntegrityError:
            return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def DeleteProduct(self, request, pk=None):
        try:
            product = get_object_or_404(Product, pk=pk)
            product.delete()
            return Response({'success': True}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'success': False}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
