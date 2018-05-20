from rest_framework.serializers import (
    DecimalField,
    ModelSerializer,
)

from .models import (
    BuyOrder,
    SellOrder,
    ProfitLossTransaction,
)


class BuyOrderCreateSerializer(ModelSerializer):
    quantity = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    purchase_price_btc = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    purchase_price_fiat = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6, min_value=0)

    class Meta:
        model = BuyOrder
        fields = [
            'user',
            'ticker',
            'quantity',
            'purchase_price_btc',
            'purchase_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
        ]


class BuyOrderListSerializer(ModelSerializer):
    class Meta:
        model = BuyOrder
        fields = [
            'ticker',
            'quantity',
            'purchase_price_btc',
            'purchase_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
        ]


class SellOrderListSerializer(ModelSerializer):
    class Meta:
        model = BuyOrder
        fields = [
            'ticker',
            'quantity',
            'sell_price_btc',
            'sell_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
        ]


class SellOrderCreateSerializer(ModelSerializer):
    quantity = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    sell_price_btc = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    sell_price_fiat = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6, min_value=0)
    exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6, min_value=0)

    class Meta:
        model = SellOrder
        fields = [
            'user',
            'ticker',
            'quantity',
            'sell_price_btc',
            'sell_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
        ]


class ProfitLossTransactionCreateSerializer(ModelSerializer):
    class Meta:
        model = ProfitLossTransaction
        fields = [
            'user',
            'ticker',
            'quantity_sold',
            'total_buy_price_btc',
            'total_buy_price_fiat',
            'total_sell_price_btc',
            'total_sell_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
            'gain_loss_percentage',
        ]


class ProfitLossTransactionListSerializer(ModelSerializer):
    class Meta:
        model = ProfitLossTransaction
        fields = [
            'ticker',
            'quantity_sold',
            'total_buy_price_btc',
            'total_buy_price_fiat',
            'total_sell_price_btc',
            'total_sell_price_fiat',
            'exchange_fee_btc',
            'exchange_fee_fiat',
            'gain_loss_percentage',
        ]
