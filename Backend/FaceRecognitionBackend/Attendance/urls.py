from django.urls import path
from .views import mark_attendance

urlpatterns = [
    path('mark-attendance/', mark_attendance, name='mark_attendance'),
]