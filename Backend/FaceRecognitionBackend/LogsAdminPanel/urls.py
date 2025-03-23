from django.urls import path
from .views import getAttendance

urlpatterns = [
    path('userAttendance/', getAttendance),  # Endpoint for fetching attendance data
]
