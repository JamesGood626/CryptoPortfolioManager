from django.urls import path
from . import views

# this is going to server my beautifully styled home page template

urlpatterns = [
    path('', views.index, name='index'),
]
