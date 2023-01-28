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
            query = request.GET.dict()
            filters = Q()

            if query.get("type") == "daily":
                year = int(query.get("year"))
                month = int(query.get("month"))
                calendar_last_day = calendar.monthrange(year, month)[1]
                start_date = datetime.date(year, month, 1)
                end_date = datetime.date(year, month, calendar_last_day)
                filters &= Q(created_at__gte=start_date, created_at__lt=end_date)

                sale_instances = Cart.objects.filter(filters).values("sales__created_at__date").annotate(
                    total_quantity=Sum(F("price") * F("quantity"))
                )
            else:
                year = int(query.get("year"))
                filters &= Q(created_at__year=year)

                sale_instances = Cart.objects.filter(filters).values("sales__created_at__month").annotate(
                    total_quantity=Sum(F("price") * F("quantity"))
                )
            
            for sale_instance in sale_instances:
                sale = {}
                sale["total_amount"] = sale_instance["total_quantity"]

                if query.get("type") == "daily":
                    sale["day"] = sale_instance["sales__created_at__date"]
                else:
                    sale["day"] = sale_instance["sales__created_at__month"]
                
                sales.append(sale)

            return self.success_response(sales)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)