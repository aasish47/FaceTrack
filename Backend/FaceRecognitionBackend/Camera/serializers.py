from rest_framework import serializers
from .models import Camera

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = ['id', 'name', 'type', 'fps', 'url', 'operational', 'created_at']
        read_only_fields = ['id', 'created_at']