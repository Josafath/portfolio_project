import type { Locale } from "./config";

const es = {
  meta: {
    title: "Josafath Cerón · Desarrollador",
    description:
      "Portafolio de Josafath Cerón: apps web, APIs y apps de escritorio. Cada proyecto muestra su v1 y su v2 para que se vea el avance.",
  },
  nav: { story: "Historia", projects: "Proyectos", services: "Servicios", contact: "Contacto" },
  theme: { toggle: "Cambiar entre modo claro y oscuro" },
  language: { label: "Idioma", switchTo: "English", switchToShort: "EN" },
  hero: {
    pill: "Josafath Cerón · desarrollador",
    rolePrefix: "Construyo",
    roles: ["APIs REST con Django", "apps web con React", "apps de escritorio en Java", "tu próxima idea"],
    lede: "Del primer juego en Python en 2020 a apps web, APIs y reconocimiento facial. Aquí cada proyecto muestra su v1 y su v2, para que se note cuánto he avanzado.",
    ctaProjects: "Ver proyectos",
    ctaIdea: "Tengo una idea",
    cue: "Baja para ver mi historia · pasa el cursor sobre el nombre",
  },
  story: { eyebrow: "Historia", title: "Cómo he ido avanzando" },
  projects: {
    eyebrow: "Proyectos",
    title: "Lo que he construido",
    lede: "Cada uno existe en dos versiones escritas con años de diferencia. Las dos siguen en el repo.",
    details: "Ver la v1 y la v2",
    repo: "Código",
    live: "Ver en vivo",
  },
  project: {
    back: "Todos los proyectos",
    versions: "Versiones",
    improvements: "Qué cambió",
    aspect: "Aspecto",
    before: "Antes",
    after: "Después",
    since: "Desde",
  },
  services: {
    eyebrow: "Servicios",
    title: "¿Tienes una idea? La construyo contigo",
    lede: "Te ayudo desde el diseño hasta el deploy. Cuéntame qué necesitas y te respondo con una propuesta.",
    examples: "Ejemplos",
    cta: "Cuéntame tu idea",
  },
  contact: {
    eyebrow: "Contacto",
    big: "Cada versión mejora a la anterior. La siguiente puede ser la tuya.",
    highlight: "tuya.",
    name: "Nombre",
    email: "Correo",
    service: "¿Qué necesitas?",
    serviceNone: "Todavía no lo sé",
    message: "Tu idea",
    messagePlaceholder: "Cuéntame qué quieres construir, para quién es y si tienes una fecha en mente.",
    send: "Enviar",
    sending: "Enviando…",
    sent: "¡Gracias! Te respondo pronto a tu correo.",
    sendAnother: "Enviar otro mensaje",
    errorInvalid: "Revisa los campos marcados.",
    errorThrottled: "Enviaste varios mensajes seguidos. Intenta de nuevo en una hora.",
    errorNetwork: "No se pudo enviar. Revisa tu conexión e intenta de nuevo.",
    or: "También me encuentras en",
  },
  footer: { built: "Hecho con Next.js y Django.", source: "Código del sitio" },
  notFound: { title: "Esta página no existe", back: "Volver al inicio" },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  meta: {
    title: "Josafath Cerón · Developer",
    description:
      "Josafath Cerón's portfolio: web apps, APIs and desktop apps. Every project shows its v1 and its v2, so the progress is visible.",
  },
  nav: { story: "Story", projects: "Projects", services: "Services", contact: "Contact" },
  theme: { toggle: "Switch between light and dark mode" },
  language: { label: "Language", switchTo: "Español", switchToShort: "ES" },
  hero: {
    pill: "Josafath Cerón · developer",
    rolePrefix: "I build",
    roles: ["REST APIs with Django", "web apps with React", "desktop apps in Java", "your next idea"],
    lede: "From a first Python game in 2020 to web apps, APIs and face recognition. Every project here shows its v1 and its v2, so you can see how far I've come.",
    ctaProjects: "See projects",
    ctaIdea: "I have an idea",
    cue: "Scroll for my story · hover over the name",
  },
  story: { eyebrow: "Story", title: "How I got here" },
  projects: {
    eyebrow: "Projects",
    title: "What I've built",
    lede: "Each one exists in two versions written years apart. Both are still in the repo.",
    details: "See v1 and v2",
    repo: "Code",
    live: "Live",
  },
  project: {
    back: "All projects",
    versions: "Versions",
    improvements: "What changed",
    aspect: "Aspect",
    before: "Before",
    after: "After",
    since: "Since",
  },
  services: {
    eyebrow: "Services",
    title: "Got an idea? Let's build it together",
    lede: "I can help from the design to the deploy. Tell me what you need and I'll get back to you with a proposal.",
    examples: "Examples",
    cta: "Tell me your idea",
  },
  contact: {
    eyebrow: "Contact",
    big: "Every version beats the last one. The next one could be yours.",
    highlight: "yours.",
    name: "Name",
    email: "Email",
    service: "What do you need?",
    serviceNone: "I'm not sure yet",
    message: "Your idea",
    messagePlaceholder: "Tell me what you want to build, who it's for, and whether you have a date in mind.",
    send: "Send",
    sending: "Sending…",
    sent: "Thanks! I'll reply to your email soon.",
    sendAnother: "Send another message",
    errorInvalid: "Check the highlighted fields.",
    errorThrottled: "You sent several messages in a row. Try again in an hour.",
    errorNetwork: "It couldn't be sent. Check your connection and try again.",
    or: "You can also find me on",
  },
  footer: { built: "Built with Next.js and Django.", source: "Site source code" },
  notFound: { title: "This page doesn't exist", back: "Back to home" },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
