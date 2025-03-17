from django.urls import path
from .views import get_users, attendance_summary

urlpatterns = [
    path('get-users/', get_users, name='get-users'),
    path('attendance-summary/', attendance_summary),
]