from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework import serializers

from .models import CryptoAsset


class CryptoAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoAsset
        fields = [
            'ticker',
            'quantity',
            'initial_investment_btc',
            'initial_investment_fiat',
        ]
