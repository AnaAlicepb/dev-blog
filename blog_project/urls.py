from django.contrib import admin
from django.urls import path
from blog import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('postagem/', views.post_list, name='post_list'),  # Rota alterada para /postagem
]
