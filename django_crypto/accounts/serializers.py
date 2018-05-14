from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND
)

from rest_framework_jwt.settings import api_settings
from rest_framework import serializers
from rest_framework.serializers import (
    CharField,
    EmailField,
    HyperlinkedIdentityField,
    ModelSerializer,
    SerializerMethodField,
    ValidationError
)

User = get_user_model()

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserCreateSerializer(ModelSerializer):
    password = CharField(
        max_length=100,
        write_only=True,
    )
    password2 = CharField(
        max_length=100,
        write_only=True,
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'password2',
        )

    def validate(request, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')
        qs = User.objects.filter(
            Q(username__iexact=username) |
            Q(email__iexact=email)
        )
        if qs.exists():
            raise ValidationError("A user with that username or email already exists")
        if password != password2:
            raise ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = User(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return token
