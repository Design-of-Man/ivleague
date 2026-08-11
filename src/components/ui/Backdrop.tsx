"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Layered teal aurora. Three blurred radial blobs on long, offset drift
 * animations — cheap enough to run behind a whole page, and it reads as
 * depth rather than as an effect.
 */
export function Aurora({
  className,
  intensity = "medium",
}: {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}) {
  const opacity = { subtle: "opacity-40", medium: "opacity-70", strong: "opacity-100" }[
    intensity
  ];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        opacity,
        className,
      )}
      aria-hidden="true"
    >
      {/*
        No `blur` filter here. A radial gradient is already soft, and stacking a
        64px Gaussian on a 52rem element forces a large offscreen filter pass on
        every frame of the drift animation — which on a throttled mobile CPU
        landed directly in the hero's LCP render delay. The gradient stops do
        the same job for free.
      */}
      <div className="absolute -top-[28%] left-[8%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,rgba(31,205,192,0.22),transparent_65%)] animate-[drift_24s_var(--ease-in-out-quint)_infinite]" />
      <div className="absolute -right-[14%] top-[6%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(11,178,166,0.18),transparent_67%)] animate-[drift_38s_var(--ease-in-out-quint)_infinite_reverse]" />
      <div className="absolute bottom-[-24%] left-[26%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(79,227,215,0.13),transparent_68%)] animate-[drift_31s_var(--ease-in-out-quint)_infinite]" />
    </div>
  );
}

/** Fine engineering grid with a radial mask — the "technical" ground plane. */
export function GridBackdrop({
  className,
  fade = "center",
}: {
  className?: string;
  fade?: "center" | "top" | "bottom";
}) {
  const maskStyle =
    fade === "center"
      ? "radial-gradient(ellipse 78% 62% at 50% 42%, black 20%, transparent 100%)"
      : fade === "top"
        ? "linear-gradient(to bottom, black 0%, transparent 78%)"
        : "linear-gradient(to top, black 0%, transparent 78%)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 grid-lines", className)}
      style={{ maskImage: maskStyle, WebkitMaskImage: maskStyle }}
    />
  );
}

/**
 * A slow vertical "drip" of light along a hairline — the site's signature
 * ambient motif. Rendered as a masked gradient bar, not a canvas.
 */
export function DripLine({
  className,
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
          style={{ left: `${(100 / (count + 1)) * (i + 1)}%` }}
        >
          <div
            className="absolute h-16 w-px bg-gradient-to-b from-transparent via-teal-400/80 to-transparent blur-[0.5px] animate-[scan_7s_linear_infinite]"
            style={{ animationDelay: `${i * 2.3}s` }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Particle field of slow-rising "micro-droplets". Canvas keeps it to one
 * composited layer; it pauses when off-screen and never runs under
 * prefers-reduced-motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    // Purely decorative, and the most expensive thing in the hero on a phone.
    // Coarse pointers and small viewports skip it entirely.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768
    ) {
      return;
    }
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; v: number; a: number; drift: number };
    let parts: P[] = [];

    const seed = () => {
      const count = Math.min(64, Math.round((w * h) / 26000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.7,
        v: 0.08 + Math.random() * 0.32,
        a: 0.06 + Math.random() * 0.34,
        drift: (Math.random() - 0.5) * 0.16,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.v;
        p.x += p.drift;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 227, 215, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) {
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );

    resize();
    window.addEventListener("resize", resize);
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}

/** Soft top-edge glow used at the seam between dark sections. */
export function EdgeGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/45 to-transparent",
        className,
      )}
    />
  );
}
