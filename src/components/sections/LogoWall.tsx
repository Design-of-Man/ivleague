import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { payers, PayerLogo } from "@/components/ui/PayerLogos";
import { cn } from "@/lib/utils";

/**
 * The payer wall. Every logo is monochrome until you touch it — the whole grid
 * desaturates to one grey and lights up in brand colour on hover, which reads
 * as a curated set rather than a pile of clip art.
 */
export function LogoWall({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Section
      className={cn("relative border-y border-white/8 bg-ink-900/30", className)}
      tight={compact}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_0%,rgba(31,205,192,0.06),transparent_70%)]"
      />

      <SectionHeading
        eyebrow="Accepted here"
        title={
          <>
            Twelve ways to pay,
            <br />
            <span className="text-gradient">and we chase all of them.</span>
          </>
        }
        lead="Most major commercial plans, Medicare and Medicaid — plus HSA cards at the time of infusion and Cherry payment plans. We verify your benefits before anything is scheduled."
        action={
          <ButtonLink href="/insurance" variant="secondary">
            Insurance details
            <ArrowGlyph />
          </ButtonLink>
        }
      />

      <Stagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/6 sm:grid-cols-3 lg:grid-cols-4">
        {payers.map((p) => (
          <StaggerItem key={p.id}>
            <div className="group/wall relative flex h-full items-center justify-center bg-ink-950 px-5 py-8 transition-colors duration-500 hover:bg-ink-900">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/wall:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${p.color}22, transparent 70%)`,
                }}
              />
              <PayerLogo payer={p} className="relative" />
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <p className="mt-8 text-[12.5px] leading-relaxed text-ink-500">
          Network participation varies by plan, product line and employer group. Contact
          us to confirm your specific plan before scheduling. Carrier names and marks
          belong to their respective owners and are shown to indicate accepted coverage.
        </p>
      </Reveal>
    </Section>
  );
}

/** Single-line scrolling variant for the footer and tighter placements. */
export function LogoMarquee({
  className,
  speed = 60,
}: {
  className?: string;
  speed?: number;
}) {
  return (
    <Marquee speed={speed} className={className}>
      {payers.map((p) => (
        <span
          key={p.id}
          // No wrapper opacity: the mark is already muted by its own grayscale
          // filter, and dimming the whole lockup dropped the wordmark to 4.3:1.
          className="group/wall inline-flex shrink-0 items-center px-7"
        >
          <PayerLogo payer={p} />
        </span>
      ))}
    </Marquee>
  );
}
