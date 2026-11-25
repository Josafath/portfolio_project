import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const value = await rootLang();
  const lang = hasLocale(value) ? value : defaultLocale;
  const t = getDictionary(lang).notFound;
  return (
    <main className="wrap flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <p className="font-mono text-accent">404</p>
      <h1 className="font-display text-[clamp(2rem,6vw,4rem)] leading-tight font-semibold">{t.title}</h1>
      <Link href={`/${lang}`} className="font-mono text-[0.9rem] text-muted hover:text-accent">
        ← {t.back}
      </Link>
    </main>
  );
}
