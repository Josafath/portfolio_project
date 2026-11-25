import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getMilestones, getProjects, getServices, getSocialLinks } from "@/lib/api";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [projects, milestones, services, socials] = await Promise.all([
    getProjects(lang),
    getMilestones(lang),
    getServices(lang),
    getSocialLinks(),
  ]);

  return (
    <main>
      <Hero lang={lang} dict={dict} />
      <Story milestones={milestones} dict={dict} />
      <ProjectsGallery projects={projects} lang={lang} dict={dict} />
      <Services services={services} projects={projects} lang={lang} dict={dict} />
      <Contact services={services} socials={socials} lang={lang} dict={dict} />
    </main>
  );
}
