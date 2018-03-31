from django.test import TestCase
from decimal import Decimal

from ..models import (
    BuyOrder,
    SellOrder,
    ProfitLossTransaction,
)
from portfolio.models import CryptoAsset
from django.contrib.auth import get_user_model

User = get_user_model()


class BuyOrderSaveTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(
            username='good7',
            password='good7',
        )
        BuyOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=100,
            purchase_price_btc=1,
            purchase_price_fiat=200,
            exchange_fee_btc=0.0004,
            exchange_fee_fiat=4,
        )

    def test_crypto_asset_was_created(self):
        user = User.objects.get(username='good7')
        buy_order = BuyOrder.objects.get(user=user)
        crypto_asset = CryptoAsset.objects.get(user=user)
        self.assertEqual(crypto_asset.ticker, buy_order.ticker)
        self.assertEqual(crypto_asset.quantity, 100)
        self.assertEqual(crypto_asset.initial_investment_btc, Decimal('100.0004'))
        self.assertEqual(crypto_asset.initial_investment_fiat, 20004)

    def test_crypto_asset_successfully_updates(self):
        user = User.objects.get(username='good7')
        BuyOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=400,
            purchase_price_btc=1,
            purchase_price_fiat=10,
            exchange_fee_btc=0.0001,
            exchange_fee_fiat=1,
        )
        crypto_asset = CryptoAsset.objects.get(user=user)
        self.assertEqual(crypto_asset.ticker, 'LUX')
        self.assertEqual(crypto_asset.quantity, 500)
        self.assertEqual(crypto_asset.initial_investment_btc, Decimal('500.0005'))
        self.assertEqual(crypto_asset.initial_investment_fiat, 24005)


class SellOrderSaveTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(
            username='good7',
            password='good7',
        )
        BuyOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=4000,
            purchase_price_btc=0.03,
            purchase_price_fiat=100,
            exchange_fee_btc=0.007,
            exchange_fee_fiat=7,
        )

    def test_profit_loss_transaction_created_during_sell_order_save(self):
        user = User.objects.get(username='good7')
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=300,
            sell_price_btc=0.07,
            sell_price_fiat=240,
            exchange_fee_btc=0.011,
            exchange_fee_fiat=4,
        )
        crypto_asset = CryptoAsset.objects.get(user=user)
        self.assertEqual(crypto_asset.quantity, 3700)
        self.assertEqual(crypto_asset.initial_investment_btc, Decimal('111.007'))
        self.assertEqual(crypto_asset.initial_investment_fiat, 370007)

    def test_buy_order_sell_fulfilled_set_to_true(self):
        user = User.objects.get(username='good7')
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=4000,
            sell_price_btc=200,
            sell_price_fiat=200,
            exchange_fee_btc=200,
            exchange_fee_fiat=200,
        )
        crypto_asset = CryptoAsset.objects.get(user=user)
        buy_order = BuyOrder.objects.get(user=user)
        self.assertEqual(buy_order.sell_order_fulfilled, True)
        self.assertEqual(crypto_asset.quantity, 0)
        self.assertEqual(crypto_asset.initial_investment_btc, 0)
        self.assertEqual(crypto_asset.initial_investment_fiat, 0)

    def test_sell_order_quantity_remainder_carries_over(self):
        user = User.objects.get(username='good7')
        BuyOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=1200,
            purchase_price_btc=0.5,
            purchase_price_fiat=240,
            exchange_fee_btc=0.0017,
            exchange_fee_fiat=9,
        )
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=4200,
            sell_price_btc=1.2,
            sell_price_fiat=600,
            exchange_fee_btc=0.0029,
            exchange_fee_fiat=17,
        )
        buy_order_list = BuyOrder.objects.filter(user=user).order_by("-purchase_price_fiat")
        first_buy_order = buy_order_list[0]
        second_buy_order = buy_order_list[1]
        pl_transaction = ProfitLossTransaction.objects.get(buy_order=first_buy_order)
        second_pl_transaction = ProfitLossTransaction.objects.get(buy_order=second_buy_order)
        crypto_asset = CryptoAsset.objects.get(user=user, ticker='LUX')

        self.assertEqual(pl_transaction.quantity_sold, 1200)
        self.assertEqual(pl_transaction.total_buy_price_btc, 600)
        self.assertEqual(pl_transaction.total_buy_price_fiat, 288000)
        self.assertEqual(pl_transaction.total_sell_price_btc, 1440)
        self.assertEqual(pl_transaction.total_sell_price_fiat, 720000)
        self.assertEqual(pl_transaction.exchange_fee_btc, Decimal('0.0017'))
        self.assertEqual(pl_transaction.exchange_fee_fiat, Decimal('9'))
        self.assertEqual(pl_transaction.gain_loss_percentage, 1.5)

        self.assertEqual(second_pl_transaction.quantity_sold, 3000)
        self.assertEqual(second_pl_transaction.total_buy_price_btc, 90)
        self.assertEqual(second_pl_transaction.total_buy_price_fiat, 300000)
        self.assertEqual(second_pl_transaction.total_sell_price_btc, 3600)
        self.assertEqual(second_pl_transaction.total_sell_price_fiat, 1800000)
        self.assertEqual(second_pl_transaction.exchange_fee_btc, Decimal('0.0029'))
        self.assertEqual(second_pl_transaction.exchange_fee_fiat, 17)
        self.assertEqual(second_pl_transaction.gain_loss_percentage, 5)

        self.assertEqual(first_buy_order.sell_order_fulfilled, True)
        self.assertEqual(second_buy_order.sell_order_fulfilled, False)
        self.assertEqual(crypto_asset.quantity, 1000)

    def test_existing_pl_transaction_successfully_reused_for_succeeding_sell_order(self):
        user = User.objects.get(username='good7')
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=1000,
            sell_price_btc=0.028,
            sell_price_fiat=90,
            exchange_fee_btc=0.007,
            exchange_fee_fiat=7,
        )
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=3000,
            sell_price_btc=0.025,
            sell_price_fiat=65,
            exchange_fee_btc=0.009,
            exchange_fee_fiat=11,
        )
        # Might test crypto asset quantity, IIB, and IIF later
        buy_order_list = BuyOrder.objects.filter(user=user).order_by("-purchase_price_fiat")
        buy_order = buy_order_list[0]
        self.assertEqual(buy_order.sell_order_fulfilled, True)
        pl_transaction_list = ProfitLossTransaction.objects.filter(buy_order=buy_order)
        self.assertEqual(len(pl_transaction_list), 1)
        self.assertEqual(pl_transaction_list[0].quantity_sold, 4000)
        self.assertEqual(pl_transaction_list[0].total_buy_price_fiat, 400000)
        self.assertEqual(pl_transaction_list[0].total_buy_price_btc, 120)
        self.assertEqual(pl_transaction_list[0].total_sell_price_fiat, 285000)
        self.assertEqual(pl_transaction_list[0].total_sell_price_btc, 103)
        self.assertEqual(pl_transaction_list[0].gain_loss_percentage, Decimal('-0.45'))

    def test_existing_pl_transaction_successfully_reused_for_prev_buy_order_and_remainder_carries(self):
        user = User.objects.get(username='good7')
        BuyOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=6000,
            purchase_price_btc=0.04,
            purchase_price_fiat=120,
            exchange_fee_btc=0.004,
            exchange_fee_fiat=4.59,
        )
        # Crypto asset quantity, IIB, and IIF being added correctly amongst multiple buy orders.
        crypto_asset = CryptoAsset.objects.get(user=user, ticker='LUX')
        self.assertEqual(crypto_asset.quantity, 10000)
        self.assertEqual(crypto_asset.initial_investment_btc, Decimal('360.011'))
        self.assertEqual(crypto_asset.initial_investment_fiat, Decimal('1120011.59'))
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=2000,
            sell_price_btc=0.01,
            sell_price_fiat=35,
            exchange_fee_btc=0.001,
            exchange_fee_fiat=3.30,
        )
        SellOrder.objects.create(
            user=user,
            ticker='LUX',
            quantity=5000,
            sell_price_btc=0.10,
            sell_price_fiat=210,
            exchange_fee_btc=0.006,
            exchange_fee_fiat=8.21,
        )
        buy_order_list = BuyOrder.objects.filter(user=user).order_by("-purchase_price_fiat")
        crypto_asset = CryptoAsset.objects.get(user=user, ticker='LUX')
        first_buy_order = buy_order_list[0]
        second_buy_order = buy_order_list[1]
        self.assertEqual(crypto_asset.quantity, 3000)
        self.assertEqual(crypto_asset.initial_investment_btc, Decimal('90.007'))
        self.assertEqual(crypto_asset.initial_investment_fiat, 300007)

        self.assertEqual(first_buy_order.sell_order_fulfilled, True)
        self.assertEqual(second_buy_order.sell_order_fulfilled, False)

        first_pl_transaction = ProfitLossTransaction.objects.get(buy_order=first_buy_order)
        self.assertEqual(first_pl_transaction.quantity_sold, 6000)
        self.assertEqual(first_pl_transaction.total_buy_price_btc, 240)
        self.assertEqual(first_pl_transaction.total_buy_price_fiat, 720000)
        self.assertEqual(first_pl_transaction.total_sell_price_btc, 420)
        self.assertEqual(first_pl_transaction.total_sell_price_fiat, 910000)
        self.assertEqual(first_pl_transaction.gain_loss_percentage, Decimal('0.041667'))

        second_pl_transaction = ProfitLossTransaction.objects.get(buy_order=second_buy_order)
        self.assertEqual(second_pl_transaction.quantity_sold, 1000)
        self.assertEqual(second_pl_transaction.total_buy_price_btc, 30)
        self.assertEqual(second_pl_transaction.total_buy_price_fiat, 100000)
        self.assertEqual(second_pl_transaction.total_sell_price_btc, 100)
        self.assertEqual(second_pl_transaction.total_sell_price_fiat, 210000)
        self.assertEqual(second_pl_transaction.gain_loss_percentage, Decimal('1.1'))
