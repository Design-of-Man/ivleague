"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/content/site";
import { specialties } from "@/content/therapies";

const SRC = "/media/hero-infusion.mp4";
const SRC_WEBM = "/media/hero-infusion.webm";
const POSTER = "/media/hero-infusion.jpg";

/**
 * Full-bleed hero. The bag meets the water as you scroll.
 *
 * The section is a tall scroll runway with a pinned viewport inside it, so the
 * film holds still on screen while the page scrolls past and the scroll offset
 * drives `video.currentTime` instead of the clock. Scrolling back up runs the
 * splash in reverse, which is most of why it feels good.
 *
 * Three things make it survive contact with real devices:
 *
 * **The file is all-intra.** Scrubbing seeks to an arbitrary time on every
 * scroll frame, and with a normal GOP the decoder walks back to the previous
 * keyframe for each one, which stutters. Every frame is a keyframe (see
 * `tools/hero-render/README.md`), which is why the mp4 is 2MB rather than 1MB.
 *
 * **Seeks are coalesced into one rAF.** A scroll event can fire many times per
 * frame; setting `currentTime` on each is how you get a jammed decoder. One
 * write per animation frame, and none at all while a previous seek is still in
 * flight.
 *
 * **It degrades rather than breaks.** iOS refuses to seek video that has not
 * buffered, and a coarse pointer is a bad fit for scrub anyway, so touch
 * devices play the clip as a normal loop instead. Reduced motion holds a still
 * frame and loads no video at all. The layout is identical in every case, so
 * none of this costs a layout shift.
 */
