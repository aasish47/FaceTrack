from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from .models import AdminUser, NormalUser

class LoginSerializer(serializers.Serializer):
    userId = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    def validate(self, data):
        user_id = data.get("userId")
        password = data.get("password")
        role = data.get("role").lower()

        if not user_id or not password or not role:
            raise serializers.ValidationError("Missing required fields")

        # Determine the correct model to query
        if role == "admin":
            try:
                user_login = AdminUser.objects.get(admin_id=user_id)
            except AdminUser.DoesNotExist:
                raise serializers.ValidationError("Invalid admin credentials")
        elif role == "user":
            try:
                user_login = NormalUser.objects.get(user_id=user_id)
            except NormalUser.DoesNotExist:
                raise serializers.ValidationError("Invalid user credentials")
        else:
            raise serializers.ValidationError("Invalid role specified")

        # Check the hashed password
        if not check_password(password, user_login.hashed_password):
            raise serializers.ValidationError("Incorrect password")

        # Return user details based on role
        if role == "admin":
            return {
                "userId": user_login.admin_id,
                "role": "admin",
            }
        else:
            return {
                "userId": user_login.user_id,
                "role": "user",
            }

