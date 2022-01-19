# Generated by Django 3.1 on 2022-01-17 17:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('garpix_page', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('basepage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='garpix_page.basepage')),
            ],
            options={
                'verbose_name': 'Home',
                'verbose_name_plural': 'Homes',
                'ordering': ('-created_at',),
            },
            bases=('garpix_page.basepage',),
        ),
    ]
