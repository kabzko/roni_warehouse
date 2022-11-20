from rest_framework import serializers

from app.models.stock_out import StockOut

class StockOutSerializer(serializers.ModelSerializer):
    """Stock Out model serializer"""
    
    class Meta:
        model = StockOut
        
        fields = [
            "id",
            "stock_in",
            "created_by",
            "delivered_to",
            "checked_by",
            "received_by",
            "truck_plate_number",
            "truck_driver",
            "quantity",
            "created_at",
            "updated_at",
            "date",
        ]

        extra_kwargs = {
            "stock_in": {
                "error_messages": {
                    "blank": "Stock In by is required!",
                    "null": "Stock In is required!",
                    "required": "Stock In is required!",
                }
            },
            "quantity": {
                "error_messages": {
                    "blank": "Quantity is required!",
                    "invalid": "Quantity must be a valid number!",
                }
            },
            "date": {
                "error_messages": {
                    "blank": "Date is required!",
                    "null": "Date is required!",
                }
            },
        }