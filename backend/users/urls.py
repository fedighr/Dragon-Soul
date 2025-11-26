from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AuthView, SafeTokenRefreshView

urlpatterns = [
    path('<str:action>/', AuthView.as_view()),
    path("api/token/refresh/", SafeTokenRefreshView.as_view(), name="token_refresh"),
]

