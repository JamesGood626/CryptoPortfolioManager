from portfolio.models import CryptoAsset
from decimal import Decimal
# from transactions.models import BuyOrder


def fulfill_sell_order(sell_order, BuyOrder, ProfitLossTransaction):
    # print("fulfill sell order is running")
    buy_order_list = get_buy_order_list(sell_order, BuyOrder)
    if buy_order_list.count() > 0:
        create_or_update_profit_loss_transaction(sell_order, sell_order.quantity, buy_order_list, sell_order.sell_price_btc,
                                                 sell_order.sell_price_fiat, ProfitLossTransaction)
    # Removing this doesn't cause an error, but somehow
    # An empty buy_order_list is returned.
    # Will run tests individually to see which one causes this.
    # else:
    #     print("The unhandled else")
    #     print(buy_order_list)
    #     return


def get_buy_order_list(sell_order, BuyOrder):
    buy_order_list = BuyOrder.objects.filter(
        user=sell_order.user,
        ticker=sell_order.ticker,
        sell_order_fulfilled=False,
    ).order_by("-purchase_price_fiat")
    return buy_order_list


def subtract_crypto_asset_quantity(user, ticker, sell_order_quantity, buy_order=None, fulfilled_buy_orders=None):
    print("SUBTRACT CRYPTO ASSET QUANTITY RUNNING!!!!!!!!")
    print(fulfilled_buy_orders)
    crypto_asset = CryptoAsset.objects.get(
        user=user,
        ticker=ticker,
    )
    if fulfilled_buy_orders:
        for fulfilled_buy_order in fulfilled_buy_orders:
            print("THIS IS THE BUY ORDER FROM LIST IN SUBTRACT CRYPTO ASSET QUANTITY")
            print(fulfilled_buy_order)
            if fulfilled_buy_order['fulfilled']:
                total_price_fiat = (fulfilled_buy_order['quantity'] *
                                    fulfilled_buy_order['purchase_price_fiat']) + fulfilled_buy_order['exchange_fee_fiat']
                total_price_btc = (fulfilled_buy_order['quantity'] * fulfilled_buy_order['purchase_price_btc']) + \
                    fulfilled_buy_order['exchange_fee_btc']
            else:
                total_price_fiat = (fulfilled_buy_order['quantity'] *
                                    fulfilled_buy_order['purchase_price_fiat'])
                total_price_btc = (fulfilled_buy_order['quantity']
                                   * fulfilled_buy_order['purchase_price_btc'])
            crypto_asset.initial_investment_fiat -= total_price_fiat
            crypto_asset.initial_investment_btc -= total_price_btc
    crypto_asset.quantity -= sell_order_quantity
    # if buy_order is not None and buy_order.sell_order_fulfilled:
    #     crypto_asset.initial_investment_fiat -= (sell_order_quantity *
    #                                              buy_order.purchase_price_fiat) + buy_order.exchange_fee_fiat
    #     crypto_asset.initial_investment_btc -= (sell_order_quantity *
    #                                             buy_order.purchase_price_btc) + buy_order.exchange_fee_btc
    # if buy_order is not None:
    #     print("THIS IS THE BUY ORDER IN SUBTRACT CRYPTO ASSET")
    #     print(buy_order.quantity)
    #     crypto_asset.initial_investment_fiat -= sell_order_quantity * \
    #         buy_order.purchase_price_fiat
    #     crypto_asset.initial_investment_btc -= sell_order_quantity * buy_order.purchase_price_btc
    crypto_asset.save()


