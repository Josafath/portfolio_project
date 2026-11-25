"""
Content for the portfolio site.

Every text a visitor reads exists twice, with an `_es` and an `_en` suffix.
The API returns only the language asked for (see serializers.TranslatedField),
so the frontend never has to know about the suffixes.
"""
from django.db import models


class Technology(models.Model):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "technologies"

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    tagline_es = models.CharField(max_length=200)
    tagline_en = models.CharField(max_length=200)
    description_es = models.TextField()
    description_en = models.TextField()
    repo_url = models.URLField()
    live_url = models.URLField(blank=True)
    started_year = models.PositiveSmallIntegerField()
    technologies = models.ManyToManyField(Technology, related_name="projects", blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-started_year"]

    def __str__(self) -> str:
        return self.name


class ProjectVersion(models.Model):
    """A version of a project kept in its repo, e.g. the 2021 v1 and today's v2."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="versions")
    label = models.CharField(max_length=40)
    year = models.PositiveSmallIntegerField(null=True, blank=True)
    summary_es = models.CharField(max_length=300)
    summary_en = models.CharField(max_length=300)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.project} {self.label}"


class Improvement(models.Model):
    """One row of a project's before/after table: what changed between versions."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="improvements")
    aspect_es = models.CharField(max_length=80)
    aspect_en = models.CharField(max_length=80)
    before_es = models.CharField(max_length=300)
    before_en = models.CharField(max_length=300)
    after_es = models.CharField(max_length=300)
    after_en = models.CharField(max_length=300)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.project}: {self.aspect_en}"


class Milestone(models.Model):
    """A chapter of the story timeline. `shape` is the short text the particles form."""

    year = models.PositiveSmallIntegerField()
    date = models.DateField(null=True, blank=True)
    shape = models.CharField(max_length=6, help_text="Texto corto que forman las partículas, p. ej. 2022 o v2.")
    title_es = models.CharField(max_length=120)
    title_en = models.CharField(max_length=120)
    body_es = models.TextField()
    body_en = models.TextField()
    repo = models.CharField(max_length=100, blank=True)
    commit_hash = models.CharField(max_length=40, blank=True)
    commit_message = models.CharField(max_length=200, blank=True)
    technologies = models.ManyToManyField(Technology, related_name="milestones", blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["year", "order"]

    def __str__(self) -> str:
        return f"{self.shape} · {self.title_es}"


class Service(models.Model):
    """Something a visitor can hire for. `examples` are projects that prove it."""

    title_es = models.CharField(max_length=100)
    title_en = models.CharField(max_length=100)
    description_es = models.TextField()
    description_en = models.TextField()
    examples = models.ManyToManyField(Project, related_name="services", blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title_es


class SocialLink(models.Model):
    class Platform(models.TextChoices):
        GITHUB = "github", "GitHub"
        INSTAGRAM = "instagram", "Instagram"
        LINKEDIN = "linkedin", "LinkedIn"
        YOUTUBE = "youtube", "YouTube"
        TIKTOK = "tiktok", "TikTok"
        OTHER = "other", "Otro"

    class Category(models.TextChoices):
        DEV = "dev", "Desarrollo"
        PERSONAL = "personal", "Personal"

    platform = models.CharField(max_length=20, choices=Platform.choices)
    handle = models.CharField(max_length=60)
    url = models.URLField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.DEV)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "order"]

    def __str__(self) -> str:
        return f"{self.get_platform_display()} {self.handle}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name="messages")
    message = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"
