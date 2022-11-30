from datetime import datetime
from django.db import models

class Sales(models.Model):
    """Sales Model"""

    reference_no = models.CharField(max_length=100)
    cashier_by = models.ForeignKey("User", on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=100)
    amount_pay = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)