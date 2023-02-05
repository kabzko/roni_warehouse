from datetime import datetime
from django.db import models

class StockOut(models.Model):
    """Stock Out Model"""

    stock_in = models.ForeignKey("StockIn", on_delete=models.CASCADE)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    delivered_to = models.CharField(max_length=250, blank=True, null=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date = models.DateField()
    is_approved = models.BooleanField(default=False)

    def approve(self) -> None:
        """Approve the stockout"""

        self.is_approved = True
        self.save()