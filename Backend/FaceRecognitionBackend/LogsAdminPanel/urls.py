from django.urls import path
from .views import getAttendance, editAttendance

urlpatterns = [
    path('userAttendance/', getAttendance), 
    path('userAttendance/<int:id>/', editAttendance), 
]