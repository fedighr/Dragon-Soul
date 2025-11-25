from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AuthView

urlpatterns = [
    path('<str:action>/', AuthView.as_view()),
]

