import type { Milestone } from "@/lib/api";
import type { Dictionary } from "@/i18n/dictionaries";

const sceneId = (index: number) => `m${index}`;

/** What the sticky stage prints under the year, e.g. "$ git checkout 2c22e25". */
function caption(milestone: Milestone) {
  return milestone.commit_hash
    ? { command: "$ git checkout", value: milestone.commit_hash }
    : { command: "$ git log --since", value: String(milestone.year) };
}

/**
 * Desktop: a sticky stage on the right where the particles form each chapter's year.
 * Phones: each chapter has its own slot at the top, and the particles fly from one to the next.
 */
export function Story({ milestones, dict }: { milestones: Milestone[]; dict: Dictionary }) {
  const ids = milestones.map((_, i) => sceneId(i));
  return (
    <section id="story" className="pt-[clamp(40px,8vw,96px)]">
      <div className="wrap grid gap-x-12 md:grid-cols-2">
        <div className="md:col-start-1">
          <p className="eyebrow">{dict.story.eyebrow}</p>
          <h2 className="mt-2.5 font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
            {dict.story.title}
          </h2>
        </div>

        <div
          aria-hidden="true"
          className="sticky top-[calc(var(--header-h)+12vh)] hidden h-[62vh] flex-col self-start md:col-start-2 md:row-span-2 md:row-start-1 md:flex"
        >
          <div data-scene-anchor={ids.join(" ")} data-scene-align="center" className="flex-1" />
          <div className="relative h-10">
            {milestones.map((milestone, i) => {
              const { command, value } = caption(milestone);
              return (
                <p key={ids[i]} data-scene-for={ids[i]} className="stage-caption absolute inset-x-0 text-center font-mono text-[0.82rem] text-muted">
                  {command} <span className="text-accent">{value}</span>
                </p>
              );
            })}
          </div>
        </div>

        <div className="md:col-start-1">
          {milestones.map((milestone, i) => (
            <article
              key={ids[i]}
              data-scene={ids[i]}
              data-scene-text={milestone.shape}
              className="chapter flex flex-col gap-3 py-[6vh] md:min-h-[78vh] md:justify-center md:py-0"
            >
              <div aria-hidden="true" data-scene-anchor={ids[i]} data-scene-align="left" className="h-[26vh] md:hidden" />
              <p className="flex flex-wrap gap-3 font-mono text-[0.8rem] text-muted tabular-nums">
                {milestone.commit_hash && <span className="text-accent">{milestone.commit_hash}</span>}
                <span>{milestone.date ?? milestone.year}</span>
                {milestone.repo && <span>{milestone.repo}</span>}
              </p>
              <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
                {milestone.title}
              </h3>
              <p className="max-w-[52ch] text-[1.05rem] text-muted">{milestone.body}</p>
              {milestone.commit_message && (
                <p className="commit font-mono text-[0.84rem] [overflow-wrap:anywhere]">&quot;{milestone.commit_message}&quot;</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {milestone.technologies.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
