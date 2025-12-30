from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, UserViewSet

router = DefaultRouter()
router.register(r'', DashboardViewSet, basename='dashboard')
router.register(r'HandleUser', UserViewSet)

urlpatterns = router.urls