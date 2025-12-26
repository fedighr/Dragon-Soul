from django.db import transaction, IntegrityError, DatabaseError
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, F, Sum

from order.models import Order, UserOrders
from order.serializers import OrderSerializer, UserOrdersSerializer
from users.models import User
from users.serializers import UserSerializer
from store.models import Product, ProductColor, ProductColorSize
from store.serializers import ProductSerializer
from payment.models import Payment
from payment.serializers import PaymentSerializer

class DashboardViewSet(GenericViewSet):

    def get_percentage(self, a, b):
        if(a==0):
            return 0
        elif(b>0):
            return round((a-b)/b*100,2)
        elif(b==0):
            return a
        else:
            return 0 

    @action(detail=False, methods=['get'])
    def getHomeInfo(self, request):
        try:
            recent_orders = (
                Payment.objects
                .select_related('orders', 'orders__user')
                .annotate(
                    items_count=Count('orders__items', distinct=True),
                    order_id=F('orders__id')
                )
                .order_by('-orders__created_at')
                .values(
                    'order_id',
                    'amount',
                    'status',
                    'method',
                    'orders__total_price',
                    'orders__created_at',
                    'orders__user__first_name',
                    'orders__user__last_name',
                    'orders__user__email',
                    'items_count'
                )
            )
            top_selling = Product.objects.all().order_by('-Purchases')[:5]


            now = timezone.now()
            today_start = now - timedelta(hours=24)
            today_sales = UserOrders.objects.filter(
                created_at__gte=today_start,
            ).aggregate(total=Sum('total_price'))['total'] or 0

            yesterday_start = now - timedelta(hours=48)
            yesterday_end = now - timedelta(hours=24)
            yesterday_sales = UserOrders.objects.filter(
                created_at__gte=yesterday_start,
                created_at__lt=yesterday_end
            ).aggregate(total=Sum('total_price'))['total'] or 0

            today_percentage = self.get_percentage(today_sales, yesterday_sales)


            this_month_sales = UserOrders.objects.filter(created_at__gte=now-timedelta(days=30)).aggregate(total=Sum('total_price'))['total'] or 0

            last_month_sales = UserOrders.objects.filter(created_at__gte=now - timedelta(days=60), created_at__lt=now - timedelta(days=30)).aggregate(total=Sum('total_price'))['total'] or 0

            month_percentage = self.get_percentage(this_month_sales, last_month_sales)


            order_counts = Payment.objects.values('status').annotate(count=Count('id'))
            order_summary = {item['status']: item['count'] for item in order_counts}


            this_week_customers =User.objects.filter(date_joined__gte=now - timedelta(days=7)).count()
            last_week_customers =User.objects.filter(date_joined__gte=now - timedelta(days=14), date_joined__lt=now - timedelta(days=7)).count()
            week_percentage = self.get_percentage(this_week_customers, last_week_customers)


            data = {
                'Today_Sales': today_sales,
                'Today_Percentage' : today_percentage,
                'Total_Orders': Order.objects.count(),
                'status_orders' : order_summary,
                'Month_Sales': this_month_sales,
                'Month_Percentage' : month_percentage,
                'New_Customers': this_week_customers,
                'Customers_Percentage' : week_percentage,
                'Recent_orders': recent_orders,
                'Top_Selling': ProductSerializer(top_selling, many=True).data,
            }

            return Response({'success': True, 'data': data}, status=status.HTTP_200_OK)

        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred. Please try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'])
    def getOrders(self, request):
        try:
            orders = (
                Payment.objects
                .select_related('orders', 'orders__user')
                .annotate(
                    items_count=Count('orders__items', distinct=True),
                    order_id=F('orders__id')
                )
                .order_by('-orders__created_at')
                .values(
                    'order_id',
                    'amount',
                    'status',
                    'method',
                    'orders__total_price',
                    'orders__created_at',
                    'orders__user__first_name',
                    'orders__user__last_name',
                    'orders__user__email',
                    'items_count'
                )
            )
            return Response({'success' : True, 'data' : orders},status=status.HTTP_200_OK)
        
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred. Please try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def getProducts(self, request):
        try:
            products = Product.objects.all()
            return Response({'success' : False, 'data' : ProductSerializer(products, many=True).data},status=status.HTTP_200_OK)

        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred. Please try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)        

    @action(detail=False, methods=['get'])
    def getUsers(self, request):
        try:
            users = User.objects.all().prefetch_related('user__user').annotate(order_count=Count('user__user'),total_spent=Sum('user__total_price')).values('first_name', 'last_name', 'date_joined','email', 'phone_number', 'order_count', 'total_spent', 'is_active', 'is_admin', 'gender', 'is_verified')
            return Response({'success' : True, 'data' : users},status=status.HTTP_200_OK)

        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred. Please try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

    @action(detail=False, methods=['get'])
    def getOrderDetails(self, request):
        id = request.query_params.get('id')
        if(not id):
            return Response({'success' : False, 'data': [], 'message' : 'Error'}, status=status.HTTP_400_BAD_REQUEST)
        print(id)
        try:
            orders = Order.objects.filter(user_orders=id).annotate(total_price=F('price') * F('quantity')).select_related('user_orders__user').values('id', 'price', 'color', 'size', 'quantity', 'total_price', 'user_orders__user__first_name', 'user_orders__user__last_name', 'user_orders__user__email', 'user_orders__user__phone_number')
            return Response({'success' : True, 'data' : orders}, status=status.HTTP_200_OK)
        
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred. Please try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)                                                         