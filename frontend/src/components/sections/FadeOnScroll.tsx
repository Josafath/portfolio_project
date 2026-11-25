"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Fades and lifts its content during the first ~500px of scroll. */
export function FadeOnScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0.15]);
  const y = useTransform(scrollY, [0, 500], [0, -60]);
  const reduced = useReducedMotion();
  return (
    <motion.div style={reduced ? undefined : { opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}
