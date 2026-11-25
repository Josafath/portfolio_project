"""
Initial content: the six pinned GitHub projects, the story timeline, the
services and the social links. Everything can be edited later in the admin.
"""
import datetime

from django.db import migrations

TECHNOLOGIES = [
    "Python", "OpenCV", "NumPy", "Tkinter", "SQLite", "Java", "Swing", "JavaScript", "TypeScript",
    "React", "Vite", "TanStack Query", "Firebase", "Node.js", "Express", "Socket.IO", "WebRTC",
    "MongoDB", "Next.js", "Django", "Django REST Framework", "PostgreSQL", "Vercel", "GitHub Actions",
]

# (aspect, before, after) rows are (es, en) pairs
PROJECTS = [
    {
        "slug": "rollcall",
        "name": "RollCall",
        "tagline": ("Pasa lista con reconocimiento facial.", "Class attendance with face recognition."),
        "description": (
            "App de escritorio que pasa lista con la cámara. Registras a cada alumno una vez y, al apuntar a "
            "la clase, reconoce quién está, lo marca presente y exporta la lista a Excel.",
            "A desktop app that takes attendance with the webcam. Register each student once, point the "
            "camera at the class, and it recognizes who is there, marks them present and exports the list to Excel.",
        ),
        "repo_url": "https://github.com/Josafath/attendance-management",
        "live_url": "",
        "started_year": 2021,
        "technologies": ["Python", "OpenCV", "NumPy", "Tkinter", "SQLite", "GitHub Actions"],
        "versions": [
            ("v1", 2021, ("Detección con Haar cascade y reconocimiento LBPH; guardaba 20 fotos de cada cara.",
                          "Haar cascade detection and LBPH recognition; stored 20 photos of each face.")),
            ("v2 · RollCall", 2026, ("Redes neuronales YuNet y SFace, sin guardar fotos, con historial y 143 tests.",
                                     "YuNet and SFace neural networks, no photos stored, session history and 143 tests.")),
        ],
        "improvements": [
            (("Detección", "Face detection"), ("Haar cascade", "Haar cascade"),
             ("Red neuronal YuNet: encuentra caras de lado, con lentes o con poca luz",
              "YuNet neural network: finds turned faces, glasses, low light")),
            (("Qué se guarda", "What's stored"), ("20 fotos de cada cara", "20 photos of each face"),
             ("128 números por muestra, sin fotos", "128 numbers per sample, no photos")),
            (("Asistencia", "Attendance"), ("Solo presentes", "Students present"),
             ("Presentes y ausentes, historial y porcentaje por alumno", "Present and absent, history and % per student")),
            (("Tests", "Tests"), ("Ninguno", "None"),
             ("143 tests con CI en Windows, macOS y Linux", "143 tests, CI on Windows, macOS and Linux")),
        ],
    },
    {
        "slug": "algoscope",
        "name": "AlgoScope",
        "tagline": ("Algoritmos de ordenamiento y de búsqueda de caminos, paso a paso.",
                    "Sorting and pathfinding algorithms, step by step."),
        "description": (
            "App de escritorio en Java que anima algoritmos paso a paso: seis de ordenamiento sobre barras y "
            "BFS, DFS, Dijkstra y A* recorriendo un laberinto. Se puede avanzar, retroceder o saltar a cualquier paso.",
            "A Java desktop app that animates algorithms step by step: six sorting algorithms on bars, and BFS, "
            "DFS, Dijkstra and A* finding their way through a maze, played forwards, backwards or from any step.",
        ),
        "repo_url": "https://github.com/Josafath/Sorting-Algorithms",
        "live_url": "",
        "started_year": 2021,
        "technologies": ["Java", "Swing", "GitHub Actions"],
        "versions": [
            ("v1", 2021, ("Ordenaba los números que escribías y mostraba el tiempo. Java 8.",
                          "Sorted the numbers you typed and showed the time. Java 8.")),
            ("v2 · AlgoScope", 2026, ("Anima cada algoritmo hacia adelante y hacia atrás, con métricas reales. Java 21.",
                                      "Animates each algorithm forwards and backwards, with real metrics. Java 21.")),
        ],
        "improvements": [
            (("Qué hace", "What it does"), ("Ordena números y muestra el tiempo", "Sorts numbers and shows the time"),
             ("Anima cada paso, hacia adelante y hacia atrás", "Animates every step, forwards and backwards")),
            (("Algoritmos", "Algorithms"), ("5 de ordenamiento", "5 sorting"),
             ("6 de ordenamiento, 4 de caminos y un generador de laberintos", "6 sorting, 4 pathfinding and a maze generator")),
            (("Qué mide", "What it measures"), ("Un tiempo en nanosegundos", "One time in nanoseconds"),
             ("Comparaciones, intercambios, escrituras y celdas exploradas", "Comparisons, swaps, writes and cells explored")),
            (("Tests", "Tests"), ("94", "94"),
             ("344, incluida la interfaz sin pantalla", "344, including the UI without a screen")),
        ],
    },
    {
        "slug": "jossify",
        "name": "Jossify",
        "tagline": ("Tus canciones y artistas más escuchados en Spotify, en ranking.",
                    "Your Spotify top tracks and artists, ranked."),
        "description": (
            "Tus 40 canciones y artistas más escuchados de las últimas 4 semanas, los últimos 6 meses y de "
            "siempre, y cómo suben o bajan entre esos periodos. Tiene un modo demo para probarla sin cuenta.",
            "Your top 40 tracks and artists from the last 4 weeks, the last 6 months and all time, and how they "
            "move between those ranges. A demo mode lets anyone try it without an account.",
        ),
        "repo_url": "https://github.com/Josafath/Spotify-React-App",
        "live_url": "https://jossify-joss.web.app",
        "started_year": 2021,
        "technologies": ["React", "TypeScript", "Vite", "TanStack Query", "Firebase", "GitHub Actions"],
        "versions": [
            ("v1", 2021, ("JavaScript con Create React App y el flujo Implicit Grant, ya retirado por Spotify.",
                          "JavaScript with Create React App and the Implicit Grant flow, since retired by Spotify.")),
            ("v2", 2026, ("React 19 y TypeScript estricto, inicio de sesión con PKCE y modo demo.",
                          "React 19 and strict TypeScript, PKCE sign-in and a demo mode.")),
        ],
        "improvements": [
            (("Lenguaje", "Language"), ("JavaScript", "JavaScript"), ("TypeScript estricto", "Strict TypeScript")),
            (("Inicio de sesión", "Sign-in"), ("Implicit Grant, ya retirado", "Implicit Grant, since retired"),
             ("Authorization Code + PKCE con renovación de token", "Authorization Code + PKCE with token refresh")),
            (("Datos", "Data fetching"), ("Seis llamadas con axios, una tras otra", "Six sequential axios calls"),
             ("Cliente fetch tipado, caché con TanStack Query y llamadas en paralelo",
              "Typed fetch client, TanStack Query cache, parallel requests")),
            (("Estados", "States"), ("Fallaba con datos vacíos", "Crashed on empty data"),
             ("Carga, vacío, error, sesión expirada y límite de peticiones",
              "Loading, empty, error, expired session and rate limit")),
        ],
    },
    {
        "slug": "study-partner",
        "name": "Study Partner",
        "tagline": ("Videollamadas uno a uno para estudiar en pareja.", "One-to-one video calls for study partners."),
        "description": (
            "Creas una sala privada, mandas el enlace a tu compañero y hablan cara a cara con video, audio y "
            "chat. El video va directo entre los dos navegadores con WebRTC; el servidor solo los presenta.",
            "Create a private room, send the invite link to your partner and talk face to face with video, audio "
            "and chat. Video goes straight between the two browsers with WebRTC; the server only introduces them.",
        ),
        "repo_url": "https://github.com/Josafath/simple-video-chat",
        "live_url": "https://simple-video-chat-rpq1.onrender.com",
        "started_year": 2021,
        "technologies": ["Node.js", "Express", "Socket.IO", "WebRTC", "MongoDB", "JavaScript", "GitHub Actions"],
        "versions": [
            ("Original", 2021, ("Salas por nombre, credenciales escritas en el código y XSS en el chat.",
                                "Rooms by name, credentials in the code and XSS in the chat.")),
            ("v1", 2026, ("La misma arquitectura con sus fallas de seguridad corregidas, salas privadas y CI.",
                          "The same architecture with its security problems fixed, private rooms and CI.")),
        ],
        "improvements": [
            (("Credenciales", "Credentials"), ("Escritas en el código", "Written in the code"),
             ("En variables de entorno", "In environment variables")),
            (("Chat", "Chat"), ("Mensajes insertados como HTML (XSS)", "Messages inserted as HTML (XSS)"),
             ("Mensajes insertados como texto", "Messages inserted as text")),
            (("Salas", "Rooms"), ("Cualquiera entraba adivinando el nombre", "Anyone could join by guessing the name"),
             ("Enlace privado con un token de 128 bits", "Private invite link with a 128-bit token")),
            (("Login", "Login"), ("Sin límite de intentos", "No attempt limit"),
             ("10 intentos fallidos por IP cada 15 minutos", "10 failed attempts per IP every 15 minutes")),
        ],
    },
    {
        "slug": "authlab",
        "name": "AuthLab",
        "tagline": ("Registro e inicio de sesión con algoritmos escritos desde cero.",
                    "Sign-up and log-in built on hand-written algorithms."),
        "description": (
            "Una app de registro e inicio de sesión que hice para aprender algoritmos de forma práctica. "
            "Ordena y busca usuarios con algoritmos propios y guarda las contraseñas con PBKDF2.",
            "A sign-up and log-in app I wrote to learn algorithms in a practical way. It sorts and searches users "
            "with hand-written algorithms and stores passwords with PBKDF2.",
        ),
        "repo_url": "https://github.com/Josafath/Login-Python",
        "live_url": "",
        "started_year": 2021,
        "technologies": ["Python", "Tkinter", "GitHub Actions"],
        "versions": [
            ("v1", 2021, ("Merge sort y búsqueda binaria sobre la primera letra; contraseñas en texto plano.",
                          "Merge sort and binary search on the first letter; plain-text passwords.")),
            ("v2 · AuthLab", 2026, ("4 algoritmos de ordenamiento, búsqueda binaria y Trie hechos a mano, PBKDF2 y 57 tests.",
                                    "4 sorting algorithms, binary search and a Trie by hand, PBKDF2 and 57 tests.")),
        ],
        "improvements": [
            (("Contraseñas", "Passwords"), ("Texto plano", "Plain text"),
             ("Hash PBKDF2-SHA256 con sal y 600,000 iteraciones", "Salted PBKDF2-SHA256 hash, 600,000 iterations")),
            (("Ordenamiento", "Sorting"), ("Merge sort por la primera letra", "Merge sort on the first letter"),
             ("4 algoritmos desde cero, con conteo de comparaciones", "4 algorithms from scratch, with comparison counting")),
            (("Búsqueda", "Searching"), ("Búsqueda binaria recursiva", "Recursive binary search"),
             ("Búsqueda binaria, por prefijo y con un Trie", "Binary search, prefix range search and a Trie")),
            (("Seguridad del login", "Login security"), ("Ninguna", "None"),
             ("Mismo error para usuario y contraseña, bloqueo tras 5 intentos",
              "Same error for user and password, lockout after 5 attempts")),
        ],
    },
    {
        "slug": "rock-paper-scissors",
        "name": "Rock-Paper-Scissors",
        "tagline": ("Piedra, papel o tijera contra una CPU que aprende cómo juegas.",
                    "Rock-Paper-Scissors against a CPU that learns how you play."),
        "description": (
            "El mismo juego escrito dos veces, con años de diferencia. En el nivel difícil la CPU usa cadenas "
            "de Markov para aprender tus patrones, y también se puede jugar con Lagarto y Spock.",
            "The same game written twice, years apart. On the hardest level the CPU uses Markov chains to learn "
            "your patterns, and it also plays Rock-Paper-Scissors-Lizard-Spock.",
        ),
        "repo_url": "https://github.com/Josafath/Rock-Paper-Scissors",
        "live_url": "",
        "started_year": 2020,
        "technologies": ["Python", "Tkinter", "GitHub Actions"],
        "versions": [
            ("v1", 2020, ("Un script de 118 líneas con random.choice.", "One 118-line script with random.choice.")),
            ("v2", 2026, ("Tres niveles; el difícil aprende tus patrones con cadenas de Markov.",
                          "Three levels; the hardest learns your patterns with Markov chains.")),
        ],
        "improvements": [
            (("CPU", "CPU"), ("random.choice", "random.choice"),
             ("Aprende tus patrones con cadenas de Markov", "Learns your patterns with Markov chains")),
            (("Reglas", "Rules"), ("Un if/else por cada jugada", "Hand-written if/else for every move"),
             ("Las reglas son datos: Lagarto y Spock se agregaron con una tabla",
              "Rules are data: Lizard-Spock took a table, not code")),
            (("Estructura", "Structure"), ("Un script de 118 líneas", "One 118-line script"),
             ("Paquete dividido en reglas, IA, partida, estadísticas e interfaz",
              "Package split into rules, AI, match, stats and GUI")),
            (("Tests", "Tests"), ("Ninguno", "None"),
             ("Más de 30 tests con pytest en GitHub Actions", "30+ pytest tests on GitHub Actions")),
        ],
    },
]

