from datetime import datetime
from django.db import models

class Sales(models.Model):
    """Sales Model"""

    reference_no = models.CharField(max_length=100)
    cashier_by = models.ForeignKey("User", on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)