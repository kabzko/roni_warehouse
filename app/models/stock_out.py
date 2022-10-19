from datetime import datetime
from django.db import models

class StockOut(models.Model):
    """Stock Out Model"""

    stock_in = models.ForeignKey("StockIn", on_delete=models.CASCADE)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    delivered_to = models.ForeignKey("Store", on_delete=models.CASCADE)
    checked_by = models.CharField(max_length=250, blank=True, null=True)
    received_by = models.CharField(max_length=250, blank=True, null=True)
    truck_plate_number = models.CharField(max_length=250, blank=True, null=True)
    truck_driver = models.CharField(max_length=250, blank=True, null=True)
    sales_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    number_of_pieces = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)
    date = models.DateField()