import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import {
  Badge,
  JsonLd,
  MedicalDisclaimer,
  SpecRow,
  TickList,
} from "@/components/ui/Bits";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ReviewedOn } from "@/components/ui/ReviewedOn";
import { ChairTimeScale } from "@/components/sections/ChairTimeScale";
import {
  therapies,
  therapyBySlug,
  specialtyById,
  therapiesBySpecialty,
} from "@/content/therapies";
import { conditionsForTherapy } from "@/content/conditions";
import {
  buildMetadata,
  breadcrumbSchema,
  medicalTherapySchema,
  faqSchema,
  medicalWebPageSchema,
} from "@/lib/seo";
import { therapyAnswer, therapyFaqs, therapyArticle } from "@/lib/answers";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerFaqs } from "@/components/sections/AnswerFaqs";

export function generateStaticParams() {
  return therapies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = therapyBySlug(slug);
  if (!t)
    return buildMetadata({
      title: "Therapy not found",
      description: "",
      noIndex: true,
    });

  return buildMetadata({
    title: `${t.brand} (${t.generic}) Infusion Therapy`,
    description: `${t.summary} Administered at IV League Infusions in Delray Beach, FL. Typical chair time: ${t.duration}.`,
    path: `/therapies/${t.slug}`,
    keywords: [
      `${t.brand} infusion Delray Beach FL`,
      `${t.generic} infusion Palm Beach County`,
      `${t.brand} infusion center Florida`,
    ],
  });
}

