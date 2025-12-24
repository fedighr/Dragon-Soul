from rest_framework import serializers
from .models import Order
from users.models import User
from store.models import Product

class OrderSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all())
    product_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    price = serializers.DecimalField(max_digits=8,decimal_places=2,coerce_to_string=False)
    class Meta:
        model = Order
        fields = ['id', 'name' , 'price', 'color', 'size', 'image', 'quantity' , 'user_id' , 'product_id']