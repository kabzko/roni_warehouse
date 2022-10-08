from django.contrib.auth import (
    authenticate, 
    login, 
    logout
)

from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models import User

from utils.exceptions import HumanReadableError
from utils.views.api import API

class UserLoginAPIView(API):
    """Login"""

    authentication_classes = ()
    permission_classes = ()
    
    def post(self, request, format=None) -> dict:
        """Login User"""

        try:
            payload = request.data
            user = authenticate(mobile_number=payload["mobile_number"], password=payload["password"])
            if user != None:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                response = {
                    "message": "Signin successfully.",
                    "token": token
                }
                return self.success_response(response)
            else:
                self.raise_error(title="Error", message="Invalid username or password.")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            return self.server_error_response(exc)

class UserLogoutAPIView(API):
    """Logout"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None) -> dict:
        """Logout User"""

        try:
            user_has_token = Token.objects.filter(user=request.user).count()
            
            if user_has_token:
                request.user.auth_token.delete()
                
            logout(request)
            response = {
                "message": "Signout successfully."
            }
            return self.success_response(response)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            return self.server_error_response(exc)

class UserRegisterAPIView(API):
    """Register"""
    
    def post(self, request, format=None) -> dict:
        """Register User"""

        try:
            payload = request.data
            token = self.create_user(request, payload)
            response = {
                "message": "Signin successfully.",
                "token": token
            } 
            return self.success_response(response)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            return self.server_error_response(exc)
        
    def create_user(self, request, payload: dict) -> str:
        """Register new user"""
        
        is_strong_password, password_requirements = STRONG_PASSWORD_POLICY_UTILITY.is_strong_password(password=payload["password"])
        if not is_strong_password:
            self.raise_error(title="Error", message=", ".join(password_requirements))

        payload["mobile_number"] = payload["mobile_number"]

        try:
            user = User.objects.create(mobile_number=payload["mobile_number"], company=company)
            user.set_password(payload["password"])
            user.save()
        except IntegrityError as error:
            self.raise_error(title="Error", message="Mobile number is already used.")
        
        user_login = authenticate(mobile_number=payload["mobile_number"], password=payload["password"])
        login(request, user_login)
        token, created = Token.objects.get_or_create(user=request.user)
        return token
    
    def filter_mobile_number(self, mobile_number) -> str:
        """"""
        
        pass