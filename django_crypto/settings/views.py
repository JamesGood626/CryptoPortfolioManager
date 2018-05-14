from django.shortcuts import render

from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response

from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .serializers import (
    FiatOptionSerializer,
    UserSettingsSerializer
)
from .models import (
    FiatOption,
    UserSettings,
)


class FiatOptionListView(generics.ListAPIView):
    # authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = FiatOptionSerializer
    # permission_classes = [permissions.IsAuthenticated]
    queryset = FiatOption.objects.all()


class FiatOptionUpdateView(generics.UpdateAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = FiatOptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FiatOption.objects.all()

    def post(self, request):
        user_settings = UserSettings.objects.get(user=request.user.id)
        new_fiat_option = FiatOption.objects.get(
            abbreviated_currency=request.data['abbreviated_currency'])
        print(user_settings.fiat_option)
        user_settings.fiat_option = new_fiat_option
        user_settings.save()
        return Response("Success")

# Just testing out default permission/authentication classes


class UserSettingsListView(generics.ListAPIView):
    # authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = UserSettingsSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserSettings.objects.get(user=request.user.id)
        data = {
            # queryset.fiat_option targets the foreign key model
            # after that we have access to that particular model
            # instance's fields
            'user': queryset.user.username,
            'abbreviated_currency': queryset.fiat_option.abbreviated_currency,
            'currency': queryset.fiat_option.currency,
            'flag_image': queryset.fiat_option.flag_image,
        }
        serializer = FiatOptionSerializer(data)
        print(serializer.data)
        return Response(serializer.data)
