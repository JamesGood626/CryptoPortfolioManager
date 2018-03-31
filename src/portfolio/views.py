from django.db.models import Q
from django.shortcuts import redirect
import requests
import json
from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework import status


from rest_framework.mixins import DestroyModelMixin, UpdateModelMixin
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    GenericAPIView,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)

# from .serializers import (
#     CryptoProfitLossCreateSerializer,
# )


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


# def create_crypto_symbols(request):
#     if request.method == 'POST':
#         print(request.data)
#     else:
#         return HTTP_400_BAD_REQUEST
