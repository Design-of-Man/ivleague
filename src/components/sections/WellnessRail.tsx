import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { featuredWellness, accentMap } from "@/content/wellness";
import { cn } from "@/lib/utils";

export function WellnessRail() {
  const drips = featuredWellness();

  return (
    <Section className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(31,205,192,0.07),transparent_70%)]"
      />

      <SectionHeading
        eyebrow="Wellness & regenerative"
        title={
          <>
            The same clinical standard,
            <br />
            <span className="text-gradient">applied to feeling good.</span>
          </>
        }
        lead="Hydration, vitamin and nutrient therapy administered by the same nurses, in the same suites, under the same protocols as our specialty care. Screened by a clinician, never a vending machine."
        action={
          <ButtonLink href="/wellness" variant="secondary">
            Full drip menu
            <ArrowGlyph />
          </ButtonLink>
        }
      />

      <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
        {drips.map((d) => {
          const a = accentMap[d.accent];
          return (
            <StaggerItem key={d.slug}>
              <Link
                href={`/wellness#${d.slug}`}
                className={cn(
                  "group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[0.625rem] border border-white/8 p-7 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-white/16",
                  "bg-gradient-to-br",
                  a.from,
                  a.to,
                )}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/[0.06] blur-3xl transition-opacity duration-500 group-hover:opacity-160"
                />
                <div className="relative">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset",
                      a.ring,
                      a.text,
                    )}
                  >
                    {d.duration}
                  </span>
                  <h3 className="mt-5 font-display text-[22px] font-semibold tracking-tight text-ink-50">
                    {d.name}
                  </h3>
                  <p className={cn("mt-1.5 text-[13.5px] font-medium", a.text)}>
                    {d.tagline}
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-300">
                    {d.bestFor}
                  </p>
                </div>

                <div className="relative flex flex-wrap gap-1.5">
                  {d.ingredients.slice(0, 4).map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-white/10 bg-ink-950/40 px-2.5 py-1 text-[11px] text-ink-300 backdrop-blur-sm"
                    >
                      {ing.split("(")[0].trim()}
                    </span>
                  ))}
                  {d.ingredients.length > 4 && (
                    <span className="rounded-full border border-white/10 bg-ink-950/40 px-2.5 py-1 text-[11px] text-ink-400">
                      +{d.ingredients.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
