from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from logix.models import Argument, ArgumentUser
from loguru import logger


@receiver(post_save, sender=User)
def create_user_arguments(sender, instance, created, **kwargs):
    """Creation signal for users to fill in the ArgumentUser table."""
    if created:
        logger.info('User created. Creating ArgumentUser Data.')
        arguments = Argument.objects.all()
        for a in arguments:
            ArgumentUser.objects.create(user=instance, argument=a, solved=False)
