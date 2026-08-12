import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function CtaBand({
  eyebrow = "Next step",
  title,
  body,
  primary = { label: "Become a patient", href: "/contact#inquiry" },
  secondary,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={cn("relative py-20 sm:py-28", className)}>
      <div className="shell">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[0.875rem] border border-brand-400/20 bg-gradient-to-br from-brand-500/[0.14] via-ink-900 to-ink-950 px-7 py-14 sm:px-14 sm:py-20">
            {/* Ambient */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,205,192,0.28),transparent_65%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(11,178,166,0.2),transparent_68%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 dot-grid opacity-30"
              style={{
                maskImage:
                  "radial-gradient(ellipse 60% 80% at 70% 30%, black, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 80% at 70% 30%, black, transparent 75%)",
              }}
            />

            <div className="relative mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-400">
                {eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(1.85rem,1.2rem+2.8vw,3.25rem)] font-semibold leading-[1.05]">
                {title}
              </h2>
              {body && (
                <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-300">
                  {body}
                </p>
              )}

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href={primary.href} size="xl">
                  {primary.label}
                  <ArrowGlyph />
                </ButtonLink>
                <ButtonLink
                  href={secondary?.href ?? site.contact.phoneHref}
                  variant="secondary"
                  size="xl"
                >
                  {secondary?.label ?? site.contact.phone}
                </ButtonLink>
              </div>

              <p className="mt-8 text-[12.5px] text-ink-500">
                Physician referral required · Most major insurance accepted ·
                HSA, FSA and Cherry financing available
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
