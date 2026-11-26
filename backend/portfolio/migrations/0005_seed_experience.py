"""
The first job, taken from the CV (public/cv in the frontend). Edit it, or add
the next ones, in the admin.
"""
import datetime

from django.db import migrations

JOBS = [
    {
        "company": ("Universo de Fragancias", "Universo de Fragancias"),
        "role": ("Desarrollador de Software Jr.", "Junior Software Developer"),
        "start": datetime.date(2026, 2, 1),
        "highlights": (
            "Desarrollé módulos con la API REST de Tiendanube que generan reportes de ventas diarios, semanales y "
            "mensuales y automatizan cancelaciones de pedidos, ahorrando tiempo a las áreas de inventario, "
            "retenciones y pedidos.\n"
            "Rediseñé la arquitectura de los módulos con peticiones asíncronas: la carga de datos bajó de 23 s "
            "a 3–4 s (~85% más rápido).\n"
            "Desarrollo y mantengo aplicaciones web y doy soporte técnico a la plataforma de e-commerce.\n"
            "Administro sitios y bases de datos MySQL con Plesk, trabajando con Git y Linux.",
            "Built modules on the Tiendanube REST API that generate daily, weekly and monthly sales reports and "
            "automate order cancellations, saving time for the inventory, tax withholding and order teams.\n"
            "Redesigned the module architecture with asynchronous requests, cutting data load time from 23 s "
            "to 3–4 s (~85% faster).\n"
            "Develop and maintain web applications and provide technical support for the e-commerce platform.\n"
            "Manage websites and MySQL databases through Plesk, working with Git and Linux.",
        ),
        "technologies": ["PHP", "JavaScript", "MySQL", "Tiendanube API", "Plesk", "Git", "Linux"],
    },
]


def seed(apps, schema_editor):
    Experience = apps.get_model("portfolio", "Experience")
    Technology = apps.get_model("portfolio", "Technology")
    for order, data in enumerate(JOBS):
        job = Experience.objects.create(
            company_es=data["company"][0], company_en=data["company"][1],
            role_es=data["role"][0], role_en=data["role"][1],
            start=data["start"], order=order,
            highlights_es=data["highlights"][0], highlights_en=data["highlights"][1],
        )
        job.technologies.set(Technology.objects.filter(name__in=data["technologies"]))


def unseed(apps, schema_editor):
    apps.get_model("portfolio", "Experience").objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0004_seed_stack"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