def create_or_update_profit_loss_transaction(sell_order, sell_order_quantity, buy_order_list, sell_price_btc,
                                             sell_price_fiat, ProfitLossTransaction, i=0, buy_order=None, fulfilled_buy_orders=None):
    context = {
        'sell_order': sell_order,
        'sell_order_quantity': sell_order_quantity,
        'buy_order_list': buy_order_list,
        'sell_price_btc': sell_price_btc,
        'sell_price_fiat': sell_price_fiat,
        'ProfitLossTransaction': ProfitLossTransaction,
        'i': i,
        'fulfilled_buy_orders': []
    }
    # print('iteration count')
    # print(i)
    # print('FULFILLED BUY ORDERS BACK IN CREATE OR UPDATE PROFIT LOSS TRANSACTION')
    # print(fulfilled_buy_orders)
    if fulfilled_buy_orders is not None:
        context['fulfilled_buy_orders'].append(fulfilled_buy_orders)
    print('THE ONLY THING THAT MATTERS')
    print(context['fulfilled_buy_orders'])
    length = len(buy_order_list)
    if i < length and sell_order_quantity != 0:
        # print("SELL ORDER QUANTITY IN LOOP")
        # print(sell_order_quantity)
        # print("iteration count:")
        # print(i)
        obtain_existing_pl_transaction_or_create_new(context)
    else:
        print("THE ELSE STATEMENT BEING HIT")
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])


def obtain_existing_pl_transaction_or_create_new(context):
    print('obtain_existing_pl_transaction_or_create_new running')
    buy_order_list = context['buy_order_list']
    i = context['i']
    buy_order = buy_order_list[i]
    ProfitLossTransaction = context['ProfitLossTransaction']
    sell_order_quantity = context['sell_order_quantity']
    pl_transaction = get_pl_transaction(buy_order, ProfitLossTransaction)
    if pl_transaction:
        quantity_sold = pl_transaction.quantity_sold
        # print('pl transaction quantity sold after lookup:')
        # print(quantity_sold)
        quantity_difference = buy_order.quantity - quantity_sold

        if (sell_order_quantity <= quantity_difference):
            update_pl_transaction_quantity_sold(
                context, buy_order, pl_transaction, quantity_difference)
        else:
            update_pl_transaction_and_carry_remainder(
                context, buy_order, pl_transaction, quantity_difference)
    else:
        if (sell_order_quantity <= buy_order.quantity):
            create_pl_transaction(context, buy_order)
        else:
            create_pl_transaction_and_carry_remainder(context, buy_order)


def get_pl_transaction(buy_order, ProfitLossTransaction):
    try:
        pl_transaction = ProfitLossTransaction.objects.get(
            user=buy_order.user,
            ticker=buy_order.ticker,
            buy_order=buy_order.pk,
        )
        # print('This is the pl_transaction')
        # print(pl_transaction)
        return pl_transaction
    except Exception:
        return False


def update_pl_transaction_quantity_sold(context, buy_order, pl_transaction, quantity_difference):
    print('update_pl_transaction_quantity_sold running')
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    buy_order_list = context['buy_order_list']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    ProfitLossTransaction = context['ProfitLossTransaction']
    i = context['i']
    total_sell_price_fiat = Decimal(sell_order_quantity) * Decimal(sell_price_fiat)
    total_purchase_price_fiat = Decimal(sell_order_quantity) * \
        Decimal(buy_order.purchase_price_fiat)
    total_sell_price_btc = Decimal(sell_order_quantity) * Decimal(sell_price_btc)
    total_purchase_price_btc = Decimal(sell_order_quantity) * Decimal(buy_order.purchase_price_btc)
    gain_loss_percentage = (total_sell_price_fiat -
                            total_purchase_price_fiat)/total_purchase_price_fiat
    # Geez, I should be updating the total_sell_prices and total_buy_prices as well in here.

    # Update exchanges fees here - so that they may be accessible for CryptoProfitLoss
    # Only because the buy_order is being set to sell_order_fulfilled = True
    pl_transaction.quantity_sold += Decimal(sell_order_quantity)
    pl_transaction.total_sell_price_btc += total_sell_price_btc
    pl_transaction.total_sell_price_fiat += total_sell_price_fiat
    pl_transaction.total_buy_price_btc += total_purchase_price_btc
    pl_transaction.total_buy_price_fiat += total_purchase_price_fiat
    pl_transaction.gain_loss_percentage += Decimal(gain_loss_percentage)
    if (sell_order_quantity == quantity_difference):
        buy_order.sell_order_fulfilled = True
        buy_order.save()
        pl_transaction.exchange_fee_btc += Decimal(buy_order.exchange_fee_btc) + \
            Decimal(sell_order.exchange_fee_btc)
        pl_transaction.exchange_fee_fiat += Decimal(buy_order.exchange_fee_fiat) + \
            Decimal(sell_order.exchange_fee_fiat)
        fulfilled_buy_order_data = {
            'quantity': Decimal(sell_order_quantity),
            'purchase_price_btc': buy_order.purchase_price_btc,
            'purchase_price_fiat': buy_order.purchase_price_fiat,
            'exchange_fee_btc': buy_order.exchange_fee_btc,
            'exchange_fee_fiat': buy_order.exchange_fee_fiat,
            'fulfilled': True,
        }
        # context['fulfilled_buy_orders'].append(fulfilled_buy_order_data)
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])
    else:
        fulfilled_buy_order_data = {
            'quantity': Decimal(sell_order_quantity),
            'purchase_price_btc': buy_order.purchase_price_btc,
            'purchase_price_fiat': buy_order.purchase_price_fiat,
            'exchange_fee_btc': buy_order.exchange_fee_btc,
            'exchange_fee_fiat': buy_order.exchange_fee_fiat,
            'fulfilled': False
        }
        context['fulfilled_buy_orders'].append(fulfilled_buy_order_data)
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])
    pl_transaction.save()
    i += 1

    # create_or_update_profit_loss_transaction(
    #     sell_order, 0, buy_order_list, sell_price_btc, sell_price_fiat, ProfitLossTransaction, i)


