from rest_framework import serializers

from app.models.truck_driver import TruckDriver

class TruckDriverSerializer(serializers.ModelSerializer):
    """Truck Driver model serializer"""
    
    class Meta:
        model = TruckDriver
        
        fields = [
            "id",
            "name",
            "contact_number",
        ]

        extra_kwargs = {
            "name": {
                "error_messages": {
                    "blank": "Product is required!",
                    "null": "Product is required!",
                    "required": "Product is required!",
                }
            },
            "contact_number": {
                "error_messages": {
                    "blank": "Product is required!",
                    "null": "Product is required!",
                    "required": "Product is required!",
                }
            },
        }