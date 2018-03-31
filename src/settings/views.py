from django.shortcuts import render

from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response

from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .serializers import (
    FiatOptionListSerializer,
    UserSettingsSerializer
)
from .models import (
    FiatOption,
    UserSettings,
)


class FiatOptionListView(generics.ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = FiatOptionListSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FiatOption.objects.all()

    # def get(self, request):
    #     queryset = FiatOption.objects.all()
    #
    #     return HttpResponse(resized_img, content_type="image/png")


class UserSettingsListView(generics.ListAPIView):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserSettings.objects.get(user=request.user.id)
        data = {
            # queryset.fiat_option targets the foreign key model
            # after that we have access to that particular model
            # instance's fields
            'abbreviated_currency': queryset.fiat_option.abbreviated_currency,
            'currency': queryset.fiat_option.currency,
            'flag_image': queryset.fiat_option.flag_image,
        }
        serializer = FiatOptionListSerializer(data)
        print(serializer.data)
        return Response(serializer.data)