def update_pl_transaction_and_carry_remainder(context, buy_order, pl_transaction, quantity_difference):
    print('update_pl_transaction_and_carry_remainder running')
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    buy_order_list = context['buy_order_list']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    ProfitLossTransaction = context['ProfitLossTransaction']
    i = context['i']

    remainder_to_fulfill = buy_order.quantity - pl_transaction.quantity_sold
    remainder_quantity = sell_order_quantity - remainder_to_fulfill
    total_buy_price_btc = remainder_to_fulfill * Decimal(buy_order.purchase_price_btc)
    total_sell_price_btc = remainder_to_fulfill * Decimal(sell_price_btc)
    total_buy_price_fiat = remainder_to_fulfill * Decimal(buy_order.purchase_price_fiat)
    total_sell_price_fiat = remainder_to_fulfill * Decimal(sell_price_fiat)
    gain_loss_percentage = (Decimal(total_sell_price_fiat) -
                            Decimal(total_buy_price_fiat))/Decimal(total_buy_price_fiat)
    # fulfillment_quantity = sell_order_quantity - remainder_quantity
    # May have to move the pl_transaction to opt for a method w/
    # less saving
    pl_transaction.quantity_sold += remainder_to_fulfill
    pl_transaction.total_buy_price_btc += total_buy_price_btc
    pl_transaction.total_buy_price_fiat += total_buy_price_fiat
    pl_transaction.total_sell_price_btc += total_sell_price_btc
    pl_transaction.total_sell_price_fiat += total_sell_price_fiat
    pl_transaction.gain_loss_percentage += gain_loss_percentage
    pl_transaction.exchange_fee_btc += buy_order.exchange_fee_btc
    pl_transaction.exchange_fee_fiat += buy_order.exchange_fee_fiat
    # Update exchanges fees here - so that they may be accessible for CryptoProfitLoss
    # Only because the buy_order is being set to sell_order_fulfilled = True
    pl_transaction.save()
    # buy_order.quantity_sold += fulfillment_quantity
    buy_order.sell_order_fulfilled = True
    buy_order.save()

    fulfilled_buy_order_data = {
        'quantity': Decimal(remainder_to_fulfill),
        'purchase_price_btc': buy_order.purchase_price_btc,
        'purchase_price_fiat': buy_order.purchase_price_fiat,
        'exchange_fee_btc': buy_order.exchange_fee_btc,
        'exchange_fee_fiat': buy_order.exchange_fee_fiat,
        'fulfilled': True,
    }
    i += 1
    create_or_update_profit_loss_transaction(
        sell_order, remainder_quantity, buy_order_list, sell_price_btc, sell_price_fiat, ProfitLossTransaction, i, fulfilled_buy_orders=fulfilled_buy_order_data)


