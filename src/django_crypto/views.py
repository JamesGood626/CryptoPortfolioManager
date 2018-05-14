from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os


from rest_framework.permissions import (
    AllowAny,
)


class ReactAppView(View):
    permission_classes = [AllowAny]

    def get(self, request):
        print(request)
        try:

            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as file:
                return HttpResponse(file.read())

        except:
            return HttpResponse(
                """
				index.html not found! build your React app!!
				""",
                status=501,
            )
