from django.urls import path
from .views import (
    home,
    ReportListView,
    ReportCreateView,
    ReportUpdateView,
    ReportDeleteView,
    ReportDetailView,
    ReportUpdateStatusView,
    report_detail_json,
)

urlpatterns = [
    path('', home, name='home'),

    path('reports/', ReportListView.as_view(), name='report_list'),
    path('add/', ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', ReportDeleteView.as_view(), name='delete_report'),
    path('detail/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),

    path(
        'detail-json/<int:pk>/',
        report_detail_json,
        name='report_detail_json'
    ),

    path(
        'update-status/<int:pk>/',
        ReportUpdateStatusView.as_view(),
        name='update_status'
    ),
]