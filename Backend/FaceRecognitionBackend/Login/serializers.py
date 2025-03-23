from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import RegistrationUser, RegistrationLoginDetails

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationUser
        fields = ['userId', 'userName', 'userEmail', 'userDepartment', 'userDesignation', 'userPhoto']

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = RegistrationUser.objects.get(userId=data['user_id'])
            login_details = RegistrationLoginDetails.objects.get(user=user)

            if not check_password(data['password'], login_details.hashed_password):
                raise serializers.ValidationError("Invalid credentials")

            tokens = RefreshToken.for_user(user)

            return {
                'user': UserSerializer(user).data,
                'access_token': str(tokens.access_token),
                'refresh_token': str(tokens),
            }

        except RegistrationUser.DoesNotExist:
            raise serializers.ValidationError("User not found")
        except RegistrationLoginDetails.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
