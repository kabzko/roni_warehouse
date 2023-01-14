import json
import datetime

from django.db.models import Q, Count, Sum

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

class InvoiceAPIView(API):
    """"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            transactions = []
            query = request.GET.dict()
            filters = Q(created_at__date=f"{query.get('year')}-{query.get('month')}-{query.get('day')}")
            print(f"{query.get('year')}-{query.get('month')}-{query.get('day')}")
            if query.get("search"):
                filters &= Q(reference_no__icontains=query.get("search"))
            
            sale_instances = Sales.objects.filter(filters)
            for sale_instance in sale_instances:
                transaction = {}
                transaction["sales"] = SalesSerializer(sale_instance).data
                transaction["carts"] = []
                transaction["sales"]["total_amount"] = 0

                cart_instances = Cart.objects.filter(sales=sale_instance)
                for cart_instance in cart_instances:
                    transaction["carts"].append(CartSerializer(cart_instance).data)
                    transaction["sales"]["total_amount"] += (cart_instance.price * cart_instance.quantity)
                
                transactions.append(transaction)

            return self.success_response(transactions)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)