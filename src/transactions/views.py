from django.shortcuts import render, redirect, reverse
from django.db.models import Q

from decimal import Decimal

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response

from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    GenericAPIView,
)

from rest_framework import permissions
# (
#     AllowAny,
#     IsAuthenticated,
#     IsAdminUser,
#     IsAuthenticatedOrReadOnly,
# )

from .models import (
    BuyOrder,
    SellOrder,
    ProfitLossTransaction
)

from .serializers import (
    BuyOrderCreateSerializer,
    SellOrderCreateSerializer,
    BuyOrderListSerializer,
    SellOrderListSerializer,
    ProfitLossTransactionListSerializer,
)

from portfolio.models import CryptoAsset

# Need to ensure that a negative number may not be entered
# for quantity or purchase_price fields


class BuyOrderCreateAPIView(CreateAPIView):
    queryset = BuyOrder.objects.all()
    serializer_class = BuyOrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print(request.data)
        buy_order_data = {
            'user': request.user.id,
            'ticker': request.data['ticker'],
            'quantity': request.data['quantity'],
            'purchase_price_btc': request.data['purchase_price_btc'],
            'purchase_price_fiat': request.data['purchase_price_fiat'],
            'exchange_fee_btc': request.data['exchange_fee_btc'],
            'exchange_fee_fiat': request.data['exchange_fee_fiat'],
        }
        serializer = BuyOrderCreateSerializer(data=buy_order_data)
        if not serializer.is_valid():
            # Printing errors helped immensely
            print(serializer.errors)
            return Response("There seems to have been an error.")
        serializer.save()
        return redirect('/login')

# Need to ensure that a negative number may not be entered
# for quantity or purchase_price fields


class SellOrderCreateAPIView(CreateAPIView):
    queryset = SellOrder.objects.all()
    serializer_class = SellOrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # print("Info from inside SellOrderCreateAPIView")
        # print(request.body)
        # print(request.user.id)
        # print(request.data)
        qs = CryptoAsset.objects.filter(
            user=request.user.id,
            ticker=request.data['ticker'],
        )
        print('CryptoAsset count in SellOrderCreateAPIView POST')
        print(qs.count())
        print('THIS IS THE FIRST QS ITEM')
        print(qs[0].quantity)
        # What follows the and prevents a sell order that would result in a
        # negative crypto asset quantity from being executed.
        # Will still need to handle the error accordingly.
        # And I could benefit from writing a test to ensure that an exception is raised accordingly.
        if qs.count() == 1 and (qs[0].quantity - Decimal(request.data['quantity'])) >= 0:
            sell_order_data = {
                'user': request.user.id,
                'ticker': request.data['ticker'],
                'quantity': request.data['quantity'],
                'sell_price_btc': request.data['sell_price_btc'],
                'sell_price_fiat': request.data['sell_price_fiat'],
                'exchange_fee_btc': request.data['exchange_fee_btc'],
                'exchange_fee_fiat': request.data['exchange_fee_fiat'],
            }
            serializer = SellOrderCreateSerializer(data=sell_order_data)
            if not serializer.is_valid():
                # Printing errors helped immensely
                print(serializer.errors)
                return Response("There seems to have been an error.")
            serializer.save()
            return redirect('/portfolio/update')
        return Response('You do not currently own that crypto')


class BuyOrderListView(ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = BuyOrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print('request user')
        print(request.user)
        queryset = BuyOrder.objects.filter(user=request.user.id)
        buy_order_list = []
        for buy_order in queryset:
            data = {
                'ticker': buy_order.ticker,
                'quantity': buy_order.quantity,
                'purchase_price_fiat': buy_order.purchase_price_fiat,
                'purchase_price_btc': buy_order.purchase_price_btc,
                'exchange_fee_fiat': buy_order.exchange_fee_fiat,
                'exchange_fee_btc': buy_order.exchange_fee_btc,
            }
            buy_order_list.append(data)
        return Response(buy_order_list)


class SellOrderListView(ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = SellOrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print('request user')
        print(request.user)
        queryset = SellOrder.objects.filter(user=request.user.id)
        sell_order_list = []
        for sell_order in queryset:
            data = {
                'ticker': sell_order.ticker,
                'quantity': sell_order.quantity,
                'sell_price_fiat': sell_order.sell_price_fiat,
                'sell_price_btc': sell_order.sell_price_btc,
                'exchange_fee_fiat': sell_order.exchange_fee_fiat,
                'exchange_fee_btc': sell_order.exchange_fee_btc,
            }
            sell_order_list.append(data)
        return Response(sell_order_list)


class ProfitLossTransactionListView(ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = ProfitLossTransactionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = ProfitLossTransaction.objects.filter(user=request.user.id)
        pl_transaction_list = []
        for pl_transaction in queryset:
            data = {
                'ticker': pl_transaction.ticker,
                'quantity_sold': pl_transaction.quantity_sold,
                'total_buy_price_fiat': pl_transaction.total_buy_price_fiat,
                'total_buy_price_btc': pl_transaction.total_buy_price_btc,
                'total_sell_price_fiat': pl_transaction.total_sell_price_fiat,
                'total_sell_price_btc': pl_transaction.total_sell_price_btc,
                'exchange_fee_fiat': pl_transaction.exchange_fee_fiat,
                'exchange_fee_btc': pl_transaction.exchange_fee_btc,
                'gain_loss_percentage': pl_transaction.gain_loss_percentage,
            }
            print(data)
            pl_transaction_list.append(data)
        return Response(pl_transaction_list)
