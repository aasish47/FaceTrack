from django.db.models import Min, Count
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, UserAttendance
from datetime import datetime, timedelta


@api_view(['GET'])
def get_users(request):
    total_users = User.objects.count()
    return Response({'total_users': total_users})


@api_view(['GET'])
def attendance_summary(request):
    date_param = request.GET.get('date', None)
    today = datetime.strptime(date_param, '%Y-%m-%d').date() if date_param else now().date()

    first_entries = UserAttendance.objects.filter(date=today).values('user_id').annotate(first_entry=Min('time_in'))

    late_users, on_time_users, all_attending_users = set(), set(), set()

    for entry in first_entries:
        user_id = entry['user_id']
        all_attending_users.add(user_id)

        if entry['first_entry'] and entry['first_entry'] > datetime.strptime('09:30:00', '%H:%M:%S').time():
            late_users.add(user_id)
        else:
            on_time_users.add(user_id)

    total_users = set(User.objects.values_list('userId', flat=True))
    absent_users = total_users - all_attending_users

    users = User.objects.filter(userId__in=total_users)
    user_map = {user.userId: {'userId': user.userId, 'userName': user.userName, 'userEmail': user.userEmail} for user in users}

    return Response({
        'total_strength': len(total_users),
        'total_people_today': len(all_attending_users),
        'late_users': [user_map[uid] for uid in late_users],
        'on_time_users': [user_map[uid] for uid in on_time_users],
        'absent_users': [user_map[uid] for uid in absent_users],
        'present_users': [user_map[uid] for uid in late_users | on_time_users],
        'total_users': [user_map[uid] for uid in total_users],
    })


@api_view(['GET'])
def attendance_monthly_summary(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    today = now().date()
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else today - timedelta(days=30)
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else today

    attendance_data = (
        UserAttendance.objects
        .filter(date__range=[start_date, end_date])
        .values('date')
        .annotate(present_count=Count('user_id', distinct=True))
        .order_by('date')
    )

    date_map = {entry['date']: entry['present_count'] for entry in attendance_data}
    summary = [{'date': (start_date + timedelta(days=i)).strftime('%Y-%m-%d'),
                'present': date_map.get(start_date + timedelta(days=i), 0)}
               for i in range((end_date - start_date).days + 1)]

    return Response(summary)


@api_view(['GET'])
def send_user_data(request):
    today = now().date()
    start_date = today - timedelta(days=30)

    users = User.objects.all()
    attendance_counts = UserAttendance.objects.filter(date__range=[start_date, today]).values('user_id').annotate(
        attendance_count=Count('user_id')
    )

    attendance_map = {entry['user_id']: entry['attendance_count'] for entry in attendance_counts}

    user_data = [{
        'userId': user.userId,
        'userName': user.userName,
        'userEmail': user.userEmail,
        'userDepartment': user.userDepartment,
        'userDesignation': user.userDesignation,
        'userPhoto': user.userPhoto,
        'attendance_count': attendance_map.get(user.userId, 0)
    } for user in users]

    return Response({'users': user_data})


#Post method of accepted attendance request from admin notification panel

@api_view(['POST'])
def accept_attendance_request(request):
    try:
       
        data = request.data
        user_id = data.get('UserId')
        date = data.get('Date')
        time_in = data.get('TimeIn')
        time_out = data.get('TimeOut')


        attendance_record = UserAttendance(
            user_id=user_id,
            date=date,
            time_in=time_in,
            time_out=time_out
        )
        attendance_record.save() 

        return Response({'message': 'Attendance recorded successfully!'}, status=201)
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)


