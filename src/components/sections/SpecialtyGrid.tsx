import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { specialties, therapiesBySpecialty } from "@/content/therapies";
import { GridBackdrop } from "@/components/ui/Backdrop";

const glyphs: Record<string, React.ReactNode> = {
  gastroenterology: (
    <path d="M7 3v6a5 5 0 0 0 10 0V3M7 21v-4a5 5 0 0 1 10 0v4M12 9v6" />
  ),
  rheumatology: (
    <path d="M8 3v4.5L5 10v5l3 2.5V21M16 3v4.5l3 2.5v5l-3 2.5V21M8 12h8" />
  ),
  neurology: (
    <path d="M12 3a3.5 3.5 0 0 0-3.5 3.5c-1.4.5-2.4 1.9-2.4 3.4 0 .9.3 1.7.9 2.3-.6.7-.9 1.5-.9 2.4 0 2 1.6 3.6 3.6 3.6.4 1 1.3 1.8 2.3 1.8V3ZM12 3a3.5 3.5 0 0 1 3.5 3.5c1.4.5 2.4 1.9 2.4 3.4 0 .9-.3 1.7-.9 2.3.6.7.9 1.5.9 2.4 0 2-1.6 3.6-3.6 3.6-.4 1-1.3 1.8-2.3 1.8" />
  ),
  immunology: (
    <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.5 7.5 9.5 4.4-1 7.5-5.1 7.5-9.5V6L12 3Zm-2.5 8.8 1.9 1.9 3.6-3.7" />
  ),
  "allergy-asthma": (
    <path d="M6 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.6-1.9A4.2 4.2 0 0 1 19 18M9 14l2 3M13 13l2 4" />
  ),
  "bone-health": (
    <path d="M7.5 4.5a2.5 2.5 0 0 0-2 4l4.5 4.5m4.5-8.5a2.5 2.5 0 0 1 2 4l-4.5 4.5M6.5 19.5a2.5 2.5 0 0 1-2-4L9 11m4.5 8.5a2.5 2.5 0 0 0 2-4L11 11" />
  ),
  "infectious-disease": (
    <path d="M12 4v3m0 10v3m8-8h-3M7 12H4m13.7-5.7-2.1 2.1M8.4 15.6l-2.1 2.1m11.4 0-2.1-2.1M8.4 8.4 6.3 6.3M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
  ),
  endocrinology: (
    <path d="M12 4c-4.4 0-8 3.1-8 7s3.6 7 8 7 8-3.1 8-7-3.6-7-8-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
  ),
};

export function SpecialtyGrid() {
  return (
    <Section id="specialties" className="relative">
      <GridBackdrop className="opacity-50" />

      <SectionHeading
        eyebrow="What we treat"
        title={
          <>
            Eight specialties.
            <br />
            <span className="text-ink-400">One chair.</span>
          </>
        }
        lead="Complex, chronic and autoimmune diagnoses managed alongside your prescribing physician — with a formulary broad enough that most patients never need a second site of care."
        action={
          <ButtonLink href="/therapies" variant="secondary">
            Full formulary
            <ArrowGlyph />
          </ButtonLink>
        }
      />

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {specialties.map((s) => {
          const count = therapiesBySpecialty(s.id).length;
          return (
            <StaggerItem key={s.id}>
              <SpotlightCard
                href={`/therapies?specialty=${s.id}`}
                className="group flex h-full flex-col gap-5 p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-[0.5rem] border border-teal-400/20 bg-teal-400/[0.08] text-teal-300 transition-all duration-500 group-hover:border-teal-400/45 group-hover:bg-teal-400/15">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {glyphs[s.id]}
                  </svg>
                </span>

                <div className="flex-1">
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-teal-100">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-400">
                    {s.blurb}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/6 pt-4">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500">
                    {count} {count === 1 ? "therapy" : "therapies"}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5 text-teal-400 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-500">
        <span>Don&apos;t see your diagnosis?</span>
        <Link
          href="/conditions"
          className="link-underline font-medium text-teal-300 transition-colors hover:text-teal-200"
        >
          Browse conditions we treat
        </Link>
        <span className="text-ink-700">·</span>
        <Link
          href="/contact#inquiry"
          className="link-underline font-medium text-teal-300 transition-colors hover:text-teal-200"
        >
          or just ask us
        </Link>
      </div>
    </Section>
  );
}
