import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { JsonLd, TickList } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { wellnessDrips, injections, accentMap } from "@/content/wellness";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Wellness & Regenerative IV Infusions",
  description:
    "Myers' Cocktail, NAD+, immunity, hydration, recovery and glutathione infusions in Delray Beach, FL, administered by registered nurses in private suites under clinical protocols.",
  path: "/wellness",
  keywords: [
    "IV vitamin therapy Delray Beach FL",
    "Myers cocktail Palm Beach County",
    "NAD IV therapy Delray Beach",
    "IV hydration Palm Beach County",
  ],
});

export default function WellnessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Wellness", href: "/wellness" },
        ])}
      />

      <PageHeader
        eyebrow="Wellness & regenerative"
        title={
          <>
            Nurses who hang biologics
            <br />
            <span className="text-gradient">also hang your vitamin drip.</span>
          </>
        }
        lead="Most IV bars are staffed by people who have never run a four-hour immune globulin infusion. Ours have, thousands of times. Same clinicians, same suites, same protocols, applied to hydration and nutrient therapy."
        trail={[
          { name: "Home", href: "/" },
          { name: "Wellness", href: "/wellness" },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Book a drip
            <ArrowGlyph />
          </ButtonLink>
          <ButtonLink href="#injections" variant="secondary" size="lg">
            Quick injections
          </ButtonLink>
        </div>
      </PageHeader>

      {/* ------------------------------- Menu -------------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="The menu"
          title="Eight formulations"
          lead="Every infusion is reviewed by a clinician before it's mixed. If a drip isn't right for you, or if what you're describing needs a physician instead of a vitamin, we'll say so."
        />

        <div className="mt-14 grid gap-4">
          {wellnessDrips.map((d, i) => {
            const a = accentMap[d.accent];
            return (
              <Reveal key={d.slug} id={d.slug} delay={i * 0.03}>
                <article
                  className={cn(
                    "group relative overflow-hidden rounded-[0.75rem] border border-white/8 transition-colors duration-500 hover:border-white/16",
                    "bg-gradient-to-br",
                    a.from,
                    a.to,
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl"
                  />

                  <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] text-ink-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset",
                            a.ring,
                            a.text,
                          )}
                        >
                          {d.duration}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                          {d.price === null
                            ? "Pricing on request"
                            : `$${d.price}`}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold tracking-tight text-ink-50">
                        {d.name}
                      </h3>
                      <p className={cn("mt-2 text-[15px] font-medium", a.text)}>
                        {d.tagline}
                      </p>
                      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-300">
                        {d.description}
                      </p>
                      <p className="mt-5 border-l-2 border-white/15 pl-4 text-[13.5px] italic leading-relaxed text-ink-400">
                        Best for: {d.bestFor}
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                          In the bag
                        </h4>
                        <ul className="mt-3.5 flex flex-wrap gap-1.5">
                          {d.ingredients.map((ing) => (
                            <li
                              key={ing}
                              className="rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 text-[12px] text-ink-200"
                            >
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                          Supports
                        </h4>
                        <TickList
                          items={d.benefits}
                          className="mt-3.5"
                          tone="muted"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ---------------------------- Injections ----------------------------- */}
      <Section
        id="injections"
        className="border-y border-white/8 bg-ink-900/40"
        tight
      >
        <SectionHeading
          eyebrow="Quick visits"
          title="Injections & pushes"
          lead="In and out in ten minutes. Add any of these to an infusion, or come in for one on its own."
        />

        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {injections.map((inj) => (
            <StaggerItem key={inj.slug}>
              <div className="group h-full bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[16px] font-semibold tracking-tight text-ink-50">
                    {inj.name}
                  </h3>
                  <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-400">
                    {inj.duration}
                  </span>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                  {inj.description}
                </p>
                <p className="mt-4 border-t border-white/6 pt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                  {inj.price === null ? "Pricing on request" : `$${inj.price}`}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ------------------------------ Standard ----------------------------- */}
      <Section tight>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="The difference"
              title="Why get a drip here instead of a storefront"
              size="sm"
            />
            <div className="mt-8 grid gap-5">
              {[
                [
                  "Clinical screening, every time",
                  "You are assessed by a licensed clinician before anything is mixed. Cardiac history, kidney function, pregnancy, medication interactions: these matter, and a questionnaire on a tablet doesn't catch them.",
                ],
                [
                  "Nurses who run four-hour infusions",
                  "Our RNs place IVs in patients with years of scar tissue and difficult veins. A wellness drip is the easiest thing they'll do all day.",
                ],
                [
                  "Pharmaceutical-grade sourcing",
                  "The same U.S.-pharmacy standard that governs our biologics governs our vitamins.",
                ],
                [
                  "Emergency protocols on site",
                  "Reactions to IV nutrients are rare and almost always minor. We're still equipped and trained for them.",
                ],
              ].map(([h, b]) => (
                <div key={h} className="border-l-2 border-brand-400/35 pl-5">
                  <h3 className="text-[15.5px] font-semibold text-ink-50">
                    {h}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-400">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-4">
            <Reveal className="card p-8">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                Good to know
              </h3>
              <dl className="mt-6 grid gap-5">
                {[
                  [
                    "Do I need a referral for wellness drips?",
                    "No. Wellness and regenerative infusions do not require a physician referral, only our clinical screening. Specialty and biologic therapies do require a referral.",
                  ],
                  [
                    "Is this covered by insurance?",
                    "Generally no. Wellness infusions are typically self-pay. HSA and FSA eligibility varies by plan and by service, so check with your administrator.",
                  ],
                  [
                    "How often can I come?",
                    "That depends on the formulation and on you. Most patients who use wellness IV therapy regularly come every two to four weeks.",
                  ],
                  [
                    "Can I add to my specialty infusion?",
                    "Sometimes. Anything added to a therapy day has to be cleared against your prescribed regimen first, so ask your nurse.",
                  ],
                ].map(([q, a]) => (
                  <div
                    key={q}
                    className="border-b border-white/6 pb-5 last:border-0 last:pb-0"
                  >
                    <dt className="text-[14.5px] font-medium text-ink-50">
                      {q}
                    </dt>
                    <dd className="mt-2 text-[13.5px] leading-relaxed text-ink-400">
                      {a}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[12.5px] leading-relaxed text-ink-400">
                <strong className="font-semibold text-ink-200">
                  These statements have not been evaluated by the Food and Drug
                  Administration.
                </strong>{" "}
                Wellness infusions are not intended to diagnose, treat, cure or
                prevent any disease. They are not a substitute for medical care,
                and are not appropriate for everyone. Our clinical team will
                tell you if a drip isn&apos;t right for you.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Book"
        title={
          <>
            Walk in depleted.
            <br />
            <span className="text-gradient">Walk out level.</span>
          </>
        }
        body="Call or send a note and we'll find you a chair, often the same week. No referral needed for wellness infusions."
        primary={{ label: "Request a drip", href: "/contact" }}
      />
    </>
  );
}
