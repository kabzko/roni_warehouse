from datetime import datetime
from django.db import models

class Listing(models.Model):
    """Listing Model"""

    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    unit_of_measure = models.CharField(max_length=100)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)