from django.db.models import Model
from django.db.models import (
    ForeignKey,
    CharField,
    DecimalField,
    CASCADE,
)

from django.contrib.auth import get_user_model

User = get_user_model()


class CryptoAsset(Model):
    user = ForeignKey(User, on_delete=CASCADE)
    ticker = CharField(max_length=10)
    quantity = DecimalField(max_digits=19, decimal_places=10)
    initial_investment_btc = DecimalField(max_digits=19, decimal_places=6)
    initial_investment_fiat = DecimalField(max_digits=19, decimal_places=6)
