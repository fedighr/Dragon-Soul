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
        fields = ['first_name', 'last_name', 'email', 'password', 'phone_number', 'gender','verification_code', 'code_expired_date', 'is_admin', 'is_verified']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        
        user = User.objects.create(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        instance = super().update(instance, validated_data)

        if password:
            instance.password = make_password(password)
            instance.save(update_fields=["password"])

        return instance

    
    def validate_email(self, value):
        qs = User.objects.filter(email=value, is_verified=True)
        if self.instance:  
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Email already used")
        return value

    def validate_phone_number(self, value):
        qs = User.objects.filter(phone_number=value, is_verified=True)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Phone already used")
        return value
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['email'] = user.email
        token['username'] = (user.first_name + " " + user.last_name)

        return token    