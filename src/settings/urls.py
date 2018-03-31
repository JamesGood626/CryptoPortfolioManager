from django.urls import path

from .views import (
    FiatOptionListView,
    UserSettingsListView,
)

urlpatterns = [
    path('fiat-options/list/', FiatOptionListView.as_view(), name='fiat-options'),
    path('user-settings/list/', UserSettingsListView.as_view(), name='user-settings'),
]
