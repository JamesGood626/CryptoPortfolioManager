from django.db import models
from lib.utils import (
    create_or_update_crypto_asset,
    fulfill_sell_order,
)

from django.db.models import (
    ForeignKey,
    BooleanField,
    CharField,
    DecimalField,
    DateField,
    CASCADE,
)

from django.contrib.auth import get_user_model

User = get_user_model()


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
