"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * The hero film: an IV bag landing on still water, shot from directly overhead.
 *
 * A video hero is the most expensive thing a marketing site can do to its
 * Largest Contentful Paint, so this is built so the video can never be on the
 * critical path:
 *
 *   - The poster frame is a real <img> with `fetchPriority="high"`, so the
 *     hero has something painted on the first frame either way.
 *   - The <video> carries `preload="none"` and its source is attached only
 *     after the page has loaded. Until then the browser does not know there is
 *     a video to fetch, so it cannot compete with the font, the CSS or the
 *     headline for bandwidth.
 *   - The headline lives outside this component and is never covered by it,
 *     so text remains the LCP element.
 *
 * It also declines to play at all when it shouldn't: reduced-motion holds the
 * poster, and so does Save-Data or a connection reporting 2g/3g. Autoplaying
 * 4MB at a patient on a hospital wifi is not a design flourish.
 */
export function HeroVideo({
  src,
  poster,
  className,
  /** >1 crops in. The plate is framed a little wide for a hero. */
  zoom = 1.18,
}: {
  src: string;
  poster: string;
  className?: string;
  zoom?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduce) return;

    // Respect an explicit data-saving preference and slow radios.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/.test(conn.effectiveType)) return;

    // Wait for load, then one idle beat, so nothing on the critical path is
    // competing with a multi-megabyte file.
    const arm = () => {
      const idle =
        window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 400));
      idle(() => setArmed(true));
    };
    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, [reduce]);

  useEffect(() => {
    if (!armed) return;
    const v = ref.current;
    if (!v) return;
    // Autoplay can still be refused; the poster stays underneath if it is.
    v.play().catch(() => {});
  }, [armed]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[0.625rem] border border-white/8 bg-ink-900",
        className,
      )}
    >
      {/* Painted immediately; the video fades in over the top of it later. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- deliberately a
          plain <img>: this is the poster frame for a video, and next/image's
          wrapper markup and lazy behaviour get in the way of it being the
          thing that paints first. */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `scale(${zoom})` }}
      />

      {armed && !failed && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 [&[data-ready='true']]:opacity-100"
          style={{ transform: `scale(${zoom})` }}
          onPlaying={(e) => e.currentTarget.setAttribute("data-ready", "true")}
          // If the file is absent or the codec is refused, take the element out
          // of the tree rather than leaving a <video> that re-requests a 404 on
          // every load. The poster underneath is a finished image on its own.
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}

      {/*
        Seating the plate in a black page, without killing it.

        The first attempt laid a multiply gradient across the whole frame and
        turned a bright white product shot into grey fog — which is the one
        thing the footage is not. A white plate in a dark page is the effect
        worth having: it reads as a lightbox. So the scrim is now only a short
        fade at the bottom edge, enough to stop the panel ending in a hard line
        above the readouts, plus a teal cast that ties it to the palette.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-950/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-teal-400/[0.06] mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
      />
    </div>
  );
}
