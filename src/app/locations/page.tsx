import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { LocationSection } from "@/components/sections/LocationSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, TickList } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = buildMetadata({
  title: "Visit Us in Midlothian, Virginia",
  description:
    "IV League Infusions at 2949 Fox Chase Lane, Midlothian, VA 23112. Free parking, open seven days, serving Brandermill, Woodlake, Chesterfield and greater Richmond.",
  path: "/locations",
  keywords: [
    "infusion center near me Midlothian",
    "IV therapy Brandermill VA",
    "infusion center Chesterfield County",
  ],
});

const AREAS = [
  "Midlothian",
  "Brandermill",
  "Woodlake",
  "Chesterfield",
  "Bon Air",
  "Richmond",
  "Powhatan",
  "Moseley",
  "Chester",
  "Colonial Heights",
  "Short Pump",
  "Amelia",
];

const DIRECTIONS = [
  "From Route 288: exit at Hull Street Road (Route 360) east, then follow signs toward Brandermill.",
  "From Route 360 (Hull Street): turn onto Old Hundred Road, then Fox Chase Lane.",
  "From Midlothian Turnpike (Route 60): take Old Hundred Road south toward Brandermill.",
  "Free surface parking is directly at the entrance — no garage, no ticket, no long walk.",
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
            <span className="text-gradient">Midlothian, Virginia.</span>
          </>
        }
        lead="We are deliberately a single location. It's the reason your nurse knows your name, your veins and your schedule — and the reason we can hold a standing appointment slot for you."
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
            <SectionHeading eyebrow="Getting here" title="Directions & parking" size="sm" />
            <TickList items={DIRECTIONS} className="mt-8" />
            <p className="mt-8 rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[13px] leading-relaxed text-ink-400">
              Arriving for a long infusion? Bring a companion — every suite has a seat for
              a guest, and there&apos;s no time limit on parking.
            </p>
          </div>

          <div>
            <SectionHeading eyebrow="Who we serve" title="Areas we cover" size="sm" />
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
              Patients regularly drive from across greater Richmond and central Virginia —
              usually because the total cost of care here beats the hospital outpatient
              department by enough to make the drive worth it several times over.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------- Hours -------------------------------- */}
      <Section tight>
        <SectionHeading
          eyebrow="Hours"
          title="Open seven days"
          lead="Including weekend mornings — so treatment stops competing with work and school."
        />

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

        <Reveal delay={0.08}>
          <p className="mt-6 text-[12.5px] text-ink-500">
            Holiday hours may vary. Call {site.contact.phone} to confirm before travelling
            for a same-day visit.
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
        secondary={{ label: "Get directions", href: site.address.directionsUrl }}
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
