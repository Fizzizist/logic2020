from django.urls import path

from logix.views import views


urlpatterns = [
    path('', views.home_view, name='home_logix'),
    path('derive/', views.index, name='index')
]