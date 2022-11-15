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
)

from app.api.views.stock_in import (
    StockInAPIView,
    StockInDetailAPIView,
)

from app.api.views.stock_out import (
    StockOutAPIView,
    StockOutDetailAPIView,
)

from app.api.views.available_stock import (
    AvailableStockAPIView,
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

    # Stock In URLs
    path("stock-in/", StockInAPIView.as_view()),
    path("stock-in/<int:pk>/", StockInDetailAPIView.as_view()),

    # Stock Out URLs
    path("stock-out/", StockOutAPIView.as_view()),
    path("stock-out/<int:pk>/", StockOutDetailAPIView.as_view()),

    # Stocks URLs
    path("stock/available/", AvailableStockAPIView.as_view()),
]