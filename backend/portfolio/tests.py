import re
from datetime import timedelta
from html import unescape
from urllib.parse import parse_qs, urlparse

from django.contrib.auth.models import User
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import ContactMessage, Experience, FailedLogin, Milestone, Project, Service, SocialLink, Technology


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
        self.assertEqual([s["handle"] for s in dev], ["Josafath", "@josafath.dev", "josafath-ceron"])

    def test_unknown_social_category_returns_everything(self):
        self.assertEqual(len(self.client.get("/api/socials/?category=nope").json()), 4)

    def test_content_is_cached_by_the_cdn(self):
        response = self.client.get("/api/projects/")
        self.assertIn("s-maxage=300", response["Cache-Control"])

    def test_content_is_read_only(self):
        self.assertEqual(self.client.post("/api/projects/", {"name": "x"}).status_code, 405)

    def test_stack_groups_technologies_with_their_projects(self):
        stack = {t["name"]: t for t in self.client.get("/api/technologies/").json()}
        self.assertEqual(stack["Django"]["category"], "backend")
        self.assertEqual(stack["OpenCV"]["projects"], ["rollcall"])
        self.assertEqual(stack["PHP"], {"name": "PHP", "category": "language", "projects": []})

    def test_stack_leaves_out_uncategorized_and_unpublished(self):
        Technology.objects.create(name="COBOL")
        Project.objects.filter(slug="rollcall").update(is_published=False)
        stack = {t["name"]: t for t in self.client.get("/api/technologies/").json()}
        self.assertNotIn("COBOL", stack)
        self.assertEqual(stack["OpenCV"]["projects"], [])


class ExperienceApiTests(APITestCase):
    def test_seeded_job_comes_from_the_cv(self):
        jobs = self.client.get("/api/experience/?lang=en").json()
        self.assertEqual([(j["company"], j["role"], j["start"], j["end"]) for j in jobs],
                         [("Universo de Fragancias", "Junior Software Developer", "2026-02-01", None)])
        self.assertEqual(len(jobs[0]["highlights"]), 4)
        self.assertIn("Tiendanube API", jobs[0]["technologies"])


class ExperienceFieldsTests(APITestCase):
    def setUp(self):
        Experience.objects.all().delete()
        job = Experience.objects.create(
            company_es="Agencia de e-commerce", company_en="E-commerce agency",
            role_es="Desarrollador web", role_en="Web developer",
            start="2024-03-01", highlights_es="Tiendas en PHP.\n\n  Paneles de admin.  ",
            highlights_en="PHP stores.\nAdmin panels.",
        )
        job.technologies.set(Technology.objects.filter(name__in=["PHP", "MySQL"]))
        Experience.objects.create(
            company_es="Oculta", company_en="Hidden", role_es="x", role_en="x",
            start="2020-01-01", highlights_es="x", highlights_en="x", is_published=False,
        )

    def test_lists_published_jobs_in_the_language_asked(self):
        jobs = self.client.get("/api/experience/?lang=en").json()
        self.assertEqual(len(jobs), 1)
        self.assertEqual(jobs[0]["company"], "E-commerce agency")
        self.assertEqual(jobs[0]["role"], "Web developer")
        self.assertIsNone(jobs[0]["end"])
        self.assertEqual(jobs[0]["technologies"], ["MySQL", "PHP"])

    def test_highlights_are_a_list_without_blank_lines(self):
        job = self.client.get("/api/experience/").json()[0]
        self.assertEqual(job["highlights"], ["Tiendas en PHP.", "Paneles de admin."])


