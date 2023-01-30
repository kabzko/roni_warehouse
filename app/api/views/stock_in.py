from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.stock_in import StockIn, GroupStockIn
from app.serializers.stock_in import StockInSerializer, GroupStockInSerializer

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
            stock_in = data.pop("list", [])

            if data.get("id"):
                group_instance = GroupStockIn.objects.get(id=data["id"])
                group_stockin_serializer = GroupStockInSerializer(instance=group_instance, data=data)
            else:
                group_stockin_serializer = GroupStockInSerializer(data=data)

            if group_stockin_serializer.is_valid():
                group_stockin_instance = group_stockin_serializer.save()

                for stock in stock_in:
                    stock["group"] = group_stockin_instance.pk

                    if stock.get("id"):
                        instance = StockIn.objects.get(id=stock["id"])
                        stock_in_serializer = StockInSerializer(instance=instance, data=stock)
                    else:
                        stock_in_serializer = StockInSerializer(data=stock)

                    if stock_in_serializer.is_valid():
                        stock_in_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(group_stockin_serializer.errors))

            return self.success_response("Stock In successfully saved!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get stock In """
        try:
            data = []
            filters = request.GET.dict()

            if filters.get("product"):
                filters["product__name__icontains"] = filters.pop("product")

            stockin_instances = StockIn.objects.filter(**filters)
            group_ids = [stockin.group.pk for stockin in stockin_instances]
            group_ids = self.remove_duplicate_group(group_ids)

            group_instances = GroupStockIn.objects.filter(id__in=group_ids)
            
            for group_instance in group_instances:
                dict_data = GroupStockInSerializer(group_instance).data
                dict_data["supplier_name"] = group_instance.supplier.name

                if group_instance.received_by_user:
                    dict_data["receiver_name"] = f"{group_instance.received_by_user.first_name} {group_instance.received_by_user.last_name}"
                
                stockin_instances = StockIn.objects.filter(group=group_instance.pk)
                dict_data["list"] = [StockInSerializer(stockin_instance).data for stockin_instance in stockin_instances]
                data.append(dict_data)

            return self.success_response(data)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def remove_duplicate_group(self, group_ids:list) -> list:
        """Remove duplicate ids"""
        try:
            new_ids = []

            for g_id in group_ids:
                if g_id not in new_ids:
                    new_ids.append(g_id)

            return new_ids
        except Exception as exc:
            debug_exception(exc)
            self.raise_error(exc)

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
            group_instance = GroupStockIn.objects.get(pk=pk)
            group_instance.delete()
            return self.success_response("Successfully deleted!")
        except GroupStockIn.DoesNotExist:
            self.raise_error("Stock in does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class StockInListAPIView(API):
    """Stock In List API View"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get stock In """
        try:
            data = []
            filters = request.GET.dict()

            if filters.get("product"):
                filters["product__name__icontains"] = filters.pop("product")

            stockin_instances = StockIn.objects.filter(**filters)

            for stockin in stockin_instances:
                dict_data = StockInSerializer(stockin).data
                data.append(dict_data)

            return self.success_response(data)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)