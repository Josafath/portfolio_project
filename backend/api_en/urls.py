from django.urls import path

from .views import ListProjects, ListMessages, ListTechnologies
from .views import DetailProjects, DetailMessages, DetailTechnologies


urlpatterns = [
    path('projects/', ListProjects.as_view()),
    path('messages/', ListMessages.as_view()),
    path('technologies/', ListTechnologies.as_view()),


    path('projects/<int:pk>/', DetailProjects.as_view()),
    path('messages/<int:pk>/', DetailMessages.as_view()),
    path('technologies/<int:pk>/', DetailTechnologies.as_view()),
]
