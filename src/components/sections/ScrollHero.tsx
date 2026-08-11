"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/content/site";

const POSTER = "/media/hero-infusion.jpg"; // = the 1280 rung, for the `poster` attribute
const POSTER_SET = [640, 960, 1280, 1920, 2560]
  .map((w) => `/media/hero-infusion-${w}.jpg ${w}w`)
  .join(", ");

/**
 * Hero: an IV bag meeting still water, in slow motion. Full-bleed behind the
 * headline on a wide screen, a band beneath it on a phone.
 *
 * The slow motion is baked into the file, not done with `playbackRate`. Halving
 * the rate of 24fps footage leaves twelve real frames a second and it judders;
 * the encode synthesises intermediate frames from motion vectors instead, so a
 * 2.5x slowdown still lands on 24 genuine frames per second.
 *
 * It plays once and holds, rather than looping. The clip opens on still water
 * and ends on the settled bag, so a loop would cut between two very different
 * frames — and the held last frame is the poster, byte for byte, so the film
 * comes to rest on exactly the image that was there before it started.
 *
 * Three sources, widest first: a browser takes the first one whose `media`
 * query matches and whose codec it can decode, so a large display pulls the
 * 1440p plate and a phone never downloads it. The 720p file is not a downgrade
 * on a phone — it is already more pixels than the viewport has.
 *
 * The film stays off the critical path. The poster is a plain `<img>` that
 * paints on the first frame, and the `<video>` is not mounted until the page
 * has loaded and gone idle, so it cannot compete with the font, the CSS or the
 * headline. Reduced motion, Save-Data and 2g/3g never mount it at all and keep
 * the poster, which is a finished still on its own.
 */
export function ScrollHero() {
  // Emits a <link rel="preload"> into the head during the server render, so
  // the poster starts downloading alongside the CSS instead of waiting for the
  // parser to reach the <img> near the bottom of the document. It is the LCP
  // element; the same srcset and sizes go here so the browser preloads the
  // rung it will actually use rather than a second file.
  ReactDOM.preload("/media/hero-infusion.jpg", {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: POSTER_SET,
    imageSizes: "100vw",
  });

  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const show = !reduce && armed;

  useEffect(() => {
    if (reduce) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/.test(conn.effectiveType)) return;

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
    if (!show) return;
    videoRef.current?.play().catch(() => {});
  }, [show]);

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-white lg:justify-center lg:bg-transparent">
      {/* -------------------------------- Footage ------------------------------ */}
      {/*
        Two arrangements, because a 16:9 plate and a 9:19.5 viewport cannot be
        reconciled. Behind the copy on a wide screen; a band under it on a
        phone, where `object-cover` would otherwise magnify the bag to two
        thirds of the screen width and park it under the buttons. `mt-auto`
        pins the band to the bottom of the viewport when the copy is short.
      */}
      <div
        aria-hidden="true"
        className="relative order-last mt-auto aspect-[2/1] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:aspect-auto"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- measured:
            routing the poster through next/image cost 10 Lighthouse points and
            took TBT from 108ms to 457ms, because the optimizer runs per request
            and the browser fetched both the optimized and the raw file. Do not
            "fix" this without re-measuring. */}
        <img
          src={POSTER}
          srcSet={POSTER_SET}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {show && (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            /* Deliberately no `poster`. The <img> behind this element is
               already that exact frame, so a poster here is a second download
               of the same picture — and, because it paints only once the
               element mounts after load, it registered as the Largest
               Contentful Paint at 4.1s and cost the homepage ten points. */
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 [&[data-ready='true']]:opacity-100"
            onPlaying={(e) => e.currentTarget.setAttribute("data-ready", "true")}
          >
            <source
              src="/media/hero-infusion-1440.mp4"
              type="video/mp4"
              media="(min-width: 1600px)"
            />
            <source
              src="/media/hero-infusion-1080.mp4"
              type="video/mp4"
              media="(min-width: 1024px)"
            />
            <source src="/media/hero-infusion.mp4" type="video/mp4" />
            {/* For Chromium builds without proprietary codecs, which includes
                Playwright's — without it every automated check of this hero
                reports a broken video that is fine in production. */}
            <source src="/media/hero-infusion.webm" type="video/webm" />
          </video>
        )}

        {/*
          No tint. The plate stays the white it was shot on, which is why the
          type is dark rather than light. The only overlay is a WHITE lift, and
          it needs two gradients because one does not work at both widths.
        */}
        {/* Phone: nothing sits on the film, so the only job is dissolving its
            top edge into the white the copy is set on. Without this the band
            starts on a hard horizontal rule. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.82) 12%, rgba(255,255,255,0.44) 26%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0) 54%)",
          }}
        />
        {/* Desktop: the lift runs across instead of down, clearing by 74% so
            the bag at 55% sits in open plate. */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(96deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.5) 44%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0) 74%)",
          }}
        />
        {/* Hand-off to the black page below. A short, hard ramp reads as a
            band; this one starts early and stays near-transparent for most of
            its run, so what you notice is the page going dark, not an edge. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[18%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,7,10,0) 0%, rgba(4,7,10,0.04) 34%, rgba(4,7,10,0.16) 58%, rgba(4,7,10,0.48) 78%, rgba(4,7,10,0.85) 92%, #04070a 100%)",
          }}
        />
      </div>

      {/* --------------------------------- Copy -------------------------------- */}
      {/*
        Dark type on the light plate. Hierarchy is carried by size and weight,
        with colour separating the three levels — headline near black, lead a
        mid slate, utility text lighter. Spacing steps on the 8/16/32/48 scale,
        and the gap between groups is always larger than the gap inside one.
      */}
      {/* Tighter vertically on a phone than on a desktop, because here the copy
          shares the screen with the band rather than floating in the middle of
          a full-height plate. */}
      <div className="shell-wide relative w-full pb-6 pt-[5.5rem] sm:pb-14 sm:pt-28 lg:py-32">
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
            The LCP element. No entrance animation, no starting opacity of 0, no
            dependency on hydration: it is in the server HTML and paints on the
            first frame.
          */}
          <h1 className="mt-6 text-hero font-semibold leading-[0.94] tracking-[-0.045em] text-ink-950 text-balance sm:mt-8 sm:leading-[0.92]">
            Infusion care
            <br />
            <span className="text-teal-700">without the hospital.</span>
          </h1>

          {/* ~58 characters a line: inside the 45-75 the eye tracks best. */}
          <p className="mt-5 max-w-[34rem] text-[17px] leading-[1.6] text-ink-550 sm:mt-8 sm:text-[19px] sm:leading-[1.62]">
            Biologics, IVIG and IV therapy in private suites, administered by
            nurses who know your name, with the insurance work finished before
            you ever sit down.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="/contact#inquiry" variant="dark" size="xl">
              Become a patient
              <ArrowGlyph />
            </ButtonLink>
            <ButtonLink href="/therapies" variant="onLight" size="xl">
              Explore therapies
            </ButtonLink>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-2 sm:mt-12 sm:gap-y-3">
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
    </section>
  );
}
