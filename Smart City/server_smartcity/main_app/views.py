from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from django.views import View
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Report
from .forms import ReportForm


def home(request):
    return render(request, 'meila_app/home.html')


# =========================
# REPORT LIST (SEMUA BOLEH)
# =========================
class ReportListView(ListView):
    model = Report
    template_name = 'meila_app/report_list.html'
    context_object_name = 'reports'


# =========================
# CREATE (ADMIN ONLY)
# =========================
class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'meila_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses Ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan!")
        return super().form_valid(form)


# =========================
# DETAIL (SEMUA BOLEH)
# =========================
class ReportDetailView(DetailView):
    model = Report
    template_name = 'meila_app/report_detail.html'
    context_object_name = 'report'


# =========================
# UPDATE (ADMIN ONLY)
# =========================
class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'meila_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses Ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui!")
        return super().form_valid(form)


# =========================
# DELETE (ADMIN ONLY)
# =========================
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'meila_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses Ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dihapus!")
        return super().form_valid(form)


# =========================
# UPDATE STATUS (ADMIN ONLY)
# =========================
class ReportUpdateStatusView(View):
    def post(self, request, pk):

        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses Ditolak")
            return redirect('report_list')

        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        report.status = new_status
        report.save()

        messages.success(request, f"Status berhasil diubah ke {new_status}!")
        return redirect('report_list')

class ReportSubmitView(View):
    def post(self, request, pk):
        if not request.user.is_authenticated:
            messages.error(request, "Silakan login terlebih dahulu.")
            return redirect('login')

        report = get_object_or_404(Report, pk=pk)

        if report.reporter != request.user:
            messages.error(request, "Anda hanya bisa submit laporan milik sendiri.")
            return redirect('report_list')

        if report.status != 'DRAFT':
            messages.error(request, "Hanya laporan DRAFT yang bisa disubmit.")
            return redirect('report_list')

        report.status = 'REPORTED'
        report.save()

        messages.success(request, "Laporan berhasil disubmit ke admin.")
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