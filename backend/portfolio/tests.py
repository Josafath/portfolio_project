from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import ContactMessage, Milestone, Project, Service, SocialLink


class ContentApiTests(APITestCase):
    """Runs against the content seeded by migration 0002."""

    def test_projects_default_to_spanish(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)
        rollcall = response.json()[0]
        self.assertEqual(rollcall["slug"], "rollcall")
        self.assertEqual(rollcall["tagline"], "Pasa lista con reconocimiento facial.")
        self.assertNotIn("tagline_es", rollcall)
        self.assertEqual(rollcall["versions"][0]["label"], "v1")
        self.assertEqual(rollcall["improvements"][0]["aspect"], "Detección")
        self.assertIn("OpenCV", rollcall["technologies"])

    def test_projects_in_english(self):
        rollcall = self.client.get("/api/projects/?lang=en").json()[0]
        self.assertEqual(rollcall["tagline"], "Class attendance with face recognition.")
        self.assertEqual(rollcall["improvements"][0]["aspect"], "Face detection")

    def test_unknown_language_falls_back_to_spanish(self):
        rollcall = self.client.get("/api/projects/?lang=fr").json()[0]
        self.assertEqual(rollcall["tagline"], "Pasa lista con reconocimiento facial.")

    def test_seeded_projects_are_the_six_pinned_repos(self):
        slugs = [p["slug"] for p in self.client.get("/api/projects/").json()]
        self.assertEqual(
            slugs, ["rollcall", "algoscope", "jossify", "study-partner", "authlab", "rock-paper-scissors"]
        )

    def test_unpublished_projects_are_hidden(self):
        Project.objects.filter(slug="jossify").update(is_published=False)
        slugs = [p["slug"] for p in self.client.get("/api/projects/").json()]
        self.assertNotIn("jossify", slugs)
        self.assertEqual(self.client.get("/api/projects/jossify/").status_code, 404)
        examples = self.client.get("/api/services/").json()[1]["examples"]
        self.assertEqual(examples, ["study-partner"])

    def test_project_detail_by_slug(self):
        response = self.client.get("/api/projects/algoscope/?lang=en")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "AlgoScope")

    def test_milestones_in_order_with_shapes(self):
        shapes = [m["shape"] for m in self.client.get("/api/milestones/").json()]
        self.assertEqual(shapes, ["2020", "2021", "2022", "2024", "2026", "v2"])

    def test_unpublished_milestones_are_hidden(self):
        Milestone.objects.filter(shape="2020").update(is_published=False)
        shapes = [m["shape"] for m in self.client.get("/api/milestones/").json()]
        self.assertNotIn("2020", shapes)

    def test_services_list_example_projects(self):
        services = self.client.get("/api/services/?lang=en").json()
        self.assertEqual(services[3]["title"], "Desktop apps")
        self.assertEqual(services[3]["examples"], ["rollcall", "algoscope", "authlab"])

    def test_socials_filter_by_category(self):
        everything = self.client.get("/api/socials/").json()
        self.assertEqual(len(everything), 4)
        personal = self.client.get("/api/socials/?category=personal").json()
        self.assertEqual([s["handle"] for s in personal], ["@josafath.crn"])
        dev = self.client.get("/api/socials/?category=dev").json()
        self.assertEqual([s["handle"] for s in dev], ["Josafath", "@jossa_dev", "josafath-ceron"])

    def test_unknown_social_category_returns_everything(self):
        self.assertEqual(len(self.client.get("/api/socials/?category=nope").json()), 4)

    def test_content_is_cached_by_the_cdn(self):
        response = self.client.get("/api/projects/")
        self.assertIn("s-maxage=300", response["Cache-Control"])

    def test_content_is_read_only(self):
        self.assertEqual(self.client.post("/api/projects/", {"name": "x"}).status_code, 405)


class ContactMessageApiTests(APITestCase):
    def setUp(self):
        cache.clear()  # throttle counters live in the cache
        self.valid = {"name": "Ana", "email": "ana@example.com", "message": "Tengo una idea para una app."}

    def test_creates_message(self):
        service = Service.objects.get(title_en="Full web apps")
        response = self.client.post("/api/messages/", {**self.valid, "service": service.pk})
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(ContactMessage.objects.get().service, service)

    def test_service_is_optional(self):
        self.assertEqual(self.client.post("/api/messages/", self.valid).status_code, 201)
        self.assertIsNone(ContactMessage.objects.get().service)

    def test_rejects_invalid_email(self):
        response = self.client.post("/api/messages/", {**self.valid, "email": "nope"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.json())

    def test_rejects_too_long_message(self):
        response = self.client.post("/api/messages/", {**self.valid, "message": "x" * 2001})
        self.assertEqual(response.status_code, 400)

    def test_honeypot_drops_message_silently(self):
        response = self.client.post("/api/messages/", {**self.valid, "website": "http://spam.example"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_messages_cannot_be_read(self):
        ContactMessage.objects.create(name="Ana", email="ana@example.com", message="secreto")
        self.assertEqual(self.client.get("/api/messages/").status_code, 405)

    def test_throttles_after_five_per_hour(self):
        for _ in range(5):
            self.assertEqual(self.client.post("/api/messages/", self.valid).status_code, 201)
        self.assertEqual(self.client.post("/api/messages/", self.valid).status_code, 429)
        self.assertEqual(ContactMessage.objects.count(), 5)


class SeedMigrationTests(APITestCase):
    def test_personal_instagram_is_separate_from_dev_links(self):
        link = SocialLink.objects.get(handle="@josafath.crn")
        self.assertEqual(link.category, SocialLink.Category.PERSONAL)
