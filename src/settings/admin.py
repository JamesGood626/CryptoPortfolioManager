from django.contrib import admin

from .models import (
    UserSettings,
    FiatOption,
)


admin.site.register(UserSettings)
admin.site.register(FiatOption)
