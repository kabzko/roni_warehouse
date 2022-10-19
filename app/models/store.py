from datetime import datetime
from django.db import models

class Store(models.Model):
    """Store/branch model"""

    name = models.CharField(max_length=250)
    address = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(default=datetime.now)