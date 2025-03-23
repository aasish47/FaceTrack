from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UserDetails, UserAttendance
from .serializers import UserDetailsSerializer, UserAttendanceSerializer


@api_view(['GET'])
def get_user_details(request, user_id):
    try:
        user = UserDetails.objects.get(id=user_id)
        serializer = UserDetailsSerializer(user)
        return Response(serializer.data)
    except UserDetails.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['GET'])
def get_user_attendance(request, user_id):
    attendance = UserAttendance.objects.filter(user_id=user_id)
    serializer = UserAttendanceSerializer(attendance, many=True)
    return Response(serializer.data)
