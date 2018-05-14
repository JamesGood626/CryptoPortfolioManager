import requests
import json
from django.http import HttpResponse

from rest_framework import permissions
from rest_framework.response import Response

from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from rest_framework.generics import ListAPIView
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import CryptoAsset

from .serializers import (
    CryptoAssetSerializer,
)


def get_crypto_symbols(request):
    if request.method == 'GET':
        response = requests.get('https://api.coinmarketcap.com/v1/ticker/?limit=500')
        json_data_as_python_value = response.json()
        symbol_list = []
        for crypto in json_data_as_python_value:
            symbol_list.append(dict(symbol=crypto['symbol']))
        refined_json_data = json.dumps(symbol_list)
        return HttpResponse(refined_json_data, content_type='application/json')
    else:
        return HTTP_400_BAD_REQUEST


class CryptoAssetListView(ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = CryptoAssetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = CryptoAsset.objects.filter(user=request.user.id)
        crypto_asset_list = []
        for crypto_asset in queryset:
            data = {
                'ticker': crypto_asset.ticker,
                'quantity': crypto_asset.quantity,
                'initial_investment_fiat': crypto_asset.initial_investment_fiat,
                'initial_investment_btc': crypto_asset.initial_investment_btc,
            }
            crypto_asset_list.append(data)
        return Response(crypto_asset_list)
