from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.response import Response
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

        # extra_kwargs = {"password":
        #                 {"write_only": True}
        #                 }

    def validate(request, data):
        print('data from within validate')
        print(data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')
        qs = User.objects.filter(
            Q(username__iexact=username) |
            Q(email__iexact=email)
        )
        if qs.exists():
            return Response("A user with that username or password already exists")
        if password != password2:
            return Response("Passwords do not match")
        return data

    def create(self, validated_data):
        print("Validated_data from inside serializer.create")
        print(validated_data)
        username = validated_data.get('username')
        print("this is the username")
        print(username)
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
        print(token)
        return token

        # def validate_email(self, value):
        #     data = self.get_initial()
        #     email1 = data.get("email")
        #     email2 = value
        #     if email1 != email2:
        #         raise ValidationError("Emails must match")
        #
        #     user_qs = User.objects.filter(email=email2)
        #     if user_qs.exists():
        #         raise ValidationError("This email is already registered.")
        #     return value
        #
        # def validate_email2(self, value):
        #     data = self.get_initial()
        #     email1 = data.get("email")
        #     email2 = value
        #     if email1 != email2:
        #         raise ValidationError("Emails must match")
        #     return value


# class UserLoginSerializer(ModelSerializer):
#     token = CharField(allow_blank=True, read_only=True)
#     username = CharField(required=False, allow_blank=True)
#     email = EmailField(label='Email Address', required=False, allow_blank=True)
#
#     class Meta:
#         model = User
#         fields = [
#             'username',
#             'email',
#             'password',
#             'token',
#         ]
#         extra_kwargs = {"password":
#                             {"write_only": True}
#                         }
#
#     def validate(self, data):
#         user_obj = None
#         email = data.get("email", None)
#         username = data.get("username", None)
#         password = data["password"]
#         if not email and not username:
#             raise ValidationError("A username or email is required to login.")
#
#         user = User.objects.filter(
#                 Q(email=email) |
#                 Q(username=username)
#             ).distinct()
#         user = user.exclude(email__isnull=True).exclude(email__iexact='')
#         if user.exists() and user.count() == 1:
#             user_obj = user.first()
#         else:
#             raise ValidationError("This username/email is not valid.")
#
#         if user_obj:
#             if not user_obj.check_password(password):
#                 raise ValidationError("Incorrect credentials please try again.")
#
#         return user_obj

# Serializers are kind of like forms -> which play a major role
# in serializing and de-serializing information from the database
# into JSON and back into SQL format.
# Currently need to learn serializaers to hook up the functionality
# of user login/logout/registration

# class UserSerializer(serializers.ModelSerializer):
# 	def create(self, validated_data):
# 		user = User.objects.create(
# 			username = validated_data['username']
# 		)
# 		user.set_password(validated_data['password'])
# 		user.save()
# 		return user

# 	class Meta:
# 		model = User
# 		fields = ( 'id', 'password', 'last_login', 'username', 'email', 'is_active',)
# 		write_only_fields = ('password',)
# 		read_only_fields = ('is_active', 'last_login',)
