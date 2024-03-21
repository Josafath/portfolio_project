from django.urls import path

from .views import ListaProyectos, ListaMensajes, ListaTecnologias
from .views import ProyectosDetalles, MensajesDetalles, TecnologiasDetalles


urlpatterns = [
    path('proyectos/', ListaProyectos.as_view()),
    path('mensajes/', ListaMensajes.as_view()),
    path('tecnologias/', ListaTecnologias.as_view()),


    path('proyectos/<int:pk>/', ProyectosDetalles.as_view()),
    path('mensajes/<int:pk>/', MensajesDetalles.as_view()),
    path('tecnologias/<int:pk>/', TecnologiasDetalles.as_view()),
]
