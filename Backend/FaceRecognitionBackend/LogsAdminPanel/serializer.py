from rest_framework import serializers
from DetailsAdminPanel.models import UserAttendance  
from Registration.models import User


class AttendanceSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all())  

    class Meta:
        model = UserAttendance
        fields = ('id','user_id', 'time_in', 'time_out', 'date')
