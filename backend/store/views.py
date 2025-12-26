from rest_framework import generics, status
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from rest_framework.viewsets import ModelViewSet
import json
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