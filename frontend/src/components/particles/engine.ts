/**
 * Canvas particle engine. The page describes the scenes with data attributes:
 *
 *   <section data-scene="hero" data-scene-text="Josafath" data-scene-align="left">
 *     <div data-scene-anchor="hero" />        ← where the text forms (first visible one wins)
 *   </section>
 *   <section data-scene="projects" />          ← no text: particles drift freely
 *   <p data-scene-for="c1 c2">…</p>            ← gets data-active while c1 or c2 is active
 *
 * The active scene is the last zone whose top has passed 55% of the viewport.
 */

type Align = "left" | "center";
type Scene = { id: string; zone: HTMLElement; text: string | null; align: Align };
type Shape = { anchor: HTMLElement; points: [number, number][] };
type Particle = { x: number; y: number; vx: number; vy: number; rx: number; ry: number; has: boolean; k: number; hot: boolean };

const ACTIVE_LINE = 0.55;

export class ParticleEngine {
  private ctx: CanvasRenderingContext2D;
  private parts: Particle[] = [];
  private scenes = new Map<string, Scene>();
  private shapes = new Map<string, Shape | null>();
  private current: string | null | undefined;
  private marked: string | null | undefined;
  private anchor: HTMLElement | null = null;
  private width = 0;
  private height = 0;
  private count = 0;
  private size = 2;
  private glow = 0;
  private raf = 0;
  private ready = false;
  private mouse = { x: -1e4, y: -1e4, on: false };
  private colors = { base: "#000", hot: "#f80" };
  private resizeObserver: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private options: { reduced: boolean; fontFamily: string },
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not available");
    this.ctx = ctx;
    // An anchor changing size (layout shift, breakpoint) means its text must be sampled again
    this.resizeObserver = new ResizeObserver(() => this.invalidateShapes());
    this.readColors();
    this.resize();
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.onVisibility);
    if (!options.reduced) {
      window.addEventListener("pointermove", this.onPointerMove, { passive: true });
      window.addEventListener("pointerup", this.onPointerUp);
      window.addEventListener("pointerdown", this.onPointerDown);
      document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  start() {
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.stop();
    this.resizeObserver.disconnect();
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointerdown", this.onPointerDown);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
  }

  /** Call once the display font has loaded, so text is sampled with the real glyphs. */
  setReady() {
    this.ready = true;
    this.invalidateShapes();
  }

  readColors() {
    const styles = getComputedStyle(document.documentElement);
    this.colors = {
      base: styles.getPropertyValue("--particle").trim() || "#000",
      hot: styles.getPropertyValue("--particle-hot").trim() || "#f80",
    };
  }

  /** Re-reads the scenes from the DOM. Unchanged scenes keep their sampled shapes. */
  syncScenes() {
    const next = new Map<string, Scene>();
    document.querySelectorAll<HTMLElement>("[data-scene]").forEach((zone) => {
      const id = zone.dataset.scene!;
      const text = zone.dataset.sceneText ?? null;
      const align: Align = zone.dataset.sceneAlign === "center" ? "center" : "left";
      const previous = this.scenes.get(id);
      if (previous && previous.zone === zone && previous.text === text && previous.align === align) {
        next.set(id, previous);
      } else {
        next.set(id, { id, zone, text, align });
        this.shapes.delete(id);
      }
    });
    for (const id of this.scenes.keys()) if (!next.has(id)) this.shapes.delete(id);
    this.scenes = next;
    if (this.current && !next.has(this.current)) this.current = undefined;
    // New elements (after a navigation) don't have data-active yet
    this.marked = undefined;

    this.resizeObserver.disconnect();
    document.querySelectorAll("[data-scene-anchor]").forEach((anchor) => this.resizeObserver.observe(anchor));
  }

  private invalidateShapes = () => {
    this.shapes.clear();
    this.current = undefined;
  };

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const small = this.width < 760;
    this.size = small ? 1.6 : 2;
    const count = small ? 1100 : 2400;
    if (count !== this.count) {
      this.count = count;
      this.parts = Array.from({ length: count }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: 0, vy: 0, rx: 0, ry: 0, has: false,
        k: 0.018 + Math.random() * 0.04,
        hot: Math.random() < 0.1,
      }));
    }
    this.invalidateShapes();
  };

  private pickScene(): string | null {
    const line = this.height * ACTIVE_LINE;
    let best: string | null = null;
    let bestTop = -Infinity;
    for (const scene of this.scenes.values()) {
      const rect = scene.zone.getBoundingClientRect();
      if (rect.height === 0) continue;
      if (rect.top < line && rect.top > bestTop) {
        best = scene.id;
        bestTop = rect.top;
      }
    }
    return best;
  }

  private markActive(id: string | null) {
    document.documentElement.dataset.activeScene = id ?? "";
    document.querySelectorAll<HTMLElement>("[data-scene], [data-scene-for]").forEach((el) => {
      const ids = (el.dataset.sceneFor ?? el.dataset.scene ?? "").split(" ");
      el.toggleAttribute("data-active", id !== null && ids.includes(id));
    });
  }

  private shapeFor(scene: Scene): Shape | null {
    if (this.shapes.has(scene.id)) return this.shapes.get(scene.id)!;
    let shape: Shape | null = null;
    if (scene.text) {
      const anchor = [...document.querySelectorAll<HTMLElement>(`[data-scene-anchor~="${scene.id}"]`)].find(
        (el) => el.offsetWidth > 0 && el.offsetHeight > 0,
      );
      if (anchor) {
        // An anchor can override the alignment, e.g. centered on desktop, left on phones
        const align: Align = (anchor.dataset.sceneAlign as Align | undefined) ?? scene.align;
        shape = { anchor, points: this.sample(scene.text, anchor.offsetWidth, anchor.offsetHeight, align) };
      }
    }
    this.shapes.set(scene.id, shape);
    return shape;
  }

  // Rasterizes the text off-screen and samples an even grid of points, about one per particle
  private sample(text: string, w: number, h: number, align: Align): [number, number][] {
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    const font = this.options.fontFamily;
    o.font = `800 100px ${font}`;
    const measured = o.measureText(text).width || 1;
    const size = Math.min(h * 0.95, (100 * w * 0.97) / measured);
    o.font = `800 ${size}px ${font}`;
    o.textBaseline = "middle";
    o.textAlign = align;
    o.fillText(text, align === "center" ? w / 2 : 0, h / 2);
    const data = o.getImageData(0, 0, w, h).data;
    const filled = (x: number, y: number) => data[((y | 0) * w + (x | 0)) * 4 + 3] > 140;

    let area = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (filled(x, y)) area++;
    const step = Math.max(1.5, 2 * Math.sqrt(area / this.count));
    const points: [number, number][] = [];
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (filled(x, y)) points.push([x, y]);
    for (let i = points.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [points[i], points[j]] = [points[j], points[i]];
    }
    return points;
  }

  private assign(id: string | null) {
    this.current = id;
    const scene = id ? this.scenes.get(id) : undefined;
    const shape = scene ? this.shapeFor(scene) : null;
    this.anchor = shape?.anchor ?? null;
    this.parts.forEach((p, i) => {
      if (!shape || shape.points.length === 0) {
        // Leaving a shape: scatter outwards, then drift
        if (p.has && !this.options.reduced) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          p.vx += Math.cos(angle) * speed;
          p.vy += Math.sin(angle) * speed;
        }
        p.has = false;
        return;
      }
      const extra = i >= shape.points.length;
      const [x, y] = shape.points[i % shape.points.length];
      p.rx = x + (extra ? (Math.random() - 0.5) * 3 : 0);
      p.ry = y + (extra ? (Math.random() - 0.5) * 3 : 0);
      p.has = true;
    });
  }

  private step(ax: number, ay: number) {
    const reduced = this.options.reduced;
    const radius = this.width < 760 ? 60 : 95;
    for (const p of this.parts) {
      if (p.has) {
        const tx = ax + p.rx;
        const ty = ay + p.ry;
        if (reduced) {
          p.x = tx;
          p.y = ty;
          continue;
        }
        p.vx = (p.vx + (tx - p.x) * p.k) * 0.86;
        p.vy = (p.vy + (ty - p.y) * p.k) * 0.86;
      } else {
        if (reduced) continue;
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
        if (Math.hypot(p.vx, p.vy) > 0.45) {
          p.vx *= 0.965;
          p.vy *= 0.965;
        }
        if (p.x < -20) p.x = this.width + 20;
        else if (p.x > this.width + 20) p.x = -20;
        if (p.y < -20) p.y = this.height + 20;
        else if (p.y > this.height + 20) p.y = -20;
      }
      if (this.mouse.on) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        if (dx * dx + dy * dy < radius * radius) {
          const d = Math.hypot(dx, dy) || 1;
          const force = (1 - d / radius) * 3.4;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  private draw() {
    const { ctx, size } = this;
    const half = size / 2;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = this.glow * 0.9;
    ctx.fillStyle = this.colors.base;
    for (const p of this.parts) if (!p.hot) ctx.fillRect(p.x - half, p.y - half, size, size);
    ctx.globalAlpha = Math.min(1, this.glow * 1.1);
    ctx.fillStyle = this.colors.hot;
    for (const p of this.parts) if (p.hot) ctx.fillRect(p.x - half, p.y - half, size, size);
    ctx.globalAlpha = 1;
  }

  private frame = () => {
    const id = this.pickScene();
    if (id !== this.marked) {
      this.marked = id;
      this.markActive(id);
    }
    if (this.ready && id !== this.current) this.assign(id);
    if (this.ready) {
      const rect = this.anchor?.getBoundingClientRect();
      const target = this.anchor ? 1 : 0.28;
      this.glow += (target - this.glow) * (this.options.reduced ? 1 : 0.05);
      this.step(rect?.left ?? 0, rect?.top ?? 0);
      this.draw();
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private onVisibility = () => (document.hidden ? this.stop() : this.start());

  private onPointerMove = (e: PointerEvent) => {
    this.mouse = { x: e.clientX, y: e.clientY, on: true };
  };

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") this.mouse.on = false;
  };

  private onPointerLeave = () => {
    this.mouse.on = false;
  };

  // A click on empty space pushes nearby particles away like a shockwave
  private onPointerDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("a, button, input, textarea, select, label, [data-no-burst]")) return;
    for (const p of this.parts) {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 240) {
        const force = (1 - d / 240) * 22;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    }
  };
}
