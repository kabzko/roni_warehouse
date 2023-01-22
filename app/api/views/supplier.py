from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.supplier import Supplier
from app.serializers.supplier import SupplierSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class SupplierAPIView(API):
    """Supplier API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create supplier request"""
        try:
            data = request.data
            supplier_serializer = SupplierSerializer(data=data)

            if supplier_serializer.is_valid():
                supplier_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(supplier_serializer.errors))

            return self.success_response("Supplier successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get suppliers"""
        try:
            search = request.GET.get("search", None)
            if search:
                filters = Q(name__icontains=search) | Q(address__icontains=search)
            else:
                filters = Q(name__icontains="")

            supplier_instances = Supplier.objects.filter(filters)
            supplier_serializers = SupplierSerializer(supplier_instances, many=True)

            return self.success_response(supplier_serializers.data)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class SupplierDetailAPIView(API):
    """Supplier edit, delete, or get specific supplier"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get supplier"""
        try:
            supplier_instance = Supplier.objects.get(pk=pk)
            supplier_serializer = SupplierSerializer(supplier_instance)
            return self.success_response(supplier_serializer.data)
        except Supplier.DoesNotExist:
            self.raise_error("Supplier does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update supplier"""
        try:
            data = request.data
            supplier_instance = Supplier.objects.get(pk=pk)
            supplier_serializer = SupplierSerializer(supplier_instance, data=data)

            if supplier_serializer.is_valid():
                supplier_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(supplier_serializer.errors))

            return self.success_response("Supplier successfully updated!")
        except Supplier.DoesNotExist:
            self.raise_error("Supplier does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete supplier"""
        try:
            supplier_instance = Supplier.objects.get(pk=pk)
            supplier_instance.delete()
            return self.success_response("Supplier successfully deleted!")
        except Supplier.DoesNotExist:
            self.raise_error("Supplier does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)