import { ScrollHero } from "@/components/sections/ScrollHero";
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
  title: "Outpatient Infusion Center in Midlothian, VA",
  description:
    "IV League Infusions is a locally owned outpatient infusion center in Midlothian, Virginia. Biologics, IVIG, IV antibiotics, iron and wellness infusions in private suites, with insurance and prior authorization handled for you.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs.slice(0, 8))} />
      <ScrollHero />
      <Stats />
      <SpecialtyGrid />
      <TherapyRail />
      <IntakeProcess />
      <AmenitiesBento />
      <WhyIVL />
      <InsuranceStrip />
      <WellnessRail />
      <Testimonials />
      <InstagramFeed />
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
