import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { LocationSection } from "@/components/sections/LocationSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, TickList } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = buildMetadata({
  title: `Visit Us in ${site.address.city}, ${site.address.regionName}`,
  description:
    "IV League Infusion Services at 500 Gulfstream Blvd, Suite 105, Delray Beach, FL 33483, southeast of the Woolbright Road exit off I-95. Free, convenient parking at the door.",
  path: "/locations",
  keywords: [
    "infusion center near me Delray Beach",
    "IV therapy Delray Beach FL",
    "infusion center Palm Beach County",
  ],
});

/**
 * The previous build listed twelve towns. Every one of them was invented, and
 * for the wrong state. Naming a town is a claim to serve it, so this list is
 * now only what is verifiable: the municipality the suite is physically in and
 * the county it sits in. Ask the practice which communities they actually draw
 * from before adding any more — see CONTENT-REVIEW.md.
 */
const AREAS = ["Delray Beach", "Palm Beach County"];

/**
 * Directions are the practice's own words, from ivlinfusions.com: "Located
 * southeast from Woolbright Road exit off I-95". The parking line is also
 * theirs ("Free, Convenient Parking"). Nothing else is claimed, because
 * nothing else is known.
 */
const DIRECTIONS = [
  "Southeast of the Woolbright Road exit off I-95.",
  "Suite 105 is in the Gulfstream Professional Building.",
  "Free, convenient parking at the door.",
];

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
        ])}
      />

      <PageHeader
        eyebrow="Visit us"
        title={
          <>
            One center.
            <br />
            <span className="text-gradient">
              {site.address.city}, {site.address.regionName}.
            </span>
          </>
        }
        lead="We are deliberately a single location. It's the reason your nurse knows your name, your veins and your schedule, and the reason we can hold a standing appointment slot for you."
        trail={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
        ]}
      />

      <LocationSection />

      {/* ---------------------------- Directions ----------------------------- */}
      <Section className="border-y border-white/8 bg-ink-900/40" tight>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Getting here"
              title="Directions & parking"
              size="sm"
            />
            <TickList items={DIRECTIONS} className="mt-8" />
            <p className="mt-8 rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[13px] leading-relaxed text-ink-400">
              Arriving for a long infusion? Bring a companion. Every suite has a
              seat for a guest, and there&apos;s no time limit on parking.
            </p>
          </div>

          <div>
            <SectionHeading
              eyebrow="Who we serve"
              title="Areas we cover"
              size="sm"
            />
            <Stagger className="mt-8 flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <StaggerItem key={a}>
                  <span className="inline-flex rounded-full border border-white/8 bg-white/[0.025] px-4 py-2 text-[13px] text-ink-300">
                    {a}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-8 text-[13.5px] leading-relaxed text-ink-400">
              A freestanding outpatient infusion suite rather than a hospital
              outpatient department, which is usually what makes the difference
              on the total cost of a course of treatment.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------- Hours -------------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="Hours"
          title={site.hoursConfirmed ? "Opening hours" : "Call for hours"}
          lead={
            site.hoursConfirmed
              ? "Weekend appointments are available."
              : `Weekend appointments are available. For today's hours, call ${site.contact.phone}.`
          }
        />

        {site.hoursConfirmed && (
          <Reveal className="mt-12 overflow-hidden rounded-[0.625rem] border border-white/8">
            <table className="w-full">
              <caption className="sr-only">Hours of operation</caption>
              <tbody>
                {site.hours.map((h) => (
                  <tr
                    key={h.day}
                    className="border-b border-white/6 last:border-0 odd:bg-white/[0.015]"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-left text-[14px] font-medium text-ink-100"
                    >
                      {h.day}
                    </th>
                    <td className="px-6 py-4 text-right font-mono text-[13px] text-ink-300">
                      {formatRange(h.open, h.close)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <p className="mt-6 text-[12.5px] text-ink-500">
            Holiday hours may vary. Call {site.contact.phone} to confirm before
            travelling for a same-day visit.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Plan your visit"
        title={
          <>
            Free parking. Weekend hours.
            <br />
            <span className="text-gradient">Zero facility fee.</span>
          </>
        }
        body={`${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}. Call ahead and we'll have your suite ready.`}
        secondary={{
          label: "Get directions",
          href: site.address.directionsUrl,
        }}
      />
    </>
  );
}

function formatRange(open: string, close: string) {
  const f = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  };
  return `${f(open)} – ${f(close)}`;
}
