"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1900,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  // Local observer rather than motion's useInView, so a stat band doesn't pull
  // the animation runtime into a route that needs nothing else from it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  // With reduced motion the number is simply shown at its final value —
  // no effect needed, and nothing to animate.
  const shown = reduce ? value : display;

  const rendered =
    value >= 1000
      ? Math.round(shown).toLocaleString("en-US")
      : Number.isInteger(value)
        ? Math.round(shown).toString()
        : shown.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{rendered}</span>
      {suffix}
    </span>
  );
}
