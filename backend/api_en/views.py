from rest_framework import generics

from .models import Projects, Messages, Technologies
from .serializers import ProjectsSerializer, MessagesSerializer, TechnologiesSerializer


class ListProjects(generics.ListAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

class ListMessages(generics.ListAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer

class ListTechnologies(generics.ListAPIView):
    queryset = Technologies.objects.all()
    serializer_class = TechnologiesSerializer



class DetailProjects(generics.RetrieveAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

class DetailMessages(generics.RetrieveAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer

class DetailTechnologies(generics.RetrieveAPIView):
    queryset = Technologies.objects.all()
    serializer_class = TechnologiesSerializer


