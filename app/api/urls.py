from django.urls import path

from app.api.views import (
    UserLoginAPIView,
    UserLogoutAPIView,
    UserAPIView,
    UserDetailAPIView,
)

urlpatterns = [
    path("login/", UserLoginAPIView.as_view()),
    path("logout/", UserLogoutAPIView.as_view()),
    path("users/", UserAPIView.as_view()),
    path("users/<int:pk>/", UserDetailAPIView.as_view()),
]
