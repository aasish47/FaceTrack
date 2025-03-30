from django.urls import path
from .views import (
    get_users, attendance_summary, attendance_monthly_summary, 
    send_user_data
)

print("DetailsAdminPanel URLs loaded")  # Debugging

urlpatterns = [
    path('get-users/', get_users, name='get_users'),
    path('attendance-summary/', attendance_summary, name='attendance_summary'),
    path('attendance-monthly-summary/', attendance_monthly_summary, name='attendance_monthly_summary'),
    path('send-user-data/', send_user_data, name='send_user_data'),
]