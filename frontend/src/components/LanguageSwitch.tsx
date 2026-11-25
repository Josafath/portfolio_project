"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

export function LanguageSwitch({ lang, label, short }: { lang: Locale; label: string; short: string }) {
  const pathname = usePathname();
  const other: Locale = lang === "es" ? "en" : "es";
  const href = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  // A plain <a>, not <Link>: the language is the root layout, and a client-side navigation between
  // root layouts left the old one mounted (two headers, two particle canvases fighting over the scenes)
  return (
    <a
      href={href}
      hrefLang={other}
      aria-label={label}
      title={label}
      className="rounded-lg px-2.5 py-1.5 font-mono text-sm text-muted transition hover:bg-fg/5 hover:text-fg"
    >
      {short}
    </a>
  );
}
