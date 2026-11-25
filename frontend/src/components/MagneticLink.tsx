"use client";

import Link from "next/link";
import { useRef } from "react";

type Props = React.ComponentProps<typeof Link> & { variant?: "primary" | "ghost" };

const variants = {
  primary: "bg-accent text-accent-ink hover:bg-[color-mix(in_srgb,var(--accent)_86%,var(--fg))]",
  ghost: "border border-line bg-surface text-fg hover:border-accent",
};

/** A pill link that leans towards the cursor. */
export function MagneticLink({ variant = "primary", className = "", children, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    el.style.translate = `${(e.clientX - rect.left - rect.width / 2) * 0.25}px ${(e.clientY - rect.top - rect.height / 2) * 0.35}px`;
  }

  return (
    <Link
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current && (ref.current.style.translate = "")}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition-[translate,background-color,border-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
