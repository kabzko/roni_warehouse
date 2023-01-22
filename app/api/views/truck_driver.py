from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.truck_driver import TruckDriver
from app.serializers.truck_driver import TruckDriverSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class TruckDriverAPIView(API):
    """Truck Driver API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create truck driver request"""
        try:
            data = request.data
            driver_serializer = TruckDriverSerializer(data=data)

            if driver_serializer.is_valid():
                driver_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(driver_serializer.errors))

            return self.success_response("Successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get truck drivers"""
        try:
            search = request.GET.get("search", None)
            if search:
                filters = Q(name__icontains=search) | Q(address__icontains=search)
            else:
                filters = Q(name__icontains="")

            driver_instances = TruckDriver.objects.filter(filters)
            driver_serializers = TruckDriverSerializer(driver_instances, many=True)

            return self.success_response(driver_serializers.data)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class TruckDriverDetailAPIView(API):
    """Triver driver edit, delete, or get specific driver"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get truck driver"""
        try:
            driver_instance = TruckDriver.objects.get(pk=pk)
            driver_serializer = TruckDriverSerializer(driver_instance)
            return self.success_response(driver_serializer.data)
        except TruckDriver.DoesNotExist:
            self.raise_error("Truck driver does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update truck driver"""
        try:
            data = request.data
            driver_instance = TruckDriver.objects.get(pk=pk)
            driver_serializer = TruckDriverSerializer(driver_instance, data=data)

            if driver_serializer.is_valid():
                driver_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(driver_serializer.errors))

            return self.success_response("Successfully updated!")
        except TruckDriver.DoesNotExist:
            self.raise_error("Truck Driver does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete truck driver"""
        try:
            driver_instance = TruckDriver.objects.get(pk=pk)
            driver_instance.delete()
            return self.success_response("Successfully deleted!")
        except TruckDriver.DoesNotExist:
            self.raise_error("Truck driver does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)