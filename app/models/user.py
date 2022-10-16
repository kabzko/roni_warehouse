from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    """Creates and saves a User with the given email and password."""
    
    def _create_user(self, email, password, **extra_fields):
        """Creates and saves a User with the given email and password."""
        now = timezone.now()
        
        if not email:
            raise ValueError("The given email must be set")
        
        if not "mobile_number" in extra_fields:
            extra_fields["mobile_number"] = "09057779592"

        extra_fields["is_staff"] = True

        user = self.model(email=email, **extra_fields)
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password)

class User(AbstractBaseUser):
    """The app AUTH_USER_MODEL."""
    
    system_id = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.CharField(default=f"{settings.STATIC_URL}assets/no_photo.png", max_length=100)
    email = models.EmailField(max_length=100, unique=True, null=False, blank=False)
    mobile_number = models.CharField(max_length=20, unique=True, null=False, blank=False)
    is_superadmin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    user_type = models.CharField(max_length=250, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = "mobile_number"
    
    objects = UserManager()
    
    class Meta:
        app_label = "app"
        db_table = "users"
        ordering = ["-id"]
