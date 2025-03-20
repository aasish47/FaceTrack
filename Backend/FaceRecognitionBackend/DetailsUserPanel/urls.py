from django.urls import path
from .views import get_user_details, get_user_attendance

urlpatterns = [
    path('user/<int:user_id>/', get_user_details, name='user_details'),
    path('user/<int:user_id>/attendance/', get_user_attendance, name='user_attendance'),
]
