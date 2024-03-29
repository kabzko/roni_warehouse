from rest_framework import serializers

from app.models.product import Product

class ProductSerializer(serializers.ModelSerializer):
    """Product model serializer"""
    
    class Meta:
        model = Product
        
        fields = [
            "id",
            "supplier",
            "name",
            "description",
            "barcode",
            "created_at",
            "updated_at",
            "net_weight",
        ]

        extra_kwargs = {
            "name": {
                "error_messages": {
                    "blank": "Name is required!"
                }
            },
            "supplier": {
                "error_messages": {
                    "blank": "Supplier is required!",
                    "null": "Supplier is required!",
                    "required": "Supplier is required!",
                }
            },
        }