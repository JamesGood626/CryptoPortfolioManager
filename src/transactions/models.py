from django.db import models
# from django.core.validators import MinValueValidator
# from django.core.exceptions import ValidationError
# from decimal import Decimal
from lib.utils import (
    create_or_update_crypto_asset,
    fulfill_sell_order,
)

from django.db.models import (
    ForeignKey,
    BooleanField,
    CharField,
    IntegerField,
    DecimalField,
    DateField,
    CASCADE,
)

from django.contrib.auth import get_user_model

# from portfolio.serializers import CryptoAssetCreateSerializer

User = get_user_model()

# First order of business when I get back to this testing stuff:
# ---> override the clean method to ensure min value of 0 for decimal fields.

# More than likely going to need to add a date field for when the user
# actually made the buy/sell order on the exchange, so that the app may:
# - convert the crypto exchange rate into BTC and the current fiat rate at
#   that moment in time.


class BuyOrder(models.Model):
    user = ForeignKey(User, on_delete=CASCADE)
    ticker = CharField(max_length=10)
    quantity = DecimalField(max_digits=19, decimal_places=6)
    purchase_price_btc = DecimalField(max_digits=19, decimal_places=6)
    purchase_price_fiat = DecimalField(max_digits=19, decimal_places=6)
    exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6)
    exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6)
    sell_order_fulfilled = BooleanField(default=False)
    timestamp = DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.sell_order_fulfilled:
            create_or_update_crypto_asset(self)
        super().save(*args, **kwargs)


class SellOrder(models.Model):
    user = ForeignKey(User, on_delete=CASCADE)
    ticker = CharField(max_length=10)
    quantity = DecimalField(max_digits=19, decimal_places=6)
    sell_price_btc = DecimalField(max_digits=19, decimal_places=6)
    sell_price_fiat = DecimalField(max_digits=19, decimal_places=6)
    exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6)
    exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6)
    timestamp = DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        fulfill_sell_order(self, BuyOrder, ProfitLossTransaction)
        super().save(*args, **kwargs)


class ProfitLossTransaction(models.Model):
    user = ForeignKey(User, on_delete=CASCADE)
    buy_order = ForeignKey(BuyOrder, on_delete=CASCADE)
    ticker = CharField(max_length=10)
    quantity_sold = DecimalField(max_digits=19, decimal_places=6)
    total_buy_price_btc = DecimalField(max_digits=19, decimal_places=6)
    total_buy_price_fiat = DecimalField(max_digits=19, decimal_places=6)
    total_sell_price_btc = DecimalField(max_digits=19, decimal_places=6)
    total_sell_price_fiat = DecimalField(max_digits=19, decimal_places=6)
    exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6, default=0)
    exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6, default=0)
    gain_loss_percentage = DecimalField(max_digits=19, decimal_places=6)
    timestamp = DateField(auto_now_add=True)


# class CryptoProfitLoss(models.Model):
#     user = ForeignKey(User, on_delete=CASCADE)
#     ticker = CharField(max_length=10)
#     quantity_sold = DecimalField(max_digits=19, decimal_places=6)
#     initial_investment_btc = DecimalField(max_digits=19, decimal_places=6)
#     initial_investment_fiat = DecimalField(max_digits=19, decimal_places=6)
#     exchange_fee_btc = DecimalField(max_digits=19, decimal_places=6)
#     exchange_fee_fiat = DecimalField(max_digits=19, decimal_places=6)

#     Too much of a hassle to create this upon pl_transaction save
#     Calculate net gains/losses on the client side
#     net_gain_loss_btc = DecimalField(max_digits=19, decimal_places=6)
#     net_gain_loss_fiat = DecimalField(max_digits=19, decimal_places=6)
#     net_gain_loss_percentage = DecimalField(max_digits=19, decimal_places=6)
#
#     class Meta():
#         verbose_name_plural = "crypto profit/loss"
