"use client";

import { usePathname } from "next/navigation";
import { useScrolledPast } from "@/lib/hooks";
import { site } from "@/content/site";
import { ArrowGlyph } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Shell chrome, deliberately free of any animation library.
 *
 * These three components render on every route, so anything they import is on
 * the critical path for the whole site. Everything here is a CSS transition or
 * a scroll-driven animation; the only JS is a passive scroll listener
 * coalesced into one rAF.
 */

/** Teal progress bar. Driven by `animation-timeline: scroll()` — zero JS. */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed inset-x-0 top-0 z-100 h-[2px] bg-gradient-to-r from-brand-500 via-brand-300 to-brand-500 shadow-[0_0_14px_rgba(31,205,192,0.8)]"
    />
  );
}

/**
 * Mobile action bar. Appears past the hero and gives one-tap access to the two
 * things anyone on a phone actually wants: call, or start intake.
 */
export function StickyCta() {
  const show = useScrolledPast(640);
  const pathname = usePathname();

  if (pathname.startsWith("/contact")) return null;

  return (
    <div
      className={cn(
        "no-print fixed inset-x-0 bottom-0 z-45 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] lg:hidden",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0",
      )}
    >
      <div className="mx-3 mb-3 grid grid-cols-2 gap-2 rounded-[0.625rem] border border-white/10 bg-ink-900/97 p-2 shadow-[0_-10px_40px_-16px_rgba(0,0,0,0.9)]">
        <a
          href={site.contact.phoneHref}
          tabIndex={show ? 0 : -1}
          className="flex h-12 items-center justify-center gap-2 rounded-[0.5rem] border border-white/10 bg-white/[0.04] text-[14px] font-medium text-ink-50"
        >
          Call now
        </a>
        <a
          href="/contact#inquiry"
          tabIndex={show ? 0 : -1}
          className="group/btn flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-brand-400 text-[14px] font-semibold text-ink-950"
        >
          Get started
          <ArrowGlyph />
        </a>
      </div>
    </div>
  );
}

/** Back-to-top pill for long directory pages. */
export function BackToTop() {
  const show = useScrolledPast(1600);

  return (
    <button
      type="button"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "no-print fixed bottom-24 right-4 z-45 hidden h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-900/96 text-ink-300 transition-[opacity,transform,color,border-color] duration-400 ease-[var(--ease-out-expo)] hover:border-brand-400/40 hover:text-brand-300 lg:grid lg:bottom-8",
        show
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-90 opacity-0",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
