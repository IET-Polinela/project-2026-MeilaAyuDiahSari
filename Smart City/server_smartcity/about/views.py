from django.shortcuts import render

# Create your views here.
def meila(request):
    return render(request, 'meila_about/meila.html')
