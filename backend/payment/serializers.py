from rest_framework import serializers
from .models import Payment
from order.serializers import UserOrdersSerializer

class PaymentSerializer(serializers.ModelSerializer):
    orders=UserOrdersSerializer()

    class Meta:
        model = Payment
        fields = "__all__"

    