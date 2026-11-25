from urllib.parse import urlencode

from django.conf import settings
from django.contrib import admin
from django.utils.html import format_html

from .models import ContactMessage, Improvement, Milestone, Project, ProjectVersion, Service, SocialLink, Technology

admin.site.site_header = "Portafolio · admin"
admin.site.site_title = "Portafolio"


class ProjectVersionInline(admin.TabularInline):
    model = ProjectVersion
    extra = 0


class ImprovementInline(admin.StackedInline):
    model = Improvement
    extra = 0
    fields = (("aspect_es", "aspect_en"), ("before_es", "before_en"), ("after_es", "after_en"), "order")


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "started_year", "order", "is_published")
    list_editable = ("order", "is_published")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("technologies",)
    inlines = (ProjectVersionInline, ImprovementInline)


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("shape", "title_es", "year", "order", "is_published")
    list_editable = ("order", "is_published")
    filter_horizontal = ("technologies",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title_es", "order")
    list_editable = ("order",)
    filter_horizontal = ("examples",)


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "handle", "category", "order", "is_published")
    list_editable = ("order", "is_published")
    list_filter = ("category",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service", "created_at", "is_read", "reply")
    list_filter = ("is_read", "service")
    search_fields = ("name", "email", "message")
    readonly_fields = ("reply", "name", "email", "service", "message", "created_at")
    actions = ("mark_as_read",)

    def has_add_permission(self, request):
        return False

    @admin.display(description="Responder")
    def reply(self, obj):
        subject = f"Re: {obj.service.title_es}" if obj.service else "Re: tu mensaje en mi portafolio"
        quoted = "\n".join(f"> {line}" for line in obj.message.splitlines())
        body = f"Hola {obj.name},\n\n\n\n{quoted}"
        # Gmail's compose window in the configured account; any mail app otherwise
        if settings.CONTACT_REPLY_GMAIL:
            query = {"view": "cm", "fs": "1", "authuser": settings.CONTACT_REPLY_GMAIL, "to": obj.email, "su": subject, "body": body}
            url = f"https://mail.google.com/mail/?{urlencode(query)}"
        else:
            url = f"mailto:{obj.email}?{urlencode({'subject': subject, 'body': body})}"
        return format_html('<a class="button" href="{}" target="_blank" rel="noopener">Responder ↗</a>', url)

    @admin.action(description="Marcar como leídos")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
