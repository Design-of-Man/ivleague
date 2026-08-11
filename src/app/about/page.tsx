import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Stats } from "@/components/sections/Stats";
import { WhyIVL } from "@/components/sections/WhyIVL";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { aboutPillars, milestones } from "@/content/practice";
import { site } from "@/content/site";

export const metadata = buildMetadata({
  title: "About IV League Infusions",
  description:
    "A locally owned outpatient infusion center in Midlothian, Virginia, caring for adult patients with complex chronic conditions — plus wellness and regenerative infusions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />

      <PageHeader
        eyebrow="About"
        title={
          <>
            A local infusion center,
            <br />
            <span className="text-gradient">on purpose.</span>
          </>
        }
        lead="IV League Infusions cares for patients requiring initial or ongoing infusions or injections while relaxing in comfort during treatment. We treat adult patients with complex chronic conditions — Crohn's disease, rheumatoid arthritis, multiple sclerosis, immune system disorders and many others — and administer wellness and regenerative infusions to help promote a healthy lifestyle."
        trail={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        size="lg"
      />

      <Stats />

      {/* ----------------------------- Manifesto ----------------------------- */}
      <Section tight>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Why we exist"
            title={
              <>
                Nobody skips a biologic
                <br />
                <span className="text-gradient">because they don&apos;t want it.</span>
              </>
            }
            size="sm"
          />

          <div className="prose-iv max-w-none">
            <p>
              They skip it because the hospital appointment costs a full day of work.
              Because the coinsurance on a facility-fee bill is four figures. Because the
              prior authorization expired and nobody noticed until they showed up.
              Because the person who called them last month is gone and the new one
              doesn&apos;t know their history.
            </p>
            <p>
              Every one of those is a logistics problem wearing a clinical costume. IV
              League was built to solve the logistics — so that the clinical part, the
              part that actually works, gets to happen on schedule.
            </p>
            <p>
              That&apos;s the whole thesis. A small center, run locally, with a formulary
              broad enough that most patients never need a second site of care, and a
              team small enough that you get the same nurses every visit. We answer our
              own phone. We chase our own authorizations. And we tell you what
              you&apos;ll owe before you sit down.
            </p>
          </div>
        </div>

        <Stagger className="mt-16 grid gap-4 md:grid-cols-3">
          {aboutPillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className="card h-full p-8">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-50">
                  {p.title}
                </h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-400">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ------------------------------ Timeline ----------------------------- */}
      <Section className="border-y border-white/8 bg-ink-900/40" tight>
        <SectionHeading
          eyebrow="How we got here"
          title="A short history"
          lead="No private equity, no roll-up, no national brand guidelines. Just a center that grew as its referring physicians asked it to."
        />

        <ol className="mt-14 grid gap-0">
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.06} as="li">
              <div className="group grid gap-4 border-t border-white/8 py-8 sm:grid-cols-[8rem_1fr] sm:gap-10 last:border-b">
                <span className="font-mono text-[13px] font-medium text-teal-400">
                  {m.year}
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold tracking-tight text-ink-50">
                    {m.title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-400">
                    {m.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <WhyIVL />

      {/* -------------------------------- Team ------------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="The team"
          title={
            <>
              You&apos;ll meet the same
              <br />
              <span className="text-gradient">handful of people.</span>
            </>
          }
          lead="Continuity is the whole point. Our nurses learn which arm works, which premedication you tolerate, and what your kids are named — and that knowledge stays in the building."
        />

        <Reveal className="mt-12">
          <div className="rounded-[0.625rem] border border-white/8 bg-white/[0.02] p-8 sm:p-10">
            <p className="max-w-3xl text-[15px] leading-relaxed text-ink-300">
              Our infusions are administered by licensed registered nurses experienced in
              infusion therapy, working under orders written by your prescribing
              physician, with emergency protocols and equipment on site. Staff bios and
              photographs are being finalized and will appear here.
            </p>
            <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500">
              Team profiles pending
            </p>
          </div>
        </Reveal>
      </Section>

      <Testimonials />

      <CtaBand
        eyebrow="Come find out"
        title={
          <>
            The difference is boring
            <br />
            <span className="text-gradient">and it&apos;s everything.</span>
          </>
        }
        body={`Call ${site.contact.phone} and someone who works here will answer. That's the whole pitch.`}
      />
    </>
  );
}
