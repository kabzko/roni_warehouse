from datetime import datetime
from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_out import StockOut
from app.serializers.stock_out import StockOutSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class StockOutAPIView(API):
    """Stock Out API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create stock out post request"""
        try:
            data = request.data
            data["created_by"] = request.user.pk
            stockout_serializer = StockOutSerializer(data=data)

            if stockout_serializer.is_valid():
                stockout_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(stockout_serializer.errors))

            return self.success_response("Stock Out successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get stock Out """
        try:
            stock_out = []
            filters = request.GET.dict()

            if filters.get("product"):
                filters["stock_in__product__name__icontains"] = filters.pop("product")

            stockout_instances = StockOut.objects.filter(**filters)

            for stockout_instance in stockout_instances:
                data = StockOutSerializer(stockout_instance).data
                data["product"] = stockout_instance.stock_in.product.id
                data["expiration_date"] = stockout_instance.stock_in.expiration_date
                data["expired"] = False

                if data["expiration_date"]:
                    date_now = datetime.now()
                    data["expired"] = data["expiration_date"] <= datetime.date(date_now)
                
                stock_out.append(data)

            return self.success_response(stock_out)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class StockOutDetailAPIView(API):
    """Stock Out Detail API View. Update, delete, get specific stock out instance"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get stock out instance"""
        try:
            stockout_instance = StockOut.objects.get(pk=pk)
            stockout_serializer = StockOutSerializer(stockout_instance)
            return self.success_response(stockout_serializer.data)
        except StockOut.DoesNotExist:
            self.raise_error("Stock out does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update stock out"""
        try:
            data = request.data
            data["created_by"] = request.user.pk
            stockout_instance = StockOut.objects.get(pk=pk)
            stockout_serializer = StockOutSerializer(stockout_instance, data=data)

            stock_outs = StockOut.objects.filter(stock_in__product=stockout_instance.stock_in.product)

            if stockout_serializer.is_valid():
                stockout_serializer.save()
                stock_outs.update(price=stockout_instance.price)
            else:
                self.raise_error(beautify_serializer_error(stockout_serializer.errors))

            return self.success_response("Stock out successfully updated!")
        except StockOut.DoesNotExist:
            self.raise_error("Stock out does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete stock out"""
        try:
            stockout_instance = StockOut.objects.get(pk=pk)
            stockout_instance.delete()
            return self.success_response("Stock out successfully deleted!")
        except StockOut.DoesNotExist:
            self.raise_error("Stock out does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)