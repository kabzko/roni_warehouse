from django.db import models

class TruckDriver(models.Model):
    """Truck Driver model"""

    name = models.CharField(max_length=250)
    contact_number = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)