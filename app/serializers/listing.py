from rest_framework import serializers

from app.models.listing import Listing

class ListingSerializer(serializers.ModelSerializer):
    """Listing model serializer"""
    
    class Meta:
        model = Listing
        
        fields = [
            "id",
            "product",
            "stock_out",
            "price",
            "unit_of_measure",
            "created_by",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "product": {
                "error_messages": {
                    "blank": "Product is required!",
                    "null": "Product by is required!",
                }
            },
            "stock_out": {
                "error_messages": {
                    "blank": "Stock Out is required!",
                    "null": "Stock Out by is required!",
                }
            },
            "created_by": {
                "error_messages": {
                    "blank": "Created by is required!",
                    "null": "Created by is required!",
                    "required": "Created by is required!",
                }
            },
            "price": {
                "error_messages": {
                    "blank": "Price is required!",
                    "invalid": "Price must be a valid number!",
                }
            },
        }