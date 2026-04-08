from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from django.views import View

from .models import Report
from .forms import ReportForm


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


class ReportDetailView(DetailView):
    model = Report
    template_name = 'meila_app/report_detail.html'
    context_object_name = 'report'


class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'meila_app/update_report.html'
    success_url = reverse_lazy('report_list')


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'meila_app/delete_report.html'
    success_url = reverse_lazy('report_list')


class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')
        report.status = new_status
        report.save()
        return redirect('report_list')