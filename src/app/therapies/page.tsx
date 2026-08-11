import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { TherapyExplorer } from "@/components/sections/TherapyExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, MedicalDisclaimer, StatTile } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { therapies, specialties } from "@/content/therapies";

export const metadata = buildMetadata({
  title: "Infusion Therapies & Formulary",
  description:
    "Browse the full IV League Infusions formulary: biologics, IVIG, IV iron, bone health, anti-infectives and more. Filter by specialty or search by brand or generic name.",
  path: "/therapies",
  keywords: [
    "infusion therapy list Midlothian VA",
    "biologic infusion formulary Virginia",
    "Entyvio Remicade Ocrevus infusion Richmond",
  ],
});

export default function TherapiesPage() {
  const onSiteCount = therapies.filter((t) => t.onCurrentSite).length;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Therapies", href: "/therapies" },
          ]),
          itemListSchema({
            name: "IV League Infusions formulary",
            path: "/therapies",
            items: therapies.map((t) => ({
              name: `${t.brand} (${t.generic})`,
              path: `/therapies/${t.slug}`,
              description: t.summary,
            })),
          }),
        ]}
      />

      <PageHeader
        eyebrow="Formulary"
        title={
          <>
            Every therapy we hang,
            <br />
            <span className="text-gradient">in one place.</span>
          </>
        }
        lead="Specialty biologics, immune globulin, iron, bone health agents and IV anti-infectives, all ordered by your physician and sourced from U.S. pharmacies that adhere to strict FDA and USP guidelines."
        trail={[
          { name: "Home", href: "/" },
          { name: "Therapies", href: "/therapies" },
        ]}
        aside={
          <div className="grid grid-cols-3 gap-8 border-l border-white/8 pl-8 lg:grid-cols-1 lg:gap-6">
            <StatTile value={therapies.length} label="Therapies" />
            <StatTile value={specialties.length} label="Specialties" />
            <StatTile value={`${onSiteCount}+`} label="Core formulary" />
          </div>
        }
      />

      <Section tight>
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-[0.625rem] border border-white/8 bg-white/[0.02]" />
          }
        >
          <TherapyExplorer />
        </Suspense>

        <MedicalDisclaimer className="mt-14" />
      </Section>

      <CtaBand
        eyebrow="Don't see it?"
        title={
          <>
            Our formulary follows
            <br />
            <span className="text-gradient">our referring physicians.</span>
          </>
        }
        body="If the medication your doctor prescribed isn't listed here, call us. We can often bring a therapy on for a single patient."
        primary={{ label: "Ask about a medication", href: "/contact" }}
      />
    </>
  );
}
