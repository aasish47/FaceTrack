from django.urls import path
from .views import getAttendance, editAttendance

urlpatterns = [
    path('userAttendance/', getAttendance),  # Endpoint for fetching and creating records
    path('userAttendance/<int:pk>/', editAttendance),  # Endpoint for editing/deleting records
]