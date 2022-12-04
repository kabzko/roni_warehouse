import json
import datetime
import calendar

from django.db.models import Q, Count, Sum, F
from django.db.models.functions import TruncDay

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.sales import Sales
from app.models.cart import Cart
from app.serializers.sales import SalesSerializer
from app.serializers.cart import CartSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class SalesAPIView(API):
    """"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            sales = []
            filters = request.GET.dict()
            year = int(filters.get("year"))
            month = int(filters.get("month"))
            
            calendar_last_day = calendar.monthrange(year, month)[1]
            start_date = datetime.date(year, month, 1)
            end_date = datetime.date(year, month, calendar_last_day)

            sale_instances = Cart.objects.filter(created_at__gte=start_date, created_at__lt=end_date).values("sales__created_at__date").annotate(
                total_quantity=Sum(F("price") * F("quantity"))
            )
            
            for sale_instance in sale_instances:
                sale = {}
                sale["day"] = sale_instance["sales__created_at__date"]
                sale["total_amount"] = sale_instance["total_quantity"]
                
                sales.append(sale)

            return self.success_response(sales)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)