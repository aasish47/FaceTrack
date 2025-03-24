from rest_framework import serializers
from DetailsAdminPanel.models import UserAttendance  # Import from the first app

class AttendanceSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')  # Map user_id to the foreign key

    class Meta:
        model = UserAttendance
        fields = ('user_id', 'time_in', 'time_out', 'date')
