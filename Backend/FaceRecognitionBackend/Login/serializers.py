from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from .models import RegistrationLoginDetails

class LoginSerializer(serializers.Serializer):
    userId = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user_login = RegistrationLoginDetails.objects.select_related('user').get(user__userId=data["userId"])
        except RegistrationLoginDetails.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not check_password(data["password"], user_login.hashed_password):
            raise serializers.ValidationError("Invalid credentials")

        return {
            "userId": user_login.user.userId,
            "userName": user_login.user.userName,
            "userDepartment": user_login.user.userDepartment,
            "userDesignation": user_login.user.userDesignation,
        }