def create_pl_transaction(context, buy_order):
    print('create_pl_transaction running')
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    buy_order_list = context['buy_order_list']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    ProfitLossTransaction = context['ProfitLossTransaction']
    i = context['i']
    total_buy_price_btc = sell_order_quantity * Decimal(buy_order.purchase_price_btc)
    total_sell_price_btc = sell_order_quantity * Decimal(sell_price_btc)
    total_buy_price_fiat = sell_order_quantity * Decimal(buy_order.purchase_price_fiat)
    total_sell_price_fiat = sell_order_quantity * Decimal(sell_price_fiat)
    gain_loss_percentage = (Decimal(total_sell_price_fiat) -
                            Decimal(total_buy_price_fiat))/Decimal(total_buy_price_fiat)
    # print('Creating ProfitLossTransaction in create_pl_transaction')
    # print("THIS IS THE SELL ORDER QUANTITY")
    # print(sell_order_quantity)
    ProfitLossTransaction.objects.create(
        user=buy_order.user,
        buy_order=buy_order,
        ticker=buy_order.ticker,
        quantity_sold=sell_order_quantity,
        total_buy_price_btc=total_buy_price_btc,
        total_buy_price_fiat=total_buy_price_fiat,
        total_sell_price_btc=total_sell_price_btc,
        total_sell_price_fiat=total_sell_price_fiat,
        gain_loss_percentage=gain_loss_percentage,
    )

    # Update exchanges fees here - so that they may be accessible for CryptoProfitLoss
    # Only because the buy_order is being set to sell_order_fulfilled = True
    # Would require moving this if statement above the creation of the pl_transaction
    pl_transaction = ProfitLossTransaction.objects.get(
        user=buy_order.user,
        ticker=buy_order.ticker,
        buy_order=buy_order.pk,
    )
    if(sell_order_quantity == buy_order.quantity):
        buy_order.sell_order_fulfilled = True
        buy_order.save()
        pl_transaction.exchange_fee_btc += Decimal(buy_order.exchange_fee_btc) + \
            Decimal(sell_order.exchange_fee_btc)
        pl_transaction.exchange_fee_fiat += Decimal(buy_order.exchange_fee_fiat) + \
            Decimal(sell_order.exchange_fee_fiat)
        fulfilled_buy_order_data = {
            'quantity': Decimal(buy_order.quantity),
            'purchase_price_btc': buy_order.purchase_price_btc,
            'purchase_price_fiat': buy_order.purchase_price_fiat,
            'exchange_fee_btc': buy_order.exchange_fee_btc,
            'exchange_fee_fiat': buy_order.exchange_fee_fiat,
            'fulfilled': True,
        }
        context['fulfilled_buy_orders'].append(fulfilled_buy_order_data)
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])
    else:
        pl_transaction.exchange_fee_btc += Decimal(sell_order.exchange_fee_btc)
        pl_transaction.exchange_fee_fiat += Decimal(sell_order.exchange_fee_fiat)
        fulfilled_buy_order_data = {
            'quantity': Decimal(sell_order_quantity),
            'purchase_price_btc': buy_order.purchase_price_btc,
            'purchase_price_fiat': buy_order.purchase_price_fiat,
            'exchange_fee_btc': buy_order.exchange_fee_btc,
            'exchange_fee_fiat': buy_order.exchange_fee_fiat,
            'fulfilled': False,
        }
        context['fulfilled_buy_orders'].append(fulfilled_buy_order_data)
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])
    pl_transaction.save()

    # create_or_update_profit_loss_transaction(
    #     sell_order, 0, buy_order_list, sell_price_btc, sell_price_fiat, ProfitLossTransaction, i)


