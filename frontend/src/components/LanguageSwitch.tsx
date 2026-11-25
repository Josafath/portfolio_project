"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

export function LanguageSwitch({ lang, label, short }: { lang: Locale; label: string; short: string }) {
  const pathname = usePathname();
  const other: Locale = lang === "es" ? "en" : "es";
  const href = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  return (
    <Link
      href={href}
      hrefLang={other}
      aria-label={label}
      title={label}
      className="rounded-lg px-2.5 py-1.5 font-mono text-sm text-muted transition hover:bg-fg/5 hover:text-fg"
    >
      {short}
    </Link>
  );
}
