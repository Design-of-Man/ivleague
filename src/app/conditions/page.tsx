import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  Badge,
  JsonLd,
  MedicalDisclaimer,
  StatTile,
} from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { conditions, therapiesForCondition } from "@/content/conditions";
import { specialties } from "@/content/therapies";

export const metadata = buildMetadata({
  title: "Conditions We Treat",
  description:
    "Crohn's disease, ulcerative colitis, rheumatoid arthritis, multiple sclerosis, severe asthma, immune deficiency and more. Chronic and complex conditions managed at IV League Infusions in Delray Beach, FL.",
  path: "/conditions",
});

export default function ConditionsPage() {
  const grouped = specialties
    .map((s) => ({
      specialty: s,
      items: conditions.filter((c) => c.specialty === s.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Conditions", href: "/conditions" },
          ]),
          itemListSchema({
            name: "Conditions treated at IV League Infusions",
            path: "/conditions",
            items: conditions.map((c) => ({
              name: c.name,
              path: `/conditions/${c.slug}`,
              description: c.summary,
            })),
          }),
        ]}
      />

      <PageHeader
        eyebrow="Conditions"
        title={
          <>
            Complex diagnoses,
            <br />
            <span className="text-gradient">managed close to home.</span>
          </>
        }
        lead="We care for adult patients with chronic and complex conditions: inflammatory bowel disease, inflammatory arthritis, multiple sclerosis, immune system disorders and more, alongside the physician who prescribed your therapy."
        trail={[
          { name: "Home", href: "/" },
          { name: "Conditions", href: "/conditions" },
        ]}
        aside={
          <div className="grid grid-cols-2 gap-8 border-l border-white/8 pl-8 lg:grid-cols-1 lg:gap-6">
            <StatTile value={conditions.length} label="Conditions" />
            <StatTile value={specialties.length} label="Specialties" />
          </div>
        }
      />

      <Section tight>
        <div className="grid gap-20">
          {grouped.map((group) => (
            <div key={group.specialty.id} id={group.specialty.id}>
              <SectionHeading
                eyebrow={group.specialty.short}
                title={group.specialty.label}
                lead={group.specialty.blurb}
                size="sm"
              />

              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((c) => {
                  const count = therapiesForCondition(c.slug).length;
                  return (
                    <StaggerItem key={c.slug}>
                      <SpotlightCard
                        href={`/conditions/${c.slug}`}
                        className="group flex h-full flex-col justify-between gap-6 p-6"
                      >
                        <div>
                          {c.onCurrentSite && (
                            <Badge tone="outline" size="sm" className="mb-4">
                              Treated here
                            </Badge>
                          )}
                          <h3 className="font-display text-[19px] font-semibold leading-snug tracking-tight text-ink-50 transition-colors group-hover:text-brand-100">
                            {c.name}
                          </h3>
                          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                            {c.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/6 pt-4">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500">
                            {count} {count === 1 ? "therapy" : "therapies"}
                          </span>
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
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
                        </div>
                      </SpotlightCard>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[0.625rem] border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="text-[17px] font-medium text-ink-50">
            Your diagnosis isn&apos;t on this list?
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-400">
            This page reflects what our referring physicians order most. It is
            not the limit of what we can administer. If your doctor has written
            for an infusion, call us. The answer is usually yes.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-400 px-6 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-brand-300"
          >
            Ask about your diagnosis
          </Link>
        </div>

        <MedicalDisclaimer className="mt-10" />
      </Section>

      <CtaBand
        title={
          <>
            One phone call
            <br />
            <span className="text-gradient">starts the whole process.</span>
          </>
        }
        body="We contact your physician, collect the orders, verify your benefits and pursue prior authorization. You just tell us who your doctor is."
      />
    </>
  );
}