def create_pl_transaction_and_carry_remainder(context, buy_order):
    print('create_pl_transaction_and_carry_remainder running')
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    buy_order_list = context['buy_order_list']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    ProfitLossTransaction = context['ProfitLossTransaction']
    i = context['i']
    difference = buy_order.quantity - sell_order_quantity
    remainder_quantity = abs(difference)
    fulfillment_quantity = sell_order_quantity - remainder_quantity
    total_buy_price_btc = fulfillment_quantity * buy_order.purchase_price_btc
    total_buy_price_btc = fulfillment_quantity * buy_order.purchase_price_btc
    total_sell_price_btc = fulfillment_quantity * Decimal(sell_price_btc)
    total_buy_price_fiat = fulfillment_quantity * Decimal(buy_order.purchase_price_fiat)
    total_sell_price_fiat = fulfillment_quantity * Decimal(sell_price_fiat)
    gain_loss_percentage = (total_sell_price_fiat -
                            total_buy_price_fiat)/total_buy_price_fiat
    # print('Creating ProfitLossTransaction in create_pl_transaction_and_carry_remainder')
    ProfitLossTransaction.objects.create(
        user=buy_order.user,
        buy_order=buy_order,
        ticker=buy_order.ticker,
        quantity_sold=fulfillment_quantity,
        total_buy_price_btc=total_buy_price_btc,
        total_buy_price_fiat=total_buy_price_fiat,
        total_sell_price_btc=total_sell_price_btc,
        total_sell_price_fiat=total_sell_price_fiat,
        exchange_fee_btc=buy_order.exchange_fee_btc,
        exchange_fee_fiat=buy_order.exchange_fee_fiat,
        gain_loss_percentage=gain_loss_percentage,
    )
    # buy_order operations would need to be moved above the pl_transaction creation
    # Update exchanges fees here - so that they may be accessible for CryptoProfitLoss
    # Only because the buy_order is being set to sell_order_fulfilled = True
    buy_order.sell_order_fulfilled = True
    buy_order.save()
    fulfilled_buy_order_data = {
        'quantity': Decimal(fulfillment_quantity),
        'purchase_price_btc': buy_order.purchase_price_btc,
        'purchase_price_fiat': buy_order.purchase_price_fiat,
        'exchange_fee_btc': buy_order.exchange_fee_btc,
        'exchange_fee_fiat': buy_order.exchange_fee_fiat,
        'fulfilled': True,
    }
    i += 1
    create_or_update_profit_loss_transaction(
        sell_order, remainder_quantity, buy_order_list, sell_price_btc, sell_price_fiat, ProfitLossTransaction, i, fulfilled_buy_orders=fulfilled_buy_order_data)

