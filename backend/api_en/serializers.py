from rest_framework import serializers
from .models import Projects, Messages, Technologies



class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ('id','name','description','stars','link_github','link_website')


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ('id','name','email','messages')


class TechnologiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technologies
        fields = ('id','name','project')