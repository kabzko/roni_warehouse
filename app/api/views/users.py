from django.contrib.auth import (
    authenticate, 
    login, 
    logout
)
from django.db.models import Q

from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models import User
from app.serializers.user import UserSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class UserLoginAPIView(API):
    """Login"""

    authentication_classes = ()
    permission_classes = ()
    
    def post(self, request):
        """Login User"""
        try:
            payload = request.data
            filters = Q()

            if payload.get("login_as") == "admin":
                if not payload.get("email"):
                    self.raise_error(title="Error", message="Please provide email!")
                else:
                    filters = Q(email=payload.get("email", None))
            
            if payload.get("login_as") == "cashier":
                if not payload.get("cashier_id"):
                    self.raise_error(title="Error", message="Please provide cashier id!")
                else:
                    filters = Q(cashier_id=payload.get("cashier_id", None))

            if not payload.get("password"):
                self.raise_error(title="Error", message="Please provide password!")

            if not payload.get("login_as"):
                self.raise_error(title="Error", message="Please specify login type!")
            
            try:
                user_account = User.objects.get(filters)
            except User.DoesNotExist:
                self.raise_error(title="Error", message="Invalid username or password.")
            print(user_account.system_id, payload.get("password"))
            user = authenticate(system_id=user_account.system_id, password=payload.get("password"))
            print(user)
            if user:
                print(user.user_type)
                if user.user_type == "cashier":
                    if user.user_type != payload.get("login_as"):
                        self.raise_error(title="Error", message="Invalid username or password!")

                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                response = {
                    "message": "Signin successfully.",
                    "token": token.key,
                    "user_type": user.user_type,
                }
                return self.success_response(response)
            else:
                self.raise_error(title="Error", message="Invalid username or password!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class UserLogoutAPIView(API):
    """Logout"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Logout User"""
        try:
            user_has_token = Token.objects.filter(user=request.user).count()
            
            if user_has_token:
                request.user.auth_token.delete()
                
            logout(request)
            response = {
                "message": "Signout successfully!"
            }
            return self.success_response(response)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            return self.server_error_response(exc)

class UserAPIView(API):
    """User API View"""
    
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get users. If pk is provided, get specific user only."""
        try:
            search = request.GET.get("search", None)
            filters = Q(is_superadmin=False)

            if search:
                filters &= (Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(middle_name__icontains=search))

            users = User.objects.filter(filters)
            user_serializer = UserSerializer(users, many=True)

            return self.success_response(user_serializer.data)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request):
        """Create user post request"""
        try:
            payload = request.data
            self.create_user(payload)
            
            return self.success_response("Successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
        
    def create_user(self, payload: dict) -> User:
        """Create new user"""

        if not payload.get("password"):
            self.raise_error("Password is required!")

        if not payload.get("user_type"):
            self.raise_error("User type is required!")

        user_count = User.objects.exclude(system_id="RONIADMIN001").count()
        user_id = str(user_count + 1).zfill(5)
        payload["system_id"] = f"RONIUSER{user_id}"

        user_serializer = UserSerializer(data=payload)

        if user_serializer.is_valid():
            user = user_serializer.save()
            user.set_password(payload["password"])
            user.save()
        else:
            self.raise_error(beautify_serializer_error(user_serializer.errors))

class UserDetailAPIView(API):
    """User detail API view. Update, Get, or Delete specific user"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        """Get specific user"""
        try:
            user = User.objects.get(pk=pk)
            user_serializer = UserSerializer(user)
            return self.success_response(user_serializer.data)
        except User.DoesNotExist:
            self.raise_error("User does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
    
    def post(self, request, pk):
        """Update user information"""
        try:
            data = request.data
            user = User.objects.get(pk=pk)
            user_serializer = UserSerializer(user, data=data)
            
            if user_serializer.is_valid():
                user = user_serializer.save()

                if data.get("password"):
                    user.set_password(data["password"])
                    user.save()
            else:
                self.raise_error(beautify_serializer_error(user_serializer.errors))

            return self.success_response("Successfully updated!")
        except User.DoesNotExist:
            self.raise_error("User does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete user"""
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return self.success_response("Successfully deleted!")
        except User.DoesNotExist:
            self.raise_error("User does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)