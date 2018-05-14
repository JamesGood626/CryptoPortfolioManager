from django.db.models import Model
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db.models import (
    ForeignKey,
    CharField,
    IntegerField,
    DecimalField,
    DateField,
    ImageField,
    CASCADE,
)

from django.contrib.auth import get_user_model

User = get_user_model()


class FiatOption(Model):
    abbreviated_currency = CharField(max_length=7, default=None)
    currency = CharField(max_length=30)
    flag_image = ImageField(upload_to="flags/", null=True, blank=True)


class UserSettings(Model):
    user = ForeignKey(User, on_delete=CASCADE)
    fiat_option = ForeignKey(FiatOption, on_delete=CASCADE)

    class Meta():
        verbose_name_plural = "user settings"


@receiver(post_save, sender=User)
def my_handler(sender, instance, *args, **kwargs):
    fiat_option = FiatOption.objects.get(abbreviated_currency='USD')
    user_settings = UserSettings.objects.create(user=instance, fiat_option=fiat_option)
    user_settings.save()
