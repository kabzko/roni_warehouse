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
        
        if not "email" in extra_fields:
            extra_fields["email"] = "admin@admin.com"

        extra_fields["is_staff"] = True

        user = self.model(email=email, **extra_fields)
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password)

class User(AbstractBaseUser):
    """The app AUTH_USER_MODEL."""
    
    system_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    cashier_id = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.CharField(default=f"{settings.STATIC_URL}assets/no_photo.png", max_length=100)
    email = models.EmailField(max_length=100, blank=False, null=False)
    is_superadmin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    user_type = models.CharField(max_length=250, blank=True, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = "system_id"
    
    objects = UserManager()
    
    class Meta:
        app_label = "app"
        db_table = "users"
        ordering = ["-id"]
