import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Service, SocialLink } from "@/lib/api";
import { SocialLinks } from "../SocialLinks";
import { ContactForm } from "./ContactForm";
import { LitWords } from "./LitWords";

export function Contact({
  services,
  socials,
  lang,
  dict,
}: {
  services: Service[];
  socials: SocialLink[];
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <section id="contact" data-scene="contact" className="pt-[clamp(64px,10vw,128px)] pb-[clamp(56px,8vw,96px)]">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow">{dict.contact.eyebrow}</p>
          <LitWords
            text={dict.contact.big}
            highlight={dict.contact.highlight}
            className="mt-4 max-w-[16ch] font-display text-[clamp(2rem,5.6vw,4.4rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance"
          />
          <p className="mt-10 font-mono text-[0.78rem] text-muted">{dict.contact.or}</p>
          <SocialLinks links={socials.filter((link) => link.category === "dev")} className="mt-3" />
        </div>
        <ContactForm services={services} lang={lang} dict={dict} />
      </div>
    </section>
  );
}
