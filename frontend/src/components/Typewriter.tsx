"use client";

import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Types and deletes each phrase in turn. The first phrase is rendered on the server. */
export function Typewriter({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    let alive = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      let index = 0;
      let shown = phrases[0];
      await sleep(2800);
      while (alive) {
        index = (index + 1) % phrases.length;
        if (reduced) {
          setText(phrases[index]);
          await sleep(3200);
          continue;
        }
        while (alive && shown.length) {
          shown = shown.slice(0, -1);
          setText(shown);
          await sleep(26);
        }
        await sleep(180);
        for (const char of phrases[index]) {
          if (!alive) return;
          shown += char;
          setText(shown);
          await sleep(50 + Math.random() * 40);
        }
        await sleep(2400);
      }
    })();
    return () => {
      alive = false;
    };
  }, [phrases]);

  return (
    <>
      <span className="font-semibold text-fg">{text}</span>
      <span className="caret" aria-hidden="true" />
    </>
  );
}
