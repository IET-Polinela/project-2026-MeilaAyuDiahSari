from django.views.generic import TemplateView
from django.http import JsonResponse
from main_app.models import Report
from django.db.models import Count


class DashboardView(TemplateView):
    template_name = 'dashboard/dashboard.html'


def chart_data(request):

    status_data = Report.objects.values('status').annotate(total=Count('id'))

    category_data = Report.objects.values('category').annotate(total=Count('id'))

    reported = Report.objects.filter(
        status='REPORTED'
    ).order_by('-created_at')[:5]

    resolved = Report.objects.filter(
        status='RESOLVED'
    ).order_by('-created_at')[:5]

    return JsonResponse({

        'status_labels': [x['status'] for x in status_data],
        'status_values': [x['total'] for x in status_data],

        'category_labels': [x['category'] for x in category_data],
        'category_values': [x['total'] for x in category_data],

        'reported': [
            {
                'title': r.title,
                'location': r.location
            } for r in reported
        ],

        'resolved': [
            {
                'title': r.title,
                'location': r.location
            } for r in resolved
        ]

    })