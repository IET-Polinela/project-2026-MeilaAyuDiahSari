from django.urls import path
from .views import DashboardView, chart_data

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('chart-data/', chart_data, name='chart_data'),
]