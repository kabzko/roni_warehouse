from datetime import datetime
from django.db import models

class Listing(models.Model):
    """Listing Model"""

    stock_out = models.ForeignKey("StockOut", on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)