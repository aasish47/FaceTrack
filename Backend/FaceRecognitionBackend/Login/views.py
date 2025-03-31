from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from .models import AdminUser, NormalUser
from .serializers import LoginSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user_data = serializer.validated_data
            print(user_data)
            return Response(
                {
                    "message": "Login successful",
                    "user": user_data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
