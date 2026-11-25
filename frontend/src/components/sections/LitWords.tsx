"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/** Lights up word by word as the paragraph scrolls into view. `highlight` ends up in the accent color. */
export function LitWords({ text, highlight, className }: { text: string; highlight: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          {reduced ? (
            <span className={word === highlight ? "text-accent" : undefined}>{word}</span>
          ) : (
            <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={word === highlight}>
              {word}
            </Word>
          )}
        </span>
      ))}
    </p>
  );
}

function Word({
  progress,
  range,
  accent,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-accent" : undefined}>
      {children}
    </motion.span>
  );
}
