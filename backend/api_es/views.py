from rest_framework import generics

from .models import Proyectos, Mensajes, Tecnologias
from .serializers import ProyectoSerializer, MensajesSerializer, TecnologiaSerializer


class ListaProyectos(generics.ListAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer

class ListaMensajes(generics.ListAPIView):
    queryset = Mensajes.objects.all()
    serializer_class = MensajesSerializer

class ListaTecnologias(generics.ListAPIView):
    queryset = Tecnologias.objects.all()
    serializer_class = TecnologiaSerializer



class ProyectosDetalles(generics.RetrieveAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer

class MensajesDetalles(generics.RetrieveAPIView):
    queryset = Mensajes.objects.all()
    serializer_class = MensajesSerializer

class TecnologiasDetalles(generics.RetrieveAPIView):
    queryset = Tecnologias.objects.all()
    serializer_class = TecnologiaSerializer

