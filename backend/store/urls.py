from django.urls import path, include
from .views import ProductListView, AddProduct, GetProductById, HandleProducts
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'add', AddProduct)
router.register(r'getproduct', GetProductById, basename="getproduct")
router.register(r'HandleProducts', HandleProducts)
urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('', include(router.urls)),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)