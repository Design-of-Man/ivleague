"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/content/practice";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  const active = testimonials[index];

  return (
    <Section className="relative overflow-hidden border-y border-white/8 bg-ink-900/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(31,205,192,0.09),transparent_70%)]"
      />

      <div
        className="relative mx-auto max-w-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Reveal direction="none">
          <Eyebrow align="center">In their words</Eyebrow>
        </Reveal>

        <div className="relative mt-10 min-h-[19rem] sm:min-h-[16rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="flex gap-1"
                role="img"
                aria-label={`${active.rating} out of 5 stars`}
              >
                {Array.from({ length: active.rating }, (_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 text-teal-400"
                    aria-hidden="true"
                  >
                    <path d="M10 1.6l2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L10 14.3l-5 2.7 1.1-5.6L2 7.5l5.6-.7L10 1.6Z" />
                  </svg>
                ))}
              </div>

              <blockquote className="mt-7">
                <p className="font-display text-[clamp(1.35rem,1rem+1.7vw,2.1rem)] font-medium leading-[1.32] tracking-[-0.03em] text-ink-50">
                  &ldquo;{active.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-8 flex flex-col items-center gap-1">
                <span className="text-[13.5px] font-medium text-teal-300">
                  {active.name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
                  {active.detail}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-teal-400/40 hover:text-teal-300"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="group relative grid h-6 min-w-6 place-items-center px-1"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]",
                    i === index
                      ? "w-8 bg-teal-400"
                      : "w-1.5 bg-white/18 group-hover:bg-white/35",
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-teal-400/40 hover:text-teal-300"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </Section>
  );
}
