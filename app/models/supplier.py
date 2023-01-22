from django.db import models

class Supplier(models.Model):
    """Supplier model"""

    name = models.CharField(max_length=250)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)