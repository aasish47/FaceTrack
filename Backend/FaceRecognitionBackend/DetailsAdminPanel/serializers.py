from rest_framework import serializers
from .models import UserAttendance

class UserAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = '__all__'