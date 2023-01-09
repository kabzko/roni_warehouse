from django.db import models

class StockIn(models.Model):
    """Stock In Model"""

    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    group = models.ForeignKey("GroupStockIn", on_delete=models.CASCADE, blank=True, null=True)
    unit_of_measure = models.CharField(max_length=100)
    quantity = models.IntegerField()
    number_of_pieces = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class GroupStockIn(models.Model):
    """Group stock in"""

    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    supplier_name = models.CharField(max_length=250, blank=True, null=True)
    checked_by = models.CharField(max_length=250, blank=True, null=True)
    received_by = models.CharField(max_length=250, blank=True, null=True)
    truck_plate_number = models.CharField(max_length=250, blank=True, null=True)
    truck_driver = models.CharField(max_length=250, blank=True, null=True)
    sales_invoice_no = models.CharField(max_length=250, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date = models.DateField()