from django.http import JsonResponse
from DetailsAdminPanel.models import UserAttendance  
from .serializer import AttendanceSerializer
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import JSONParser
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
def editAttendance(request, id):
    try:
        record = UserAttendance.objects.get(id=id)  
    except UserAttendance.DoesNotExist:
        return JsonResponse({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AttendanceSerializer(record, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        record.delete()
        return JsonResponse({'message': 'Record deleted'}, status=status.HTTP_204_NO_CONTENT)
