from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        if user_id is None:
            return None

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return None

        return user
