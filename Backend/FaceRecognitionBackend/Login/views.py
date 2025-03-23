from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from .models import RegistrationLoginDetails
from .serializers import LoginSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            user = RegistrationLoginDetails.objects.get(user__userId=user_data["userId"]).user

            # Construct redirect URL
            user_details_url = reverse('user_details', kwargs={'user_id': user.userId})
            return Response(
                {
                    "message": "Login successful",
                    "redirect_url": user_details_url,
                    "user": user_data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
