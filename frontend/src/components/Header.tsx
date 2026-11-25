import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${lang}#story`, label: dict.nav.story, wide: true },
    { href: `/${lang}#projects`, label: dict.nav.projects, wide: false },
    { href: `/${lang}#services`, label: dict.nav.services, wide: true },
    { href: `/${lang}#contact`, label: dict.nav.contact, wide: false },
  ];

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line/60 bg-bg/70 backdrop-blur-md">
      <div className="wrap flex h-(--header-h) items-center justify-between gap-4">
        <Link href={`/${lang}`} className="font-mono text-[0.95rem] font-medium text-fg">
          jossa<span className="text-accent">_</span>dev
        </Link>
        <nav aria-label={dict.nav.projects} className="flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.wide ? "hidden sm:inline-block" : ""} rounded-lg px-2.5 py-1.5 text-[0.92rem] text-muted transition hover:bg-fg/5 hover:text-fg`}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitch lang={lang} label={dict.language.switchTo} short={dict.language.switchToShort} />
          <div className="ml-1.5">
            <ThemeToggle label={dict.theme.toggle} />
          </div>
        </nav>
      </div>
    </header>
  );
}
