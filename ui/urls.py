from django.urls import re_path

from ui.views import index

urlpatterns = [
    re_path(r'^.*$', index)
]