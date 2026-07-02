from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from django.views import View
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Report
from .forms import ReportForm
from django.db.models import Q


def home(request):
    return render(request, 'main_app/home.html')


# =========================
# REPORT LIST (LOGIN ONLY + ADMIN ONLY)
# =========================
class ReportListView(LoginRequiredMixin, ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if not request.user.is_admin:
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)


# =========================
# CREATE (ADMIN ONLY)
# =========================
class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if not request.user.is_admin:
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.reporter = self.request.user
        return super().form_valid(form)


# =========================
# UPDATE (BUKAN UNTUK ADMIN — hanya citizen pemilik laporan)
# =========================
class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if request.user.is_staff or request.user.is_admin:
            return HttpResponseForbidden()

        if not request.user.is_admin:
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)

# =========================
# DELETE (BUKAN UNTUK ADMIN — hanya citizen pemilik laporan)
# =========================
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if request.user.is_staff or request.user.is_admin:
            return HttpResponseForbidden()

        return redirect('home')


# =========================
# DETAIL (ADMIN ONLY)
# =========================
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if not request.user.is_admin:
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)


# =========================
# UPDATE STATUS (POST ONLY)
# =========================
class ReportUpdateStatusView(View):
    def post(self, request, pk, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        if not request.user.is_admin:
            return redirect('home')

        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        if new_status in ['VERIFIED', 'IN_PROGRESS', 'RESOLVED']:
            report.status = new_status
            report.save()

        return redirect('report_detail', pk=pk)


# =========================
# SUBMIT REPORT (POST ONLY)
# =========================
class ReportSubmitView(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        report = get_object_or_404(Report, pk=pk)

        if report.reporter != request.user:
            return HttpResponseForbidden()

        if report.status != 'DRAFT':
            return HttpResponseForbidden()

        report.status = 'REPORTED'
        report.save()
        
        return redirect('report_list')


# =========================
# DETAIL JSON
# =========================
def report_detail_json(request, pk):
    report = get_object_or_404(Report, pk=pk)

    return JsonResponse({
        'title': report.title,
        'category': report.category,
        'location': report.location,
        'status': report.status,
        'description': report.description,
    })


# =========================
# API DETAIL
# =========================
def report_detail_api(request, pk):
    report = get_object_or_404(Report, pk=pk)

    return JsonResponse({
        "id": report.id,
        "title": report.title,
        "description": report.description,
        "status": report.status,
    })


# =========================
# SEARCH
# =========================
def report_search(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()

    if not request.user.is_admin:
        return HttpResponseForbidden()

    query = request.GET.get('q', '')
    reports = Report.objects.filter(
        Q(title__icontains=query) |
        Q(category__icontains=query) |
        Q(description__icontains=query) |
        Q(location__icontains=query)
    )

    results = []
    for r in reports:
        results.append({
            'id': r.id,
            'title': r.title,
            'category': r.category,
            'location': r.location,
            'status': r.status,
            'description': r.description,
        })

    return JsonResponse({'results': results})