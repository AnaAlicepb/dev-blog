from django.shortcuts import render
from .models import Post

# View existente
def post_list(request):
    posts = Post.objects.all()
    return render(request, 'blog/post_list.html', {'posts': posts})

# Nova view para o template 'backend.html'
def backend_view(request):
    return render(request, 'blog/backend.html')
