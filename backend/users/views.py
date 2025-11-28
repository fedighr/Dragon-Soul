from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer, MyTokenObtainPairSerializer
#from rest_framework_simplejwt.tokens import RefreshToken
from utils.email_service import send_email
from utils.otp_service import OTPService
from rest_framework_simplejwt.views import TokenObtainPairView
#from rest_framework_simplejwt.views import TokenRefreshView

class AuthView(APIView):

    def post(self, request, action=None):
        if action == "register":
            serializer = UserSerializer(data=request.data)

            if serializer.is_valid():
                email = request.data.get("email")
                if not email:
                    return Response({'success': False, 'message':'email not found'}, status=status.HTTP_404_NOT_FOUND)
                
                existing_user = User.objects.filter(email=email).first()
                if existing_user:
                    if existing_user.is_verified:
                        print("error")
                        return Response({'success': False, 'message':'email already used'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    else:
                        serializer.save()
                        self.SendVerificationEmail(email)
                        return Response({'success': True, 'message':'verification code resent'}, status=status.HTTP_200_OK)
                
                serializer.save()
                self.SendVerificationEmail(email)
                return Response({'success': True, 'message':'registered successfully'}, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
                
        #elif action == "login":
        #    email = request.data.get('email')
        #    password = request.data.get('password')
        #
        #    user = authenticate(email=email, password=password)
        #
        #    if user:
        #        refresh = RefreshToken.for_user(user)
        #        refresh['email'] = user.email
        #        refresh['username'] = user.username
        #        refresh['is_verified'] = user.is_verified
        #
        #        return Response({
        #            'success': True,
        #            'message': 'login successfully',
        #           'access': str(refresh.access_token),
        #            'refresh': str(refresh)
        #        }, status=status.HTTP_200_OK)
        #    
        #    else:
        #        return Response({'success': False, 'message': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)               

        
        elif action == "verifyEmail":
            email = request.data.get("email")

            if not email:
                return Response({'success': False, 'message':'email not found'},status=status.HTTP_404_NOT_FOUND)
            
            if User.objects.filter(email=email, is_verified=True).exists():
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
                      
            if User.objects.filter(phone_number=phone, is_verified=True).exists():
                return Response({'success' : False, 'message':'phone number is used'},status=status.HTTP_400_BAD_REQUEST)
            
            else:
                return Response({'success': True, 'message':'phone number correct'},status=status.HTTP_200_OK)
            
            
        elif action == "VerifyCode":
            email = request.data.get('email')

            if not email:
                return Response ({'success' : False, 'message' : 'Email not found'},status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(email=email)
                code = user.verification_code
                expired_date = user.code_expired_date
                if request.data.get("code") == str(code):
                    if not OTPService.is_expired(expired_date):
                        User.objects.filter(email=email).update(is_verified=True)
                        return Response ({'success' : True, 'message' : 'Verification Complete with Success'},status=status.HTTP_200_OK) 
                     
                    else:
                        self.SendVerificationEmail(email)
                        return Response({'success' : False, 'message' : 'Your verification code has expired. We will send you a new one shortly.'},status=status.HTTP_408_REQUEST_TIMEOUT)
                 
                return Response ({'success' : False, 'message' : 'Code invalid'},status=status.HTTP_406_NOT_ACCEPTABLE)
            except User.DoesNotExist:
                return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
        elif action == "ResendCode":
            email = request.data.get('email')

            if not email:
                return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

            if self.SendVerificationEmail(email):
                return Response({'success': True, 'message': 'Code resend'}, status=status.HTTP_200_OK)

            return Response({'success': False, 'message': 'Email send failed'}, status=status.HTTP_400_BAD_REQUEST)
        

        elif action and action.startswith("ResetPassword"):
            step_str = action.replace("ResetPassword", "")
            if not step_str.isdigit():
                return Response({'success': False, 'message': 'Invalid reset password action'}, status=status.HTTP_400_BAD_REQUEST)
                
            step = int(step_str)
            if step == 1:
                email = request.data.get('email')
                if not User.objects.filter(email=email).exists():
                    return Response({'success' : False, 'message' : 'Email not found'},status=status.HTTP_404_NOT_FOUND)
                
                if self.SendVerificationEmail(email):
                    return Response ({'success' : True, 'message' : 'Email send. Check your inbox'},status=status.HTTP_200_OK)
                
                return Response({'success' : False, 'message' : 'Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            elif step == 2:
                email = request.data.get('email')
                if not email:
                    return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
                
                try:
                    user = User.objects.get(email=email)
                    code = user.verification_code
                    print(code,request.data.get('code'))
                    expired_date = user.code_expired_date
                    
                    if code == request.data.get('code'):
                        if not OTPService.is_expired(expired_date):
                            return Response ({'success' : True, 'message' : 'Code match. Change your password'},status=status.HTTP_200_OK)
                        else:
                            self.SendVerificationEmail(email)
                            return Response({'success' : False, 'message' : 'Your verification code has expired. We will send you a new one shortly.'},status=status.HTTP_408_REQUEST_TIMEOUT)
                    return Response({'success' : False, 'message' : 'Code not matched'},status=status.HTTP_400_BAD_REQUEST)
                except User.DoesNotExist:
                    return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
            
            elif step == 3:
                email = request.data.get('email')
                password = request.data.get('password')
                
                if not email or not password:
                    return Response({'success': False, 'message': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    user = User.objects.get(email=email)
                    user.set_password(password)
                    user.save()
                    return Response({'success': True, 'message': 'Password changed. Welcome Dragon Master!'}, status=status.HTTP_200_OK)
                except User.DoesNotExist:
                    return Response({'success': False, 'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
                except Exception as e:
                    return Response({'success': False, 'message': 'Password not changed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'success': False, 'message': 'Invalid step'}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({'success': False, 'message': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
            
    
    @staticmethod
    def SendVerificationEmail(email):
        otp = OTPService.create_otp()
        try:
            user = User.objects.filter(email=email).first()
            if not user:
                print(f"User with email {email} not found")
                return False
                
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
                """.format(otp_code=otp["code"]))
            
            user.verification_code = otp['code']
            user.code_expired_date = otp['expires_at']
            user.save()
            return True
        except Exception as e:
            print("Erreur envoi email :", e)
            return False       

    """ def get(self,request,action=None):
        
        return Response({'message': 'invalid request'}, status=status.HTTP_400_BAD_REQUEST)"""
    

"""class SafeTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except User.DoesNotExist:
            return Response(
                {"detail": "User does not exist."},
                status=status.HTTP_401_UNAUTHORIZED
            )"""

class MyLoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer