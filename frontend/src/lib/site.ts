import { locales, type Locale } from "@/i18n/config";

/** The official address, used for canonical URLs, the sitemap and link previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://josafath-dev.vercel.app").replace(/\/$/, "");

/** Canonical and hreflang links for a path that exists in every language, e.g. "" or "/projects/rollcall". */
export function alternatesFor(lang: Locale, path = "") {
  return {
    canonical: `/${lang}${path}`,
    languages: Object.fromEntries([...locales.map((l) => [l, `/${l}${path}`]), ["x-default", `/es${path}`]]),
  };
}
