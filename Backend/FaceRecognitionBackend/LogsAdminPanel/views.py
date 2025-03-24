from django.http import JsonResponse
from DetailsAdminPanel.models import UserAttendance  # Import from the first app
from .serializer import AttendanceSerializer
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['GET', 'POST'])
def getAttendance(request):
    if request.method == 'GET':
        attendance_records = UserAttendance.objects.all()
        serializer = AttendanceSerializer(attendance_records, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def editAttendance(request, user_id, date):
    try:
        record = UserAttendance.objects.get(user=user_id, date=date)
    except UserAttendance.DoesNotExist:
        return JsonResponse({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AttendanceSerializer(record, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        record.delete()
        return JsonResponse({'message': 'Record deleted'}, status=status.HTTP_204_NO_CONTENT)
