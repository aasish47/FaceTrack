from django.http import JsonResponse
from .models import UserAttendance
from .serializer import AttendanceSerializer

def getAttendance(request):
    attendance_records = UserAttendance.objects.all()
    serializer = AttendanceSerializer(attendance_records, many=True)
    return JsonResponse(serializer.data, safe=False)