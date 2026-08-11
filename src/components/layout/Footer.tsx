import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { LogoMarquee } from "@/components/sections/LogoWall";
import { site, footerNav } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink-950">
      {/* Ambient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-64 h-[36rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(31,205,192,0.13),transparent_70%)]"
      />

      {/* Payer logo marquee */}
      <div className="relative border-b border-white/6 py-7">
        <LogoMarquee speed={64} />
      </div>

      {/* CTA */}
      <div className="relative shell border-b border-white/6 py-16 sm:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] font-semibold leading-[1.05]">
              Start treatment without
              <br />
              <span className="text-gradient">starting a fight with your insurer.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-400">
              Send us your name and diagnosis. We handle orders, benefits and prior
              authorization from there, and tell you what you&apos;ll owe before you
              schedule.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <ButtonLink href="/contact#inquiry" size="lg">
              New patient inquiry
              <ArrowGlyph />
            </ButtonLink>
            <ButtonLink href={site.contact.phoneHref} variant="secondary" size="lg">
              {site.contact.phone}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="relative shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_2.65fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" className="w-fit">
              <Logo />
            </Link>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-ink-400">
              A locally owned outpatient infusion center in {site.address.city},{" "}
              {site.address.regionName}. Biologics, IVIG, IV anti-infectives and
              wellness therapy, delivered by nurses who know your name.
            </p>

            <address className="not-italic text-[13.5px] leading-relaxed text-ink-400">
              <a
                href={site.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 transition-colors hover:text-teal-300"
              >
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </a>
              <a
                href={site.contact.phoneHref}
                className="mt-3 block py-0.5 font-medium text-ink-100 transition-colors hover:text-teal-300"
              >
                {site.contact.phone}
              </a>
              <a
                href={site.contact.emailHref}
                className="block py-0.5 transition-colors hover:text-teal-300"
              >
                {site.contact.email}
              </a>
            </address>

            <div className="flex items-center gap-2.5">
              <SocialLink href={site.social.instagram} label="Instagram">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.83-.4.4-.63.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.07 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.83 1.3.4.4.8.63 1.3.83.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.83.4-.4.63-.8.83-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-3.3s0-2.1-.07-3.3c-.05-1.1-.24-1.7-.4-2.1a3.5 3.5 0 0 0-.83-1.3 3.5 3.5 0 0 0-1.3-.83c-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.3-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
              </SocialLink>
              <SocialLink href={site.social.facebook} label="Facebook">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
              </SocialLink>
              <SocialLink href={site.social.linkedin} label="LinkedIn">
                <path d="M6.94 5.5a2.06 2.06 0 1 1-4.12 0 2.06 2.06 0 0 1 4.12 0ZM3.1 8.98h3.66V21H3.1V8.98Zm5.98 0h3.5v1.64h.05c.49-.92 1.68-1.9 3.45-1.9 3.69 0 4.37 2.42 4.37 5.57V21h-3.65v-5.98c0-1.43-.03-3.26-1.99-3.26-1.99 0-2.29 1.55-2.29 3.16V21H9.08V8.98Z" />
              </SocialLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
                  {col.heading}
                </h3>
                <ul className="mt-5 grid gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13.5px] text-ink-400 transition-colors duration-300 hover:text-teal-200"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal strip */}
      <div className="relative border-t border-white/6">
        <div className="shell flex flex-col gap-4 py-7 text-[12px] text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="max-w-2xl leading-relaxed md:text-right">
            Information on this site is educational and is not medical advice. A physician
            referral is required for all therapies. Wellness infusions are not evaluated
            by the FDA to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div
        aria-hidden="true"
        className="relative -mb-[3.2vw] select-none overflow-hidden px-4 pb-2"
      >
        <p className="whitespace-nowrap bg-gradient-to-b from-white/[0.055] to-transparent bg-clip-text text-center font-display text-[15.5vw] font-semibold leading-[0.8] tracking-[-0.05em] text-transparent">
          IV LEAGUE
        </p>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink-300 transition-all duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
