from rest_framework.response import Response
from rest_framework import serializers

from .models import (
    FiatOption,
    UserSettings,
)


class FiatOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiatOption
        fields = [
            'abbreviated_currency',
            'currency',
            'flag_image',
        ]


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'fiat_option',
        ]
