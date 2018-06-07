from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND
    # HTTP_304_NOT_MODIFIED, doesn't return data.message
)

from .serializers import UserCreateSerializer

User = get_user_model()


class UserCreateAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        if request.user.is_authenticated:
            # returns status 200
            return Response("You're already authenticated")
        # This works for now, to ensure that if a username
        # is currently taken then two of the same users won't be
        # created, but need to implement a more elegant solution
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            content = {'message': 'That username is already taken.'}
            return Response(content, status=HTTP_404_NOT_FOUND)
        else:
            serializer = UserCreateSerializer(data=request.data)
            # Will need to ensure I handle error cases appropriately to send back
            # to the client side app.
            if not serializer.is_valid():
                # Need to determine what happens between serializer
                # ValidationError being raised and this line
                content = {'message': 'Email taken.'}
                return Response(content, status=HTTP_404_NOT_FOUND)
            serializer.save()
            content = {'message': 'User successfully created.'}
            return Response(content, status=HTTP_201_CREATED)


class LoginAPIView(APIView):
    serializer_class = JSONWebTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            return Response(status=HTTP_200_OK)
        else:
            try:
                User.objects.get(username=username)
                content = {'message': 'Incorrect password.'}
                return Response(content, status=HTTP_404_NOT_FOUND)
            except User.DoesNotExist:
                content = {'message': 'User does not exist.'}
                return Response(content, status=HTTP_404_NOT_FOUND)
