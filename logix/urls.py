from django.urls import path
from logix.views import views

urlpatterns = [
    path('', views.index, name='index')
]