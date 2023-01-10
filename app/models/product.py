from datetime import datetime
from django.db import models

class Product(models.Model):
    """Product/Item Model"""

    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    net_weight = models.CharField(max_length=250, blank=True, null=True)