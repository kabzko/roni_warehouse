from django.urls import path

from app.api.views import (
    UserLoginAPIView
)

urlpatterns = [
    path("login/", UserLoginAPIView.as_view()),
]