# def sell_order_post_save(sender, instance, created, *args, **kwargs):
#     qs = BuyOrder.objects.filter(
#         user=instance.user,
#         ticker=instance.ticker,
#         sell_order_fulfilled=False,
#     ).order_by("-purchase_price_fiat")
#     print('Here is the qs count from sell order post save!')
#     print(qs.count())
#
#     if qs.count() > 0:
#         """
#         This is intended to update the crypto_asset model instance's
#         quantity(subtracting sell quantity) and initial investment
#         """
#         user = instance.user
#         ticker = instance.ticker
#         sell_order_quantity = instance.quantity
#         sell_price_btc = instance.sell_price_btc
#         sell_price_fiat = instance.sell_price_fiat
#         crypto_asset = CryptoAsset.objects.get(
#             user=user,
#             ticker=ticker,
#         )
#         crypto_asset.quantity -= sell_order_quantity
#         crypto_asset.save()

    # def fulfillSellOrder(sell_order_quantity, buy_orders, sell_price_btc, sell_price_fiat, i=0):
    #     keep_looping = True
    #     if sell_order_quantity == 0:
    #         keep_looping = False
    #         print("set keep looping to false")
    #     length = len(buy_orders)
    #     while i < length and keep_looping:
    #         print("iteration count:")
    #         print(i)
    #         buy_order = buy_orders[i]
    #         try:
    #             pl_transaction = ProfitLossTransaction.objects.get(
    #                 user=user,
    #                 ticker=ticker,
    #                 buy_order=buy_order.pk,
    #             )
    #             quantity_sold = pl_transaction.quantity_sold
    #             buy_order_quantity = buy_order.quantity
    #
    #             # This if statement is frivolous now that I've added
    #             # sell_order_fulfilled flag on the buy_order model.
    #             if (buy_order_quantity - quantity_sold) == 0:
    #                 i += 1
    #                 fulfillSellOrder(sell_order_quantity, buy_orders,
    #                                  sell_price_btc, sell_price_fiat, i)
    #
    #             quantity_difference = buy_order_quantity - quantity_sold
    # def update_pl_transaction

    # if (sell_order_quantity <= quantity_difference):
    # pl_transaction.quantity_sold += sell_order_quantity
    # pl_transaction.save()
    #     if (sell_order_quantity == quantity_difference):
    #         buy_order.sell_order_fulfilled = True
    #         buy_order.save()
    #     i += 1
    #     fulfillSellOrder(0, buy_orders,
    #                      sell_price_btc, sell_price_fiat, i)

    # else:
    #     remainder_quantity = sell_order_quantity % quantity_difference
    #     fulfillment_quantity = sell_order_quantity - remainder_quantity
    #     # May have to move the pl_transaction to opt for a method w/
    #     # less saving
    #     pl_transaction.quantity_sold += sell_order_quantity
    #     pl_transaction.save()
    #     buy_order.quantity_sold += fulfillment_quantity
    #     buy_order.sell_order_fulfilled = True
    #     buy_order.save()
    #     i += 1
    #     fulfillSellOrder(remainder_quantity, buy_orders,
    #                      sell_price_btc, sell_price_fiat, i)
    # end def update_pl_transaction
    # except Exception:
    # All of the variables are the same with the exception of
    # the last elif's remainder_quantity variable
    # and see if I can creat PLT by just passing in a dict of data

    # REALLY LEFT OFF HERE LAST
    #             buy_order_quantity = buy_order.quantity
    #             if (sell_order_quantity < buy_order_quantity):
    #                 total_buy_price_btc = sell_order_quantity * buy_order.purchase_price_btc
    #                 total_buy_price_btc = sell_order_quantity * buy_order.purchase_price_btc
    #                 total_sell_price_btc = sell_order_quantity * sell_price_btc
    #                 total_buy_price_fiat = sell_order_quantity * buy_order.purchase_price_fiat
    #                 total_sell_price_fiat = sell_order_quantity * sell_price_fiat
    #                 gain_loss_percentage = (total_sell_price_fiat -
    #                                         total_buy_price_fiat)/total_buy_price_fiat
    #
    #                 ProfitLossTransaction.objects.create(
    #                     user=user,
    #                     buy_order=buy_order,
    #                     ticker=ticker,
    #                     quantity_sold=sell_order_quantity,
    #                     total_buy_price_btc=total_buy_price_btc,
    #                     total_buy_price_fiat=total_buy_price_fiat,
    #                     total_sell_price_btc=total_sell_price_btc,
    #                     total_sell_price_fiat=total_sell_price_fiat,
    #                     gain_loss_percentage=gain_loss_percentage,
    #                 )
    #                 i += 1
    #                 fulfillSellOrder(0, buy_orders,
    #                                  sell_price_btc, sell_price_fiat, i)
    #             # Every thing is the same as above, with the exception of
    #             # setting sell_order_fulfilled to True on the buy_order
    #             elif (sell_order_quantity == buy_order_quantity):
    #                 total_buy_price_btc = sell_order_quantity * buy_order.purchase_price_btc
    #                 total_buy_price_btc = sell_order_quantity * buy_order.purchase_price_btc
    #                 total_sell_price_btc = sell_order_quantity * sell_price_btc
    #                 total_buy_price_fiat = sell_order_quantity * buy_order.purchase_price_fiat
    #                 total_sell_price_fiat = sell_order_quantity * sell_price_fiat
    #                 gain_loss_percentage = (total_sell_price_fiat -
    #                                         total_buy_price_fiat)/total_buy_price_fiat
    #
    #                 ProfitLossTransaction.objects.create(
    #                     user=user,
    #                     buy_order=buy_order,
    #                     ticker=ticker,
    #                     quantity_sold=sell_order_quantity,
    #                     total_buy_price_btc=total_buy_price_btc,
    #                     total_buy_price_fiat=total_buy_price_fiat,
    #                     total_sell_price_btc=total_sell_price_btc,
    #                     total_sell_price_fiat=total_sell_price_fiat,
    #                     gain_loss_percentage=gain_loss_percentage,
    #                 )
    #                 buy_order.sell_order_fulfilled = True
    #                 buy_order.save()
    #                 i += 1
    #                 fulfillSellOrder(0, buy_orders,
    #                                  sell_price_btc, sell_price_fiat, i)
    #
    #             elif (sell_order_quantity > buy_order_quantity):
    #                 remainder_quantity = sell_order_quantity % buy_order_quantity
    #                 fulfillment_quantity = sell_order_quantity - remainder_quantity
    #                 total_buy_price_btc = fulfillment_quantity * buy_order.purchase_price_btc
    #                 total_buy_price_btc = fulfillment_quantity * buy_order.purchase_price_btc
    #                 total_sell_price_btc = fulfillment_quantity * sell_price_btc
    #                 total_buy_price_fiat = fulfillment_quantity * buy_order.purchase_price_fiat
    #                 total_sell_price_fiat = fulfillment_quantity * sell_price_fiat
    #                 print("total_buy_price_fiat right after a newly creating PLT and buy order fulfilled.")
    #                 print(total_buy_price_fiat)
    #                 gain_loss_percentage = (total_sell_price_fiat -
    #                                         total_buy_price_fiat)/total_buy_price_fiat
    #                 ProfitLossTransaction.objects.create(
    #                     user=user,
    #                     buy_order=buy_order,
    #                     ticker=ticker,
    #                     quantity_sold=sell_order_quantity,
    #                     total_buy_price_btc=total_buy_price_btc,
    #                     total_buy_price_fiat=total_buy_price_fiat,
    #                     total_sell_price_btc=total_sell_price_btc,
    #                     total_sell_price_fiat=total_sell_price_fiat,
    #                     gain_loss_percentage=gain_loss_percentage,
    #                 )
    #                 buy_order.sell_order_fulfilled = True
    #                 buy_order.save()
    #                 i += 1
    #                 fulfillSellOrder(remainder_quantity, buy_orders,
    #                                  sell_price_btc, sell_price_fiat, i)
    # fulfillSellOrder(sell_order_quantity, qs, sell_price_btc, sell_price_fiat)
    # return user


