# Generated by Django 4.1.1 on 2022-09-29 13:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('system_id', models.CharField(blank=True, max_length=100, null=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('avatar', models.CharField(default='/static/assets/no_photo.png', max_length=100)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('mobile_number', models.CharField(max_length=20, unique=True)),
                ('is_superadmin', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'db_table': 'users',
                'ordering': ['-id'],
            },
        ),
    ]