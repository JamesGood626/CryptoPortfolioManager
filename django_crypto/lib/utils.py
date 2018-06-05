from portfolio.models import CryptoAsset
from decimal import Decimal


def fulfill_sell_order(sell_order, BuyOrder, ProfitLossTransaction):
    """
        Note: sell_order.quantity is being passed as an arg to
        create_or_update_profit_loss_transaction, as opposed to
        just setting sell_order.quantity on the context dict that's within
        the create_or_update_profit_loss_transaction function, because the function
        will be called recursively throughout this procedure.
        And in future calls to the function, a remainder quantity from a sell_order
        that was paired with a buy_order who's quantity is less than the sell_order
        will be passed in to the create_or_update_profit_loss_transaction to continue
        this procedure until sell_order_quantity is zero.
    """
    buy_order_list = get_buy_order_list(sell_order, BuyOrder)
    if buy_order_list.count() > 0:
        create_or_update_profit_loss_transaction(
            sell_order, sell_order.quantity, buy_order_list, ProfitLossTransaction)
    else:
        return


def get_buy_order_list(sell_order, BuyOrder):
    buy_order_list = BuyOrder.objects.filter(
        user=sell_order.user,
        ticker=sell_order.ticker,
        sell_order_fulfilled=False,
    ).order_by("-purchase_price_fiat")
    return buy_order_list


def subtract_crypto_asset_quantity(user, ticker, sell_order_quantity, buy_order=None, fulfilled_buy_orders=None):
    '''
        This function is called from within create_pl_transaction and update_pl_transaction_quantity_sold
        If there is a significant sell order issued which requires multiple buy orders to be fulfilled.
        Each buy order that is fulfilled will be pushed into an array on the main context object
        to be utilized in this function when there's no longer any sell order quantity to fulfill.
        The crypto asset specific to that crypto's ticker in the sell order is updated to accomodate
        the quantity * buy order price (per unit) that total + the exchange fees from the fullfilled
        buy order is then subtracted from the crypto asset to obtain the newly updated
        initial_investment prices for the crypto asset.
        Otherwise, a buy order that still has remaining quantity leftover
        will not deduct the exchange fee, however, the initital investment deducted
        from the crypto asset will be derived from the buy_order's buy price and the quantity sold.
        (The amount from initial_investment was added to the crypto asset upon the initiation of a buy order)
    '''
    crypto_asset = CryptoAsset.objects.get(
        user=user,
        ticker=ticker,
    )
    if fulfilled_buy_orders:
        for fulfilled_buy_order in fulfilled_buy_orders:
            if fulfilled_buy_order['fulfilled']:
                total_price_fiat = (fulfilled_buy_order['quantity'] *
                                    fulfilled_buy_order['purchase_price_fiat']) + \
                    fulfilled_buy_order['exchange_fee_fiat']
                total_price_btc = (fulfilled_buy_order['quantity'] *
                                   fulfilled_buy_order['purchase_price_btc']) + \
                    fulfilled_buy_order['exchange_fee_btc']
            else:
                total_price_fiat = (fulfilled_buy_order['quantity'] *
                                    fulfilled_buy_order['purchase_price_fiat'])
                total_price_btc = (fulfilled_buy_order['quantity']
                                   * fulfilled_buy_order['purchase_price_btc'])
            crypto_asset.initial_investment_fiat -= total_price_fiat
            crypto_asset.initial_investment_btc -= total_price_btc
    crypto_asset.quantity -= sell_order_quantity
    if crypto_asset.quantity == 0:
        crypto_asset.delete()
    else:
        crypto_asset.save()


def create_or_update_profit_loss_transaction(sell_order, sell_order_quantity, buy_order_list, ProfitLossTransaction, i=0, fulfilled_buy_orders=None):
    context = {
        'sell_order': sell_order,
        'sell_order_quantity': sell_order_quantity,
        'buy_order_list': buy_order_list,
        'sell_price_btc': sell_order.sell_price_btc,
        'sell_price_fiat': sell_order.sell_price_fiat,
        'ProfitLossTransaction': ProfitLossTransaction,
        'i': i,
        'fulfilled_buy_orders': []
    }
    if fulfilled_buy_orders is not None:
        context['fulfilled_buy_orders'].append(fulfilled_buy_orders)
    length = len(buy_order_list)
    if i < length and sell_order_quantity != 0:
        obtain_existing_pl_transaction_or_create_new(context)
    else:
        subtract_crypto_asset_quantity(sell_order.user, sell_order.ticker,
                                       sell_order.quantity, fulfilled_buy_orders=context['fulfilled_buy_orders'])


