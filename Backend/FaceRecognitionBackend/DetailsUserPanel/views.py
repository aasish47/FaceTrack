from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import RegistrationUser as User, UserAttendance
from .serializers import UserAttendanceSerializer
from django.shortcuts import get_object_or_404
import base64
from django.http import JsonResponse

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