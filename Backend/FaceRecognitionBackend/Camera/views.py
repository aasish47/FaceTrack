from django.shortcuts import render

from rest_framework import generics
from .models import Camera
from .serializers import CameraSerializer
from rest_framework.response import Response

class CameraListCreateView(generics.ListCreateAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'Camera added successfully',
            'camera': serializer.data
        }, status=201, headers=headers)

class CameraRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'message': 'Camera deleted successfully',
            'id': kwargs['pk']
        }, status=200)