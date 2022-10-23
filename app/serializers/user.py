from rest_framework import serializers

from app.models.user import User

class UserSerializer(serializers.ModelSerializer):
    """User model serializer"""
    class Meta:
        model = User

        fields = [
            "id",
            "system_id",
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "mobile_number",
            "user_type",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "mobile_number": {
                "error_messages": {
                    "blank": "Mobile number is required!"
                }
            },
            "email": {
                "error_messages": {
                    "blank": "Email is required!"
                }
            },
        }