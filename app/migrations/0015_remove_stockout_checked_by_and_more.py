# Generated by Django 4.1.1 on 2023-01-27 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0014_remove_groupstockin_truck_driver_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="stockout",
            name="checked_by",
        ),
        migrations.RemoveField(
            model_name="stockout",
            name="received_by",
        ),
        migrations.RemoveField(
            model_name="stockout",
            name="truck_driver",
        ),
        migrations.RemoveField(
            model_name="stockout",
            name="truck_plate_number",
        ),
        migrations.AddField(
            model_name="stockout",
            name="price",
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]
