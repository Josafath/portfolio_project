from django.db.models import Prefetch
from django.utils.cache import patch_cache_control
from rest_framework import generics
from rest_framework.throttling import AnonRateThrottle

from .models import Experience, Milestone, Project, Service, SocialLink, Technology
from .serializers import (
    DEFAULT_LANGUAGE,
    LANGUAGES,
    ContactMessageSerializer,
    ExperienceSerializer,
    MilestoneSerializer,
    ProjectSerializer,
    ServiceSerializer,
    SocialLinkSerializer,
    TechnologySerializer,
)


class PublicContentMixin:
    """
    Read-only content: language from ?lang=es|en (Spanish by default), and a
    short CDN cache so most visits never reach Django or the database.
    """

    def get_serializer_context(self):
        context = super().get_serializer_context()
        lang = self.request.query_params.get("lang", DEFAULT_LANGUAGE)
        context["lang"] = lang if lang in LANGUAGES else DEFAULT_LANGUAGE
        return context

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if request.method == "GET" and response.status_code == 200:
            patch_cache_control(response, public=True, max_age=0, s_maxage=300, stale_while_revalidate=86400)
        return response


PROJECTS = Project.objects.filter(is_published=True).prefetch_related("technologies", "versions", "improvements")


class ProjectList(PublicContentMixin, generics.ListAPIView):
    queryset = PROJECTS
    serializer_class = ProjectSerializer


class ProjectDetail(PublicContentMixin, generics.RetrieveAPIView):
    queryset = PROJECTS
    serializer_class = ProjectSerializer
    lookup_field = "slug"


class MilestoneList(PublicContentMixin, generics.ListAPIView):
    queryset = Milestone.objects.filter(is_published=True).prefetch_related("technologies")
    serializer_class = MilestoneSerializer


class ExperienceList(PublicContentMixin, generics.ListAPIView):
    queryset = Experience.objects.filter(is_published=True).prefetch_related("technologies")
    serializer_class = ExperienceSerializer


class TechnologyList(PublicContentMixin, generics.ListAPIView):
    """The stack: technologies with a category, and the published projects that use each one."""

    queryset = Technology.objects.exclude(category="").prefetch_related(
        Prefetch("projects", queryset=Project.objects.filter(is_published=True))
    )
    serializer_class = TechnologySerializer


class ServiceList(PublicContentMixin, generics.ListAPIView):
    queryset = Service.objects.prefetch_related(
        Prefetch("examples", queryset=Project.objects.filter(is_published=True))
    )
    serializer_class = ServiceSerializer


class SocialLinkList(PublicContentMixin, generics.ListAPIView):
    """All published links, or only one group with ?category=dev|personal."""

    serializer_class = SocialLinkSerializer

    def get_queryset(self):
        links = SocialLink.objects.filter(is_published=True)
        category = self.request.query_params.get("category")
        if category in SocialLink.Category.values:
            links = links.filter(category=category)
        return links


class ContactRateThrottle(AnonRateThrottle):
    scope = "contact"
    rate = "5/hour"


# Write-only: messages are read in the admin, never through the public API
class ContactMessageCreate(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    throttle_classes = [ContactRateThrottle]

    def perform_create(self, serializer):
        # A filled honeypot means a bot: answer as if it worked, but drop it
        if serializer.validated_data.pop("website", ""):
            return
        serializer.save()
