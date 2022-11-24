from django.db.models import Q, Count, Sum

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_out import StockOut
from app.models.listing import Listing
from app.serializers.listing import ListingSerializer


from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class ListingAPIView(API):
    """Listing API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create listing post request"""
        try:
            data = request.data
            data["created_by"] = request.user.pk

            is_listing_exist = Listing.objects.filter(stock_out=data["stock_out"]).count()
            if is_listing_exist:
                return self.raise_error("Product is already in the listing.")

            listing_serializer = ListingSerializer(data=data)

            if listing_serializer.is_valid():
                listing_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(listing_serializer.errors))

            return self.success_response("Listing successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

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
                listing.append(data)

            return self.success_response(listing)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class ListingDetailAPIView(API):
    """Listing detail. Update, delete, or get specific listing instance"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get listing instance"""
        try:
            listing_instance = Listing.objects.get(pk=pk)
            listing_serializer = ListingSerializer(listing_instance)
            return self.success_response(listing_serializer.data)
        except Listing.DoesNotExist:
            self.raise_error("Listing does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update listing"""
        try:
            data = request.data
            data["created_by"] = request.user.pk
            listing_instance = Listing.objects.get(pk=pk)
            listing_serializer = ListingSerializer(listing_instance, data=data)

            if listing_serializer.is_valid():
                listing_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(listing_serializer.errors))

            return self.success_response("Listing successfully updated!")
        except Listing.DoesNotExist:
            self.raise_error("Listing does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete listing"""
        try:
            listing_instance = Listing.objects.get(pk=pk)
            listing_instance.delete()
            return self.success_response("Listing successfully deleted!")
        except Listing.DoesNotExist:
            self.raise_error("Listing does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class CashierListingAPIView(API):
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
                data["product"] = listing_instance.stock_out.stock_in.product.id
                data["available_stocks"] = StockOut.objects.select_related("stock_in").filter(id=listing_instance.stock_out.id).values("stock_in__product").annotate(total_quantity=Sum("quantity"))[0]["total_quantity"]
                listing.append(data)

            return self.success_response(listing)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)