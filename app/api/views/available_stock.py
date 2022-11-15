from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_out import StockOut
from app.models.stock_in import StockIn

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class AvailableStockAPIView(API):
    """Available Stock API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get available stock """
        try:
            parameters = request.GET.dict()
            stock_in_id = parameters.get("stock_in", None)

            stock_in_instance = StockIn.objects.get(id=stock_in_id)
            available_stock = stock_in_instance.quantity

            stock_out_instances = StockOut.objects.filter(stock_in=stock_in_instance)
            for stock_out in stock_out_instances:
                available_stock -= stock_out.quantity

            return self.success_response({"available": available_stock})
        except StockIn.DoesNotExist:
            self.raise_error("Stock In does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)