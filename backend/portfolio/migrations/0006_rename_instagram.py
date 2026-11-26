"""The dev Instagram account changed from @jossa_dev to @josafath.dev."""
from django.db import migrations


def rename(apps, schema_editor, old, new):
    SocialLink = apps.get_model("portfolio", "SocialLink")
    SocialLink.objects.filter(platform="instagram", handle=f"@{old}").update(
        handle=f"@{new}", url=f"https://www.instagram.com/{new}/"
    )


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0005_seed_experience"),
    ]

    operations = [
        migrations.RunPython(
            lambda apps, editor: rename(apps, editor, "jossa_dev", "josafath.dev"),
            lambda apps, editor: rename(apps, editor, "josafath.dev", "jossa_dev"),
        ),
    ]
