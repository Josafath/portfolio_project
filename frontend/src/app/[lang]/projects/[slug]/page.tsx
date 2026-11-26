import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { ViewTransition } from "react";
import { ProjectLinks, repoPath } from "@/components/project-utils";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject, getProjects } from "@/lib/api";
import { alternatesFor } from "@/lib/site";

export async function generateStaticParams() {
  const lang = await rootLang();
  if (!hasLocale(lang)) return [];
  const projects = await getProjects(lang);
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/[lang]/projects/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = hasLocale(lang) ? await getProject(lang, slug) : null;
  if (!project || !hasLocale(lang)) return {};
  const path = `/projects/${slug}`;
  return {
    title: project.name,
    description: project.tagline,
    alternates: alternatesFor(lang, path),
    // Keeps the layout's site name, locale and preview image
    openGraph: { ...(await parent).openGraph, title: project.name, description: project.tagline, url: `/${lang}${path}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const project = await getProject(lang, slug);
  if (!project) notFound();
  const dict = getDictionary(lang);
  const t = dict.project;
  // The particles form the label of the newest version, e.g. "v2" from "v2 · RollCall"
  const latest = project.versions.at(-1)?.label.split(" ")[0] ?? "";

  return (
    <main className="pt-[clamp(32px,6vw,64px)] pb-[clamp(64px,10vw,120px)]">
      <article data-scene="project" data-scene-text={latest} data-scene-align="center" className="wrap">
        <Link href={`/${lang}#projects`} className="font-mono text-[0.82rem] text-muted hover:text-accent">
          ← {t.back}
        </Link>

        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono text-[0.8rem] text-muted">
              ~/{repoPath(project.repo_url)} · {t.since} {project.started_year}
            </p>
            <ViewTransition name={`project-${project.slug}`}>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance">
                {project.name}
              </h1>
            </ViewTransition>
            <p className="mt-4 max-w-[48ch] font-display text-[clamp(1.2rem,2.6vw,1.6rem)] leading-snug text-muted">
              {project.tagline}
            </p>
            <ProjectLinks project={project} dict={dict} className="mt-6" />
          </div>
          <div aria-hidden="true" data-scene-anchor="project" className="h-[clamp(120px,22vw,260px)]" />
        </header>

        <p className="mt-10 max-w-[65ch] text-[1.08rem]">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="eyebrow">{t.versions}</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {project.versions.map((version) => (
              <li key={version.label} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 backdrop-blur-sm">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl font-semibold">{version.label}</span>
                  {version.year && <span className="font-mono text-[0.8rem] text-muted tabular-nums">{version.year}</span>}
                </p>
                <p className="text-muted">{version.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        {project.improvements.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow">{t.improvements}</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface backdrop-blur-sm">
              <table className="w-full min-w-[560px] text-left">
                <thead className="font-mono text-[0.75rem] tracking-wider text-muted uppercase">
                  <tr className="border-b border-line">
                    <th scope="col" className="px-5 py-3 font-medium">{t.aspect}</th>
                    <th scope="col" className="px-5 py-3 font-medium">{t.before}</th>
                    <th scope="col" className="px-5 py-3 font-medium">{t.after}</th>
                  </tr>
                </thead>
                <tbody>
                  {project.improvements.map((row) => (
                    <tr key={row.aspect} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-4 align-top font-semibold">{row.aspect}</th>
                      <td className="px-5 py-4 align-top text-muted">{row.before}</td>
                      <td className="px-5 py-4 align-top">
                        <span className="text-accent">→ </span>
                        {row.after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
