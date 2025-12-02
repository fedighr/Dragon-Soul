from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Order
from rest_framework.pagination import PageNumberPagination
from users.models import User
from .serializers import OrderSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class NoPagination(PageNumberPagination):
    page_size = None

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        queryset = Order.objects.filter(user=user_id)
        if user_id:
            queryset = queryset.filter(user=user_id)
        return queryset

    @action(detail=False,methods=['delete'])
    def delete_all(self,request):
        user_id=request.query_params.get('user')
        if not user_id:
            return Response({'success':False,'error':'user param is required'},status=status.HTTP_400_BAD_REQUEST)
        try:
            user=User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'success':False,'error':'User not found'},status=status.HTTP_404_NOT_FOUND)
        orders=Order.objects.filter(user=user)
        if not orders.exists():
            return Response({'success':False,'error':'No orders for this user'},status=status.HTTP_400_BAD_REQUEST)
        deleted_count,_=orders.delete()
        return Response({'success':True,'deleted':deleted_count},status=status.HTTP_204_NO_CONTENT)







