from django.db.models import Q

from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models import Employee
from app.serializers.employee import EmployeeSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class EmployeeAPIView(API):
    """Employee API View"""
    
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get users. If pk is provided, get specific employee only."""
        try:
            search = request.GET.get("search", None)
            filters = Q()

            if search:
                filters &= (Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(middle_name__icontains=search))

            employees = Employee.objects.filter(filters)
            employee_serializer = EmployeeSerializer(employees, many=True)

            return self.success_response(employee_serializer.data)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request):
        """Create employee post request"""
        try:
            data = request.data

            employee_serializer = EmployeeSerializer(data=data)

            if employee_serializer.is_valid():
                employee_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(employee_serializer.errors))

            return self.success_response("Employee successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class EmployeeDetailAPIView(API):
    """Employee detail API view. Update, Get, or Delete specific employee"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        """Get specific employee"""
        try:
            employee = Employee.objects.get(pk=pk)
            employee_serializer = EmployeeSerializer(employee)
            return self.success_response(employee_serializer.data)
        except Employee.DoesNotExist:
            self.raise_error("Employee does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
    
    def post(self, request, pk):
        """Update employee information"""
        try:
            data = request.data
            employee = Employee.objects.get(pk=pk)
            employee_serializer = EmployeeSerializer(employee, data=data)
            
            if employee_serializer.is_valid():
                employee = employee_serializer.save()

                if data.get("password"):
                    employee.set_password(data["password"])
                    employee.save()
            else:
                self.raise_error(beautify_serializer_error(employee_serializer.errors))

            return self.success_response("Successfully updated!")
        except Employee.DoesNotExist:
            self.raise_error("Employee does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete employee"""
        try:
            employee = Employee.objects.get(pk=pk)
            employee.delete()
            return self.success_response("Successfully deleted!")
        except Employee.DoesNotExist:
            self.raise_error("Employee does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class EmployeeDetailLoginAPIView(API):
    """Employee detail API view"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get specific employee"""
        try:
            employee = Employee.objects.get(pk=request.user.employee.pk)
            employee_serializer = EmployeeSerializer(employee)
            data = employee_serializer.data
            data["email"] = request.user.email
            data["user_type"] = request.user.user_type
            return self.success_response(data)
        except Employee.DoesNotExist:
            self.raise_error("Employee does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)