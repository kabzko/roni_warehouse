from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from app.models.product import Product
from app.models.stock_in import StockIn
from app.models.stock_out import StockOut

from app.serializers.product import ProductSerializer

from utils.exceptions import HumanReadableError
from utils.views.api import API
from utils.common import beautify_serializer_error
from utils.debug import debug_exception

class ProductAPIView(API):
    """Product class view"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create product request"""
        try:
            data = request.data

            if data.get("expiration_date", None) == "":
                data.pop("expiration_date")

            product_serializer = ProductSerializer(data=data)

            if product_serializer.is_valid():
                product_serializer.save()
            else:
                return self.raise_error(beautify_serializer_error(product_serializer.errors))

            return self.success_response("Product successfully created!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def get(self, request):
        """Get products"""
        try:
            search = request.GET.get("search", None)
            supplier_id = request.GET.get("supplier_id", None)

            if search:
                filters = Q(name__icontains=search) | Q(description__icontains=search) | Q(barcode__icontains=search)
            else:
                filters = Q(name__icontains="")

            if supplier_id:
                filters &= Q(supplier__id=supplier_id)

            product_instances = Product.objects.filter(filters)
            product_serializers = ProductSerializer(product_instances, many=True)

            return self.success_response(product_serializers.data)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class ProductDetailAPIView(API):
    """Product edit, delete, or get specific product"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get product"""
        try:
            product_instance = Product.objects.get(pk=pk)
            product_serializer = ProductSerializer(product_instance)
            return self.success_response(product_serializer.data)
        except Product.DoesNotExist:
            self.raise_error("Product does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def post(self, request, pk):
        """Update product"""
        try:
            data = request.data
            
            if data.get("expiration_date", None) == "":
                data.pop("expiration_date")

            product_instance = Product.objects.get(pk=pk)
            product_serializer = ProductSerializer(product_instance, data=data)

            if product_serializer.is_valid():
                product_serializer.save()
            else:
                self.raise_error(beautify_serializer_error(product_serializer.errors))

            return self.success_response("Product successfully updated!")
        except Product.DoesNotExist:
            self.raise_error("Product does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def delete(self, request, pk):
        """Delete product"""
        try:
            product_instance = Product.objects.get(pk=pk)
            product_instance.delete()
            return self.success_response("Product successfully deleted!")
        except Product.DoesNotExist:
            self.raise_error("Product does not exist!")
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

class ProductAvailableStockAPIView(API):
    """Product available stock API view"""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get product"""
        try:
            products = []
            filters = {
                "product__name__icontains": request.GET.get("search", "")
            }
            
            stock_in_instances = StockIn.objects.filter(**filters)
            for stock_in in stock_in_instances:
                available_stocks = self.countAvailableStock(stockIn=stock_in)
                is_product_exist = self.isProductExist(stockIns=stock_in, productList=products, availableStock=available_stocks)

                if not is_product_exist:
                    products.append({
                        "id": stock_in.product.pk,
                        "name": stock_in.product.name,
                        "barcode": stock_in.product.barcode,
                        "unit_of_measure": stock_in.unit_of_measure,
                        "available_stocks": available_stocks
                    })

            return self.success_response(products)
        except HumanReadableError as exc:
            return self.error_response(exc, self.error_dict, self.status)
        except Exception as exc:
            debug_exception(exc)
            return self.server_error_response(exc)

    def countAvailableStock(self, stockIn:StockIn) -> int:
        """Count available stock"""

        available_stock = stockIn.quantity

        stock_out_instances = StockOut.objects.filter(stock_in=stockIn)
        for stock_out in stock_out_instances:
            available_stock -= stock_out.quantity

        return available_stock

    def isProductExist(self, stockIns:StockIn, productList:list, availableStock:int) -> bool:
        """Check if the product already exist in the list and update available stock if exist."""

        is_exist = False

        for product in productList:
            if product["id"] == stockIns.product.pk and product["unit_of_measure"] == stockIns.unit_of_measure:
                product["available_stocks"] += availableStock
                is_exist = True
                break

        return is_exist