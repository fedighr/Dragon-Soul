from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class AuthView(APIView):

    def post(self, request, action=None):
        if action == "register":
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'success': True, 'message': 'register successfully'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        elif action == "login":
            email = request.data.get('email')
            password = request.data.get('password')

            user = authenticate(email=email, password=password)
            print(user,email,password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'success': True,
                    'message': 'login successfully',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'message': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        
        elif action == "verifyEmail":
            email = request.data.get("email")
            if not email:
                return Response({'message':'email not found'},status=status.HTTP_404_NOT_FOUND)
            if User.objects.filter(email=email).exists():
                return Response({'message':'email is used'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'success': True, 'message':'email correct'},status=status.HTTP_200_OK)
            
        elif action == "verifyPhone":
            phone = request.data.get("phoneNumber")
            if not phone:
                return Response({'message':'phone number not found'},status=status.HTTP_404_NOT_FOUND)            
            if User.objects.filter(phone_number=phone).exists():
                return Response({'message':'phone number is used'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'success': True, 'message':'phone number correct'},status=status.HTTP_200_OK)

        
        return Response({'message': 'invalid request'}, status=status.HTTP_400_BAD_REQUEST)

        

