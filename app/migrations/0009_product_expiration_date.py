# Generated by Django 4.1.1 on 2023-01-22 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_alter_product_net_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='expiration_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]