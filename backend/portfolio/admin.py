from django.contrib import admin

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
    list_display = ("name", "email", "service", "created_at", "is_read")
    list_filter = ("is_read", "service")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "service", "message", "created_at")
    actions = ("mark_as_read",)

    def has_add_permission(self, request):
        return False

    @admin.action(description="Marcar como leídos")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
