from django.urls import path
from .views import LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView;
urlpatterns = [
    path('login/', LoginView.as_view(), name='user_login'),
    path('gettoken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshtoken/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verifytoken/', TokenVerifyView.as_view(), name='token_verify'),
]
