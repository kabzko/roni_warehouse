from rest_framework import serializers

from app.models.sales import Sales

class SalesSerializer(serializers.ModelSerializer):
    """Sales model serializer"""
    
    class Meta:
        model = Sales
        
        fields = [
            "id",
            "reference_no",
            "cashier_by",
            "payment_type",
            "amount_pay",
            "created_at",
            "updated_at",
        ]