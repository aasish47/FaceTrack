# from django.db.models import Min
# from django.utils.timezone import now
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import User, UserAttendance
# from datetime import datetime

# @api_view(['GET'])
# def get_users(request):
#     total_users = User.objects.count()
#     return Response({'total_users': total_users})

# @api_view(['GET'])
# def attendance_summary(request):
#     today = now().date()

#     first_entries = UserAttendance.objects.filter(date=today).values('user_id').annotate(first_entry=Min('time_in'))

#     total_people = len(first_entries)
#     late_count = sum(1 for entry in first_entries if entry['first_entry'] > datetime.strptime('09:30:00', '%H:%M:%S').time())
#     on_time_count = total_people - late_count

#     total_strength = User.objects.count()

#     return Response({
#         'total_strength': total_strength,
#         'total_people_today': total_people,
#         'late_count': late_count,
#         'on_time_count': on_time_count
#     })









from django.db.models import Min
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, UserAttendance
from datetime import datetime
from Registration.serializers import UserSerializer
from django.db.models import Count
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserAttendance
from datetime import timedelta

@api_view(['GET'])
def get_users(request):
    total_users = User.objects.count()
    return Response({'total_users': total_users})


@api_view(['GET'])
def attendance_summary(request):
    date_param = request.GET.get('date', None)
    today = datetime.strptime(date_param, '%Y-%m-%d').date() if date_param else now().date()

    first_entries = UserAttendance.objects.filter(date=today).values('user_id').annotate(first_entry=Min('time_in'))

    late_users = []
    on_time_users = []
    all_attending_users = set()

    for entry in first_entries:
        user_id = entry['user_id']
        all_attending_users.add(user_id)

        if entry['first_entry'] and entry['first_entry'] > datetime.strptime('09:30:00', '%H:%M:%S').time():
            late_users.append(user_id)
        else:
            on_time_users.append(user_id)

    total_users = set(User.objects.values_list('userId', flat=True))
    absent_users = list(total_users - all_attending_users)

    def get_user_data(user_ids):
        return list(User.objects.filter(userId__in=user_ids).values('userId', 'userName', 'userEmail'))

    return Response({
        'total_strength': len(total_users),
        'total_people_today': len(all_attending_users),
        'late_users': get_user_data(late_users),
        'on_time_users': get_user_data(on_time_users),
        'absent_users': get_user_data(absent_users),
        'present_users': get_user_data(late_users + on_time_users)
    })
    
@api_view(['GET'])
def attendance_monthly_summary(request):
    today = now().date()
    start_date = today - timedelta(days=30)

    # Get attendance counts for the last 30 days
    attendance_data = (
        UserAttendance.objects
        .filter(date__range=[start_date, today])
        .values('date')
        .annotate(
            present_count=Count('user_id', distinct=True),
        )
        .order_by('date')
    )

    # Fill missing dates with 0 attendance
    date_map = {entry['date']: entry['present_count'] for entry in attendance_data}
    summary = []
    
    for i in range(30):
        date = start_date + timedelta(days=i)
        summary.append({
            'date': date.strftime('%Y-%m-%d'),
            'present': date_map.get(date, 0)
        })

    return Response(summary)







@api_view(['GET'])
def send_user_data(request):
    today = now().date()
    start_date = today - timedelta(days=30)

    # Get all users
    users = User.objects.all()

    # Count attendance for each user in the last 30 days
    attendance_counts = UserAttendance.objects.filter(date__range=[start_date, today]).values('user_id').annotate(
        attendance_count=Count('user_id')
    )

    # Map attendance counts to users
    attendance_map = {entry['user_id']: entry['attendance_count'] for entry in attendance_counts}

    # Serialize user data along with attendance count
    user_data = []
    for user in users:
        user_data.append({
            'userId': user.userId,
            'userName': user.userName,  # Fixed field name
            'userEmail': user.userEmail,
            'userDepartment': user.userDepartment,
            'userDesignation': user.userDesignation,
            'userPhoto': user.userPhoto,
            'attendance_count': attendance_map.get(user.userId, 0)  # Default to 0 if no attendance record
        })

    return Response({'users': user_data})