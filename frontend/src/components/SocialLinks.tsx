import type { SocialLink } from "@/lib/api";

const platformNames: Record<SocialLink["platform"], string> = {
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Web",
};

export function SocialLinks({ links, className = "" }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[0.9rem] transition hover:border-accent"
          >
            <span className="text-muted">{platformNames[link.platform]}</span>
            <span className="font-mono text-[0.82rem]">{link.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
