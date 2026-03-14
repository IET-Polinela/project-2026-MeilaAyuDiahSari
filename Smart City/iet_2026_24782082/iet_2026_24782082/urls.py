"""
URL configuration for iet_2026_24782082 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.urls import path, include


def welcome(request):
    return HttpResponse("Selamat Datang Meila")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('welcome/', welcome),
    path('', include('main_app.urls')),
    path('about/', include('about.urls')),
    path('contacts/', include('contacts.urls')),
]