# Portfolio

My developer portfolio. v1 (2022) was a Next.js site; v2 adds a Django backend that holds the content,
so projects, the story timeline, services and contact messages are all managed from the Django admin.

| Folder | What it is | Status |
|---|---|---|
| [`backend/`](backend) | Django + Django REST Framework API, PostgreSQL in production | Done |
| [`frontend/`](frontend) | Next.js site with particles, scroll animations and light/dark mode, in Spanish and English | Done |

## API

Every content endpoint takes `?lang=es` (default) or `?lang=en` and returns only that language.
Responses are cached by Vercel's CDN for 5 minutes, so an edit in the admin can take that long to appear.

| Method | Path | Returns |
|---|---|---|
| GET | `/api/projects/` | Published projects, with their versions (v1, v2…) and the before/after table |
| GET | `/api/projects/<slug>/` | One project |
| GET | `/api/milestones/` | The story timeline. `shape` is the short text the particles form (`2022`, `v2`) |
| GET | `/api/experience/` | Jobs, newest first. `highlights` is a list (one line per achievement in the admin) |
| GET | `/api/technologies/` | The stack: technologies with a `category`, and the slugs of the projects that use each one |
| GET | `/api/services/` | What can be hired, with the slugs of projects that prove it |
| GET | `/api/socials/` | Social links. `?category=dev` or `?category=personal` for one group |
| POST | `/api/messages/` | Contact form: `name`, `email`, `message`, `kind` (`project` by default, or `job`), optional `service` (id, ignored for `job`) |

The contact endpoint only accepts POST, so messages can't be read through the API: they are read in the admin.
Its validation errors come in the request's `Accept-Language` (`es` or `en`).
It allows 5 messages per hour per IP, and it has a honeypot: a hidden `website` field that the frontend
must leave empty. Messages with it filled get a normal `201` but are not saved.

## Run it locally

You need Python 3.12 or newer.

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env            # DJANGO_DEBUG=1, SQLite
set -a && . ./.env && set +a

python manage.py migrate         # creates the tables and loads the initial content
python manage.py createsuperuser
python manage.py runserver
```

- API: http://localhost:8000/api/projects/
- Admin: http://localhost:8000/admin/

Run the tests with `python manage.py test`.

Then, in another terminal, the frontend (Node.js 24 or newer). It needs the API running, even to build:

```bash
cd frontend
npm install
cp .env.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

- Site: http://localhost:3000 (redirects to `/es` or `/en` from the browser's language)
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`

### How the frontend is built

- **Next.js 16** with Cache Components: API content is cached with `'use cache'` + `cacheLife("minutes")`,
  so pages are static and refresh a few minutes after an edit in the admin.
- **Particles** (`src/components/particles/engine.ts`): a canvas engine with no dependencies. Sections declare what
  the particles form with `data-scene` attributes, and the engine picks the scene from the scroll position:
  the name in the hero, each milestone's year in the story, the newest version on a project page.
- **Motion** for scroll-linked animation (pinned horizontal gallery, words lighting up), **next-themes** for
  light/dark mode, and the View Transitions API for the circular theme switch and the project title morph.
- Everything respects `prefers-reduced-motion`.
- **CV:** drop `josafath-ceron-cv-es.pdf` and/or `josafath-ceron-cv-en.pdf` in `public/cv/` and the hero shows
  a *Download CV* button (checked at build time in `next.config.ts`). Without one it links to the experience section.

## Deploy on Vercel

Two Vercel projects, both connected to this repo.

### Backend

Vercel detects Django from `manage.py`, runs `collectstatic` on every build (so the admin's CSS works)
and reads the Python version from `backend/.python-version`. No `vercel.json` is needed.

1. **Database.** In the Vercel dashboard, go to *Storage* and create a **Neon** Postgres database. Connect it to
   the project. This adds `DATABASE_URL`.
2. **Project.** Import this repo and set **Root Directory** to `backend`.
3. **Environment variables** (*Settings → Environment Variables*):
   - `DJANGO_SECRET_KEY`: a new random key, made with
     `python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"`
   - `DJANGO_CORS_ALLOWED_ORIGINS`: the frontend's URL, once it exists
   - `DJANGO_ALLOWED_HOSTS` and `DJANGO_CSRF_TRUSTED_ORIGINS`: only if you add a custom domain such as
     `api.example.com`. The `*.vercel.app` hosts are added automatically.
4. **Migrations.** Vercel doesn't run them. Run them from your machine against the production database
   whenever a model changes:

   ```bash
   cd backend
   DATABASE_URL="<Neon connection string>" DJANGO_DEBUG=1 python manage.py migrate
   DATABASE_URL="<Neon connection string>" DJANGO_DEBUG=1 python manage.py createsuperuser
   ```

   Running them by hand is deliberate: preview deployments of unmerged branches share the same database,
   so migrating on every build could change production from a branch that never gets merged.

`manage.py check --deploy` warns about `SECURE_HSTS_SECONDS` and `SECURE_SSL_REDIRECT`.
Both are handled by Vercel, which only serves HTTPS and sends HSTS on its domains.

### Frontend

Deploy the backend first: the frontend reads the API while it builds.

1. **Project.** The existing portfolio project (it keeps the domain). In *Settings → Build and Deployment*:
   Root Directory `frontend`, framework Next.js, Node.js 26.x. Remove the `exit 0` Ignored Build Step if one was set.
2. **Environment variable.** `NEXT_PUBLIC_API_URL` = the backend's URL, e.g. `https://portfolio-api.vercel.app`.
3. **Back in the backend project**, set `DJANGO_CORS_ALLOWED_ORIGINS` to the frontend's URL (with `https://`),
   so the contact form can post from the browser.
