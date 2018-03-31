from django.urls import path

from .views import (
    BuyOrderCreateAPIView,
    SellOrderCreateAPIView,
    BuyOrderListView,
    SellOrderListView,
)

urlpatterns = [
    path('buy-order/create/', BuyOrderCreateAPIView.as_view(), name='buy-order'),
    path('buy-order/list/', BuyOrderListView.as_view(), name='buy-order-list'),
    path('sell-order/create/', SellOrderCreateAPIView.as_view(), name='sell-order'),
    path('sell-order/list/', SellOrderListView.as_view(), name='sell-order-list'),
]
