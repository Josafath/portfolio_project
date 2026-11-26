import type { Locale } from "@/i18n/config";

const available = (process.env.NEXT_PUBLIC_CV_LANGUAGES ?? "").split(",").filter(Boolean);

/** The CV in the page's language, the other language's if that's the only one, or null if there's none yet. */
export function cvUrl(lang: Locale): string | null {
  const file = available.includes(lang) ? lang : available[0];
  return file ? `/cv/josafath-ceron-cv-${file}.pdf` : null;
}
