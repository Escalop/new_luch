# Generated by Django 3.1 on 2022-01-18 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garpix_menu', '0002_auto_20220117_1453'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menuitem',
            name='menu_type',
            field=models.CharField(choices=[('top_menu', 'Верхнее меню Упаковка'), ('about_menu', 'О компании меню Упаковка'), ('top_menu_creative', 'Верхнее меню Творчество'), ('about_menu_creative', 'О компании меню Творчество'), ('top_menu_eng', 'Верхнее меню Английский'), ('about_menu_eng', 'О компании меню Английский')], default='', max_length=100, verbose_name='Тип меню'),
        ),
    ]
