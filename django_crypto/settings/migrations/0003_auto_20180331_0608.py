# Generated by Django 2.0.1 on 2018-03-31 06:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings', '0002_auto_20180331_0234'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usersettings',
            options={'verbose_name_plural': 'user settings'},
        ),
        migrations.AddField(
            model_name='fiatoption',
            name='abbreviated_currency',
            field=models.CharField(default=None, max_length=7),
        ),
        migrations.AlterField(
            model_name='fiatoption',
            name='currency',
            field=models.CharField(max_length=30),
        ),
    ]
