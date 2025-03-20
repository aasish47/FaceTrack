# from django.contrib import admin
from django.urls import re_path
from Registration import views

urlpatterns = [
    re_path(r'^user/$', views.userApi),
    re_path(r'^user/([0-9]+)$', views.userApi)
]
