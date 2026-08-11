import Link from "next/link";
import { Aurora, GridBackdrop } from "@/components/ui/Backdrop";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const LINKS = [
  { label: "All therapies", href: "/therapies" },
  { label: "Conditions we treat", href: "/conditions" },
  { label: "Wellness infusions", href: "/wellness" },
  { label: "Patient FAQ", href: "/patients/faq" },
  { label: "Insurance & billing", href: "/insurance" },
  { label: "Visit us", href: "/locations" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-40 pb-24">
      <Aurora intensity="subtle" />
      <GridBackdrop />

      <div className="shell relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-400">
            404 · No line here
          </p>
          <h1 className="mt-6 text-display font-semibold leading-[1.02]">
            This page has
            <br />
            <span className="text-gradient">infiltrated.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lead leading-relaxed text-ink-300">
            The page you were looking for isn&apos;t here. Let&apos;s get you back into a
            good vein.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              Back to home
              <ArrowGlyph />
            </ButtonLink>
            <ButtonLink href={site.contact.phoneHref} variant="secondary" size="lg">
              {site.contact.phone}
            </ButtonLink>
          </div>

          <div className="mt-14 border-t border-white/8 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">
              Popular pages
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-white/8 bg-white/[0.025] px-4 py-2 text-[13px] text-ink-300 transition-all duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-teal-400/35 hover:text-teal-200"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
