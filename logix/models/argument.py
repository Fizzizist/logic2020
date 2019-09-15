from django.db import models
from django.contrib.postgres.fields import JSONField
from django_enumfield import enum
from logix.enums import ArgumentSet


class Argument(models.Model):
    argument = JSONField()
    argument_set = enum.EnumField(ArgumentSet, default=ArgumentSet.SET1)
