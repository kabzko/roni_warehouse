from rest_framework import serializers

from app.models.stock_in import StockIn, GroupStockIn

class StockInSerializer(serializers.ModelSerializer):
    """Stock In model serializer"""
    
    class Meta:
        model = StockIn
        
        fields = [
            "id",
            "product",
            "group",
            "unit_of_measure",
            "price",
            "quantity",
            "number_of_pieces",
        ]

        extra_kwargs = {
            "product": {
                "error_messages": {
                    "blank": "Product is required!",
                    "null": "Product is required!",
                    "required": "Product is required!",
                }
            },
            "unit_of_measure": {
                "error_messages": {
                    "blank": "Unit of measure is required!",
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
        }

class GroupStockInSerializer(serializers.ModelSerializer):
    """Group Stock In model serializer"""
    
    class Meta:
        model = GroupStockIn
        
        fields = [
            "id",
            "created_by",
            "supplier_name",
            "checked_by",
            "received_by",
            "truck_plate_number",
            "truck_driver",
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
            "date": {
                "error_messages": {
                    "blank": "Date is required!",
                    "null": "Date is required!",
                }
            },
        }