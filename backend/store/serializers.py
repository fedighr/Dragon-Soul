from rest_framework import serializers
from .models import Product, ProductColor, ProductColorSize

class ProductColorSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorSize
        fields = ['size', 'stock']

class ProductColorSerializer(serializers.ModelSerializer):
    productcolorsize_set = ProductColorSizeSerializer(many=True, read_only=True)

    class Meta:
        model = ProductColor
        fields = ['color','image', 'productcolorsize_set']

class ProductSerializer(serializers.ModelSerializer):
    productcolor_set = ProductColorSerializer(many=True, read_only=True)

    class Meta:               
        model = Product       
        fields = ['id', 'name', 'price', 'description', 'created_at', 'productcolor_set']