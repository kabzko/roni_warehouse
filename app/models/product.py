from datetime import datetime
from django.db import models

class Product(models.Model):
    """Product/Item Model"""

    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)