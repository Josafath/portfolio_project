"""
Limits wrong passwords in the admin login: after MAX_ATTEMPTS from one IP within
WINDOW, that IP can't try again until the oldest attempt leaves the window.
"""
from datetime import timedelta

from django.contrib.admin.forms import AdminAuthenticationForm
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.throttling import BaseThrottle

from .models import FailedLogin

MAX_ATTEMPTS = 5
WINDOW = timedelta(minutes=15)


def client_ip(request) -> str:
    # Same rule as the contact form's throttle: behind Vercel, the last X-Forwarded-For entry
    return BaseThrottle().get_ident(request).split(",")[-1].strip()


class ThrottledAdminAuthenticationForm(AdminAuthenticationForm):
    error_messages = {
        **AdminAuthenticationForm.error_messages,
        "too_many_attempts": "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.",
    }

    def clean(self):
        ip = client_ip(self.request)
        since = timezone.now() - WINDOW
        if FailedLogin.objects.filter(ip=ip, created_at__gte=since).count() >= MAX_ATTEMPTS:
            raise ValidationError(self.error_messages["too_many_attempts"], code="too_many_attempts")
        try:
            cleaned = super().clean()
        except ValidationError:
            FailedLogin.objects.create(ip=ip)
            # Old rows are useless once they leave the window
            FailedLogin.objects.filter(created_at__lt=timezone.now() - timedelta(days=1)).delete()
            raise
        FailedLogin.objects.filter(ip=ip).delete()
        return cleaned
