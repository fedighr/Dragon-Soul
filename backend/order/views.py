from django.shortcuts import render
from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from .models import Order
from store.models import ProductColor, ProductColorSize
from rest_framework.pagination import PageNumberPagination
from users.models import User
from .serializers import OrderSerializer
from store.serializers import ProductColorSerializer, ProductColorSizeSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404

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
    
    @action(detail=False, methods=['post'])
    def addOrder(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            color = data["color"]
            size = data["size"]
            quantity = data["quantity"]
            user = data["user"]
            price = data["price"]
            product = data["product"]
            with transaction.atomic():
                order_qs = Order.objects.filter(
                    color=color, size=size, user=user, product=product
                )
                if order_qs.exists():
                    order_instance = order_qs.first()
                    order_instance.quantity += quantity
                    order_instance.price = price * order_instance.quantity
                    order_instance.save()
                    return Response({'success': True}, status=status.HTTP_200_OK)

                serializer.save()
                return Response({"success": True}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
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
    
    @action(detail=True, methods=["patch"])
    def updateStock(self,request, pk=None):
        quantity = request.data.get('quantity')
        option = request.data.get('option')
        if((not pk) or (not quantity) or (not option)):
            return Response({'success':False,'error':'Error'},status=status.HTTP_400_BAD_REQUEST)
        try:
            order = get_object_or_404(Order, pk=pk)
            orderSerializer = OrderSerializer(order).data
            color = get_object_or_404(ProductColor,product_id=orderSerializer['product'],color=orderSerializer['color'])
            colorid = ProductColorSerializer(color).data['id']
            size = get_object_or_404(ProductColorSize, color_id=colorid, size=orderSerializer['size'])
            serializer = ProductColorSizeSerializer(size)
            stock = serializer.data['stock']
            print(stock)
            if(option == "+"):
                if(stock-quantity<1):
                    return Response({'success' : False, 'message' : 'Not enough'},status=status.HTTP_304_NOT_MODIFIED)
                else:
                    size.stock -=quantity
                    order.quantity += quantity
                    order.price += order.price/quantity
                    size.save()
                    order.save()
                    return Response({'success' : True, 'message' : 'modified'},status=status.HTTP_200_OK)
            elif(option == "-"):
                   size.stock +=quantity
                   order.quantity -= quantity
                   order.price -= order.price/quantity
                   size.save()
                   order.save()
                   return Response({'success' : True, 'message' : 'modified'},status=status.HTTP_200_OK) 
            else:
                return Response({'success' : True, 'message' : 'Invalid option'}, status=status.HTTP_400_BAD_REQUEST)    
        except Http404:
            return Response({'success':False,'message':'Data not found'},status=status.HTTP_404_NOT_FOUND)








