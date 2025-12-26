from rest_framework import serializers
from .models import Order, UserOrders
from users.models import User
from users.serializers import UserSerializer
from store.models import Product

class UserOrdersSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = UserOrders
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    price = serializers.DecimalField(max_digits=8,decimal_places=2,coerce_to_string=False)
    user_orders = UserOrdersSerializer()
    class Meta:
        model = Order
        fields = ['id', 'name' , 'price', 'color', 'size', 'image', 'quantity' , 'product_id', 'user_orders']

        

