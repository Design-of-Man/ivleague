import {
  Armchair,
  DoorClosed,
  Wifi,
  Tv,
  Users,
  Car,
  ThermometerSnowflake,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightCard, CornerTicks } from "@/components/ui/SpotlightCard";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { amenities } from "@/content/practice";

const icons: Record<string, LucideIcon> = {
  armchair: Armchair,
  "door-closed": DoorClosed,
  wifi: Wifi,
  tv: Tv,
  users: Users,
  car: Car,
  "thermometer-snowflake": ThermometerSnowflake,
};

export function AmenitiesBento() {
  return (
    <Section id="suite" className="relative">
      <SectionHeading
        eyebrow="The suite"
        title={
          <>
            Four hours is a long time
            <br />
            <span className="text-ink-400">to sit in a bad chair.</span>
          </>
        }
        lead="Every detail here exists because someone spent a whole afternoon in it. Private and semi-private suites, heated massaging recliners, fast Wi-Fi and a seat for whoever came with you."
        action={
          <ButtonLink href="/suite" variant="secondary">
            Look inside
            <ArrowGlyph />
          </ButtonLink>
        }
      />

      <Stagger className="mt-14 grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((a) => {
          const Icon = icons[a.icon] ?? Armchair;
          const isLarge = a.span === "lg";
          return (
            <StaggerItem
              key={a.title}
              className={isLarge ? "sm:col-span-2 sm:row-span-2" : undefined}
            >
              <SpotlightCard
                className={`group flex h-full flex-col justify-between gap-6 p-6 sm:p-7 ${
                  isLarge ? "min-h-[22rem]" : ""
                }`}
              >
                {isLarge && <CornerTicks />}

                {isLarge && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-70"
                  >
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(31,205,192,0.16),transparent_65%)] blur-2xl" />
                    <ChairArt />
                  </div>
                )}

                <span
                  className={`relative grid place-items-center rounded-[0.5rem] border border-brand-400/20 bg-brand-400/[0.07] text-brand-300 transition-all duration-500 group-hover:border-brand-400/45 ${
                    isLarge ? "h-13 w-13" : "h-11 w-11"
                  }`}
                >
                  <Icon
                    className={isLarge ? "h-6 w-6" : "h-5 w-5"}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>

                <div className="relative">
                  <h3
                    className={`font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-brand-100 ${
                      isLarge ? "text-2xl" : "text-[16.5px]"
                    }`}
                  >
                    {a.title}
                  </h3>
                  <p
                    className={`mt-2.5 leading-relaxed text-ink-400 ${
                      isLarge ? "max-w-md text-[15px]" : "text-[13.5px]"
                    }`}
                  >
                    {a.body}
                  </p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          );
        })}

        {/* Closing tile */}
        <StaggerItem>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[0.625rem] border border-brand-400/25 bg-gradient-to-br from-brand-500/15 via-brand-600/5 to-transparent p-6 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(31,205,192,0.28),transparent_65%)] blur-2xl"
            />
            <p className="relative text-[15px] font-medium leading-relaxed text-brand-50">
              Ask for a blanket, a private suite, the lights down, or the game
              on. The answer is almost always yes.
            </p>
            <ButtonLink
              href="/contact"
              variant="outline"
              size="sm"
              className="relative mt-6 w-fit"
            >
              Plan your visit
              <ArrowGlyph />
            </ButtonLink>
          </div>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}

/** Abstract line-art recliner for the large bento tile. */
function ChairArt() {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      className="absolute bottom-0 right-0 h-48 w-auto opacity-[0.18]"
      aria-hidden="true"
    >
      <g
        stroke="#6ec6ed"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 180v-24c0-10 6-16 16-16h132c10 0 16 6 16 16v24" />
        <path d="M76 140V72c0-14 10-24 24-24h84c14 0 24 10 24 24v68" />
        <path d="M76 96H54c-8 0-14 6-14 14v34c0 8 6 14 14 14h22" />
        <path d="M208 96h22c8 0 14 6 14 14v34c0 8-6 14-14 14h-22" />
        <path d="M72 180v20M212 180v20" />
        <path d="M100 72h84M100 92h84M100 112h60" opacity="0.5" />
      </g>
      <g stroke="#a7dbf5" strokeWidth="1" opacity="0.5">
        <path d="M262 40v70M262 110l-14 14M262 110l14 14" />
        <circle cx="262" cy="34" r="6" />
      </g>
    </svg>
  );
}
