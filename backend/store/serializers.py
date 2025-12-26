from rest_framework import serializers
from .models import Product, ProductColor, ProductColorSize
import json

class ProductColorSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorSize
        fields = ["id", "size", "stock"]

class ProductColorSerializer(serializers.ModelSerializer):
    productcolorsize_set = ProductColorSizeSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductColor
        fields = ["id", "color", "image", "productcolorsize_set"]

class ProductSerializer(serializers.ModelSerializer):
    productcolor_set = ProductColorSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "Purchases", "description", "created_at", "productcolor_set"]

    def create(self, validated_data):
        request_data = self.context['request'].data
        
        product = Product.objects.create(**validated_data)

        color_index = 0
        while f'productcolor_set[{color_index}][color]' in request_data:
            color_value = request_data.get(f'productcolor_set[{color_index}][color]')
            image_file = request_data.get(f'productcolor_set[{color_index}][image]')
            sizes_json = request_data.get(f'productcolor_set[{color_index}][productcolorsize_set]')
            
            if color_value:
                color_obj = ProductColor.objects.create(
                    product_id=product,
                    color=color_value,
                    image=image_file
                )
                
                if sizes_json:
                    sizes_data = json.loads(sizes_json) if isinstance(sizes_json, str) else sizes_json
                    
                    for size_data in sizes_data:
                        ProductColorSize.objects.create(
                            color_id=color_obj,
                            size=size_data.get('size'),
                            stock=size_data.get('stock', 0)
                        )
            
            color_index += 1

        return product

    def update(self, instance, validated_data):
        request_data = self.context['request'].data
        
        instance.name = validated_data.get('name', instance.name)
        instance.price = validated_data.get('price', instance.price)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        existing_colors = {color.color: color for color in instance.productcolor_set.all()}
        processed_colors = set()

        color_index = 0
        while f'productcolor_set[{color_index}][color]' in request_data:
            color_value = request_data.get(f'productcolor_set[{color_index}][color]')
            image_file = request_data.get(f'productcolor_set[{color_index}][image]')
            existing_image = request_data.get(f'productcolor_set[{color_index}][existing_image]')
            sizes_json = request_data.get(f'productcolor_set[{color_index}][productcolorsize_set]')
            
            if color_value:
                processed_colors.add(color_value)
                
                if color_value in existing_colors:
                    color_obj = existing_colors[color_value]
                    if image_file:
                        color_obj.image = image_file
                        color_obj.save()
                else:
                    color_data = {
                        'product_id': instance,
                        'color': color_value
                    }
                    
                    if image_file:
                        color_data['image'] = image_file
                    elif existing_image:
                        color_data['image'] = existing_image
                    
                    color_obj = ProductColor.objects.create(**color_data)
                
                color_obj.productcolorsize_set.all().delete()
                
                if sizes_json:
                    sizes_data = json.loads(sizes_json) if isinstance(sizes_json, str) else sizes_json
                    
                    for size_data in sizes_data:
                        ProductColorSize.objects.create(
                            color_id=color_obj,
                            size=size_data.get('size'),
                            stock=size_data.get('stock', 0)
                        )
            
            color_index += 1

        for color_name, color_obj in existing_colors.items():
            if color_name not in processed_colors:
                color_obj.delete()

        return instance