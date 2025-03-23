from rest_framework import serializers
from .models import UserAttendance

class AttendanceSerializer (serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = ('user_id',
                  'time_in',
                  'time_out',
                  'date')