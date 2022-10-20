from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.product import Product
from app.serializers.product import ProductSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class ProductAPIView(API):
    """Product class view"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create product request"""
        try:
            data = request.data
            product_serializer = ProductSerializer(data=data)

            if product_serializer.is_valid():
                product_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(product_serializer.errors))

            return self.success_response("Product successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get products"""
        try:
            search = request.GET.get("search", None)
            if search:
                filters = Q(name__icontains=search) | Q(description__icontains=search) | Q(barcode__icontains=search)
            else:
                filters = Q(name__icontains="")

            product_instances = Product.objects.filter(filters)
            product_serializers = ProductSerializer(product_instances, many=True)

            return self.success_response(product_serializers.data)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class ProductDetailAPIView(API):
    """Product edit, delete, or get specific product"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get product"""
        try:
            product_instance = Product.objects.get(pk=pk)
            product_serializer = ProductSerializer(product_instance)
            return self.success_response(product_serializer.data)
        except Product.DoesNotExist:
            self.raise_error("Product does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update product"""
        try:
            data = request.data
            product_instance = Product.objects.get(pk=pk)
            product_serializer = ProductSerializer(product_instance, data=data)

            if product_serializer.is_valid():
                product_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(product_serializer.errors))

            return self.success_response("Product successfully updated!")
        except Product.DoesNotExist:
            self.raise_error("User does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete product"""
        try:
            product_instance = Product.objects.get(pk=pk)
            product_instance.delete()
            return self.success_response("Product successfully deleted!")
        except Product.DoesNotExist:
            self.raise_error("User does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)