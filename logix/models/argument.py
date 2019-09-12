from django.db import models
from django.contrib.postgres.fields import JSONField


class Argument(models.Model):
    argument = JSONField()