def obtain_existing_pl_transaction_or_create_new(context):
    buy_order_list = context['buy_order_list']
    i = context['i']
    buy_order = buy_order_list[i]
    ProfitLossTransaction = context['ProfitLossTransaction']
    sell_order_quantity = context['sell_order_quantity']
    pl_transaction = get_pl_transaction(buy_order, ProfitLossTransaction)
    if pl_transaction:
        quantity_sold = pl_transaction.quantity_sold
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
        return pl_transaction
    except Exception:
        return False


def update_pl_transaction_quantity_sold(context, buy_order, pl_transaction, quantity_difference):
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    i = context['i']
    total_sell_price_fiat = Decimal(sell_order_quantity) * Decimal(sell_price_fiat)
    total_purchase_price_fiat = Decimal(sell_order_quantity) * \
        Decimal(buy_order.purchase_price_fiat)
    total_sell_price_btc = Decimal(sell_order_quantity) * Decimal(sell_price_btc)
    total_purchase_price_btc = Decimal(sell_order_quantity) * Decimal(buy_order.purchase_price_btc)
    gain_loss_percentage = (total_sell_price_fiat -
                            total_purchase_price_fiat)/total_purchase_price_fiat
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


def update_pl_transaction_and_carry_remainder(context, buy_order, pl_transaction, quantity_difference):
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

    pl_transaction.quantity_sold += remainder_to_fulfill
    pl_transaction.total_buy_price_btc += total_buy_price_btc
    pl_transaction.total_buy_price_fiat += total_buy_price_fiat
    pl_transaction.total_sell_price_btc += total_sell_price_btc
    pl_transaction.total_sell_price_fiat += total_sell_price_fiat
    pl_transaction.gain_loss_percentage += gain_loss_percentage
    pl_transaction.exchange_fee_btc += buy_order.exchange_fee_btc
    pl_transaction.exchange_fee_fiat += buy_order.exchange_fee_fiat
    pl_transaction.save()

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
        sell_order, remainder_quantity, buy_order_list, ProfitLossTransaction, i, fulfilled_buy_orders=fulfilled_buy_order_data)


def create_pl_transaction(context, buy_order):
    sell_order = context['sell_order']
    sell_order_quantity = context['sell_order_quantity']
    sell_price_btc = context['sell_price_btc']
    sell_price_fiat = context['sell_price_fiat']
    ProfitLossTransaction = context['ProfitLossTransaction']
    total_buy_price_btc = sell_order_quantity * Decimal(buy_order.purchase_price_btc)
    total_sell_price_btc = sell_order_quantity * Decimal(sell_price_btc)
    total_buy_price_fiat = sell_order_quantity * Decimal(buy_order.purchase_price_fiat)
    total_sell_price_fiat = sell_order_quantity * Decimal(sell_price_fiat)
    gain_loss_percentage = (Decimal(total_sell_price_fiat) -
                            Decimal(total_buy_price_fiat))/Decimal(total_buy_price_fiat)

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


def create_pl_transaction_and_carry_remainder(context, buy_order):
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
        sell_order, remainder_quantity, buy_order_list, ProfitLossTransaction, i, fulfilled_buy_orders=fulfilled_buy_order_data)


def create_or_update_crypto_asset(buy_order):
    user = buy_order.user
    ticker = buy_order.ticker
    quantity = buy_order.quantity
    purchase_price_btc = buy_order.purchase_price_btc
    purchase_price_fiat = buy_order.purchase_price_fiat
    exchange_fee_btc = buy_order.exchange_fee_btc
    exchange_fee_fiat = buy_order.exchange_fee_fiat
    initial_investment_btc = Decimal(quantity * purchase_price_btc) + Decimal(exchange_fee_btc)
    initial_investment_fiat = Decimal(quantity * purchase_price_fiat) + Decimal(exchange_fee_fiat)

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