MILESTONES = [
    {
        "year": 2020, "date": None, "shape": "2020",
        "title": ("Mi primer juego", "My first game"),
        "body": ("Piedra, papel o tijera en Python: un script de 118 líneas donde la CPU elegía al azar.",
                 "Rock-Paper-Scissors in Python: one 118-line script where the CPU picked at random."),
        "repo": "Rock-Paper-Scissors", "commit_hash": "", "commit_message": "",
        "technologies": ["Python"],
    },
    {
        "year": 2021, "date": None, "shape": "2021",
        "title": ("Un año de probarlo todo", "A year of trying everything"),
        "body": ("Un login para aprender algoritmos, mi primera app en Java, React con la API de Spotify, "
                 "videollamadas con WebRTC y asistencia con reconocimiento facial.",
                 "A login app to learn algorithms, my first Java app, React with the Spotify API, video calls "
                 "with WebRTC and attendance with face recognition."),
        "repo": "", "commit_hash": "", "commit_message": "",
        "technologies": ["Python", "Java", "React", "Node.js", "OpenCV"],
    },
    {
        "year": 2022, "date": datetime.date(2022, 1, 25), "shape": "2022",
        "title": ("Mi primer sitio", "My first website"),
        "body": ("Un portafolio con Next.js publicado en Vercel. Ahí aprendí lo que significa poner algo en producción.",
                 "A Next.js portfolio deployed on Vercel. That's where I learned what putting something in production means."),
        "repo": "portfolio_project", "commit_hash": "2c22e25", "commit_message": "Initial commit from Create Next App",
        "technologies": ["Next.js", "React", "Vercel"],
    },
    {
        "year": 2024, "date": datetime.date(2024, 3, 20), "shape": "2024",
        "title": ("Del frontend al backend", "From frontend to backend"),
        "body": ("Construí la API del portafolio con Django REST Framework y, después, un sistema de biblioteca "
                 "en Java con su propia base de datos.",
                 "I built the portfolio's API with Django REST Framework, and then a library system in Java "
                 "with its own database."),
        "repo": "portfolio_project", "commit_hash": "c4d5589", "commit_message": "Estructura backend ya hecha",
        "technologies": ["Django", "Django REST Framework", "Java"],
    },
    {
        "year": 2026, "date": None, "shape": "2026",
        "title": ("Reescribir con lo que sé hoy", "Rewriting with what I know today"),
        "body": ("Volví a mis proyectos y escribí una v2 de cada uno: seguridad, tests, CI y arquitectura limpia, "
                 "dejando la v1 al lado para que se note la diferencia.",
                 "I went back to my projects and wrote a v2 of each one: security, tests, CI and clean "
                 "architecture, with v1 kept alongside so the difference shows."),
        "repo": "", "commit_hash": "", "commit_message": "",
        "technologies": ["GitHub Actions", "TypeScript", "Java"],
    },
    {
        "year": 2026, "date": None, "shape": "v2", "order": 1,
        "title": ("Todo junto", "All together"),
        "body": ("Este portafolio: Next.js en el frontend, Django en el backend y PostgreSQL, todo en Vercel.",
                 "This portfolio: Next.js on the frontend, Django on the backend and PostgreSQL, all on Vercel."),
        "repo": "portfolio_project", "commit_hash": "", "commit_message": "",
        "technologies": ["Next.js", "Django", "PostgreSQL", "Vercel"],
    },
]

