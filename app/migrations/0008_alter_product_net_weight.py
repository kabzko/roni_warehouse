# Generated by Django 4.1.1 on 2023-01-10 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_cart_options_groupstockin_sales_invoice_no_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='net_weight',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
