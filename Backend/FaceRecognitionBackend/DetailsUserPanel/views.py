from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import RegistrationUser as User, UserAttendance
from .serializers import UserAttendanceSerializer
from django.shortcuts import get_object_or_404
import base64
from django.http import JsonResponse
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

@api_view(['POST'])
def send_wfh_email(request):
    try:
        userId = request.data.get('userId')
        name = request.data.get('name')
        email = request.data.get('email')
        type_ = request.data.get('type')
        date = request.data.get('date')
        reason = request.data.get('reason')

        if not all([name, email, type_, date, reason]):
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        subject = f"{type_} Request from {name}"
        message = f"""
{name} has submitted a {type_} request.

Details:
- Name: {name}
- User Id: {userId}
- Email: {email}
- Type: {type_}
- Date: {date}
- Reason: {reason}
        """

        from_email = settings.EMAIL_HOST_USER
        to_email = [settings.EMAIL_HOST_USER, email]

        send_mail(subject, message, from_email, to_email, fail_silently=False)

        return Response({"message": "Request submitted and email sent!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "Failed to send email", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_details(request, user_id):
    user = get_object_or_404(User, userId=user_id)

    encoded_string = None
    if user.userPhoto: 
        with open(user.userPhoto, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    else:
        encoded_string = None 

    user_data = {
        "userId": user.userId,
        "userName": user.userName,
        "userEmail": user.userEmail,
        "userDepartment": user.userDepartment,
        "userDesignation": user.userDesignation,
        "userPhoto": encoded_string,
    }

    return JsonResponse(user_data)
# def get_user_details(request, user_id):
#     user = get_object_or_404(RegistrationUser, user_id=user_id)
#     serializer = RegistrationUserSerializer(user)
#     return Response(serializer.data)


@api_view(['GET'])
def get_user_attendance(request, user_id):
    user = get_object_or_404(User, userId=user_id)
    attendance_records = UserAttendance.objects.filter(user=user)
    serializer = UserAttendanceSerializer(attendance_records, many=True)

    return Response(serializer.data)