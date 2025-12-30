from django.db import transaction, IntegrityError, DatabaseError
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404

from .models import Order, UserOrders
from store.models import Product, ProductColor, ProductColorSize
from users.models import User
from .serializers import OrderSerializer, UserOrdersSerializer
from store.serializers import ProductColorSerializer, ProductColorSizeSerializer
from rest_framework.pagination import PageNumberPagination


class NoPagination(PageNumberPagination):
    page_size = None


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')

        if user_id:
            user_order = UserOrders.objects.filter(user=user_id).first()
            if user_order:
                queryset = queryset.filter(user_orders=user_order.id)
            else:
                queryset = queryset.none()

        return queryset.order_by('id')

    def get_color_and_size(self, product, color_name, size_value):
        color = get_object_or_404(ProductColor, product_id=product, color=color_name)
        size = get_object_or_404(ProductColorSize, color_id=color.id, size=size_value)
        return color, size

    @action(detail=False, methods=['post'])
    def addOrder(self, request):
        user = request.data.get('user_id')
        data = request.data.copy()
        print(data)
        data.pop('user_id', None) 
        serializer_product = OrderSerializer(data=data, partial=True)
        if not serializer_product.is_valid():
            return Response({'success': False, 'message': serializer_product.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer_product.validated_data
        quantity = data["quantity"]
        product = data['product']
        color_name = data["color"]
        size_value = data["size"]
        price_unit = data["price"]

        try:
            color, size = self.get_color_and_size(product, color_name, size_value)
            user_details = get_object_or_404(User, id=user)
        except Http404:
            return Response({'success': False}, status=status.HTTP_404_NOT_FOUND)
        
        if(size.stock<=0):
           return Response({'success' : False, 'message' : 'No more product'}, status=status.HTTP_204_NO_CONTENT)
        
        
        with transaction.atomic():
            order = UserOrders.objects.filter(user=user).first()

            if not order:
                serializer = UserOrdersSerializer(
                    data={'total_price': price_unit * quantity, 'user': user},
                    partial=True
                )
                serializer.is_valid(raise_exception=True)
                order = serializer.save()
            else:
                order.total_price += price_unit * quantity
                order.save(update_fields=['total_price'])

        size.stock -= quantity
        try:
            with transaction.atomic():
                order_qs = Order.objects.filter(color=color.color, size=size.size, user_orders=order.id, product=product)

                if order_qs.exists():
                    order_instance = order_qs.first()
                    order_instance.quantity += quantity
                    order_instance.price = price_unit * quantity
                    order_instance.save()
                    size.save()
                    return Response({'success': True}, status=status.HTTP_200_OK)
                serializer_product.save(user_orders=order)
                size.save()
                return Response({"success": True}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({"success": False, "message": "Cannot add the order due to database constraints."}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({"success": False, "message": "A database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"success": False, "message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def delete_one(self, request, pk=None):
        if not pk:
            return Response({'success': False, 'message': 'PK not found'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = self.request.query_params.get('user')
        try:
            user = get_object_or_404(User, id=user_id)
            order = get_object_or_404(Order, pk=pk)
            color, size = self.get_color_and_size(order.product, order.color, order.size)

            with transaction.atomic():
                size.stock += order.quantity
                size.save()
                order.delete()
                return Response({'success': True, 'message': 'Delete with success'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'success': False, 'message': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({"success": False, "message": "Cannot delete the order due to database constraints."}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({"success": False, "message": "A database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"success": False, "message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        user_id = self.request.query_params.get('user')
        if not user_id:
            return Response({'success': False, 'error': 'user param is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        orders = Order.objects.filter(user=user)
        if not orders.exists():
            return Response({'success': False, 'error': 'No orders for this user'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for order in orders:
                    try:
                        color, size = self.get_color_and_size(order.product, order.color, order.size)
                        size.stock += order.quantity
                        size.save()
                    except Http404:
                        continue
                deleted_count, _ = orders.delete()
                return Response({'success': True, 'deleted': deleted_count}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'success': False, 'message': f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["patch"])
    def updateStock(self, request, pk=None):
        quantity = request.data.get('quantity')
        option = request.data.get('option')
        if not pk or not quantity or not option:
            return Response({'success': False, 'error': 'Error'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = get_object_or_404(Order, pk=pk)
            color, size = self.get_color_and_size(order.product_id, order.color, order.size)
            product = get_object_or_404(Product, id=order.product_id)
            price_unit = product.price
            print(price_unit,quantity,order.product_id)
            if option == "+":
                if size.stock < quantity:
                    return Response({'success': False, 'message': 'Not enough'}, status=status.HTTP_400_BAD_REQUEST)
                size.stock -= quantity
                order.quantity += quantity
                order.price = price_unit * order.quantity
            elif option == "-":
                size.stock += quantity
                order.quantity -= quantity
                order.price = price_unit * order.quantity
            else:
                return Response({'success': False, 'message': 'Invalid option'}, status=status.HTTP_400_BAD_REQUEST)

            size.save()
            order.save()
            return Response({'success': True, 'message': 'modified', 'price' : order.price}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'success': False, 'message': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({"success": False, "message": "Cannot delete the order due to database constraints."}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({"success": False, "message": "A database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

