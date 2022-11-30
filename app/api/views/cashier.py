import json
import datetime

from django.db.models import Q, Count, Sum

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
        """Get listing"""
        try:
            listing = []
            filters = request.GET.dict()

            if filters.get("product"):
                filters["product__name__icontains"] = filters.pop("product")

            listing_instances = Listing.objects.filter(**filters)

            for listing_instance in listing_instances:
                data = ListingSerializer(listing_instance).data
                data["stock_out"] = json.loads(data["stock_out"])
                data["product"] = listing_instance.product.id
                data["unit_of_measure"] = listing_instance.unit_of_measure
                data["available_stocks"] = StockOut.objects.select_related("stock_in").filter(id__in=data["stock_out"]).values("stock_in__product").annotate(total_quantity=Sum("quantity"))[0]["total_quantity"]
                listing.append(data)

            return self.success_response(listing)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)
    
    def post(self, request):
        """Create listing post request"""
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
                return self.raise_error(beautify_serializer_error(sales_serializer.errors))

            return self.success_response("Checkout successfully!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)