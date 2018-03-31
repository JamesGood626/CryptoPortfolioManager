from django.test import TestCase
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from ..models import (
    BuyOrder,
    SellOrder,
    ProfitLossTransaction,
)


class BuyOrderModelTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(
            username='good7',
            password='good7',
        )
        BuyOrder.objects.create(
            user=user,
            ticker='ADA',
            quantity=200,
            purchase_price_btc=0.01,
            purchase_price_fiat=900,
            exchange_fee_btc=0.000001,
            exchange_fee_fiat=2.40,
        )

    def test_buy_order_was_created(self):
        user = User.objects.get(username='good7')
        buy_order = BuyOrder.objects.get(user=user)
        self.assertEqual(buy_order.ticker, 'ADA')
        self.assertEqual(buy_order.quantity, 200)
        self.assertEqual(buy_order.purchase_price_btc, Decimal('0.01'))
        self.assertEqual(buy_order.purchase_price_fiat, 900)
        self.assertEqual(buy_order.exchange_fee_btc, Decimal('0.000001'))
        self.assertEqual(buy_order.exchange_fee_fiat, Decimal('2.4'))


class SellOrderModelTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(
            username='good7',
            password='good7',
        )
        SellOrder.objects.create(
            user=user,
            ticker='ADA',
            quantity=100,
            sell_price_btc=0.01,
            sell_price_fiat=1800,
            exchange_fee_btc=0.000001,
            exchange_fee_fiat=1.20,
        )

    def test_sell_order_was_created(self):
        user = User.objects.get(username='good7')
        sell_order = SellOrder.objects.get(user=user)
        self.assertEqual(sell_order.ticker, 'ADA')
        self.assertEqual(sell_order.quantity, 100)
        self.assertEqual(sell_order.sell_price_btc, Decimal('0.01'))
        self.assertEqual(sell_order.sell_price_fiat, 1800)
        self.assertEqual(sell_order.exchange_fee_btc, Decimal('0.000001'))
        self.assertEqual(sell_order.exchange_fee_fiat, Decimal('1.2'))


class ProfitLossTransactionModelTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(
            username='good7',
            password='good7',
        )
        BuyOrder.objects.create(
            user=user,
            ticker='ADA',
            quantity=200,
            purchase_price_btc=0.01,
            purchase_price_fiat=900,
            exchange_fee_btc=0.000001,
            exchange_fee_fiat=2.40,
        )
        buy_order = BuyOrder.objects.get(user=user)
        ProfitLossTransaction.objects.create(
            user=user,
            buy_order=buy_order,
            ticker='ADA',
            quantity_sold=100,
            total_buy_price_btc=1,
            total_buy_price_fiat=45000,
            total_sell_price_btc=2,
            total_sell_price_fiat=90000,
            gain_loss_percentage=100,
        )

    def test_profit_loss_transaction_has_buy_order_as_pk(self):
        user = User.objects.get(username='good7')
        profit_loss_transaction = ProfitLossTransaction.objects.get(user=user)
        buy_order = BuyOrder.objects.get(user=user)
        self.assertEqual(profit_loss_transaction.buy_order, buy_order)

    def test_profit_loss_transaction_was_created(self):
        user = User.objects.get(username='good7')
        profit_loss_transaction = ProfitLossTransaction.objects.get(user=user)
        self.assertEqual(profit_loss_transaction.ticker, 'ADA')
        self.assertEqual(profit_loss_transaction.quantity_sold, 100)
        self.assertEqual(profit_loss_transaction.total_buy_price_btc, 1)
        self.assertEqual(profit_loss_transaction.total_buy_price_fiat, 45000)
        self.assertEqual(profit_loss_transaction.total_sell_price_btc, 2)
        self.assertEqual(profit_loss_transaction.total_sell_price_fiat, 90000)
        self.assertEqual(profit_loss_transaction.gain_loss_percentage, 100)


# def setUp(self):
#     self.jwt_url = reverse('accounts:accounts_login')
#     response = self.client.post(self.jwt_url, {'username': 'good', 'password': 'good'})
#     print(response.data)
