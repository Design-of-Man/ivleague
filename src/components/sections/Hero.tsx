"use client";

import Link from "next/link";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/hooks";
import { Aurora, GridBackdrop, ParticleField, DripLine } from "@/components/ui/Backdrop";
import { DripChamber } from "@/components/ui/DripChamber";
import { site } from "@/content/site";
import { specialties } from "@/content/therapies";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden pt-32 pb-20 sm:pt-40 lg:min-h-dvh lg:pt-44 lg:pb-28">
      <Aurora intensity="medium" />
      <GridBackdrop className="hidden md:block" />
      <ParticleField className="opacity-70" />
      <DripLine count={4} className="hidden opacity-40 md:block" />

      {/* Bottom fade into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent"
      />

      <div className="shell-wide relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-20">
          {/* ------------------------------ Copy ------------------------------ */}
          <div className="flex flex-col items-start">
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-400/25 bg-teal-400/[0.07] py-1.5 pl-2 pr-4 backdrop-blur-sm"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-300" />
              </span>
              <span className="text-[12px] font-medium tracking-[0.02em] text-teal-100">
                Now accepting new patients
              </span>
              <span className="h-3 w-px bg-teal-400/25" />
              <span className="text-[12px] text-teal-300/70">
                {site.address.city}, {site.address.region}
              </span>
            </div>

            {/*
              The headline is the LCP element, so it is deliberately NOT
              animated: no entrance transform, no starting opacity of 0, no
              dependency on hydration. It is in the server HTML and paints on
              the first frame. Everything below it can afford to arrive late.
            */}
            <h1 className="mt-8 text-hero font-semibold leading-[0.92] tracking-[-0.045em]">
              Infusion care
              <br />
              <span className="text-gradient text-glow">without the hospital.</span>
            </h1>

            <div className="mt-8 max-w-xl">
              <p className="text-lead leading-relaxed text-ink-300">
                Biologics, IVIG and IV therapy in private suites, administered by
                nurses who know your name, with the insurance work finished before
                you ever sit down.
              </p>
            </div>

            <div className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/contact#inquiry" size="xl">
                  Become a patient
                  <ArrowGlyph />
                </ButtonLink>
                <ButtonLink href="/therapies" variant="secondary" size="xl">
                  Explore therapies
                </ButtonLink>
              </div>
            </div>

            <div className="mt-10 w-full">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-ink-400">
                {[
                  "Physician referral required",
                  "Most major plans accepted",
                  "Open 7 days a week",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3.5 w-3.5 text-teal-400"
                      aria-hidden="true"
                    >
                      <path
                        d="m3.5 8.4 3 3L12.5 5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ----------------------------- Visual ----------------------------- */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HeroConsole reduce={Boolean(reduce)} />
          </div>
        </div>

        {/* --------------------------- Specialty rail ------------------------ */}
        <Reveal delay={0.4} className="mt-20 lg:mt-28">
          <div className="flex flex-col gap-5 border-t border-white/8 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">
              Specialties on formulary
            </p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <Link
                  key={s.id}
                  href={`/therapies?specialty=${s.id}`}
                  className="group rounded-full border border-white/8 bg-white/[0.025] px-4 py-2 text-[13px] text-ink-300 transition-all duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-teal-400/35 hover:bg-teal-400/[0.07] hover:text-teal-200"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HERO CONSOLE                                 */
/* -------------------------------------------------------------------------- */

/**
 * Frame for the signature element. The drip chamber sits inside an instrument
 * panel rather than bleeding across the page — contained, so it reads as an
 * object under observation rather than decorative wallpaper. The readouts are
 * the argument the hero is making (short chair time, no wait, same nurse,
 * authorization already handled) stated as data instead of adjectives.
 */
function HeroConsole({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      {/* Halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_35%,rgba(31,205,192,0.16),transparent_62%)] blur-2xl"
      />

      <div className="card relative overflow-hidden rounded-[0.875rem] p-1.5">
        <div className="relative overflow-hidden rounded-[0.6rem] bg-gradient-to-b from-ink-850 to-ink-950">
          {/* Panel chrome */}
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(31,205,192,0.9)]" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-400">
                Suite 03 · Infusing
              </span>
            </div>
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-500">
              IVL / MIDLO
            </span>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-7">
            {/* Signature: macro drip chamber */}
            <div className="mx-auto sm:mx-0">
              <DripChamber className="h-60 sm:h-72" label="Live rate · 20 gtt/mL" />
            </div>

            {/* Readouts */}
            <div className="flex flex-col justify-between gap-5">
              <div className="grid gap-3">
                {[
                  { k: "Therapy", v: "Vedolizumab 300 mg" },
                  { k: "Rate", v: "300 mL / 30 min" },
                  { k: "Suite", v: "Private · heat + massage" },
                ].map((r) => (
                  <div
                    key={r.k}
                    className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2.5"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                      {r.k}
                    </span>
                    <span className="text-right text-[13px] font-medium text-ink-100">
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                    Progress
                  </span>
                  <span className="font-mono text-[11px] text-teal-300">68%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-teal-600 via-teal-400 to-teal-200"
                    style={{
                      width: "68%",
                      animation: reduce
                        ? undefined
                        : "console-fill 2.4s var(--ease-out-expo) 1s both",
                    }}
                  />
                </div>
                <p className="text-[11.5px] leading-relaxed text-ink-500">
                  Reported to the prescribing physician within 24 hours of every
                  visit.
                </p>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="grid grid-cols-3 divide-x divide-white/6 border-t border-white/6">
            {[
              { k: "Chair time", v: "30 min" },
              { k: "Wait today", v: "0 min" },
              { k: "Nurse", v: "Same RN" },
            ].map((s) => (
              <div key={s.k} className="px-4 py-3.5 text-center">
                <div className="text-[15px] font-semibold text-teal-200">{s.v}</div>
                <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-500">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chip */}
      <div
        className="absolute -bottom-8 -left-5 hidden rounded-[0.625rem] border border-white/10 bg-ink-900/92 px-4 py-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-400/12 text-teal-300">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path
                d="m3.5 8.4 3 3L12.5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <div className="text-[12.5px] font-medium text-ink-50">
              Prior auth approved
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
              36 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
