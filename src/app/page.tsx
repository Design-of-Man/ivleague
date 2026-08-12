import { ScrollHero } from "@/components/sections/ScrollHero";
import { Band } from "@/components/ui/Section";
import { Stats } from "@/components/sections/Stats";
import { SpecialtyGrid } from "@/components/sections/SpecialtyGrid";
import { TherapyRail } from "@/components/sections/TherapyRail";
import { IntakeProcess } from "@/components/sections/IntakeProcess";
import { AmenitiesBento } from "@/components/sections/AmenitiesBento";
import { WhyIVL } from "@/components/sections/WhyIVL";
import { InsuranceStrip } from "@/components/sections/InsuranceStrip";
import { WellnessRail } from "@/components/sections/WellnessRail";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { FaqSection } from "@/components/sections/FaqSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/Bits";
import { faqSchema } from "@/lib/seo";
import { faqs } from "@/content/practice";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Outpatient Infusion Center in Delray Beach, FL",
  description:
    "IV League Infusions is a locally owned outpatient infusion center in Delray Beach, Florida. Biologics, IVIG, IV antibiotics, iron and wellness infusions in private suites, with insurance and prior authorization handled for you.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs.slice(0, 8))} />
      <ScrollHero />
      <Stats />
      <Band>
        <SpecialtyGrid />
      </Band>
      <TherapyRail />
      <Band>
        <IntakeProcess />
      </Band>
      <AmenitiesBento />
      <Band>
        <WhyIVL />
      </Band>
      <InsuranceStrip />
      <Band>
        <WellnessRail />
      </Band>
      <Testimonials />
      <Band>
        <InstagramFeed />
      </Band>
      <FaqSection items={faqs.slice(0, 9)} showFilters={false} />
      <LocationSection />
      <CtaBand
        title={
          <>
            Bring us the diagnosis.
            <br />
            <span className="text-gradient">We&apos;ll handle the rest.</span>
          </>
        }
        body="Send your name, your diagnosis and your prescriber. We'll verify benefits, chase the authorization, order the drug and call you with a time that works."
      />
    </>
  );
}
