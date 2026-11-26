import type { Dictionary } from "@/i18n/dictionaries";
import { CRN_SITE_URL } from "@/lib/site";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="wrap flex flex-wrap justify-between gap-3 pt-7 pb-9 text-[0.88rem] text-muted">
        <span>Josafath Cerón · {dict.footer.built}</span>
        <a href={CRN_SITE_URL} target="_blank" rel="noopener" className="group">
          {dict.footer.crn}: <span className="font-mono text-[0.82rem] text-fg transition-colors group-hover:text-accent">josafath.crn ↗</span>
        </a>
        <a
          href="https://github.com/Josafath/portfolio_project"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.82rem] hover:text-accent"
        >
          {dict.footer.source} ↗
        </a>
      </div>
    </footer>
  );
}
