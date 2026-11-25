from django.urls import path

from .views import ListaProyectos, CrearMensajes, ListaTecnologias
from .views import ProyectosDetalles, TecnologiasDetalles


urlpatterns = [
    path('proyectos/', ListaProyectos.as_view()),
    path('mensajes/', CrearMensajes.as_view()),
    path('tecnologias/', ListaTecnologias.as_view()),


    path('proyectos/<int:pk>/', ProyectosDetalles.as_view()),
    path('tecnologias/<int:pk>/', TecnologiasDetalles.as_view()),
]
