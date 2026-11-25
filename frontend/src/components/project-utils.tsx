import type { Dictionary } from "@/i18n/dictionaries";
import type { Project } from "@/lib/api";

/** "https://github.com/Josafath/Login-Python" -> "Login-Python" */
export function repoPath(url: string) {
  return url.replace(/\/$/, "").split("/").pop() ?? url;
}

/** "2021 → 2026", from the first and last version years. */
export function yearSpan(project: Project) {
  const years = project.versions.map((v) => v.year).filter((year): year is number => year !== null);
  const first = years[0] ?? project.started_year;
  const last = years.at(-1);
  return last && last !== first ? `${first} → ${last}` : String(first);
}

export function ProjectLinks({ project, dict, className = "" }: { project: Project; dict: Dictionary; className?: string }) {
  const link = "font-mono text-[0.8rem] text-muted underline-offset-4 transition hover:text-accent hover:underline";
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className={link}>
        {dict.projects.repo} ↗
      </a>
      {project.live_url && (
        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={link}>
          {dict.projects.live} ↗
        </a>
      )}
    </div>
  );
}
