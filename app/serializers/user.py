from rest_framework import serializers

from app.models.user import User

class UserSerializer(serializers.ModelSerializer):
    """User model serializer"""

    email = serializers.EmailField(allow_blank=True, allow_null=True)
    cashier_id = serializers.CharField(allow_blank=True, allow_null=True)

    class Meta:
        model = User

        fields = (
            "id",
            "system_id",
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "cashier_id",
            "user_type",
            "created_at",
            "updated_at",
        )