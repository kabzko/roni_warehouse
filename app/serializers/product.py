from rest_framework import serializers

from app.models.product import Product

class ProductSerializer(serializers.ModelSerializer):
    """Product model serializer"""
    
    class Meta:
        model = Product
        
        fields = [
            "id",
            "name",
            "description",
            "barcode",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "name": {"error_messages": {"blank": "Name is required!"}},
        }