import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/content/practice";
import { EdgeGlow } from "@/components/ui/Backdrop";

export function WhyIVL() {
  return (
    <Section className="relative border-y border-white/8 bg-ink-900/40">
      <EdgeGlow />

      <SectionHeading
        eyebrow="Why IV League"
        title={
          <>
            Same drug. Same standard.
            <br />
            <span className="text-gradient">A completely different day.</span>
          </>
        }
        lead="There are bigger infusion networks. There is not a more accountable one within an hour of Delray Beach."
      />

      <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
        {differentiators.map((d) => (
          <StaggerItem key={d.title}>
            <div className="group relative h-full bg-ink-950 p-7 transition-colors duration-500 hover:bg-ink-900 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(31,205,192,0.1),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-teal-400">
                  {d.stat}
                </span>
                <h3 className="mt-4 text-[18px] font-semibold leading-snug tracking-tight text-ink-50">
                  {d.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-400">
                  {d.body}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.12} className="mt-12">
        <blockquote className="relative mx-auto max-w-3xl text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-6 h-px w-24 rule-teal"
          />
          <p className="font-display text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-medium leading-snug tracking-tight text-ink-100">
            &ldquo;We administer all intravenous therapies and injections
            safely, in accordance with the highest standards of care and
            protocols, using only high-quality pharmaceuticals from U.S.
            pharmacies that adhere to strict FDA and USP guidelines.&rdquo;
          </p>
          <footer className="mt-5 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-500">
            IV League Infusion Services
          </footer>
        </blockquote>
      </Reveal>
    </Section>
  );
}
