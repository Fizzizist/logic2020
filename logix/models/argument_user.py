from django.db import models
from django.contrib.auth.models import User
from logix.models import Argument


class ArgumentUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    argument = models.ForeignKey(Argument, on_delete=models.CASCADE)

    solved = models.BooleanField(default=False)

