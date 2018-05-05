from django.db.models import Q
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.urls import reverse
import requests


from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework import status


from rest_framework.mixins import DestroyModelMixin, UpdateModelMixin
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    GenericAPIView,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)

User = get_user_model()

from .serializers import (
    UserCreateSerializer,
    # UserLoginSerializer,
)

from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.views import ObtainJSONWebToken

from settings.models import UserSettings

# Spruce up your error messages... an error from trying to make
# a buy Order via the front end form submission returned status code 200


class UserCreateAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        if request.user.is_authenticated:
            return Response("You're already authenticated")
        print(request.data)
        serializer = UserCreateSerializer(data=request.data)
        # Will need to ensure I handle error cases appropriately to send back
        # # to the client side app.

        if not serializer.is_valid():
            return Response("There seems to have been an error.")
        serializer.save()
        # Successfully reverses URL, however no redirect occurs...
        return Response("Registering was a success")


class LoginAPIView(APIView):
    serializer_class = JSONWebTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        print('request data in LoginAPIView')
        print(request.data)
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_404_NOT_FOUND)
        # r = requests.get('http://users/api/token/auth/', headers=request.data)
        # print(r)


# Need to work on the backend logic to extend ObtainJWTToken and check if
# The user is actually registered in order to get the login flow correct.


# class ObtainJWTAPIView(ObtainJSONWebToken):
#     serializer_class = JSONWebTokenSerializer
#     permission_classes = [AllowAny]
#
#     def post(self, request, *args, **kwargs):
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         print("Here's the user")
#         print(user)
#         if user is not None:
#             response = super().post(request, *args, **kwargs)
#             login(request, user)
#         print('printing request data')
#         print(request.data['username'])
#         print('printing response')
#         print(response.data['token'])
#         return Response(response.data)
