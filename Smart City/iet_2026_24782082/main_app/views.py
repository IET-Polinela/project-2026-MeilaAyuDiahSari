from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from django.views import View

from .models import Report
from .forms import ReportForm
from django.contrib import messages


def home(request):
    return render(request, 'meila_app/home.html')


class ReportListView(ListView):
    model = Report
    template_name = 'meila_app/report_list.html'
    context_object_name = 'reports'


class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'meila_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan!")
        return super().form_valid(form)


class ReportDetailView(DetailView):
    model = Report
    template_name = 'meila_app/report_detail.html'
    context_object_name = 'report'


class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'meila_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui!")
        return super().form_valid(form)


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'meila_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dihapus!")
        return super().form_valid(form)


class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')
        report.status = new_status
        report.save()

        messages.success(request, f"Status berhasil diubah ke {new_status}!")

        return redirect('report_list')