import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getProjects } from "@/lib/api";
import { alternatesFor, SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects("es");
  const paths = ["", ...projects.map((project) => `/projects/${project.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternatesFor(lang, path).languages).map(([l, href]) => [l, `${SITE_URL}${href}`]),
        ),
      },
      priority: path ? 0.6 : 1,
    })),
  );
}
