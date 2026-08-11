import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { IntakeProcess } from "@/components/sections/IntakeProcess";
import { AmenitiesBento } from "@/components/sections/AmenitiesBento";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { JsonLd, TickList } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = buildMetadata({
  title: "What to Expect as a Patient",
  description:
    "Your first infusion at IV League Infusions in Midlothian, VA: from referral and prior authorization through what to bring, what the day looks like, and how long it takes.",
  path: "/patients",
});

const BRING = [
  "Photo ID and your insurance card",
  "A current list of medications, including over-the-counter supplements",
  "Any labs or paperwork your physician gave you",
  "A short-sleeved or loose-sleeved top for easy IV access",
  "Headphones, a laptop or a book. Wi-Fi is fast and outlets are at every chair",
  "A snack, especially for infusions over two hours",
];

const AVOID = [
  "Don't skip breakfast; eat a normal meal unless your physician said otherwise",
  "Don't arrive dehydrated; it makes IV access slower and more uncomfortable",
  "Don't schedule a flight the same day as a first-dose infusion",
  "Don't stop your other medications without talking to your prescriber",
];

const DAY = [
  {
    time: "On arrival",
    title: "Check-in and vitals",
    body: "Blood pressure, heart rate, temperature and weight where dosing depends on it. Your nurse reviews any change in your health since your last visit.",
  },
  {
    time: "First 10 minutes",
    title: "IV access",
    body: "We place the smallest catheter your therapy allows. Tell us which arm works and which veins have failed before. We write it down and use it next time.",
  },
  {
    time: "During",
    title: "The infusion",
    body: "Rate is set by your physician's orders and titrated by your nurse. Vitals are checked at set intervals. Say something the moment anything feels off. A rate change usually fixes it.",
  },
  {
    time: "After",
    title: "Observation and discharge",
    body: "Post-infusion observation depends on your therapy and how many doses you've had. We schedule your next visit before you leave.",
  },
  {
    time: "Within 24 hours",
    title: "Report to your physician",
    body: "Administration record, vitals, tolerance and anything notable goes back to your prescribing physician.",
  },
];

export default function PatientsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Patients", href: "/patients" },
        ])}
      />

      <PageHeader
        eyebrow="For patients"
        title={
          <>
            Everything that happens
            <br />
            <span className="text-gradient">before you sit down.</span>
          </>
        }
        lead="Infusion therapy is intimidating the first time and routine by the third. Here is exactly what to expect, from the referral your physician writes to the moment you walk back out to your car."
        trail={[
          { name: "Home", href: "/" },
          { name: "Patients", href: "/patients" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact#inquiry" size="lg">
            Start intake
            <ArrowGlyph />
          </ButtonLink>
          <ButtonLink href="/patients/faq" variant="secondary" size="lg">
            Patient FAQ
          </ButtonLink>
          <ButtonLink href="/insurance" variant="ghost" size="lg">
            Insurance & billing
          </ButtonLink>
        </div>
      </PageHeader>

      <IntakeProcess />

      {/* ---------------------------- The day ------------------------------ */}
      <Section tight>
        <SectionHeading
          eyebrow="Your visit, hour by hour"
          title="What the day actually looks like"
          lead="No mystery, no waiting room limbo. Here's the shape of an infusion appointment at IV League."
        />

        <div className="mt-14 grid gap-3">
          {DAY.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.05}>
              <div className="grid gap-4 rounded-[0.625rem] border border-white/8 bg-white/[0.02] p-6 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:p-7">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-teal-400 sm:pt-1">
                  {d.time}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink-50">
                    {d.title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-400">
                    {d.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ Prep -------------------------------- */}
      <Section className="border-y border-white/8 bg-ink-900/40" tight>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Come prepared" title="What to bring" size="sm" />
            <TickList items={BRING} className="mt-8" />
          </div>
          <div>
            <SectionHeading eyebrow="Common mistakes" title="What to avoid" size="sm" />
            <ul className="mt-8 grid gap-3">
              {AVOID.map((a) => (
                <li
                  key={a}
                  className="flex gap-3 rounded-[0.5rem] border border-white/8 bg-white/[0.02] p-4"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
                    <path d="M10 5.5v5.2M10 13.6v.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  <span className="text-[14.5px] leading-relaxed text-ink-300">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <AmenitiesBento />

      {/* --------------------------- Quick links ----------------------------- */}
      <Section tight>
        <Stagger className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Patient FAQ",
              body: "Referrals, insurance, timing, driving home, guests, reactions.",
              href: "/patients/faq",
            },
            {
              title: "Insurance & billing",
              body: "Plans accepted, prior authorization, HSA, Cherry financing and copay assistance.",
              href: "/insurance",
            },
            {
              title: "Inside the suite",
              body: "Recliners, private rooms, Wi-Fi, parking and everything else about the space.",
              href: "/suite",
            },
          ].map((c) => (
            <StaggerItem key={c.href}>
              <Link
                href={c.href}
                className="group card card-hover flex h-full flex-col justify-between gap-6 p-7"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-teal-100">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-400">
                    {c.body}
                  </p>
                </div>
                <ArrowGlyph className="text-teal-400" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand
        title={
          <>
            Questions we haven&apos;t answered?
            <br />
            <span className="text-gradient">Just call. Someone picks up.</span>
          </>
        }
        body={`Reach the center directly at ${site.contact.phone}, Monday through Friday until 6:00 PM, and weekend mornings.`}
        primary={{ label: "Start intake", href: "/contact#inquiry" }}
      />
    </>
  );
}
