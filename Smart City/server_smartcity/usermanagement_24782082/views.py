from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib import messages
from .forms import RegisterForm


class UserLoginView(LoginView):
    template_name = 'registration/login.html'

    def form_valid(self, form):
        messages.success(self.request, "Login berhasil.")
        return super().form_valid(form)


class UserLogoutView(LogoutView):
    next_page = '/login/'

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, "Logout berhasil.")
        return super().dispatch(request, *args, **kwargs)


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = False
            user.is_member = True
            user.save()

            messages.success(request, "Registrasi berhasil. Silakan login.")
            return redirect('login')

    else:
        form = RegisterForm()

    return render(request, 'registration/register.html', {
        'form': form
    })