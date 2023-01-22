from rest_framework import serializers

from app.models.supplier import Supplier

class SupplierSerializer(serializers.ModelSerializer):
    """Supplier model serializer"""
    
    class Meta:
        model = Supplier
        
        fields = [
            "id",
            "name",
            "address",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "name": {
                "error_messages": {
                    "blank": "Name is required!"
                }
            },
            "address": {
                "error_messages": {
                    "blank": "Address is required!"
                }
            },
        }