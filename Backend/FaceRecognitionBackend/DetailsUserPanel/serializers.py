from rest_framework import serializers
from .models import UserDetails, UserAttendance

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'

class UserAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = ['time_in', 'time_out', 'date']  # ✅ Only include attendance details

