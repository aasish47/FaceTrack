from rest_framework import serializers
from .models import RegistrationUser, UserAttendance, AttendanceRequest, PastAttendanceRequest

class RegistrationUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationUser
        fields = '__all__'

class UserAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = ['time_in', 'time_out', 'date'] 


class AttendanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRequest
        fields = ['Id', 'UserId', 'Name', 'Email', 'Date', 'Type', 'Reason']

    def validate(self, data):
        if not data.get('UserId') or not data.get('Email'):
            raise serializers.ValidationError("UserId and Email are required.")
        return data

class PastAttendanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastAttendanceRequest
        fields = '__all__'