class ContactMessageApiTests(APITestCase):
    def setUp(self):
        cache.clear()  # throttle counters live in the cache
        self.valid = {"name": "Ana", "email": "ana@example.com", "message": "Tengo una idea para una app."}

    def test_creates_message(self):
        service = Service.objects.get(title_en="Full web apps")
        response = self.client.post("/api/messages/", {**self.valid, "service": service.pk})
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(ContactMessage.objects.get().service, service)

    def test_job_offer_drops_the_service(self):
        service = Service.objects.get(title_en="Full web apps")
        response = self.client.post("/api/messages/", {**self.valid, "kind": "job", "service": service.pk})
        self.assertEqual(response.status_code, 201, response.content)
        message = ContactMessage.objects.get()
        self.assertEqual(message.kind, ContactMessage.Kind.JOB)
        self.assertIsNone(message.service)

    def test_kind_defaults_to_project(self):
        self.client.post("/api/messages/", self.valid)
        self.assertEqual(ContactMessage.objects.get().kind, ContactMessage.Kind.PROJECT)

    def test_rejects_unknown_kind(self):
        response = self.client.post("/api/messages/", {**self.valid, "kind": "spam"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("kind", response.json())

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


class ContactMessageAdminTests(APITestCase):
    def setUp(self):
        user = User.objects.create_superuser("admin", password="test-only-password")
        self.client.force_login(user)
        service = Service.objects.get(title_en="Full web apps")
        self.message = ContactMessage.objects.create(
            name="Ana", email="ana@example.com", message="Tengo una idea.\nEs una app.", service=service
        )

    @override_settings(CONTACT_REPLY_GMAIL="yo@gmail.com")
    def test_reply_opens_gmail_in_the_configured_account(self):
        html = self.client.get(f"/admin/portfolio/contactmessage/{self.message.pk}/change/").content.decode()
        reply_url = unescape(re.search(r'href="(https://mail\.google\.com/[^"]+)"', html).group(1))
        query = parse_qs(urlparse(reply_url).query)
        self.assertEqual(query["authuser"], ["yo@gmail.com"])
        self.assertEqual(query["to"], ["ana@example.com"])
        self.assertEqual(query["su"], ["Re: Apps web completas"])
        self.assertIn("> Tengo una idea.\n> Es una app.", query["body"][0])

    @override_settings(CONTACT_REPLY_GMAIL="")
    def test_reply_falls_back_to_mailto(self):
        html = self.client.get("/admin/portfolio/contactmessage/").content.decode()
        self.assertIn('href="mailto:ana@example.com?subject=', html)

    @override_settings(CONTACT_REPLY_GMAIL="")
    def test_reply_to_a_job_offer(self):
        self.message.kind = ContactMessage.Kind.JOB
        self.message.save()
        html = unescape(self.client.get("/admin/portfolio/contactmessage/").content.decode())
        self.assertIn("subject=Re%3A+oferta+de+trabajo", html)


class AdminLoginThrottleTests(TestCase):
    def setUp(self):
        User.objects.create_superuser("admin", password="test-only-password")

    def login(self, password, ip="203.0.113.7"):
        return self.client.post(
            "/admin/login/?next=/admin/",
            {"username": "admin", "password": password},
            REMOTE_ADDR=ip,
        )

    def test_blocks_the_ip_after_five_wrong_passwords(self):
        for _ in range(5):
            self.assertContains(self.login("wrong"), "errornote")
        response = self.login("test-only-password")
        self.assertContains(response, "Demasiados intentos fallidos")
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_other_ips_can_still_log_in(self):
        for _ in range(5):
            self.login("wrong")
        self.assertRedirects(self.login("test-only-password", ip="198.51.100.4"), "/admin/")

    def test_attempts_expire_after_the_window(self):
        for _ in range(5):
            self.login("wrong")
        FailedLogin.objects.update(created_at=timezone.now() - timedelta(minutes=16))
        self.assertRedirects(self.login("test-only-password"), "/admin/")

    def test_successful_login_clears_the_count(self):
        for _ in range(4):
            self.login("wrong")
        self.assertRedirects(self.login("test-only-password"), "/admin/")
        self.assertFalse(FailedLogin.objects.exists())
