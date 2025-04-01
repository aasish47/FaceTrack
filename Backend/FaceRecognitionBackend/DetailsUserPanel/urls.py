from django.urls import path
from .views import( get_user_details, get_user_attendance,send_wfh_email, get_attendance_requests,
                    delete_attendance_request, save_accepted_attendance_request, get_past_attendance_requests, 
                    delete_attendance_request_on_accept )

urlpatterns = [
    path('user/<int:user_id>/', get_user_details, name='user_details'),
    path('user/<int:user_id>/attendance/', get_user_attendance, name='user_attendance'),
    path('send-email/', send_wfh_email, name='send-wfh-email'),
    path('attendance-requests/', get_attendance_requests, name='get_attendance_requests'),  # URL for the GET request
    path('delete-attendance-request/<int:request_id>/', delete_attendance_request, name='delete_attendance_request'), #Url of the DELETE request
    path('delete_attendance_request_on_accept/<int:request_id>/', delete_attendance_request_on_accept, name='delete_attendance_request_on_accept'), #Url of the DELETE request data after admin approves
    path('save-accepted-attendance-request/', save_accepted_attendance_request, name='save_accepted_attendance_request'), #Url of storing accepted attendance request in past data
    path('past-attendance-requests/', get_past_attendance_requests, name='get_past_attendance_requests'),  # URL for the GET past attendance request


]
