from django.db.models import Min
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, UserAttendance
from datetime import datetime

@api_view(['GET'])
def get_users(request):
    total_users = User.objects.count()
    return Response({'total_users': total_users})

@api_view(['GET'])
def attendance_summary(request):
    today = now().date()

    first_entries = UserAttendance.objects.filter(date=today).values('user_id').annotate(first_entry=Min('time_in'))

    total_people = len(first_entries)
    late_count = sum(1 for entry in first_entries if entry['first_entry'] > datetime.strptime('09:30:00', '%H:%M:%S').time())
    on_time_count = total_people - late_count

    total_strength = User.objects.count()

    return Response({
        'total_strength': total_strength,
        'total_people_today': total_people,
        'late_count': late_count,
        'on_time_count': on_time_count
    })