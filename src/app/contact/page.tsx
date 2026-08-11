import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { LocationSection } from "@/components/sections/LocationSection";
import { JsonLd } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/content/site";
import { intakeSteps } from "@/content/practice";

export const metadata = buildMetadata({
  title: "Contact & New Patient Inquiry",
  description:
    "Start treatment at IV League Infusions in Midlothian, VA. Submit a new patient inquiry, call (804) 397-6286, or email info@IVLinfusions.com.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />

      <PageHeader
        eyebrow="Get in touch"
        title={
          <>
            Start with a name
            <br />
            <span className="text-gradient">and a diagnosis.</span>
          </>
        }
        lead="That's all we need to begin. We'll contact your physician for orders, verify your benefits, pursue prior authorization and call you with a time that works."
        trail={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
        aside={
          <div className="grid w-full gap-3 lg:w-[19rem]">
            <ContactCard
              label="Call"
              value={site.contact.phone}
              href={site.contact.phoneHref}
              detail="Mon–Fri 9–6 · Sat–Sun 9–1"
            />
            <ContactCard
              label="Email"
              value={site.contact.email}
              href={site.contact.emailHref}
              detail="Replies within one business day"
            />
            <ContactCard
              label="Visit"
              value={site.address.street}
              href={site.address.directionsUrl}
              detail={`${site.address.city}, ${site.address.region} ${site.address.postalCode} · Free parking`}
              external
            />
          </div>
        }
      />

      {/* ------------------------------- Form -------------------------------- */}
      <Section id="inquiry" tight>
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="New patient inquiry"
              title="Tell us who you are"
              lead="Two minutes now saves you weeks of phone tag later. Nothing here is required except your name and how to reach you."
              size="sm"
            />
            <div className="mt-10">
              <InquiryForm />
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
            <Reveal className="card p-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                What happens next
              </h3>
              <ol className="mt-5 grid gap-4">
                {intakeSteps.slice(0, 4).map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="mt-0.5 font-mono text-[11px] text-teal-500">
                      {s.n}
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-ink-50">{s.title}</p>
                      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                        {s.duration}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <a
                href="/patients"
                className="mt-6 inline-flex text-[13px] font-medium text-teal-300 transition-colors hover:text-teal-200"
              >
                See the full process →
              </a>
            </Reveal>

            <Reveal delay={0.08} className="rounded-[0.625rem] border border-amber-400/20 bg-amber-400/[0.05] p-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                Medical emergency
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-300">
                This form is not monitored around the clock and is not a secure channel
                for medical information. If you are experiencing a medical emergency,
                call <strong className="font-semibold text-ink-50">911</strong>. For
                urgent clinical questions about an active infusion course, call us
                directly at{" "}
                <a
                  href={site.contact.phoneHref}
                  className="font-semibold text-amber-200 underline underline-offset-4"
                >
                  {site.contact.phone}
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={0.14} className="card p-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                For referring providers
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                Fax orders to{" "}
                <span className="font-medium text-ink-100">{site.contact.fax}</span> or
                call our intake line directly. We&apos;ll confirm receipt the same day.
              </p>
              <a
                href="/providers#refer"
                className="mt-4 inline-flex text-[13px] font-medium text-teal-300 transition-colors hover:text-teal-200"
              >
                Referral requirements →
              </a>
            </Reveal>
          </aside>
        </div>
      </Section>

      <LocationSection />
    </>
  );
}

function ContactCard({
  label,
  value,
  href,
  detail,
  external,
}: {
  label: string;
  value: string;
  href: string;
  detail: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group card card-hover flex flex-col gap-1 p-5"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-400">
        {label}
      </span>
      <span className="text-[15px] font-medium text-ink-50 transition-colors group-hover:text-teal-200">
        {value}
      </span>
      <span className="text-[12px] text-ink-500">{detail}</span>
    </a>
  );
}
