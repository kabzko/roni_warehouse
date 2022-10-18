from django.db import models

class Product(models.Model):
    """"""

    barcode = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    net_weight = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

class StockInLogs(models.Model):
    """"""

    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    sales_invoice_no = models.CharField(max_length=100, blank=True, null=True)
    supplier_name = models.CharField(max_length=100, blank=True, null=True)
    cost = models.DecimalField(max_length=100, blank=True, null=True)
    unit_measurement = models.CharField(max_length=100, blank=True, null=True)
    new_added_per_unit_measurement = models.IntegerField(max_length=100, blank=True, null=True)
    new_added_per_piece = models.IntegerField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

class ProductBatching(models.Model):
    """"""

    batch_no = models.IntegerField(max_length=100, blank=True, null=True)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    unit_measurement = models.CharField(max_length=100, blank=True, null=True)
    quantity_per_unit_measurement = models.IntegerField(max_length=100, blank=True, null=True)
    quantity_per_piece = models.IntegerField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
