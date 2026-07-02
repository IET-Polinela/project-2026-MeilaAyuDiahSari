from django.urls import path
from .views import (
    home,
    ReportListView,
    ReportCreateView,
    ReportUpdateView,
    ReportDeleteView,
    ReportDetailView,
    ReportUpdateStatusView,
    ReportSubmitView,
    report_detail_json,
    report_detail_api,   # ✅ TAMBAHAN
    report_search        # ✅ TAMBAHAN
)

urlpatterns = [
    path('', home, name='home'),

    path('reports/', ReportListView.as_view(), name='report_list'),
    path('add/', ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', ReportDeleteView.as_view(), name='delete_report'),
    path('detail/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),

    path('detail-json/<int:pk>/', report_detail_json, name='report_detail_json'),

    path('legacy-api/report/<int:pk>/', report_detail_api, name='report_detail_api'),  # ✅

    path('search/', report_search, name='report_search'),  # ✅

    path('update-status/<int:pk>/', ReportUpdateStatusView.as_view(), name='update_status'),
    path('submit/<int:pk>/', ReportSubmitView.as_view(), name='submit_report'),
    
]