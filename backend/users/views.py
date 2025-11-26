from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from utils.email_service import send_email
from utils.otp_service import OTPService
from rest_framework_simplejwt.views import TokenRefreshView

class AuthView(APIView):

    def post(self, request, action=None):

        if action == "register":
            serializer = UserSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.save()
                code = self.SendVerificationEmail(request.data.get('email'))
                user.verification_code = code
                user.save() 
                
                                               
                return Response({'success': True, 'message': 'register successfully'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
                
        elif action == "login":
            email = request.data.get('email')
            password = request.data.get('password')

            user = authenticate(email=email, password=password)

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
                return Response({'success': False, 'message':'email not found'},status=status.HTTP_404_NOT_FOUND)
            
            if User.objects.filter(email=email).exists():
                return Response({'success': False, 'message':'email is used'},status=status.HTTP_400_BAD_REQUEST)
            
            else:
                return Response({'success': True, 'message':'email correct'},status=status.HTTP_200_OK)

        elif action == "verifyEmailUsed":
            email = request.data.get("email")

            if not email:
                return Response({'success': False, 'message':'email not found'},status=status.HTTP_404_NOT_FOUND)
            
            if User.objects.filter(email=email).exists():
                return Response({'success': True, 'message':'email correct'},status=status.HTTP_200_OK)
            
            else:
                return Response({'success': False, 'message':'Error '},status=status.HTTP_400_BAD_REQUEST)    
            
            
        elif action == "verifyPhone":

            phone = request.data.get("phoneNumber")
            if not phone:
                return Response({'success' : False, 'message':'phone number not found'},status=status.HTTP_404_NOT_FOUND)  
                      
            if User.objects.filter(phone_number=phone).exists():
                return Response({'success' : False, 'message':'phone number is used'},status=status.HTTP_400_BAD_REQUEST)
            
            else:
                return Response({'success': True, 'message':'phone number correct'},status=status.HTTP_200_OK)
            
            
        elif(action == "VerifyCode"):
            email = request.data.get('email')

            if not email:
                return Response ({'success' : False, 'message' : 'Email not found'},status=status.HTTP_400_BAD_REQUEST)
            
            code = User.objects.get(email=email).verification_code
            if request.data.get("code") == str(code):
                User.objects.filter(email=email).update(is_verified=True)
                return Response ({'success' : True, 'message' : 'Verification Complete with Success'},status=status.HTTP_200_OK)  
             
            return Response ({'success' : False, 'message' : 'Code invalid'},status=status.HTTP_406_NOT_ACCEPTABLE) 
        
        
        elif(action == "ResendCode"):
            email = request.data.get('email')

            if not email:
                return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

            code = self.SendVerificationEmail(email)

            if code is not None:
                User.objects.filter(email=email).update(verification_code=code)
                return Response({'success': True, 'message': 'Code resend'}, status=status.HTTP_200_OK)

            return Response({'success': False, 'message': 'Email send failed'}, status=status.HTTP_400_BAD_REQUEST)
        

        elif(action[0:-1] == "ResetPassword"):
            step = int(action[-1])
            if(step == 1):
                email = request.data.get('email')
                if not User.objects.filter(email=email).exists():
                    return Response({'success' : False, 'message' : 'Email not found'},status=status.HTTP_404_NOT_FOUND)
                
                code = self.SendVerificationEmail(email)
                if(code is not None):
                    User.objects.filter(email=email).update(verification_code=code)
                    return Response ({'success' : True, 'message' : 'Email send. Check your inbox'},status=status.HTTP_200_OK)
                
                return Response({'success' : False, 'message' : 'Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if(step == 2):
                email = request.data.get('email')
                code = User.objects.get(email=email).verification_code
                if not email:
                    return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
                    
                if(str(code) == request.data.get('code')):
                    return Response ({'success' : True, 'message' : 'Code match. Change your password'},status=status.HTTP_200_OK)
                return Response({'success' : False, 'message' : 'Code not matched'},status=status.HTTP_400_BAD_REQUEST)
            
            if(step == 3):
                email = request.data.get('email')
                password = request.data.get('password')
                
                try:
                    user = User.objects.get(email=email)
                    user.set_password(password)
                    user.save()
                    return Response({'success': True, 'message': 'Password changed. Welcome Dragon Master!'}, status=200)
                except User.DoesNotExist:
                    return Response({'success': False, 'message': 'Email not found'}, status=404)
                except Exception as e:
                    return Response({'success': False, 'message': 'Password not changed'}, status=500)
            
            

            


    
    @staticmethod
    def SendVerificationEmail(email):
        otp = OTPService.create_otp()
        code = otp["code"] 
        try:
            send_email(
                to_email=email,
                subject="Welcome to our website !",
                html_content = """
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; text-align: center;">
                        <h2 style="color: #333;">Verification Code</h2>
                        <p style="font-size: 18px;">Hello,</p>
                        <p>Here is your verification code to access your account:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #1a73e8;">{otp_code}</p>
                        <p style="color: #999; font-size: 12px;">
                            This code is valid for 5 minutes.
                        </p>
                    </div>
                </body>
                </html>
                """.format(otp_code=code))
        except Exception as e:
            print("Erreur envoi email :", e)
            return None
        return code         

    """ def get(self,request,action=None):

        
        
        return Response({'message': 'invalid request'}, status=status.HTTP_400_BAD_REQUEST)"""
    

class SafeTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except User.DoesNotExist:
            return Response(
                {"detail": "User does not exist."},
                status=status.HTTP_401_UNAUTHORIZED
            )


