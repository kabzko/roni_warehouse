from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_in import StockIn
from app.serializers.stock_in import StockInSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class StockInAPIView(API):
    """Stock In API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create stock in post request"""
        try:
            data = request.data
            data["created_by"] = request.user.pk
            stockin_serializer = StockInSerializer(data=data)

            if stockin_serializer.is_valid():
                stockin_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(stockin_serializer.errors))

            return self.success_response("Stock In successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get stock In """
        try:
            filters = request.GET.dict()

            if filters.get("product"):
                filters["product__name__icontains"] = filters.pop("product")

            stockin_instances = StockIn.objects.filter(**filters)
            stockin_serializer = StockInSerializer(stockin_instances, many=True)

            return self.success_response(stockin_serializer.data)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class StockInDetailAPIView(API):
    """Stock In detail. Update, delete, or get specific stock in instance"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get stock in instance"""
        try:
            stockin_instance = StockIn.objects.get(pk=pk)
            stockin_serializer = StockInSerializer(stockin_instance)
            return self.success_response(stockin_serializer.data)
        except StockIn.DoesNotExist:
            self.raise_error("Stock in does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update stock in"""
        try:
            data = request.data
            data["created_by"] = request.user.pk
            stockin_instance = StockIn.objects.get(pk=pk)
            stockin_serializer = StockInSerializer(stockin_instance, data=data)

            if stockin_serializer.is_valid():
                stockin_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(stockin_serializer.errors))

            return self.success_response("Stock in successfully updated!")
        except StockIn.DoesNotExist:
            self.raise_error("Stock in does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete stock in"""
        try:
            stockin_instance = StockIn.objects.get(pk=pk)
            stockin_instance.delete()
            return self.success_response("Stock in successfully deleted!")
        except StockIn.DoesNotExist:
            self.raise_error("Stock in does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)