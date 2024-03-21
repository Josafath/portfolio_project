from rest_framework import serializers
from .models import Proyectos, Mensajes, Tecnologias


class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = ('id','nombre','descripcion','estrellas','enlace_github','enlace_website')


class MensajesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensajes
        fields = ('id','nombres','email','mensaje')



class TecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnologias
        fields = ('id','nombre','proyecto')
