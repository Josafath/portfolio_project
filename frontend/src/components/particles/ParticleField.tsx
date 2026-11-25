"use client";

import { useEffect, useRef } from "react";
import { ParticleEngine } from "./engine";

/** Fixed full-screen canvas. Scenes are declared in the page with data-scene attributes (see engine.ts). */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const fontFamily = getComputedStyle(root).getPropertyValue("--font-bricolage").trim() || "sans-serif";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = new ParticleEngine(canvasRef.current!, { reduced, fontFamily });
    root.classList.add("fx");
    engine.syncScenes();
    engine.start();

    let cancelled = false;
    const timeout = new Promise((resolve) => setTimeout(resolve, 2000));
    Promise.race([document.fonts.load(`800 100px ${fontFamily}`), timeout])
      .catch(() => {})
      .then(() => {
        if (cancelled) return;
        engine.setReady();
        root.classList.add("fx-ready");
      });

    // Navigations and streamed content add or replace scenes
    let pending = 0;
    const pageObserver = new MutationObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => engine.syncScenes());
    });
    pageObserver.observe(document.body, { childList: true, subtree: true });

    // next-themes switches data-theme on <html>
    const themeObserver = new MutationObserver(() => engine.readColors());
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelled = true;
      cancelAnimationFrame(pending);
      pageObserver.disconnect();
      themeObserver.disconnect();
      engine.destroy();
      root.classList.remove("fx", "fx-ready");
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
