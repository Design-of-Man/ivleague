import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { site } from "@/content/site";

export function LocationSection() {
  return (
    <Section id="location" className="relative">
      <SectionHeading
        eyebrow="Visit us"
        title={
          <>
            500 Gulfstream Blvd, Suite 105,
            <br />
            <span className="text-ink-400">Delray Beach, Florida.</span>
          </>
        }
        lead="Southeast of the Woolbright Road exit off I-95, in the Gulfstream Professional Building, with free parking at the door."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Map */}
        <Reveal className="relative overflow-hidden rounded-[0.625rem] border border-white/8">
          <div className="relative aspect-[16/10] w-full bg-ink-900 sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            {/* Stylised fallback sits underneath: if the embed is slow, blocked
                by a privacy extension, or fails, the panel still reads as a map. */}
            <MapFallback />
            <iframe
              title={`Map to ${site.name}`}
              src={site.address.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] invert-[0.92] hue-rotate-[150deg] contrast-[0.9] saturate-[1.3]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent"
            />
          </div>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-[0.5rem] border border-white/10 bg-ink-950/94 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[14px] font-medium text-ink-50">
                {site.address.street}
              </p>
              <p className="text-[13px] text-ink-400">
                {site.address.city}, {site.address.region}{" "}
                {site.address.postalCode} · Free parking
              </p>
            </div>
            <ButtonLink
              href={site.address.directionsUrl}
              size="sm"
              variant="secondary"
              external
              className="shrink-0"
            >
              Get directions
              <ArrowGlyph />
            </ButtonLink>
          </div>
        </Reveal>

        {/* Details */}
        <div className="grid gap-4">
          <Reveal delay={0.08} className="card p-7">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              Hours
            </h3>
            {!site.hoursConfirmed && (
              <p className="mt-5 text-[14px] leading-relaxed text-ink-300">
                Weekend appointments are available. Call{" "}
                <a
                  href={site.contact.phoneHref}
                  className="text-brand-300 underline-offset-4 hover:underline"
                >
                  {site.contact.phone}
                </a>{" "}
                for today&rsquo;s hours.
              </p>
            )}
            <dl className={site.hoursConfirmed ? "mt-5 grid gap-3" : "hidden"}>
              {site.hoursSummary.map((h) => (
                <div
                  key={h.label}
                  className="flex items-baseline justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-[14px] text-ink-300">{h.label}</dt>
                  <dd className="text-[14px] font-medium text-ink-50">
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
              Weekend mornings and late-afternoon slots exist specifically so
              treatment doesn&apos;t cost you a workday.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="card p-7">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              Contact
            </h3>
            <div className="mt-5 grid gap-4">
              <a
                href={site.contact.phoneHref}
                className="group flex items-center justify-between gap-4"
              >
                <span className="text-[13px] text-ink-400">Phone</span>
                <span className="text-[15px] font-medium text-ink-50 transition-colors group-hover:text-brand-300">
                  {site.contact.phone}
                </span>
              </a>
              <a
                href={site.contact.emailHref}
                className="group flex items-center justify-between gap-4 border-t border-white/6 pt-4"
              >
                <span className="text-[13px] text-ink-400">Email</span>
                <span className="text-[13.5px] font-medium text-ink-50 transition-colors group-hover:text-brand-300">
                  {site.contact.email}
                </span>
              </a>
            </div>
            <ButtonLink
              href="/contact#inquiry"
              size="sm"
              className="mt-6 w-full"
            >
              New patient inquiry
              <ArrowGlyph />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/** Abstract street grid + pin, drawn in brand colors. */
function MapFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-ink-900"
    >
      <svg
        viewBox="0 0 800 520"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <rect width="800" height="520" fill="#070b0f" />
        <g stroke="#152128" strokeWidth="14" strokeLinecap="square">
          <path d="M-20 150h840M-20 330h840M120 -20v560M420 -20v560M640 -20v560" />
        </g>
        <g stroke="#0e161c" strokeWidth="5">
          <path d="M-20 60h840M-20 240h840M-20 430h840M260 -20v560M540 -20v560M730 -20v560" />
        </g>
        <g stroke="rgba(31,205,192,0.18)" strokeWidth="2" fill="none">
          <path d="M120 330 L420 330 L420 150" />
        </g>
        <circle cx="420" cy="330" r="42" fill="rgba(31,205,192,0.10)" />
        <circle cx="420" cy="330" r="22" fill="rgba(31,205,192,0.18)" />
        <circle cx="420" cy="330" r="7" fill="#35abdd" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_52%_63%,transparent,rgba(4,7,10,0.72))]" />
    </div>
  );
}
