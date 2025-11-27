from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AuthView, SafeTokenRefreshView, MyLoginView

urlpatterns = [
    path('login/', MyLoginView.as_view(), name='token_obtain_pair'),
    path('<str:action>/', AuthView.as_view()),
    path('refresh/', SafeTokenRefreshView.as_view(), name='token_refresh'),

]