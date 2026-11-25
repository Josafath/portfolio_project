from rest_framework import serializers

from .models import ContactMessage, Improvement, Milestone, Project, ProjectVersion, Service, SocialLink

LANGUAGES = ("es", "en")
DEFAULT_LANGUAGE = "es"


class TranslatedField(serializers.ReadOnlyField):
    """Outputs `<field>_<lang>` under the plain field name, e.g. `title_en` as `title`."""

    def __init__(self, **kwargs):
        super().__init__(source="*", **kwargs)

    def to_representation(self, instance):
        lang = self.context.get("lang", DEFAULT_LANGUAGE)
        return getattr(instance, f"{self.field_name}_{lang}")


class ProjectVersionSerializer(serializers.ModelSerializer):
    summary = TranslatedField()

    class Meta:
        model = ProjectVersion
        fields = ("label", "year", "summary")


class ImprovementSerializer(serializers.ModelSerializer):
    aspect = TranslatedField()
    before = TranslatedField()
    after = TranslatedField()

    class Meta:
        model = Improvement
        fields = ("aspect", "before", "after")


class ProjectSerializer(serializers.ModelSerializer):
    tagline = TranslatedField()
    description = TranslatedField()
    technologies = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    versions = ProjectVersionSerializer(many=True, read_only=True)
    improvements = ImprovementSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "slug", "name", "tagline", "description", "repo_url", "live_url",
            "started_year", "technologies", "versions", "improvements",
        )


class MilestoneSerializer(serializers.ModelSerializer):
    title = TranslatedField()
    body = TranslatedField()
    technologies = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = Milestone
        fields = ("year", "date", "shape", "title", "body", "repo", "commit_hash", "commit_message", "technologies")


class ServiceSerializer(serializers.ModelSerializer):
    title = TranslatedField()
    description = TranslatedField()
    examples = serializers.SlugRelatedField(many=True, read_only=True, slug_field="slug")

    class Meta:
        model = Service
        fields = ("id", "title", "description", "examples")


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ("platform", "handle", "url", "category")


class ContactMessageSerializer(serializers.ModelSerializer):
    # Honeypot: hidden in the form, so only bots fill it in
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ("name", "email", "service", "message", "website")
        extra_kwargs = {"service": {"required": False, "allow_null": True}}