SERVICES = [
    {
        "title": ("Páginas web y landing pages", "Websites and landing pages"),
        "description": ("Sitios rápidos y responsivos para tu negocio, tu marca personal o un evento, con "
                        "animaciones y modo claro y oscuro.",
                        "Fast, responsive sites for your business, personal brand or event, with animations "
                        "and light and dark modes."),
        "examples": [],
    },
    {
        "title": ("Apps web completas", "Full web apps"),
        "description": ("Frontend y backend, con usuarios, inicio de sesión y base de datos. De la idea al deploy.",
                        "Frontend and backend, with users, sign-in and a database. From the idea to the deploy."),
        "examples": ["jossify", "study-partner"],
    },
    {
        "title": ("APIs y backends", "APIs and backends"),
        "description": ("APIs REST con Django o Node.js para conectar tu app, tu sitio o tus datos.",
                        "REST APIs with Django or Node.js to connect your app, your site or your data."),
        "examples": ["study-partner"],
    },
    {
        "title": ("Apps de escritorio", "Desktop apps"),
        "description": ("Programas en Python o Java para tareas concretas, como pasar lista, visualizar datos "
                        "o automatizar procesos.",
                        "Python or Java programs for specific jobs, like taking attendance, visualizing data "
                        "or automating processes."),
        "examples": ["rollcall", "algoscope", "authlab"],
    },
]

