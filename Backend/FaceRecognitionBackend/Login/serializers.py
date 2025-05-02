from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from .models import User

class LoginSerializer(serializers.Serializer):
    userId = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user_id = data.get("userId")
        password = data.get("password")

        if not user_id or not password:
            raise serializers.ValidationError("Missing required fields: userId or password")

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not check_password(password, user.hashed_password):
            raise serializers.ValidationError("Incorrect password")

        return {
            "userId": user.user_id,
            "role": user.role,
        }
