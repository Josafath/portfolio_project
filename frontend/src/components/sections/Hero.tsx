import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowIcon, MagneticLink } from "../MagneticLink";
import { Typewriter } from "../Typewriter";
import { FadeOnScroll } from "./FadeOnScroll";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section id="top" data-scene="hero" data-scene-text="Josafath" className="pt-[clamp(40px,8vw,88px)] pb-[clamp(48px,7vw,80px)]">
      <div className="wrap">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.78rem] tracking-wide text-muted">
          <span className="pulse-dot size-[7px] rounded-full bg-accent" />
          {t.pill}
        </span>

        <div data-scene-anchor="hero" className="mt-4 flex h-[clamp(140px,24vw,320px)] items-center">
          <h1 className="particle-text font-display text-[clamp(3.5rem,19vw,17rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap transition-colors duration-[900ms]">
            Josafath<span className="sr-only"> Cerón</span>
          </h1>
        </div>

        <FadeOnScroll className="mt-6 grid items-end gap-6 md:grid-cols-[1.3fr_1fr] md:gap-8">
          <div>
            <p className="min-h-[2.5em] font-display text-[clamp(1.3rem,3.2vw,2rem)] leading-tight text-muted">
              {t.rolePrefix}
              <br />
              <Typewriter phrases={t.roles} />
            </p>
            <p className="mt-3.5 max-w-[56ch] text-muted">{t.lede}</p>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap gap-3">
              <MagneticLink href={`/${lang}#projects`}>
                {t.ctaProjects}
                <ArrowIcon />
              </MagneticLink>
              <MagneticLink href={`/${lang}#contact`} variant="ghost">
                {t.ctaIdea}
              </MagneticLink>
            </div>
            <a href="#story" className="inline-flex items-center gap-3 font-mono text-[0.76rem] tracking-wide text-muted">
              <span className="cue-line relative h-9 w-px overflow-hidden bg-line" />
              {t.cue}
            </a>
          </div>
        </FadeOnScroll>
      </div>
    </section>
  );
}
