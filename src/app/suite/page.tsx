import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { DripChamber } from "@/components/ui/DripChamber";
import { Reveal } from "@/components/ui/Reveal";
import { AmenitiesBento } from "@/components/sections/AmenitiesBento";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { LocationSection } from "@/components/sections/LocationSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Inside the Infusion Suite",
  description:
    "Private and semi-private infusion suites in Delray Beach, FL: heated massaging recliners, high-speed Wi-Fi, flat-screen TVs, room for a guest and free parking at the door.",
  path: "/suite",
});

/**
 * Photography placeholders. Each tile renders a labelled art panel until real
 * interior photography is supplied — see CONTENT-REVIEW.md for the shot list.
 */
const SHOTS = [
  {
    label: "Private suite 03",
    note: "Electric lift recliner, heat + massage",
    span: "wide",
  },
  { label: "Semi-private bay", note: "Four chairs, individual TVs" },
  { label: "The drip station", note: "Pharmacy-grade prep, U.S.-sourced" },
  { label: "Guest seating", note: "Every suite has a seat for someone" },
  {
    label: "Nurses' station",
    note: "Line of sight to every chair",
    span: "wide",
  },
  { label: "Entry and parking", note: "Free, at the door, no garage" },
];

export default function SuitePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "The Suite", href: "/suite" },
        ])}
      />

      <PageHeader
        eyebrow="The suite"
        title={
          <>
            Designed by people
            <br />
            <span className="text-gradient">who&apos;ve sat in the chair.</span>
          </>
        }
        lead="Infusion centers are usually designed around throughput. This one is designed around the four hours you spend in it: heat, quiet, good light, fast Wi-Fi, and a nurse within line of sight the entire time."
        trail={[
          { name: "Home", href: "/" },
          { name: "The Suite", href: "/suite" },
        ]}
      />

      {/* ------------------------------ Gallery ------------------------------ */}
      <Section tight>
        <div className="grid auto-rows-[13rem] gap-3 sm:auto-rows-[15rem] sm:grid-cols-3">
          {SHOTS.map((shot, i) => (
            <Reveal
              key={shot.label}
              delay={i * 0.05}
              className={shot.span === "wide" ? "sm:col-span-2" : undefined}
            >
              <figure className="group relative h-full overflow-hidden rounded-[0.625rem] border border-white/8 bg-ink-900">
                <ShotArt seed={i} />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[14px] font-medium text-ink-50">
                    {shot.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-400">{shot.note}</p>
                </figcaption>
                <span className="absolute right-4 top-4 rounded-full border border-white/12 bg-ink-950/82 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
                  Photo pending
                </span>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 text-[12.5px] leading-relaxed text-ink-500">
            Interior photography is scheduled. These panels are placeholders and
            will be replaced with real images of the center. The layout and
            captions are final.
          </p>
        </Reveal>
      </Section>

      <AmenitiesBento />

      {/* ---------------------------- The standard --------------------------- */}
      <Section className="border-y border-white/8 bg-ink-900/40" tight>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Behind the door"
              title={
                <>
                  The parts you don&apos;t see
                  <br />
                  <span className="text-gradient">matter more.</span>
                </>
              }
              lead="Comfort is the easy half. The other half is protocol."
              size="sm"
            />
            {/* The drip chamber the homepage hero used to carry. It belongs
                here at least as much: this is the page about the room, and the
                chamber is the one thing a patient looks at for four hours. */}
            <DripChamber
              className="mt-12 h-56 sm:h-64"
              label="Live rate · 20 gtt/mL"
            />
          </div>

          <div className="grid gap-5">
            {[
              [
                "U.S. pharmacy sourcing",
                "Every medication we administer comes from U.S. pharmacies that adhere to strict FDA and USP guidelines. Specialty biologics are ordered patient-specific, by name.",
              ],
              [
                "Nurse-to-patient ratios that allow watching",
                "Our RNs are not managing a floor. They are watching your infusion, which is how rate-related reactions get caught in the first two minutes instead of the tenth.",
              ],
              [
                "Emergency preparedness",
                "Reaction protocols, emergency medications and trained staff on site for every infusion, including first doses, which is when reactions are most likely.",
              ],
              [
                "Closed-loop documentation",
                "Administration, vitals, tolerance and any event go back to your prescribing physician within 24 hours of your visit.",
              ],
            ].map(([h, b]) => (
              <Reveal key={h}>
                <div className="border-l-2 border-brand-400/35 pl-5">
                  <h3 className="text-[16px] font-semibold text-ink-50">{h}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-400">
                    {b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <InstagramFeed limit={6} />
      <LocationSection />

      <CtaBand
        title={
          <>
            Come see it
            <br />
            <span className="text-gradient">before you commit.</span>
          </>
        }
        body="We'll walk you through the suite, show you the chair you'd be in, and answer whatever you want to ask. No appointment required. Call ahead and we'll make time."
        primary={{ label: "Schedule a tour", href: "/contact" }}
      />
    </>
  );
}

/** Deterministic abstract panel standing in for interior photography. */
function ShotArt({ seed }: { seed: number }) {
  const hue = 168 + ((seed * 9) % 26);
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id={`shot-${seed}`}
          cx={`${25 + ((seed * 13) % 50)}%`}
          cy={`${20 + ((seed * 19) % 45)}%`}
          r="80%"
        >
          <stop
            offset="0%"
            stopColor={`hsl(${hue} 70% 34%)`}
            stopOpacity="0.9"
          />
          <stop
            offset="55%"
            stopColor={`hsl(${hue + 12} 60% 16%)`}
            stopOpacity="0.85"
          />
          <stop offset="100%" stopColor="#05080b" />
        </radialGradient>
        <filter id={`blur-${seed}`}>
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>
      <rect width="800" height="500" fill="#05080b" />
      <rect width="800" height="500" fill={`url(#shot-${seed})`} />
      <g filter={`url(#blur-${seed})`} opacity="0.5">
        <circle
          cx={180 + ((seed * 87) % 440)}
          cy={140 + ((seed * 53) % 240)}
          r="150"
          fill={`hsl(${hue} 85% 52%)`}
          opacity="0.42"
        />
      </g>
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={i * 60} y1="0" x2={i * 60} y2="500" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1="0" y1={i * 60} x2="800" y2={i * 60} />
        ))}
      </g>
    </svg>
  );
}