SOCIAL_LINKS = [
    ("github", "Josafath", "https://github.com/Josafath", "dev"),
    ("instagram", "@jossa_dev", "https://www.instagram.com/jossa_dev/", "dev"),
    ("linkedin", "josafath-ceron", "https://www.linkedin.com/in/josafath-ceron/", "dev"),
    ("instagram", "@josafath.crn", "https://www.instagram.com/josafath.crn/", "personal"),
]


def seed(apps, schema_editor):
    Technology = apps.get_model("portfolio", "Technology")
    Project = apps.get_model("portfolio", "Project")
    ProjectVersion = apps.get_model("portfolio", "ProjectVersion")
    Improvement = apps.get_model("portfolio", "Improvement")
    Milestone = apps.get_model("portfolio", "Milestone")
    Service = apps.get_model("portfolio", "Service")
    SocialLink = apps.get_model("portfolio", "SocialLink")

    tech = {name: Technology.objects.create(name=name) for name in TECHNOLOGIES}

    projects = {}
    for order, data in enumerate(PROJECTS):
        project = Project.objects.create(
            slug=data["slug"], name=data["name"],
            tagline_es=data["tagline"][0], tagline_en=data["tagline"][1],
            description_es=data["description"][0], description_en=data["description"][1],
            repo_url=data["repo_url"], live_url=data["live_url"],
            started_year=data["started_year"], order=order,
        )
        project.technologies.set([tech[name] for name in data["technologies"]])
        for i, (label, year, summary) in enumerate(data["versions"]):
            ProjectVersion.objects.create(
                project=project, label=label, year=year, summary_es=summary[0], summary_en=summary[1], order=i,
            )
        for i, (aspect, before, after) in enumerate(data["improvements"]):
            Improvement.objects.create(
                project=project, order=i,
                aspect_es=aspect[0], aspect_en=aspect[1],
                before_es=before[0], before_en=before[1],
                after_es=after[0], after_en=after[1],
            )
        projects[project.slug] = project

    for data in MILESTONES:
        milestone = Milestone.objects.create(
            year=data["year"], date=data["date"], shape=data["shape"], order=data.get("order", 0),
            title_es=data["title"][0], title_en=data["title"][1],
            body_es=data["body"][0], body_en=data["body"][1],
            repo=data["repo"], commit_hash=data["commit_hash"], commit_message=data["commit_message"],
        )
        milestone.technologies.set([tech[name] for name in data["technologies"]])

    for order, data in enumerate(SERVICES):
        service = Service.objects.create(
            title_es=data["title"][0], title_en=data["title"][1],
            description_es=data["description"][0], description_en=data["description"][1],
            order=order,
        )
        service.examples.set([projects[slug] for slug in data["examples"]])

    for order, (platform, handle, url, category) in enumerate(SOCIAL_LINKS):
        SocialLink.objects.create(platform=platform, handle=handle, url=url, category=category, order=order)


def unseed(apps, schema_editor):
    for model in ("SocialLink", "Service", "Milestone", "Project", "Technology"):
        apps.get_model("portfolio", model).objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
