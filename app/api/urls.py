from django.urls import path

from app.api.views.users import (
    UserLoginAPIView,
    UserLogoutAPIView,
    UserAPIView,
    UserDetailAPIView,
)

from app.api.views.product import (
    ProductAPIView,
    ProductDetailAPIView,
    ProductAvailableStockAPIView,
)

from app.api.views.stock_in import (
    StockInAPIView,
    StockInDetailAPIView,
    StockInListAPIView,
)

from app.api.views.stock_out import (
    StockOutAPIView,
    StockOutDetailAPIView,
    StockOutApproveAPIView,
)

from app.api.views.listing import (
    ListingAPIView,
    ListingDetailAPIView,
)

from app.api.views.cashier import (
    CashierAPIView,
    CashierLastTransactionAPIView,
)

from app.api.views.invoice import (
    InvoiceAPIView,
)

from app.api.views.sales import (
    SalesAPIView,
)

from app.api.views.available_stock import (
    AvailableStockAPIView,
)

from app.api.views.leaderboards import (
    LeaderboardsAPIView,
)

from app.api.views.cart import (
    CartAPIView,
)

from app.api.views.supplier import (
    SupplierAPIView,
    SupplierDetailAPIView,
)

from app.api.views.truck_driver import (
    TruckDriverAPIView,
    TruckDriverDetailAPIView,
)

urlpatterns = [
    # Authentication URLs
    path("login/", UserLoginAPIView.as_view()),
    path("logout/", UserLogoutAPIView.as_view()),

    # Users URLs
    path("users/", UserAPIView.as_view()),
    path("users/<int:pk>/", UserDetailAPIView.as_view()),

    # Product URLs
    path("products/", ProductAPIView.as_view()),
    path("products/<int:pk>/", ProductDetailAPIView.as_view()),
    path("products/available-stocks/", ProductAvailableStockAPIView.as_view()),

    # Stock In URLs
    path("stock-in/", StockInAPIView.as_view()),
    path("stock-in/list/", StockInListAPIView.as_view()),
    path("stock-in/<int:pk>/", StockInDetailAPIView.as_view()),

    # Stock Out URLs
    path("stock-out/", StockOutAPIView.as_view()),
    path("stock-out/<int:pk>/", StockOutDetailAPIView.as_view()),
    path("stock-out/approve/<int:pk>/", StockOutApproveAPIView.as_view()),

    # Stocks URLs
    path("stock/available/", AvailableStockAPIView.as_view()),

    # Listing URLs
    path("listing/", ListingAPIView.as_view()),
    path("listing/<int:pk>/", ListingDetailAPIView.as_view()),

    # Cashier URLs
    path("cashier/listing/", CashierAPIView.as_view()),
    path("cashier/checkout/", CashierAPIView.as_view()),
    path("cashier/last-transaction/<int:pk>/", CashierLastTransactionAPIView.as_view()),

    # Invoice URLs
    path("invoice/", InvoiceAPIView.as_view()),

    # Sales URLs
    path("sales/", SalesAPIView.as_view()),

    # Leaderboards URLs
    path("leaderboards/", LeaderboardsAPIView.as_view()),

    path("carts/", CartAPIView.as_view()),

    # Supplier URLs
    path("suppliers/", SupplierAPIView.as_view()),
    path("suppliers/<int:pk>/", SupplierDetailAPIView.as_view()),

    # Truck driver URLs
    path("truck-drivers/", TruckDriverAPIView.as_view()),
    path("truck-drivers/<int:pk>/", TruckDriverDetailAPIView.as_view()),
]