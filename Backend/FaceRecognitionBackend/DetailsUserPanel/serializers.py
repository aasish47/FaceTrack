from rest_framework import serializers
from .models import RegistrationUser, UserAttendance

class RegistrationUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationUser
        fields = '__all__'

class UserAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = ['time_in', 'time_out', 'date']  # ✅ Only include attendance details

