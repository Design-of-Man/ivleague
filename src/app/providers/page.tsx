import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { JsonLd, TickList, StatTile } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/content/site";
import { providerValueProps, referralRequirements } from "@/content/practice";
import { specialties, therapiesBySpecialty } from "@/content/therapies";

export const metadata = buildMetadata({
  title: "For Referring Providers",
  description:
    "Refer patients to IV League Infusions in Delray Beach, FL. Broad specialty formulary, prior authorization handled end to end, documentation returned after every visit, seven-day availability.",
  path: "/providers",
});

export default function ProvidersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Providers", href: "/providers" },
        ])}
      />

      <PageHeader
        eyebrow="For referring providers"
        title={
          <>
            Send the order.
            <br />
            <span className="text-gradient">We&apos;ll close the loop.</span>
          </>
        }
        lead="Your staff should not be spending their week on benefit investigations and specialty pharmacy calls. Refer to IV League and that work leaves your office, with documentation back in your chart after every administration."
        trail={[
          { name: "Home", href: "/" },
          { name: "Providers", href: "/providers" },
        ]}
        aside={
          <div className="grid grid-cols-3 gap-8 border-l border-white/8 pl-8 lg:grid-cols-1 lg:gap-6">
            <StatTile value="2–3wk" label="Referral to first dose" />
            <StatTile value="7 days" label="Weekly availability" />
            <StatTile value="24hr" label="Post-visit documentation" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#refer" size="lg">
            Referral requirements
            <ArrowGlyph />
          </ButtonLink>
          <ButtonLink
            href={site.contact.phoneHref}
            variant="secondary"
            size="lg"
          >
            Call intake: {site.contact.phone}
          </ButtonLink>
        </div>
      </PageHeader>

      {/* ------------------------------ Value ------------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="Why refer here"
          title="Six reasons practices send us their infusions"
        />

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/6 md:grid-cols-2 lg:grid-cols-3">
          {providerValueProps.map((v, i) => (
            <StaggerItem key={v.title}>
              <div className="group h-full bg-ink-950 p-7 transition-colors duration-500 hover:bg-ink-900 sm:p-8">
                <span className="font-mono text-[11px] text-brand-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[17.5px] font-semibold leading-snug tracking-tight text-ink-50">
                  {v.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-400">
                  {v.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ----------------------------- Referral ----------------------------- */}
      <Section
        id="refer"
        className="border-y border-white/8 bg-ink-900/40"
        tight
      >
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="How to refer"
              title="Three ways to send a patient"
              lead="Whichever route you use, we confirm receipt the same business day and start the benefits investigation immediately."
              size="sm"
            />

            <div className="mt-10 grid gap-3">
              {[
                {
                  n: "01",
                  title: "Fax the order",
                  body: `Send the signed order and supporting documentation to ${site.contact.fax}. This is the fastest route for most practices.`,
                },
                {
                  n: "02",
                  title: "Call our intake line",
                  body: `Reach us at ${site.contact.phone}, Monday through Friday 9:00 AM to 6:00 PM. We can take a verbal referral and chase the paperwork ourselves.`,
                },
                {
                  n: "03",
                  title: "Send the patient to us",
                  body: "Give them our number or point them at the inquiry form. We'll contact your office for orders. Your staff doesn't need to initiate anything.",
                },
              ].map((m) => (
                <Reveal key={m.n}>
                  <div className="flex gap-6 rounded-[0.625rem] border border-white/8 bg-white/[0.02] p-6">
                    <span className="font-mono text-[11px] text-brand-400">
                      {m.n}
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-semibold tracking-tight text-ink-50">
                        {m.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-400">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} className="lg:pt-16">
            <div className="card p-8">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                What to include
              </h3>
              <TickList items={referralRequirements} className="mt-6" />
              <p className="mt-8 border-t border-white/6 pt-6 text-[13px] leading-relaxed text-ink-500">
                Missing a piece? Send what you have. We&apos;ll call your office
                for the rest rather than sitting on an incomplete referral.
              </p>
              <ButtonLink
                href={site.contact.emailHref}
                variant="outline"
                size="sm"
                className="mt-6 w-full"
              >
                Email our intake team
                <ArrowGlyph />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ----------------------------- Formulary ---------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="Formulary at a glance"
          title="What we can administer"
          lead="If a therapy isn't listed, ask. Our formulary follows what our referring physicians order, and we routinely bring a product on for a single patient."
        />

        <div className="mt-14 grid gap-3 md:grid-cols-2">
          {specialties.map((s) => {
            const list = therapiesBySpecialty(s.id);
            return (
              <Reveal key={s.id}>
                <div className="card h-full p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[16.5px] font-semibold tracking-tight text-ink-50">
                      {s.label}
                    </h3>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                      {list.length}
                    </span>
                  </div>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-ink-400">
                    {list.map((t) => t.brand).join(" · ")}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaBand
        eyebrow="Intake line"
        title={
          <>
            Same-day confirmation.
            <br />
            <span className="text-gradient">Every referral.</span>
          </>
        }
        body={`Fax ${site.contact.fax} or call ${site.contact.phone}. We'll acknowledge receipt, start benefits, and keep your office updated until the patient is in the chair.`}
        primary={{ label: "Email intake", href: site.contact.emailHref }}
      />
    </>
  );
}
