from django.urls import path
from .views import CameraListCreateView, CameraRetrieveUpdateDestroyView

urlpatterns = [
    path('cameras/', CameraListCreateView.as_view(), name='camera-list-create'),
    path('cameras/<int:pk>/', CameraRetrieveUpdateDestroyView.as_view(), name='camera-retrieve-update-destroy'),
]