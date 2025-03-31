from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import RegistrationUser as User, UserAttendance, AttendanceRequest
from .serializers import UserAttendanceSerializer, AttendanceRequestSerializer
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
        
        # Save the data to the AttendanceRequest table
        attendance_request = AttendanceRequest(
            UserId=userId,
            Name=name,
            Email=email,
            Date=date,
            Type=type_,
            Reason=reason
        )
        attendance_request.save()


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


#Getting attendance requests from admin notification panel
@api_view(['GET'])
def get_attendance_requests(request):
    try:
        attendance_requests = AttendanceRequest.objects.all()
        serializer = AttendanceRequestSerializer(attendance_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#Deleting request when admin clicks on decline button in notification panel
@api_view(['DELETE'])
def delete_attendance_request(request, request_id):
    try:
        attendance_request = get_object_or_404(AttendanceRequest, Id=request_id)
        attendance_request.delete()
        return Response({"message": "Attendance request deleted successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)