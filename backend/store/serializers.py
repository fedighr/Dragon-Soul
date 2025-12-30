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

        existing_colors = {color.id: color for color in instance.productcolor_set.all()}
        processed_color_ids = set()

        color_index = 0
        while f'productcolor_set[{color_index}][color]' in request_data:
            color_value = request_data.get(f'productcolor_set[{color_index}][color]')
            color_id = request_data.get(f'productcolor_set[{color_index}][id]')
            image_file = request_data.get(f'productcolor_set[{color_index}][image]')
            existing_image = request_data.get(f'productcolor_set[{color_index}][existing_image]')
            sizes_json = request_data.get(f'productcolor_set[{color_index}][productcolorsize_set]')
            
            if color_value:
                if color_id and int(color_id) in existing_colors:
                    color_obj = existing_colors[int(color_id)]
                    processed_color_ids.add(int(color_id))
                    
                    color_obj.color = color_value
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
                    processed_color_ids.add(color_obj.id)
                
                if sizes_json:
                    sizes_data = json.loads(sizes_json) if isinstance(sizes_json, str) else sizes_json
                    
                    existing_sizes = {size.id: size for size in color_obj.productcolorsize_set.all()}
                    processed_size_ids = set()
                    
                    for size_data in sizes_data:
                        size_id = size_data.get('id')
                        
                        if size_id and size_id in existing_sizes:
                            size_obj = existing_sizes[size_id]
                            size_obj.size = size_data.get('size', size_obj.size)
                            size_obj.stock = size_data.get('stock', size_obj.stock)
                            size_obj.save()
                            processed_size_ids.add(size_id)
                        else:
                            new_size = ProductColorSize.objects.create(
                                color_id=color_obj,
                                size=size_data.get('size'),
                                stock=size_data.get('stock', 0)
                            )
                            processed_size_ids.add(new_size.id)
                    
                    for size_id, size_obj in existing_sizes.items():
                        if size_id not in processed_size_ids:
                            size_obj.delete()
            
            color_index += 1

        for color_id, color_obj in existing_colors.items():
            if color_id not in processed_color_ids:
                color_obj.delete()

        return instance