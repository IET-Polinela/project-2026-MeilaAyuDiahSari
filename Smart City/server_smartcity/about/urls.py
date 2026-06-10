from django.urls import path
from . import views

urlpatterns = [
    path('meila/', views.meila, name='meila'),
]