"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/content/site";

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
      // The runway only exists where the film actually scrubs. The media query
      // is the same one that picks the mode, so a touch device gets a single
      // screen with a looping clip rather than two extra screens of scrolling
      // past a video that is not responding to the scroll.
      className="relative h-svh [@media(hover:hover)_and_(pointer:fine)]:h-[264svh]"
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
          {/*
            No tint over the footage. The plate stays the white it was shot on,
            which means the type has to be dark rather than light — an untinted
            white film with white text on it is unreadable, and dimming the film
            to fix that is the thing being avoided.

            The only overlay is a white lift on the left third. It raises the
            grey caustics under the headline to near-paper so dark type holds
            contrast wherever the splash happens to be in the frame, and it
            fades out entirely before it reaches the bag.
          */}
          {/* Narrow: the copy spans the full width, so a left-weighted veil
              leaves body text sitting on the bag. Lifted top to bottom instead,
              clearing toward the base where the splash still reads. */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 52%, rgba(255,255,255,0.62) 78%, rgba(255,255,255,0.3) 100%)",
            }}
          />
          {/* Wide: the copy occupies the left half, so the lift can too, and
              the bag stays untouched. */}
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(96deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.5) 44%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0) 74%)",
            }}
          />
          {/* Hand-off to the black page underneath. Confined to the bottom
              tenth so it reads as a transition, not a scrim. */}
          <div
            className="absolute inset-x-0 bottom-0 h-[9%]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(4,7,10,0) 0%, rgba(4,7,10,0.35) 45%, #04070a 100%)",
            }}
          />
        </div>

        {/* -------------------------------- Copy ------------------------------ */}
        {/*
          Dark type on the light plate. Hierarchy is carried by size and weight,
          with colour used only to separate the three levels — headline near
          black, lead a mid slate, utility text lighter still. Spacing steps on
          the 8/16/32/48 scale, and the gap between groups is always larger than
          the gap inside one, so the eyebrow belongs to the headline and the
          headline does not belong to the buttons.
        */}
        <div className="shell-wide relative w-full">
          <div className="max-w-[46rem]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-2 pr-4 ring-1 ring-inset ring-ink-950/10 backdrop-blur-sm">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-teal-500 opacity-70 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-700" />
              </span>
              <span className="text-[12px] font-medium tracking-[0.01em] text-ink-950">
                Now accepting new patients
              </span>
              <span className="h-3 w-px bg-ink-950/15" />
              <span className="text-[12px] text-ink-550">
                {site.address.city}, {site.address.region}
              </span>
            </div>

            {/*
              The LCP element. No entrance animation, no starting opacity of 0,
              no dependency on hydration: it is in the server HTML and paints on
              the first frame.
            */}
            <h1 className="mt-6 text-hero font-semibold leading-[0.94] tracking-[-0.045em] text-ink-950 text-balance sm:mt-8 sm:leading-[0.92]">
              Infusion care
              <br />
              <span className="text-teal-700">without the hospital.</span>
            </h1>

            {/* ~58 characters a line: inside the 45-75 the eye tracks best. */}
            <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.6] text-ink-550 sm:mt-8 sm:text-[19px] sm:leading-[1.62]">
              Biologics, IVIG and IV therapy in private suites, administered by
              nurses who know your name, with the insurance work finished before
              you ever sit down.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink href="/contact#inquiry" variant="dark" size="xl">
                Become a patient
                <ArrowGlyph />
              </ButtonLink>
              <ButtonLink href="/therapies" variant="onLight" size="xl">
                Explore therapies
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2.5 sm:mt-12 sm:gap-y-3">
              {[
                "Physician referral required",
                "Most major plans accepted",
                "Open 7 days a week",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-[13.5px] text-ink-550"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5 shrink-0 text-teal-700"
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
        </div>

        {/* Scroll affordance: the shot only happens if you scroll. */}
        {mode === "scrub" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[13%] hidden justify-center lg:flex"
          >
            <span className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-550/70">
              Scroll
              <span className="h-6 w-px animate-[drip_2.6s_var(--ease-in-out-quint)_infinite] bg-gradient-to-b from-teal-600 to-transparent" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
