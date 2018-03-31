from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.serializers import (
    CharField,
    EmailField,
    HyperlinkedIdentityField,
    ModelSerializer,
    SerializerMethodField,
    ValidationError
)

# from .models import CryptoAsset
#
#
# class CryptoAssetCreateSerializer(ModelSerializer):
#     class Meta:
#         model = CryptoAsset
#         fields = [
#             'user',
#             'ticker',
#             'quantity',
#         ]
