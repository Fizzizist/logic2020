# Generated by Django 2.2.5 on 2019-09-15 21:34

from django.db import migrations
import django_enumfield.db.fields
import logix.enums.argument_set


class Migration(migrations.Migration):

    dependencies = [
        ('logix', '0002_argument_argument_set'),
    ]

    operations = [
        migrations.AlterField(
            model_name='argument',
            name='argument_set',
            field=django_enumfield.db.fields.EnumField(default=1, enum=logix.enums.argument_set.ArgumentSet),
        ),
    ]
