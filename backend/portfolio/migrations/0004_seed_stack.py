"""
Groups the seeded technologies for the stack section and adds the ones used at
work (PHP, MySQL, the Tiendanube API, Plesk…), which no public project shows. Editable later in the admin.
"""
from django.db import migrations

CATEGORIES = {
    "language": ["Python", "Java", "JavaScript", "TypeScript", "PHP", "SQL", "HTML", "CSS"],
    "frontend": ["React", "Next.js", "Vite", "TanStack Query"],
    "backend": ["Django", "Django REST Framework", "Node.js", "Express", "Socket.IO", "WebRTC", "Firebase", "Tiendanube API"],
    "data": ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
    "desktop": ["OpenCV", "NumPy", "Tkinter", "Swing"],
    "tools": ["Git", "GitHub Actions", "Linux", "Plesk", "Vercel"],
}


def seed(apps, schema_editor):
    Technology = apps.get_model("portfolio", "Technology")
    for category, names in CATEGORIES.items():
        for name in names:
            Technology.objects.update_or_create(name=name, defaults={"category": category})


def unseed(apps, schema_editor):
    Technology = apps.get_model("portfolio", "Technology")
    added = ["PHP", "MySQL", "SQL", "HTML", "CSS", "Tiendanube API", "Git", "Linux", "Plesk"]
    Technology.objects.filter(name__in=added, projects=None, milestones=None, experiences=None).delete()
    Technology.objects.update(category="")


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0003_experience_stack_message_kind"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
