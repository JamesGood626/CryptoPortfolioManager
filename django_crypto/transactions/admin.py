from django.contrib import admin

from .models import (
    BuyOrder,
    SellOrder,
    ProfitLossTransaction,
)


admin.site.register(BuyOrder)
admin.site.register(SellOrder)
admin.site.register(ProfitLossTransaction)
