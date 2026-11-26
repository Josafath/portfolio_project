import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getExperience, getMilestones, getProjects, getServices, getSocialLinks, getTechnologies } from "@/lib/api";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [projects, milestones, jobs, technologies, services, socials] = await Promise.all([
    getProjects(lang),
    getMilestones(lang),
    getExperience(lang),
    getTechnologies(),
    getServices(lang),
    getSocialLinks(),
  ]);

  return (
    <main>
      <Hero lang={lang} dict={dict} />
      <Story milestones={milestones} dict={dict} />
      <Experience jobs={jobs} technologies={technologies} projects={projects} lang={lang} dict={dict} />
      <ProjectsGallery projects={projects} lang={lang} dict={dict} />
      <Services services={services} projects={projects} lang={lang} dict={dict} />
      <Contact services={services} socials={socials} lang={lang} dict={dict} />
    </main>
  );
}
