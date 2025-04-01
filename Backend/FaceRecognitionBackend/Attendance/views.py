from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserAttendance
from datetime import datetime, timedelta
from django.utils.timezone import localtime
from Camera.models import Camera
import re


@csrf_exempt
def mark_attendance(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            user_id = data.get("user_id")
            camera_id = data.get("camera")  # Camera ID passed from the client
            date = datetime.today().date()
            current_time = (datetime.utcnow() + timedelta(hours=5, minutes=30)).time()

            # Fetch the camera object based on camera_id from the Camera model
            match = re.search(r'camera_(\d+)', camera_id)

            if match:
                camera_id = match.group(1)  # This will give you the numeric part (e.g., "10")
                print(f"Camera ID: {camera_id}")
            else:
                print("No camera ID found")
            
            camera = Camera.objects.filter(id=camera_id).first()
            print(camera)

            if not camera:
                return JsonResponse({"status": "error", "message": "Camera not found"}, status=404)

            # Get the camera type (entry or exit)
            camera_type = camera.type  # Assuming 'camera_type' is a field in Camera model

            # Get the latest attendance entry for the user on the current date
            latest_entry = UserAttendance.objects.filter(user_id=user_id, date=date).order_by('-id').first()

            if camera_type == "entry":
                # if latest_entry:  # If an entry already exists, don't create a new one
                #     return JsonResponse({"status": "error", "message": "Entry already recorded for today"}, status=400)

                # Create a new entry
                UserAttendance.objects.create(
                    user_id=user_id,
                    date=date,
                    time_in=current_time,
                    time_out="00:00:00"
                )
                return JsonResponse({"status": "success", "message": "Entry recorded"}, status=201)

            elif camera_type == "exit":
                if latest_entry:
                    # Update the existing entry with time out
                    latest_entry.time_out = current_time
                    latest_entry.save()
                    return JsonResponse({"status": "success", "message": "Exit recorded"}, status=201)
                else:
                    return JsonResponse({"status": "error", "message": "No entry found for exit"}, status=400)

            else:
                return JsonResponse({"status": "error", "message": "Invalid camera type"}, status=400)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)