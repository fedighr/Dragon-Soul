from django.db import transaction, IntegrityError, DatabaseError
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, F, Sum
from django.db.models.functions import TruncDate

from order.models import Order, UserOrders
from order.serializers import OrderSerializer, UserOrdersSerializer
from users.models import User
from users.serializers import UserSerializer
from store.models import Product
from store.serializers import ProductSerializer
from payment.models import Payment
from utils.permissions import IsDashboardAdmin


class DashboardViewSet(GenericViewSet):
    # permission_classes = [IsDashboardAdmin]

    def get_percentage(self, a, b):
        if a == 0:
            return 0
        if b > 0:
            return round((a - b) / b * 100, 2)
        if b == 0:
            return a
        return 0

    def get_date_range(self, range_type):
        now = timezone.now()
        if range_type == "week":
            return now - timedelta(days=7)
        if range_type == "month":
            return now - timedelta(days=30)
        if range_type == "year":
            return now - timedelta(days=365)
        return now - timedelta(days=30)

    @action(detail=False, methods=['get'])
    def getHomeInfo(self, request):
        now = timezone.now()

        today_sales = UserOrders.objects.filter(
            created_at__gte=now - timedelta(days=1)
        ).aggregate(total=Sum('total_price'))['total'] or 0

        yesterday_sales = UserOrders.objects.filter(
            created_at__gte=now - timedelta(days=2),
            created_at__lt=now - timedelta(days=1)
        ).aggregate(total=Sum('total_price'))['total'] or 0

        month_sales = UserOrders.objects.filter(
            created_at__gte=now - timedelta(days=30)
        ).aggregate(total=Sum('total_price'))['total'] or 0

        last_month_sales = UserOrders.objects.filter(
            created_at__gte=now - timedelta(days=60),
            created_at__lt=now - timedelta(days=30)
        ).aggregate(total=Sum('total_price'))['total'] or 0

        new_customers = User.objects.filter(
            date_joined__gte=now - timedelta(days=7)
        ).count()

        last_week_customers = User.objects.filter(
            date_joined__gte=now - timedelta(days=14),
            date_joined__lt=now - timedelta(days=7)
        ).count()

        recent_orders = (
            Payment.objects
            .select_related('orders__user')
            .annotate(order_id=F('orders__id'))
            .order_by('-created_at')[:6]
            .values(
                'order_id',
                'amount',
                'status',
                'method',
                'created_at',
                'orders__user__first_name',
                'orders__user__last_name',
                'orders__user__email'
            )
        )

        top_selling = Product.objects.order_by('-Purchases')[:5]

        order_status = Payment.objects.values('status').annotate(count=Count('id'))
        status_chart = {
            "labels": [o['status'] for o in order_status],
            "values": [o['count'] for o in order_status]
        }

        data = {
            "Today_Sales": today_sales,
            "Today_Percentage": self.get_percentage(today_sales, yesterday_sales),
            "Month_Sales": month_sales,
            "Month_Percentage": self.get_percentage(month_sales, last_month_sales),
            "New_Customers": new_customers,
            "Customers_Percentage": self.get_percentage(new_customers, last_week_customers),
            "Total_Orders": Payment.objects.count(),
            "Recent_orders": recent_orders,
            "Top_Selling": ProductSerializer(top_selling, many=True).data,
            "Order_Status_Chart": status_chart
        }

        return Response({"success": True, "data": data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def getAnalytics(self, request):
        chart_type = request.query_params.get('type', 'sales')
        date_range = request.query_params.get('range', 'month')
        start_date = self.get_date_range(date_range)

        labels = []
        values = []

        if chart_type == "sales":
            qs = UserOrders.objects.filter(created_at__gte=start_date)
            qs = qs.annotate(day=TruncDate('created_at')).values('day')
            qs = qs.annotate(total=Sum('total_price')).order_by('day')
            labels = [str(q['day']) for q in qs]
            values = [float(q['total']) for q in qs]

        elif chart_type == "revenue":
            qs = Payment.objects.filter(created_at__gte=start_date, status='completed')
            qs = qs.annotate(day=TruncDate('created_at')).values('day')
            qs = qs.annotate(total=Sum('amount')).order_by('day')
            labels = [str(q['day']) for q in qs]
            values = [float(q['total']) for q in qs]

        elif chart_type == "customers":
            qs = User.objects.filter(date_joined__gte=start_date)
            qs = qs.annotate(day=TruncDate('date_joined')).values('day')
            qs = qs.annotate(total=Count('id')).order_by('day')
            labels = [str(q['day']) for q in qs]
            values = [q['total'] for q in qs]

        return Response({"success": True, "data": {"labels": labels, "values": values}}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def getOrders(self, request):
        try:
            orders = (
                Payment.objects
                .select_related('orders__user')
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
            return Response({'success': True, 'data': orders}, status=status.HTTP_200_OK)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def getProducts(self, request):
        try:
            products = Product.objects.all()
            return Response({'success': True, 'data': ProductSerializer(products, many=True).data}, status=status.HTTP_200_OK)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def getUsers(self, request):
        try:
            users = User.objects.all().annotate(
                order_count=Count('user_orders', distinct=True),
                total_spent=Sum('user_orders__total_price')
            ).values(
                'id','first_name','last_name','date_joined','email','phone_number',
                'order_count','total_spent','is_active','is_admin','gender','is_verified'
            )
            return Response({'success': True, 'data': users}, status=status.HTTP_200_OK)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def getOrderDetails(self, request):
        id = request.query_params.get('id')
        if not id:
            return Response({'success': False, 'data': [], 'message': 'Error'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            orders = (
                Order.objects.filter(user_orders=id)
                .select_related('user_orders__user')
                .annotate(total_price=F('price')*F('quantity'))
                .values(
                    'id','price','color','size','quantity','total_price',
                    'user_orders__user__first_name','user_orders__user__last_name',
                    'user_orders__user__email','user_orders__user__phone_number'
                )
            )
            return Response({'success': True, 'data': orders}, status=status.HTTP_200_OK)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def deleteOrder(self, request, pk=None):
        if not pk:
            return Response({'success': False, 'error': 'Error'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = get_object_or_404(UserOrders, pk=pk)
            order.delete()
            return Response({'success': True, 'message': 'Deleted with success'}, status=status.HTTP_200_OK)
        except Http404:
            return Response({'success': False, 'message': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({'success': False, 'message': 'Cannot delete due to constraints.'}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'])
    def cancelOrder(self, request, pk=None):
        if not pk:
            return Response({'success': False, 'error': 'Error'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payment = Payment.objects.filter(orders=pk).first()
            if not payment:
                return Response({'success': False, 'message': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)
            payment.status = "cancelled"
            payment.save()
            return Response({'success': True, 'message': 'Cancelled with success'}, status=status.HTTP_200_OK)
        except IntegrityError:
            return Response({'success': False, 'message': 'Cannot update due to constraints.'}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsDashboardAdmin]

    @action(detail=True, methods=['patch'])
    def changeAdminStatus(self, request, pk=None):
        if not pk:
            return Response({'success': False, 'message': 'Error'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = get_object_or_404(User, pk=pk)
            user.is_admin = request.data.get('is_admin')
            user.save()
            return Response({'success': True, 'message': 'Updated with success'}, status=status.HTTP_200_OK)
        except Http404:
            return Response({'success': False, 'message': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({'success': False, 'message': 'Cannot update due to constraints.'}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError:
            return Response({'success': False, 'message': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
