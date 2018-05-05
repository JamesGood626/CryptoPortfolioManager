from django.urls import path

from .views import (
    get_crypto_symbols,
    CryptoAssetListView,
)

urlpatterns = [
    path('crypto-symbol/list/', get_crypto_symbols, name='crypto-symbol-list'),
    path('crypto-asset/list/', CryptoAssetListView.as_view(), name='crypto-asset-list'),
]
