from django.urls import re_path,path
from Registration import views

urlpatterns = [
    re_path(r'^user/$', views.userApi),
    re_path(r'^user/([0-9]+)$', views.userApi),
    re_path(r'^user/(\w+)$', views.userApi),
    path('user/<str:user_id>/exists/', views.check_user_exists, name='check_user_exists'),
]
