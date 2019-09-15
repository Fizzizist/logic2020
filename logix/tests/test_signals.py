import pytest
from logix.tests.test_models.model_factories import ArgumentFactory, UserFactory
from logix.models import ArgumentUser


@pytest.mark.django_db
def test_user_post_init():
    ArgumentFactory()
    UserFactory()
    assert ArgumentUser.objects.all().count() == 1
