import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Experience as Job, Project, Technology, TechnologyCategory } from "@/lib/api";
import { PickJobButton } from "./PickServiceButton";

const categoryOrder: TechnologyCategory[] = ["language", "backend", "frontend", "data", "desktop", "tools"];

/** "mar 2024" / "Mar 2024". Dates come as YYYY-MM-DD, read in UTC so the month never shifts. */
function monthYear(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}

export function Experience({
  jobs,
  technologies,
  projects,
  lang,
  dict,
}: {
  jobs: Job[];
  technologies: Technology[];
  projects: Project[];
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.experience;
  const names = new Map(projects.map((project) => [project.slug, project.name]));
  const groups = categoryOrder
    .map((category) => ({ category, items: technologies.filter((tech) => tech.category === category) }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="experience" data-scene="experience" className="py-[clamp(64px,10vw,128px)]">
      <div className="wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="mt-2.5 max-w-[20ch] font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
          {t.title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted">{t.lede}</p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
          {jobs.length > 0 && (
            <ol className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {jobs.map((job) => (
                <li key={`${job.company}-${job.start}`} className="flex flex-col gap-3 bg-bg/90 p-6 backdrop-blur-sm sm:p-8">
                  <p className="font-mono text-[0.8rem] text-muted tabular-nums">
                    {monthYear(job.start, lang)} — {job.end ? monthYear(job.end, lang) : <span className="text-accent">{t.present}</span>}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{job.role}</h3>
                    <p className="text-muted">{job.company}</p>
                  </div>
                  <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted marker:text-accent">
                    {job.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {job.technologies.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className={`flex flex-col gap-6 ${jobs.length === 0 ? "lg:col-span-2" : ""}`}>
            <h3 className="font-mono text-[0.78rem] tracking-[0.12em] text-muted uppercase">{t.stack}</h3>
            <dl className={`grid gap-6 ${jobs.length === 0 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-1"}`}>
              {groups.map(({ category, items }) => (
                <div key={category} className="flex flex-col gap-2">
                  <dt className="font-display font-semibold">{t.categories[category]}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {items.map((tech) => (
                      <span key={tech.name} className="tag" title={tech.projects.length ? `${t.usedIn}: ${tech.projects.map((slug) => names.get(slug) ?? slug).join(", ")}` : undefined}>
                        {tech.name}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <PickJobButton>{t.cta} →</PickJobButton>
              <Link href={`/${lang}#projects`} className="font-mono text-[0.85rem] text-muted hover:text-fg">
                {dict.hero.ctaProjects} ↓
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