def create_or_update_crypto_asset(buy_order):
    user = buy_order.user
    ticker = buy_order.ticker
    quantity = buy_order.quantity
    purchase_price_btc = buy_order.purchase_price_btc
    purchase_price_fiat = buy_order.purchase_price_fiat
    exchange_fee_btc = buy_order.exchange_fee_btc
    exchange_fee_fiat = buy_order.exchange_fee_fiat
    initial_investment_btc = Decimal((quantity * purchase_price_btc)) + Decimal(exchange_fee_btc)
    initial_investment_fiat = Decimal((quantity * purchase_price_fiat)) + Decimal(exchange_fee_fiat)

    try:
        crypto_asset = CryptoAsset.objects.get(
            user=user,
            ticker=ticker,
        )
        crypto_asset.quantity += quantity
        crypto_asset.initial_investment_btc += initial_investment_btc
        crypto_asset.initial_investment_fiat += initial_investment_fiat
        crypto_asset.save()
    except Exception as e:
        new_crypto_asset = CryptoAsset.objects.create(
            user=user,
            ticker=ticker,
            quantity=quantity,
            initial_investment_btc=initial_investment_btc,
            initial_investment_fiat=initial_investment_fiat,
        )
        crypto_asset = CryptoAsset.objects.filter(
            user=user,
            ticker=ticker,
        )
        return new_crypto_asset
    return crypto_asset
