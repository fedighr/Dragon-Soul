from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[v for v in serializers.EmailField().validators if not isinstance(v, UniqueValidator)]
    )
    phone_number = serializers.CharField(
        validators=[v for v in serializers.CharField().validators if not isinstance(v, UniqueValidator)]
    )
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone_number', 'gender','verification_code']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        
        user = User.objects.create(**validated_data)
        return user
    
    def validate_email(self, value):
        if User.objects.filter(email=value, is_verified=True).exists():
            raise serializers.ValidationError("Email already used")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value, is_phone_verified=True).exists():
            raise serializers.ValidationError("Phone already used")
        return value
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['username'] = (user.first_name + " " + user.last_name)

        return token    