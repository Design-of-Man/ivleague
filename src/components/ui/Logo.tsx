import { cn } from "@/lib/utils";

/**
 * IV League Infusion Services' lockup — **their actual artwork**, not a redraw.
 *
 * Source: `public/brand/ivl-logo-source.png`, supplied by the client (266x66,
 * opaque white ground). Two things were done to it and nothing else:
 *
 *  1. The white ground was knocked out to alpha, with a soft matte between
 *     luminance 200 and 240 so the silver rule around the shield keeps its
 *     anti-aliasing. Nothing was recoloured.
 *  2. It was trimmed to the ink (x 11-259, y 3-61) and cut into two assets: the
 *     full lockup and the shield on its own for the icons.
 *
 * Knocking the white out rather than sitting the logo on a white chip is what
 * lets it work on this site: the shield's interior goes to the page's black and
 * the mark reads cleanly, while the same file still sits correctly on white.
 * Checked on both grounds before shipping.
 *
 * ⚠️ It is a 266px-wide raster. That is enough for the header at 1x and 2x, and
 * for a favicon, but the 512px PWA icon is upscaled ~10x from a 53px mark and is
 * visibly soft. An SVG/EPS would fix that one file and nothing else — see
 * CONTENT-REVIEW.md. Five hand-redrawn versions preceded this and all of them
 * were wrong; do not reintroduce one.
 */

/** Sampled from the supplied artwork, not estimated. */
export const BRAND = {
  /** Shield band. Darkest 1% of the lockup. */
  navy: "#2B3991",
  /** The droplet. */
  cyan: "#3EA4CE",
  /** The hairline around the shield. */
  silver: "#D1D2D4",
  /** The wordmark, which is near-uniform rather than a gradient. */
  word: "#1F8FC2",
} as const;

const LOCKUP = "/brand/ivl-logo.png";
const LOCKUP_2X = "/brand/ivl-logo@2x.png";
const MARK = "/brand/ivl-mark.png";
const MARK_4X = "/brand/ivl-mark@4x.png";

/** Intrinsic sizes of the trimmed assets, for aspect-ratio and CLS. */
const LOCKUP_W = 249;
const LOCKUP_H = 59;
const MARK_W = 53;
const MARK_H = 59;

/**
 * The shield on its own. Used where the full lockup would be too wide.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
  /** Accepted for call-site compatibility; the artwork suits both grounds. */
  onLight?: boolean;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the brand assets
          are fixed-size and already optimised; running them through the image
          optimiser costs a round trip for no saving. */}
      <img
        src={MARK}
        srcSet={`${MARK} 1x, ${MARK_4X} 4x`}
        width={MARK_W}
        height={MARK_H}
        alt=""
        decoding="async"
        className="h-full w-auto"
      />
      {animated && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -m-1 rounded-full ring-1 ring-[#3EA4CE]/40 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]"
        />
      )}
    </span>
  );
}

/**
 * The full lockup: shield, "IV LEAGUE", and "INFUSION SERVICES" beneath it.
 *
 * One image rather than a mark plus live type, because the wordmark's letter
 * spacing and weight are part of the artwork and setting them in Sora was one
 * of the things that made the earlier redraws read as not-quite-right.
 */
export function Logo({
  className,
  compact = false,
  animated = false,
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
  onLight?: boolean;
}) {
  const h = compact ? 30 : 34;
  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      style={{ height: h }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- see LogoMark. */}
      <img
        src={LOCKUP}
        srcSet={`${LOCKUP} 1x, ${LOCKUP_2X} 2x`}
        width={LOCKUP_W}
        height={LOCKUP_H}
        alt="IV League Infusion Services"
        decoding="async"
        /* Deliberately not fetchPriority="high". It is 13KB in the header and
           marking it high cost every interior page ~360ms of LCP by competing
           with the fonts and the CSS for the first connections. Measured. */
        style={{ height: h, width: (h * LOCKUP_W) / LOCKUP_H }}
        className="block"
      />
      {animated && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full ring-1 ring-[#3EA4CE]/35 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]"
        />
      )}
    </span>
  );
}
