"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { ViewTransition, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Project } from "@/lib/api";
import { useMediaQuery } from "@/lib/hooks";
import { ProjectLinks, repoPath, yearSpan } from "../project-utils";

/**
 * Wide screens: the section is pinned and vertical scroll moves the cards sideways.
 * Phones and reduced motion: a plain grid.
 */
export function ProjectsGallery({ projects, lang, dict }: { projects: Project[]; lang: Locale; dict: Dictionary }) {
  const pinned = useMediaQuery("(min-width: 760px) and (prefers-reduced-motion: no-preference)");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ distance: 0, viewport: 0 });

  useEffect(() => {
    if (!pinned) return;
    const measure = () =>
      setSize({ distance: Math.max(0, trackRef.current!.scrollWidth - window.innerWidth), viewport: window.innerWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current!);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -size.distance]);

  const head = (
    <div className="wrap">
      <p className="eyebrow">{dict.projects.eyebrow}</p>
      <h2 className="mt-2.5 font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
        {dict.projects.title}
      </h2>
      <p className="mt-3 max-w-[60ch] text-muted">{dict.projects.lede}</p>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-scene="projects"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${size.distance}px)` } : undefined}
    >
      {pinned ? (
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden pt-(--header-h)">
          {head}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex w-max gap-7 pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,calc((100vw-1120px)/2+16px))]"
          >
            {projects.map((project) => (
              <PinnedCard key={project.slug} project={project} lang={lang} dict={dict} x={x} viewport={size.viewport} />
            ))}
          </motion.div>
          <div className="wrap">
            <div className="h-0.5 overflow-hidden rounded bg-line">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-accent" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 py-[clamp(48px,8vw,96px)]">
          {head}
          <div className="wrap grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** A card that turns and shrinks as it moves away from the center of the screen. */
function PinnedCard({ x, viewport, ...props }: CardProps & { x: MotionValue<number>; viewport: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const center = useMotionValue(0);
  const width = useMotionValue(viewport);
  useEffect(() => {
    const el = ref.current!;
    center.set(el.offsetLeft + el.offsetWidth / 2);
    width.set(viewport);
  }, [viewport, center, width]);

  // -1 (far left) … 0 (centered) … 1 (far right)
  const offset = useTransform([x, center, width], ([latestX, c, w]: number[]) =>
    Math.max(-1, Math.min(1, (c + latestX - w / 2) / (w || 1))),
  );
  const rotateY = useTransform(offset, (o) => o * -16);
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * 0.1);
  const opacity = useTransform(offset, (o) => 1 - Math.abs(o) * 0.45);

  return (
    <motion.div ref={ref} style={{ rotateY, scale, opacity, transformPerspective: 1100 }} className="w-[min(400px,70vw)] shrink-0">
      <ProjectCard {...props} />
    </motion.div>
  );
}

type CardProps = { project: Project; lang: Locale; dict: Dictionary };

function ProjectCard({ project, lang, dict }: CardProps) {
  const ref = useRef<HTMLElement>(null);
  const highlight = project.improvements[0];

  // Light that follows the cursor, and a slight tilt towards it
  function move(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 9}deg)`;
  }

  return (
    <article
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current && (ref.current.style.transform = "")}
      data-no-burst
      className="spotlight relative flex h-full flex-col gap-3.5 overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card backdrop-blur-sm transition-[transform,border-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))]"
    >
      <div className="flex justify-between gap-3 font-mono text-[0.78rem] text-muted">
        <span>~/{repoPath(project.repo_url)}</span>
        <span className="tabular-nums">{yearSpan(project)}</span>
      </div>
      <ViewTransition name={`project-${project.slug}`}>
        <h3 className="font-display text-2xl leading-tight font-semibold">
          <Link href={`/${lang}/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.name}
          </Link>
        </h3>
      </ViewTransition>
      <p className="text-[0.96rem] text-muted">{project.tagline}</p>
      {highlight && (
        <div className="rounded-xl bg-fg/5 p-3.5 font-mono text-[0.78rem] leading-relaxed">
          <p className="text-muted">{highlight.aspect}</p>
          <p className="text-muted line-through decoration-muted/60">{highlight.before}</p>
          <p>
            <span className="text-accent">→ </span>
            {highlight.after}
          </p>
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="tag">{tech}</span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[0.8rem] text-accent">{dict.projects.details} →</span>
        <ProjectLinks project={project} dict={dict} className="relative z-10" />
      </div>
    </article>
  );
}
