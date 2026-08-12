import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { InsuranceStrip } from "@/components/sections/InsuranceStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, TickList, StatTile } from "@/components/ui/Bits";
import { FaqSection } from "@/components/sections/FaqSection";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { faqs } from "@/content/practice";

export const metadata = buildMetadata({
  title: "Insurance, Billing & Financial Assistance",
  description:
    "IV League Infusions accepts most major commercial plans, Medicare and Medicaid, plus HSA cards and Cherry payment plans. We handle prior authorization and screen every patient for copay assistance.",
  path: "/insurance",
});

const WE_DO = [
  "Verify your benefits before anything is scheduled",
  "Submit and follow up on prior authorization with your plan",
  "Collect the clinical documentation your plan requires from your physician",
  "Screen you for manufacturer copay programs and foundation grants",
  "Tell you your expected out-of-pocket cost before your first infusion",
  "Re-authorize proactively before your approval expires",
];

const YOU_DO = [
  "Give us your insurance card and your prescriber's name",
  "Tell us if your coverage changes mid-year",
  "Let us know if a bill arrives that doesn't look right and we'll investigate it",
];

export default function InsurancePage() {
  const costFaqs = faqs.filter((f) => f.category === "Insurance & cost");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Insurance", href: "/insurance" },
        ])}
      />

      <PageHeader
        eyebrow="Insurance & billing"
        title={
          <>
            The most expensive part
            <br />
            <span className="text-gradient">is usually the building.</span>
          </>
        }
        lead="Hospital outpatient departments bill a facility fee on top of the drug and its administration. Freestanding infusion centers don't. Same medication, same class of clinician, a fraction of the total cost of care, and it shows up directly in your coinsurance."
        trail={[
          { name: "Home", href: "/" },
          { name: "Insurance", href: "/insurance" },
        ]}
        aside={
          <div className="grid grid-cols-2 gap-8 border-l border-white/8 pl-8 lg:grid-cols-1 lg:gap-6">
            <StatTile value="48hr" label="Typical benefits check" />
            <StatTile value="$0" label="Facility fee" />
          </div>
        }
      />

      <InsuranceStrip />

      {/* ------------------------- Division of labor ------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="Who does what"
          title="You give us two things. We do the rest."
          lead="Prior authorization is the single most common reason infusion therapy gets delayed. We treat it as our job, because when it's the patient's job, it doesn't get done."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="card p-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
              What we handle
            </h3>
            <TickList items={WE_DO} className="mt-6" />
          </Reveal>
          <Reveal delay={0.08} className="card p-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              What we need from you
            </h3>
            <TickList items={YOU_DO} className="mt-6" tone="muted" />
            <p className="mt-8 border-t border-white/6 pt-6 text-[13px] leading-relaxed text-ink-500">
              That&apos;s the whole list. If we need something else, we&apos;ll
              call. We won&apos;t leave a voicemail and wait.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------- Cost paths ----------------------------- */}
      <Section className="border-y border-white/8 bg-ink-900/40" tight>
        <SectionHeading
          eyebrow="Paying for care"
          title="Four ways this gets affordable"
          lead="Cost should never be the reason a therapy stops working. If your responsibility is a barrier, tell us. There is almost always a lever we can pull."
        />

        <Stagger className="mt-14 grid gap-4 md:grid-cols-2">
          {[
            {
              n: "01",
              title: "Manufacturer copay assistance",
              body: "Most specialty biologics have a copay card that can reduce a commercially insured patient's responsibility to a nominal amount per infusion. We screen every patient and handle enrollment, so you do not need to find these programs yourself.",
              note: "Commercial insurance only; federal program rules prohibit use with Medicare or Medicaid.",
            },
            {
              n: "02",
              title: "Foundation grants",
              body: "Independent charitable foundations fund out-of-pocket costs for specific diagnoses, including for Medicare patients. Funds open and close throughout the year; we watch for openings relevant to our patients.",
              note: "Eligibility is income-based and diagnosis-specific.",
            },
            {
              n: "03",
              title: "Cherry payment plans",
              body: "Cherry lets you spread your responsibility across monthly payments with a decision in minutes. It's a practical option for high-deductible plans early in the calendar year.",
              note: "Approval and terms are set by Cherry, not by IV League.",
            },
            {
              n: "04",
              title: "HSA, FSA and self-pay",
              body: "We accept HSA cards at the time of infusion for eligible services. For patients without coverage, or for wellness infusions, we quote transparent self-pay pricing in writing before you commit.",
              note: "HSA/FSA eligibility varies by plan administrator and service.",
            },
          ].map((c) => (
            <StaggerItem key={c.n}>
              <div className="card h-full p-8">
                <span className="font-mono text-[11px] text-brand-400">
                  {c.n}
                </span>
                <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-ink-50">
                  {c.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-300">
                  {c.body}
                </p>
                <p className="mt-5 border-t border-white/6 pt-4 text-[12px] leading-relaxed text-ink-500">
                  {c.note}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <FaqSection
        items={costFaqs}
        showFilters={false}
        eyebrow="Cost questions"
        title={
          <>
            What patients ask
            <br />
            <span className="text-gradient">about paying for this.</span>
          </>
        }
        lead="If your question isn't here, ask before you schedule, not after you're billed."
        cta={false}
      />

      <Section tight className="pt-0">
        <Reveal>
          <p className="rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[12.5px] leading-relaxed text-ink-400">
            <strong className="font-semibold text-ink-200">
              Coverage varies by plan.
            </strong>{" "}
            Network participation, benefits and prior authorization requirements
            differ by carrier, product line and employer group. Nothing on this
            page is a guarantee of coverage or of a specific out-of-pocket
            amount. We will give you a benefits estimate in writing before your
            first infusion.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Find out what you'd owe"
        title={
          <>
            Get a benefits check
            <br />
            <span className="text-gradient">before you commit.</span>
          </>
        }
        body="Send us your insurance and your prescriber. We'll come back with your expected out-of-pocket cost, usually within two business days."
      />
    </>
  );
}
