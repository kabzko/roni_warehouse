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
            "created_by": {
                "error_messages": {
                    "blank": "Created by is required!",
                    "null": "Created by is required!",
                    "required": "Created by is required!",
                }
            },
            "quantity": {
                "error_messages": {
                    "blank": "Quantity is required!",
                    "invalid": "Quantity must be a valid number!",
                }
            },
            "price": {
                "error_messages": {
                    "blank": "Price is required!",
                    "invalid": "Price must be a valid number!",
                }
            },
            "number_of_pieces": {
                "error_messages": {
                    "blank": "Number of pieces is required!",
                    "invalid": "Number of pieces must be a valid number!",
                }
            },
            "date": {
                "error_messages": {
                    "blank": "Date is required!",
                    "null": "Date is required!",
                }
            },
        }