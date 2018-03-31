from django.urls import path

from .views import (
    UserCreateAPIView,
    # ObtainJWTAPIView,
    # LoginAPIView,
)

from rest_framework_jwt.views import obtain_jwt_token


app_name = 'Review'

urlpatterns = [
    path('api/token/auth/', obtain_jwt_token, name='accounts_login'),
    path('api/register/', UserCreateAPIView.as_view(), name='register'),
]
