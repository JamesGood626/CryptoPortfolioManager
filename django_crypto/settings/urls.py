from django.urls import path

from .views import (
    FiatOptionListView,
    UserSettingsListView,
    FiatOptionUpdateView,
)

urlpatterns = [
    path('fiat-options/list/', FiatOptionListView.as_view(), name='fiat-options'),
    path('user-settings/list/', UserSettingsListView.as_view(), name='user-settings'),
    path('user-settings/update/', FiatOptionUpdateView.as_view(), name='user-update'),
]
