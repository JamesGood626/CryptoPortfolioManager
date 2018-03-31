from django.urls import path

from .views import (
    get_crypto_symbols,
    # create_crypto_symbols,
)

urlpatterns = [
    path('crypto-symbol-list/retrieve/', get_crypto_symbols, name='crypto-symbol-list'),
]
