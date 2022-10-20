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
]