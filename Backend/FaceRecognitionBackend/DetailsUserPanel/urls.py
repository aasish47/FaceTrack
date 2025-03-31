from django.urls import path
from .views import get_user_details, get_user_attendance,send_wfh_email, get_attendance_requests, delete_attendance_request

urlpatterns = [
    path('user/<int:user_id>/', get_user_details, name='user_details'),
    path('user/<int:user_id>/attendance/', get_user_attendance, name='user_attendance'),
    path('send-email/', send_wfh_email, name='send-wfh-email'),
    path('attendance-requests/', get_attendance_requests, name='get_attendance_requests'),  # URL for the GET request
    path('delete-attendance-request/<int:request_id>/', delete_attendance_request, name='delete_attendance_request'), #Url of the DELETE request

]
