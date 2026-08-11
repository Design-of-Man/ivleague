"use client";

import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { ArrowGlyph } from "@/components/ui/Button";

/** Teal progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-100 h-[2px] origin-left bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 shadow-[0_0_14px_rgba(31,205,192,0.8)]"
    />
  );
}

/**
 * Mobile action bar. Appears after the hero and gives one-tap access to the
 * two things anyone on a phone actually wants: call, or start intake.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 640));

  if (pathname.startsWith("/contact")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="no-print fixed inset-x-0 bottom-0 z-45 lg:hidden"
        >
          <div className="mx-3 mb-3 grid grid-cols-2 gap-2 rounded-[0.625rem] border border-white/10 bg-ink-900/92 p-2 shadow-[0_-10px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <a
              href={site.contact.phoneHref}
              className="flex h-12 items-center justify-center gap-2 rounded-[0.5rem] border border-white/10 bg-white/[0.04] text-[14px] font-medium text-ink-50"
            >
              Call now
            </a>
            <a
              href="/contact#inquiry"
              className="group/btn flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-teal-400 text-[14px] font-semibold text-ink-950"
            >
              Get started
              <ArrowGlyph />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Fade/lift transition between routes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Back-to-top pill for long directory pages. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 1600));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="no-print fixed bottom-24 right-4 z-45 hidden h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-900/90 text-ink-200 backdrop-blur-xl transition-colors hover:border-teal-400/40 hover:text-teal-300 lg:grid lg:bottom-8"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
