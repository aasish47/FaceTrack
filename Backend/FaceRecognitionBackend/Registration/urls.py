from django.urls import re_path,path
from Registration import views

urlpatterns = [
    # User-related URLs
    re_path(r'^user/$', views.userApi),
    re_path(r'^user/([0-9]+)$', views.userApi),
    re_path(r'^user/(\w+)$', views.userApi),
    path('user/<str:user_id>/exists/', views.check_user_exists, name='check_user_exists'),

    # Department-related URLs
    path('department/', views.departmentApi, name='department_post'),
    path('department/<str:id>/', views.departmentApi, name='department_delete'),
]
