from datetime import datetime
from django.db import models

class StockOut(models.Model):
    """Stock Out Model"""

    stock_in = models.ForeignKey("StockIn", on_delete=models.CASCADE)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    delivered_to = models.CharField(max_length=250, blank=True, null=True)
    checked_by = models.CharField(max_length=250, blank=True, null=True)
    received_by = models.CharField(max_length=250, blank=True, null=True)
    truck_plate_number = models.CharField(max_length=250, blank=True, null=True)
    truck_driver = models.CharField(max_length=250, blank=True, null=True)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date = models.DateField()