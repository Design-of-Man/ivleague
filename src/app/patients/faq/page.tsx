import { PageHeader } from "@/components/layout/PageHeader";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, MedicalDisclaimer } from "@/components/ui/Bits";
import { Section } from "@/components/ui/Section";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { faqs } from "@/content/practice";

export const metadata = buildMetadata({
  title: "Patient FAQ",
  description:
    "Answers about referrals, insurance, prior authorization, appointment length, what to bring, driving home and more. IV League Infusions, Midlothian VA.",
  path: "/patients/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Patients", href: "/patients" },
            { name: "FAQ", href: "/patients/faq" },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHeader
        eyebrow="Patient FAQ"
        title={
          <>
            Every question
            <br />
            <span className="text-gradient">we get asked twice.</span>
          </>
        }
        lead="Referrals, insurance, timing, what the day looks like, and the clinical questions people are sometimes embarrassed to ask. If yours isn't here, call us."
        trail={[
          { name: "Home", href: "/" },
          { name: "Patients", href: "/patients" },
          { name: "FAQ", href: "/patients/faq" },
        ]}
      />

      <FaqSection
        items={faqs}
        showFilters
        showSearch
        eyebrow="Browse"
        title={
          <>
            Search or filter
            <br />
            <span className="text-gradient">by what you need.</span>
          </>
        }
        lead="Nineteen answers, grouped into getting started, insurance and cost, your visit, and clinical."
      />

      <Section tight className="pt-0">
        <MedicalDisclaimer />
      </Section>

      <CtaBand
        title={
          <>
            Didn&apos;t find it?
            <br />
            <span className="text-gradient">Ask a human.</span>
          </>
        }
        body="Our phone is answered by the people who actually work here. Describe your situation and you'll get a straight answer, including if we're not the right place for you."
        primary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
