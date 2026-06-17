"""
URL configuration for iet_2026_24782082 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django_scalar.views import scalar_viewer

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


def welcome(request):
    return HttpResponse("Selamat Datang Meila")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('welcome/', welcome),

    path('', include('main_app.urls')),
    path('about/', include('about.urls')),
    path('contacts/', include('contacts.urls')),
    path('', include('usermanagement_24782082.urls')),
    path('dashboard/', include('dashboard_24782082.urls')),
    path('api/', include('main_app.api_urls')),
    path(
    'api/',
    include('usermanagement_24782082.api_urls')
    ),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    path(
        'api/docs/swagger/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui'
    ),

    path('api/docs/scalar/', scalar_viewer, name='scalar-ui'),
        
    # JWT TOKEN
    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]