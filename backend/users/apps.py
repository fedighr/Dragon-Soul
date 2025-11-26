from django.apps import AppConfig
from django.utils import timezone
from datetime import timedelta

"""class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        from .models import User
        expiration_time = timezone.now() - timedelta(hours=1)
        User.objects.filter(is_verified=False, date_joined__lt=expiration_time).delete()"""