export function ScrollHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // `armed` is null until we have decided it is safe to fetch the film. The
  // visible mode is derived rather than stored, so reduced-motion needs no
  // setState at all — synchronously setting state inside an effect is what
  // triggers the cascading-render lint, and the derivation is simpler anyway.
  const [armed, setArmed] = useState<"scrub" | "loop" | null>(null);
  const mode: "poster" | "scrub" | "loop" = reduce || armed === null ? "poster" : armed;

  /* ----------------------------- decide the mode ---------------------------- */
  useEffect(() => {
    if (reduce) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/.test(conn.effectiveType)) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Never on the critical path: wait for load, then an idle beat.
    const arm = () => {
      const idle =
        window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 400));
      idle(() => setArmed(fine ? "scrub" : "loop"));
    };
    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, [reduce]);

  /* ------------------------------- the scrub -------------------------------- */
  const seeking = useRef(false);
  const frame = useRef(0);

  const sync = useCallback(() => {
    frame.current = 0;
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v || !v.duration || Number.isNaN(v.duration)) return;

    const rect = el.getBoundingClientRect();
    const runway = rect.height - window.innerHeight;
    if (runway <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / runway));

    // Hold the last tenth on the settled frame so the ripples have somewhere to
    // rest instead of the shot ending the instant the section does.
    const eased = Math.min(1, p / 0.9);
    const t = eased * (v.duration - 0.05);

    if (seeking.current) return;
    if (Math.abs(v.currentTime - t) < 0.016) return;
    seeking.current = true;
    v.currentTime = t;
  }, []);

  useEffect(() => {
    if (mode !== "scrub") return;
    const v = videoRef.current;
    if (!v) return;

    const onSeeked = () => {
      seeking.current = false;
    };
    v.addEventListener("seeked", onSeeked);

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(sync);
    };
    // `preload="auto"` is only a hint, and a video that is never played is a
    // video the browser feels free to stop fetching — the load was aborting at
    // networkState 3 with duration NaN, so no seek could ever land. Kicking
    // play() and pausing on the next tick forces the decoder up and the buffer
    // to fill, which is what scrubbing needs. It stays silent and invisible:
    // the element is muted and still faded out at this point.
    v.load();
    const wake = () => {
      v.play()
        .then(() => {
          v.pause();
          v.currentTime = 0;
          sync();
        })
        .catch(() => {
          // Autoplay refused. Seeking still works once data has arrived.
          sync();
        });
    };
    const start = () => wake();
    v.addEventListener("loadedmetadata", start, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("loadedmetadata", start);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [mode, sync]);

  useEffect(() => {
    if (mode !== "loop") return;
    videoRef.current?.play().catch(() => {});
  }, [mode]);

  return (
    <section
      ref={sectionRef}
      // The runway. Roughly two extra screens of scroll to play five seconds of
      // film, which lands at a pace that reads as deliberate rather than twitchy.
      className="relative h-[260svh] lg:h-[280svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {/* ------------------------------ Footage ----------------------------- */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- measured:
              routing the poster through next/image cost 10 Lighthouse points
              and took TBT from 108ms to 457ms, because the optimizer runs per
              request and the browser fetched both the optimized and raw files.
              Do not "fix" this without re-measuring. */}
          <img
            src={POSTER}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
          />

          {mode !== "poster" && (
            <video
              ref={videoRef}
              muted
              playsInline
              loop={mode === "loop"}
              preload="auto"
              poster={POSTER}
              tabIndex={-1}
              className="absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-0 transition-opacity duration-700 [&[data-ready='true']]:opacity-100"
              onLoadedData={(e) => e.currentTarget.setAttribute("data-ready", "true")}
            >
              {/*
                Two sources, h264 first, deliberately.

                Every shipping browser plays h264, and the all-intra h264 is
                smaller than the equivalent VP9 (2.0MB against 2.6MB), so real
                visitors take the mp4. The webm exists for Chromium builds
                compiled without proprietary codecs — which includes
                Playwright's bundled browser. Without it every automated check
                of this hero fails with DEMUXER_ERROR_NO_SUPPORTED_STREAMS, and
                the hero looks broken when it is only untestable.
              */}
              <source src={SRC} type="video/mp4" />
              <source src={SRC_WEBM} type="video/webm" />
            </video>
          )}

          {/*
            The footage is white and the type is white, so the scrim is doing
            legibility work, not decoration. It is weighted to the left, where
            the copy sits, and stays light on the right so the splash is still
            visible rather than fogged out.
          */}
          {/* Horizontal: opaque under the type, clearing to almost nothing over
              the splash. Stacked Tailwind gradients were compounding to near
              black and hiding the shot, so the stops are explicit. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, #04070a 0%, rgba(4,7,10,0.96) 30%, rgba(4,7,10,0.72) 46%, rgba(4,7,10,0.28) 64%, rgba(4,7,10,0.06) 82%, rgba(4,7,10,0.02) 100%)",
            }}
          />
          {/* Vertical: just enough top and bottom to seat the nav and hand off
              to the next section. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(4,7,10,0.72) 0%, rgba(4,7,10,0) 22%, rgba(4,7,10,0) 68%, #04070a 100%)",
            }}
          />
        </div>

        {/* -------------------------------- Copy ------------------------------ */}
        <div className="shell-wide relative w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-400/25 bg-teal-400/[0.07] py-1.5 pl-2 pr-4 backdrop-blur-sm">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-300" />
              </span>
              <span className="text-[12px] font-medium tracking-[0.02em] text-teal-100">
                Now accepting new patients
              </span>
              <span className="h-3 w-px bg-teal-400/25" />
              <span className="text-[12px] text-teal-300/80">
                {site.address.city}, {site.address.region}
              </span>
            </div>

            {/*
              The LCP element. No entrance animation, no starting opacity of 0,
              no dependency on hydration: it is in the server HTML and paints on
              the first frame, above the film in both senses.
            */}
            <h1 className="mt-8 text-hero font-semibold leading-[0.92] tracking-[-0.045em]">
              Infusion care
              <br />
              <span className="text-gradient text-glow">without the hospital.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lead leading-relaxed text-ink-200">
              Biologics, IVIG and IV therapy in private suites, administered by
              nurses who know your name, with the insurance work finished before
              you ever sit down.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact#inquiry" size="xl">
                Become a patient
                <ArrowGlyph />
              </ButtonLink>
              <ButtonLink href="/therapies" variant="secondary" size="xl">
                Explore therapies
              </ButtonLink>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[
                "Physician referral required",
                "Most major plans accepted",
                "Open 7 days a week",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-[13.5px] text-ink-300"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5 shrink-0 text-teal-400"
                    aria-hidden="true"
                  >
                    <path
                      d="m3.5 8.4 3 3L12.5 5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialty rail, pinned to the bottom of the frame */}
          <div className="mt-14 hidden border-t border-white/10 pt-6 lg:block">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
                On formulary
              </span>
              {specialties.map((s) => (
                <Link
                  key={s.id}
                  href={`/therapies?specialty=${s.id}`}
                  className="rounded-full border border-white/10 bg-ink-950/40 px-4 py-2 text-[13px] text-ink-200 backdrop-blur-sm transition-all duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-teal-400/35 hover:bg-teal-400/[0.1] hover:text-teal-100"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll affordance: the shot only happens if you scroll. */}
        {mode === "scrub" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
          >
            <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
              <span className="h-6 w-px animate-[drip_2.6s_var(--ease-in-out-quint)_infinite] bg-gradient-to-b from-teal-400 to-transparent" />
              Scroll
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
