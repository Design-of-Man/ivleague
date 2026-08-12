import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Bits";
import { featuredTherapies, specialtyById } from "@/content/therapies";

/**
 * Horizontally scrollable rail of headline therapies. Snap points on mobile,
 * a normal grid conversation on desktop.
 */
export function TherapyRail() {
  const items = featuredTherapies();

  return (
    <Section className="relative" bleed>
      <div className="shell">
        <SectionHeading
          eyebrow="Formulary"
          title="Therapies patients ask for by name"
          lead="Thirty-plus specialty medications on formulary, from thirty-minute biologics to five-hour immune globulin. Every one ordered by your physician and sourced from U.S. pharmacies."
          action={
            <ButtonLink href="/therapies" variant="secondary">
              All therapies
              <ArrowGlyph />
            </ButtonLink>
          }
        />
      </div>

      <Reveal delay={0.1} className="mt-14">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(2.5rem,calc((100vw-78rem)/2+2.5rem))]">
          {items.map((t) => {
            const sp = specialtyById(t.specialty);
            return (
              <Link
                key={t.slug}
                href={`/therapies/${t.slug}`}
                className="group card card-hover relative flex w-[19rem] shrink-0 snap-start flex-col justify-between gap-8 overflow-hidden p-6 sm:w-[21rem] sm:p-7"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(31,205,192,0.14),transparent_65%)] opacity-0 blur-2xl transition-opacity duration-600 group-hover:opacity-100"
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="neutral" size="sm">
                      {sp.label}
                    </Badge>
                    {t.onCurrentSite && (
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-brand-500/70">
                        On formulary
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-brand-100">
                    {t.brand}
                  </h3>
                  <p className="mt-1 font-mono text-[11.5px] lowercase tracking-wide text-ink-500">
                    {t.generic}
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-400">
                    {t.summary}
                  </p>
                </div>

                <div className="relative">
                  <dl className="grid gap-2 border-t border-white/6 pt-4 text-[12.5px]">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-ink-500">Chair time</dt>
                      <dd className="text-right text-ink-200">
                        {t.duration.replace(
                          /^(About|Approximately|At least|Usually around)\s/i,
                          "~",
                        )}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-ink-500">Cadence</dt>
                      <dd className="max-w-[60%] text-right text-ink-200">
                        {t.frequency.split("(")[0].trim()}
                      </dd>
                    </div>
                  </dl>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-300">
                    Therapy detail
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3.5 w-3.5 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Tail card */}
          <Link
            href="/therapies"
            className="group flex w-[16rem] shrink-0 snap-start flex-col items-start justify-center gap-4 rounded-[0.625rem] border border-dashed border-white/12 p-7 transition-colors duration-400 hover:border-brand-400/40 hover:bg-brand-400/[0.04]"
          >
            <span className="font-display text-2xl font-semibold tracking-tight text-ink-200 transition-colors group-hover:text-brand-100">
              See all 30+
            </span>
            <span className="text-[13.5px] leading-relaxed text-ink-500">
              Filter by specialty, search by brand or generic name.
            </span>
            <ArrowGlyph className="text-brand-400" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
