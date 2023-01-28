import json
import datetime

from django.db.models import Q, Count, Sum, F

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_out import StockOut
from app.models.listing import Listing
from app.models.sales import Sales
from app.models.cart import Cart
from app.serializers.listing import ListingSerializer
from app.serializers.sales import SalesSerializer
from app.serializers.cart import CartSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class CashierAPIView(API):
    """"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            listing = []
            filters = request.GET.dict()

            if filters.get("product"):
                filters["stock_in__product__name__icontains"] = filters.pop("product")

            stockout = StockOut.objects.select_related("stock_in").filter(**filters).values("stock_in__product").annotate(product=F("stock_in__product"), unit_of_measure=F("stock_in__unit_of_measure"),price=F("price"),total_quantity=Sum("quantity"))

            return self.success_response(stockout)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
    
    def post(self, request):
        """"""
        try:
            data = request.data
            data["reference_no"] = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            data["cashier_by"] = request.user.pk
            
            sales_serializer = SalesSerializer(data=data)

            if sales_serializer.is_valid():
                sales_serializer.save()
                for cart in data["carts"]:
                    cart["sales"] = sales_serializer.data["id"]
                    cart["product"] = cart["id"]
                    cart_serializer = CartSerializer(data=cart)
                    if cart_serializer.is_valid():
                        cart_serializer.save()
                    else:
                        sales = Sales.objects.get(id=sales_serializer.data["id"])
                        sales.delete()
                        self.raise_error(title="Error", message="Something went wrong, Please try again.")
            else:
                return self.raise_error(beautify_serializer_error(sales_serializer.errors))

            response = {
                "reference_no": data["reference_no"]
            }

            return self.success_response(response)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class CashierLastTransactionAPIView(API):
    """"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """"""
        try:
            transaction = {}
            
            sale_instance = Sales.objects.get(reference_no=pk, cashier_by=request.user)
            cart_instances = Cart.objects.filter(sales=sale_instance)

            transaction["sales"] = SalesSerializer(sale_instance).data
            transaction["carts"] = []

            transaction["sales"]["total_amount"] = 0
            for cart_instance in cart_instances:
                transaction["carts"].append(CartSerializer(cart_instance).data)
                transaction["sales"]["total_amount"] += (cart_instance.price * cart_instance.quantity)

            return self.success_response(transaction)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)