export default async function TherapyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = therapyBySlug(slug);
  if (!t) notFound();

  const specialty = specialtyById(t.specialty);
  const related = therapiesBySpecialty(t.specialty)
    .filter((x) => x.slug !== t.slug)
    .slice(0, 3);
  const linkedConditions = conditionsForTherapy(t.conditions);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Therapies", href: "/therapies" },
    { name: t.brand, href: `/therapies/${t.slug}` },
  ];

  const faqs = therapyFaqs(t);
  const an = therapyArticle(t);

  return (
    <>
      <JsonLd
        data={[
          medicalWebPageSchema({
            name: `${t.brand} (${t.generic}) Infusion Therapy`,
            description: t.summary,
            path: `/therapies/${t.slug}`,
            specialty: specialty.label,
          }),
          breadcrumbSchema(trail),
          medicalTherapySchema(t),
          faqSchema(faqs),
        ]}
      />

      <PageHeader
        eyebrow={specialty.label}
        title={t.brand}
        lead={t.summary}
        trail={trail}
        size="md"
        aside={
          <div className="card w-full min-w-[17rem] p-6 lg:w-[19rem]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-400">
              At a glance
            </p>
            <dl className="mt-4 grid gap-3.5">
              {[
                ["Generic", t.generic],
                ["Class", t.drugClass],
                ["Route", t.route],
                ["Chair time", t.duration],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-col gap-0.5 border-b border-white/6 pb-3 last:border-0 last:pb-0"
                >
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-500">
                    {k}
                  </dt>
                  <dd className="text-[13.5px] leading-snug text-ink-100">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink
              href="/contact#inquiry"
              size="sm"
              className="mt-6 w-full"
            >
              Start intake
              <ArrowGlyph />
            </ButtonLink>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge>{t.drugClass}</Badge>
          <Badge tone="neutral">{t.route}</Badge>
          {t.onCurrentSite && <Badge tone="outline">Core formulary</Badge>}
        </div>
      </PageHeader>

      {/* ------------------------------- Body -------------------------------- */}
      <Section tight>
        <div className="grid gap-14 lg:grid-cols-[1.5fr_0.9fr] lg:gap-20">
          <div>
            <AnswerBlock>{therapyAnswer(t)}</AnswerBlock>

            <Reveal className="mt-12">
              <div className="prose-iv max-w-none">
                <h2 className="!mt-0 text-2xl font-semibold">
                  How does {t.brand} work?
                </h2>
                <p>{t.howItWorks}</p>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">
                What is {t.brand} used for?
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-400">
                {t.brand} is used in the management of the following. Whether it
                is right for you is a decision for you and your prescribing
                physician.
              </p>
              <TickList items={t.treats} className="mt-6" />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">
                What happens during {an} {t.brand} infusion?
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="card p-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                    Before you come
                  </h3>
                  <TickList items={t.prep} className="mt-5" tone="muted" />
                </div>
                <div className="card p-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                    In the chair
                  </h3>
                  <TickList items={t.expect} className="mt-5" tone="muted" />
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <ChairTimeScale therapy={t} />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="text-2xl font-semibold">
                How often is {t.brand} given?
              </h2>
              <dl className="mt-6">
                <SpecRow label="Route" value={t.route} />
                <SpecRow label="Typical chair time" value={t.duration} />
                <SpecRow label="Dosing cadence" value={t.frequency} />
                <SpecRow label="Specialty" value={specialty.label} />
                <SpecRow
                  label="Referral"
                  value="Required. Your prescriber writes the order; we handle everything downstream of it."
                />
                <SpecRow
                  label="Coverage"
                  value={
                    <>
                      Most major commercial plans, Medicare and Medicaid.{" "}
                      <Link
                        href="/insurance"
                        className="text-teal-300 underline underline-offset-4"
                      >
                        See insurance details
                      </Link>
                      .
                    </>
                  }
                />
              </dl>
            </Reveal>

            <AnswerFaqs
              className="mt-12"
              heading={`Common questions about ${t.brand}`}
              items={faqs}
            />

            <MedicalDisclaimer className="mt-12" />
            <ReviewedOn className="mt-6" />
          </div>

          {/* ------------------------------ Sidebar ---------------------------- */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
            {linkedConditions.length > 0 && (
              <Reveal className="card p-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                  Conditions treated
                </h3>
                <ul className="mt-4 grid gap-1">
                  {linkedConditions.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/conditions/${c.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-[13.5px] text-ink-300 transition-colors hover:bg-white/[0.04] hover:text-teal-200"
                      >
                        {c.shortName ?? c.name}
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
              </Reveal>
            )}

            <Reveal delay={0.08} className="card overflow-hidden">
              <div className="border-b border-white/8 p-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                  Getting started
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                  Send us your prescriber&apos;s name and your insurance. We
                  collect the order, verify benefits and pursue prior
                  authorization. Most patients are infusing in two to three
                  weeks.
                </p>
              </div>
              <div className="grid divide-y divide-white/6">
                <Link
                  href="/contact#inquiry"
                  className="group flex items-center justify-between gap-3 px-6 py-4 text-[13.5px] font-medium text-ink-100 transition-colors hover:bg-white/[0.03] hover:text-teal-200"
                >
                  New patient inquiry
                  <ArrowGlyph />
                </Link>
                <Link
                  href="/patients"
                  className="group flex items-center justify-between gap-3 px-6 py-4 text-[13.5px] font-medium text-ink-100 transition-colors hover:bg-white/[0.03] hover:text-teal-200"
                >
                  What to expect
                  <ArrowGlyph />
                </Link>
                <Link
                  href="/providers#refer"
                  className="group flex items-center justify-between gap-3 px-6 py-4 text-[13.5px] font-medium text-ink-100 transition-colors hover:bg-white/[0.03] hover:text-teal-200"
                >
                  Refer a patient
                  <ArrowGlyph />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* ------------------------------ Related ------------------------------ */}
      {related.length > 0 && (
        <Section className="border-t border-white/8 bg-ink-900/30" tight>
          <SectionHeading
            eyebrow={`More in ${specialty.label}`}
            title="Related therapies"
            size="sm"
          />
          <Stagger className="mt-10 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <StaggerItem key={r.slug}>
                <SpotlightCard
                  href={`/therapies/${r.slug}`}
                  className="group flex h-full flex-col gap-3 p-6"
                >
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-teal-100">
                    {r.brand}
                  </h3>
                  <p className="font-mono text-[10.5px] lowercase tracking-wide text-ink-500">
                    {r.generic}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-400">
                    {r.summary}
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
            Ready to start {t.brand}
            <br />
            <span className="text-gradient">without the runaround?</span>
          </>
        }
        body="Give us your prescriber and your insurance. We'll take the order, the authorization and the scheduling off your plate."
      />
    </>
  );
}
