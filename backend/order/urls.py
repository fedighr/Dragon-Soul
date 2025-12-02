from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'orders', OrderViewSet)

urlpatterns = router.urls
