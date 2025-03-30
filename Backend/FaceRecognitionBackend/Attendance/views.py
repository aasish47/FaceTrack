# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# from .models import UserAttendance
# from datetime import datetime

# @csrf_exempt
# def mark_attendance(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             user_id = data.get("user_id")
#             camera = data.get("camera")  # Get camera source
#             date = datetime.today().date()
#             current_time = datetime.now().time()

#             # Fetch or create an attendance record for today
#             attendance, created = UserAttendance.objects.get_or_create(
#                 user_id=user_id, date=date,
#                 defaults={"time_in": "00:00:00", "time_out": "00:00:00"}
#             )

#             if camera == "camera_1":  # Entry camera
#                 attendance.time_in = current_time
#             elif camera == "camera_2":  # Exit camera
#                 attendance.time_out = current_time

#             attendance.save()

#             return JsonResponse({"status": "success", "message": "Attendance recorded"}, status=201)

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=400)

#     return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# from .models import UserAttendance
# from datetime import datetime, timedelta
# from django.utils.timezone import localtime

# @csrf_exempt
# def mark_attendance(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             user_id = data.get("user_id")
#             camera = data.get("camera")
#             date = datetime.today().date()
#             # current_time = datetime.now().time()
#             # current_time = localtime().time()
#             current_time = datetime.utcnow() + timedelta(hours=5, minutes=30)
#             print(current_time)  
#             print(datetime.now().time())

#             # Create a new entry without overriding previous records
#             UserAttendance.objects.create(
#                 user_id=user_id,
#                 date=date,
#                 time_in=current_time if camera == "camera_1" else "00:00:00",
#                 time_out=current_time if camera == "camera_2" else "00:00:00"
#             )

#             return JsonResponse({"status": "success", "message": "Attendance recorded"}, status=201)

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=400)

#     return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserAttendance
from datetime import datetime, timedelta
from django.utils.timezone import localtime

@csrf_exempt
def mark_attendance(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            camera = data.get("camera")
            date = datetime.today().date()
            current_time = (datetime.utcnow() + timedelta(hours=5, minutes=30)).time()  # Adjust for local timezone

            # Get the latest entry for the user on the same date
            latest_entry = UserAttendance.objects.filter(user_id=user_id, date=date).order_by('-id').first()

            if camera == "camera_1":  # Entry detection
                # Create a new attendance entry
                UserAttendance.objects.create(
                    user_id=user_id,
                    date=date,
                    time_in=current_time,
                    time_out="00:00:00"
                )
                return JsonResponse({"status": "success", "message": "Entry recorded"}, status=201)

            elif camera == "camera_2":  # Exit detection
                if latest_entry:
                    latest_entry.time_out = current_time  # Update the latest entry's time_out
                    latest_entry.save()
                    return JsonResponse({"status": "success", "message": "Exit recorded"}, status=201)
                else:
                    return JsonResponse({"status": "error", "message": "No entry found for exit"}, status=400)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)