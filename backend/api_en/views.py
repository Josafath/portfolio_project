from rest_framework import generics

from .models import Projects, Messages, Technologies
from .serializers import ProjectsSerializer, MessagesSerializer, TechnologiesSerializer


class ListProjects(generics.ListAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

# Write-only: contact messages are read from the admin, not the public API
class CreateMessages(generics.CreateAPIView):
    queryset = Messages.objects.all()
    serializer_class = MessagesSerializer

class ListTechnologies(generics.ListAPIView):
    queryset = Technologies.objects.all()
    serializer_class = TechnologiesSerializer



class DetailProjects(generics.RetrieveAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

class DetailTechnologies(generics.RetrieveAPIView):
    queryset = Technologies.objects.all()
    serializer_class = TechnologiesSerializer


