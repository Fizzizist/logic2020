from factory import DjangoModelFactory, Sequence
from django.contrib.auth.models import User
from logix.models import Argument
from logix.enums import ArgumentSet


def fake_argument(n):
    return {
        f'{n}': {'premises': [{'id': 'PR1',
                               'type': 'atomic',
                               'symbol': 'P'}],
                 'conclusion': {'id': 'C',
                                'type': 'atomic',
                                'symbol': 'Q'}}
    }


class ArgumentFactory(DjangoModelFactory):

    class Meta:
        model = Argument

    argument = Sequence(fake_argument)
    argument_set = ArgumentSet.SET1


class UserFactory(DjangoModelFactory):

    class Meta:
        model = User

    username = Sequence(lambda n: f'Test{n}')
    password = '1234fakepassword!'