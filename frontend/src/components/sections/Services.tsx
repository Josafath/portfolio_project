import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Project, Service } from "@/lib/api";
import { PickServiceButton } from "./PickServiceButton";

export function Services({
  services,
  projects,
  lang,
  dict,
}: {
  services: Service[];
  projects: Project[];
  lang: Locale;
  dict: Dictionary;
}) {
  const names = new Map(projects.map((project) => [project.slug, project.name]));
  return (
    <section id="services" data-scene="services" className="py-[clamp(64px,10vw,128px)]">
      <div className="wrap">
        <p className="eyebrow">{dict.services.eyebrow}</p>
        <h2 className="mt-2.5 max-w-[20ch] font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
          {dict.services.title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted">{dict.services.lede}</p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.id} className="flex flex-col gap-3 bg-bg/90 p-6 backdrop-blur-sm sm:p-8">
              <h3 className="font-display text-xl font-semibold">{service.title}</h3>
              <p className="text-muted">{service.description}</p>
              {service.examples.length > 0 && (
                <p className="font-mono text-[0.78rem] text-muted">
                  {dict.services.examples}:{" "}
                  {service.examples.map((slug, i) => (
                    <span key={slug}>
                      {i > 0 && ", "}
                      <Link href={`/${lang}/projects/${slug}`} className="text-fg underline-offset-4 hover:text-accent hover:underline">
                        {names.get(slug) ?? slug}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              <PickServiceButton serviceId={service.id} className="mt-auto self-start pt-2">
                {dict.services.cta} →
              </PickServiceButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
