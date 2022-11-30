from rest_framework import serializers

from app.models.cart import Cart

class CartSerializer(serializers.ModelSerializer):
    """Cart model serializer"""
    
    class Meta:
        model = Cart
        
        fields = [
            "id",
            "sales",
            "product",
            "unit_of_measure",
            "quantity",
            "price",
            "created_at",
            "updated_at",
        ]