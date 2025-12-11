from rest_framework import serializers
from .models import Product, ProductColor, ProductColorSize

class ProductColorSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorSize
        fields = ["id", "size", "stock"]

class ProductColorSerializer(serializers.ModelSerializer):
    productcolorsize_set = ProductColorSizeSerializer(many=True)

    class Meta:
        model = ProductColor
        fields = ["id", "color", "image", "productcolorsize_set"]

class ProductSerializer(serializers.ModelSerializer):
    productcolor_set = ProductColorSerializer(many=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "description", "created_at", "productcolor_set"]

    def create(self, validated_data):
        colors_data = validated_data.pop("productcolor_set", [])

        product = Product.objects.create(**validated_data)

        for color_data in colors_data:
            sizes_data = color_data.pop("productcolorsize_set", [])
            color = ProductColor.objects.create(product_id=product, **color_data)

            for size_data in sizes_data:
                ProductColorSize.objects.create(color_id=color, **size_data)

        return product

    