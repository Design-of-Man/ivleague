import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { JsonLd, MedicalDisclaimer, TickList, Badge } from "@/components/ui/Bits";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  conditions,
  conditionBySlug,
  therapiesForCondition,
} from "@/content/conditions";
import { specialtyById } from "@/content/therapies";
import {
  buildMetadata,
  breadcrumbSchema,
  medicalConditionSchema,
} from "@/lib/seo";

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c)
    return buildMetadata({ title: "Condition not found", description: "", noIndex: true });

  return buildMetadata({
    title: `${c.name} Infusion Treatment`,
    description: `${c.summary} Infusion therapy for ${c.name.toLowerCase()} at IV League Infusions in Midlothian, Virginia.`,
    path: `/conditions/${c.slug}`,
    keywords: [
      `${c.name} infusion Midlothian VA`,
      `${c.name} treatment Richmond Virginia`,
      `${c.shortName ?? c.name} infusion center`,
    ],
  });
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) notFound();

  const specialty = specialtyById(c.specialty);
  const therapyOptions = therapiesForCondition(c.slug);
  const siblings = conditions
    .filter((x) => x.specialty === c.specialty && x.slug !== c.slug)
    .slice(0, 4);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Conditions", href: "/conditions" },
    { name: c.shortName ?? c.name, href: `/conditions/${c.slug}` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(trail), medicalConditionSchema(c)]} />

      <PageHeader
        eyebrow={specialty.label}
        title={c.name}
        lead={c.summary}
        trail={trail}
        aside={
          therapyOptions.length > 0 ? (
            <div className="card w-full min-w-[17rem] p-6 lg:w-[19rem]">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-400">
                Therapies we administer
              </p>
              <ul className="mt-4 grid gap-1">
                {therapyOptions.slice(0, 6).map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/therapies/${t.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-200 transition-colors hover:bg-white/[0.04] hover:text-teal-200"
                    >
                      <span>
                        {t.brand}
                        <span className="ml-1.5 font-mono text-[10px] text-ink-500">
                          {t.generic.split(",")[0]}
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3 w-3 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
              {therapyOptions.length > 6 && (
                <p className="mt-3 px-2.5 font-mono text-[10.5px] text-ink-500">
                  +{therapyOptions.length - 6} more
                </p>
              )}
              <ButtonLink href="/contact#inquiry" size="sm" className="mt-5 w-full">
                Start intake
                <ArrowGlyph />
              </ButtonLink>
            </div>
          ) : undefined
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge>{specialty.label}</Badge>
          {c.onCurrentSite && <Badge tone="outline">Treated at IVL</Badge>}
        </div>
      </PageHeader>

      <Section tight>
        <div className="grid gap-14 lg:grid-cols-[1.5fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <div className="prose-iv max-w-none">
                <h2 className="!mt-0 text-2xl font-semibold">Understanding {c.shortName ?? c.name}</h2>
                <p>{c.overview}</p>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">Common signs and symptoms</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-400">
                Presentation varies widely between patients. Only your physician can
                diagnose {c.shortName ?? c.name}.
              </p>
              <TickList items={c.symptoms} className="mt-6" />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">How infusion therapy helps</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-200">
                {c.howInfusionHelps}
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">Living with it</h2>
              <div className="mt-6 grid gap-3">
                {c.livingWith.map((tip, i) => (
                  <div
                    key={tip}
                    className="flex gap-5 rounded-[0.5rem] border border-white/8 bg-white/[0.02] p-5"
                  >
                    <span className="font-mono text-[11px] text-teal-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14.5px] leading-relaxed text-ink-200">{tip}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <MedicalDisclaimer className="mt-12" />
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
            <Reveal className="card p-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                What to expect from us
              </h3>
              <ul className="mt-5 grid gap-4">
                {[
                  ["Your physician stays in charge", "We administer; they prescribe. Documentation goes back to them after every visit."],
                  ["We chase the authorization", "Benefits investigation and prior auth are our job, not yours."],
                  ["Continuity of care", "Same nurses, same suite, same appointment slot when you want it."],
                ].map(([h, b]) => (
                  <li key={h}>
                    <p className="text-[13.5px] font-medium text-ink-50">{h}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-400">{b}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {siblings.length > 0 && (
              <Reveal delay={0.08} className="card p-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                  Related conditions
                </h3>
                <ul className="mt-4 grid gap-1">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/conditions/${s.slug}`}
                        className="block rounded-lg px-2.5 py-2 text-[13.5px] text-ink-300 transition-colors hover:bg-white/[0.04] hover:text-teal-200"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>
      </Section>

      {therapyOptions.length > 0 && (
        <Section className="border-t border-white/8 bg-ink-900/30" tight>
          <SectionHeading
            eyebrow="Treatment options"
            title={`Therapies for ${c.shortName ?? c.name}`}
            lead="Which therapy is right for you depends on disease activity, prior treatment and your physician's judgement — not on what we happen to stock."
            size="sm"
          />
          <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {therapyOptions.map((t) => (
              <StaggerItem key={t.slug}>
                <SpotlightCard
                  href={`/therapies/${t.slug}`}
                  className="group flex h-full flex-col justify-between gap-5 p-6"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-teal-100">
                      {t.brand}
                    </h3>
                    <p className="mt-1 font-mono text-[10.5px] lowercase tracking-wide text-ink-500">
                      {t.generic}
                    </p>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                      {t.summary}
                    </p>
                  </div>
                  <p className="border-t border-white/6 pt-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                    {t.drugClass}
                  </p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      <CtaBand
        title={
          <>
            Treatment for {c.shortName ?? c.name},
            <br />
            <span className="text-gradient">minutes from home.</span>
          </>
        }
        body="Tell us your prescriber and your insurance. We'll take the order, verify benefits and get you scheduled."
      />
    </>
  );
}
