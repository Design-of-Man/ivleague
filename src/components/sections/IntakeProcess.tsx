"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { intakeSteps } from "@/content/practice";

/**
 * Scroll-linked intake timeline. A teal rail fills as the section scrolls,
 * with each step's node lighting up when its row crosses the viewport middle.
 */
export function IntakeProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 62%", "end 72%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const height = useTransform(fill, [0, 1], ["0%", "100%"]);

  return (
    <Section id="process" className="relative bg-ink-900/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dot-grid opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 100%)",
        }}
      />

      <SectionHeading
        eyebrow="How it works"
        title={
          <>
            The hard part isn&apos;t the infusion.
            <br />
            <span className="text-gradient">It&apos;s everything before it.</span>
          </>
        }
        lead="Orders, benefits, prior authorization, drug procurement, scheduling. Six steps, and five of them are ours."
      />

      <div ref={ref} className="relative mt-14 max-w-4xl">
        {/* Rail */}
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-2 hidden h-[calc(100%-3rem)] w-px bg-white/8 md:block"
        >
          <motion.div
            style={{ height }}
            className="w-px bg-gradient-to-b from-teal-300 via-teal-400 to-teal-600 shadow-[0_0_16px_rgba(31,205,192,0.7)]"
          />
        </div>

        <ol className="grid gap-3">
          {intakeSteps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05} as="li">
              <div className="group relative grid gap-5 md:grid-cols-[40px_1fr] md:gap-8">
                {/* Node */}
                <div className="relative hidden md:block">
                  <span className="sticky top-32 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink-950 font-mono text-[11px] font-medium text-ink-400 transition-all duration-500 group-hover:border-teal-400/60 group-hover:bg-teal-400/10 group-hover:text-teal-300">
                    {step.n}
                  </span>
                </div>

                <div className="card card-hover relative overflow-hidden p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 md:hidden">
                        <span className="font-mono text-[11px] text-teal-400">
                          {step.n}
                        </span>
                        <span className="h-px flex-1 bg-white/8" />
                      </div>
                      <h3 className="mt-2 text-[19px] font-semibold tracking-tight text-ink-50 md:mt-0 sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
                        {step.body}
                      </p>
                      <p className="mt-3 border-l-2 border-teal-400/35 pl-4 text-[13.5px] italic leading-relaxed text-ink-400">
                        {step.detail}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal delay={0.1} className="mt-12">
        <div className="flex flex-col items-start gap-4 rounded-[0.625rem] border border-teal-400/20 bg-teal-400/[0.05] p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-ink-50">
              Most patients are infusing within two to three weeks.
            </p>
            <p className="mt-1.5 text-[14px] text-ink-400">
              Start with a name and a diagnosis. We&apos;ll take it from there.
            </p>
          </div>
          <ButtonLink href="/contact#inquiry" size="lg" className="shrink-0">
            Start your inquiry
            <ArrowGlyph />
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
