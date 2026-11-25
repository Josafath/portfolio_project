from django.urls import path

from .views import ContactMessageCreate, MilestoneList, ProjectDetail, ProjectList, ServiceList, SocialLinkList

urlpatterns = [
    path("projects/", ProjectList.as_view()),
    path("projects/<slug:slug>/", ProjectDetail.as_view()),
    path("milestones/", MilestoneList.as_view()),
    path("services/", ServiceList.as_view()),
    path("socials/", SocialLinkList.as_view()),
    path("messages/", ContactMessageCreate.as_view()),
]
