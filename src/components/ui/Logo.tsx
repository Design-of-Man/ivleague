import { cn } from "@/lib/utils";

/**
 * IV League Infusion Services' mark: a double-ruled heraldic shield with a
 * water droplet inside it, the droplet running from cyan at the base to deep
 * blue at the tip.
 *
 * ⚠️ Redrawn from the raster the client supplied, not from their artwork. The
 * proportions and colours are read off that image and are close, not exact.
 * Drop in the original SVG/EPS/AI and delete this note — it is listed in
 * CONTENT-REVIEW.md. (It replaces an earlier version traced off a screenshot
 * of their website, which had the wrong mark entirely: a bare teal droplet
 * with no shield.)
 *
 * Drawn as SVG rather than a raster so one definition serves a 16px favicon
 * and a 400px footer lockup, and so the shield rule can change weight on a
 * dark ground — their navy reads as authoritative on white and disappears
 * completely on black.
 */

/** Brand colours, sampled from the supplied lockup. */
export const BRAND = {
  /** The shield band. A deep indigo-navy, not a mid blue. */
  navy: "#1D2E7C",
  /** Bottom of the droplet. */
  cyan: "#29ABE2",
  /** Top of the droplet, where it deepens. */
  deep: "#1B60AE",
  /** The wordmark runs as a gradient, dark on the left to light on the right. */
  wordFrom: "#1B3F94",
  wordTo: "#2E9BD6",
  subFrom: "#3E86C4",
  subTo: "#5FB4DE",
  /** The band again, lifted enough to survive on near-black. */
  onDark: "#5C8FE0",
} as const;

const SHIELD =
  "M7.2 7C12.5 5.4 18.2 4.6 24 4.6c5.8 0 11.5.8 16.8 2.4V25c0 9.8-7 16.4-16.8 19.8C14.2 41.4 7.2 34.8 7.2 25Z";
const DROP =
  "M22.8 11.6c0 0 8.4 10 8.4 15.8a8.2 8.2 0 0 1-16.4 0c0-4.8 4.4-10.2 8-15.8Z";
const SWIRL =
  "M22.9 16c-2 3.6-3.8 6.6-3.8 8.9 0 1.8 1 3.3 2.5 4.1-.9-1.5-1.2-2.9-.7-4.6.5-2.3 1.4-4.8 2-8.4Z";

export function LogoMark({
  className,
  animated = false,
  /** `onLight` uses the navy rule from the original. Default is the dark-ground treatment. */
  onLight = false,
  /** Unique per instance — SVG gradient ids are global to the document. */
  idSuffix = "",
}: {
  className?: string;
  animated?: boolean;
  onLight?: boolean;
  idSuffix?: string;
}) {
  const gid = `ivl-drop${idSuffix}`;
  const rule = onLight ? BRAND.navy : BRAND.onDark;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gid}
          x1="19"
          y1="29"
          x2="29"
          y2="12.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={BRAND.cyan} />
          <stop offset="100%" stopColor={BRAND.deep} />
        </linearGradient>
      </defs>

      {/* A thick band, not a hairline rule — the shield in the original reads
          as a solid navy frame with the interior knocked out. */}
      <path d={SHIELD} stroke={rule} strokeWidth="3" strokeLinejoin="round" />
      <path
        d={DROP}
        fill={`url(#${gid})`}
        stroke={rule}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* The lighter comma inside the drop, and the specular edge on its left. */}
      <path d={SWIRL} fill="#ffffff" opacity="0.42" />

      {animated && (
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke={BRAND.cyan}
          strokeWidth="1"
          fill="none"
          opacity="0.4"
          className="origin-center animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]"
        />
      )}
    </svg>
  );
}

/**
 * The full lockup: the shield, then "IV LEAGUE" over "INFUSION SERVICES"
 * tracked out to sit under it. On their artwork both tiers are blue; on this
 * site's black ground the top tier goes white so it carries, and the tracked
 * line keeps the brand cyan.
 */
export function Logo({
  className,
  compact = false,
  animated = false,
  onLight = false,
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
  onLight?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark
        animated={animated}
        onLight={onLight}
        idSuffix={compact ? "-c" : ""}
        className={compact ? "h-8 w-8" : "h-9 w-9"}
      />
      <span className="flex flex-col leading-none">
        {/* Both tiers run as a horizontal gradient, dark left to light right,
            which is how the original is drawn. On the black ground the top tier
            starts at white instead of navy so it still carries. */}
        <span
          className={cn(
            "bg-clip-text font-display font-bold uppercase tracking-[0.02em] text-transparent",
            onLight
              ? "bg-gradient-to-r from-[#1C6FB4] to-[#2A8FCB]"
              : "bg-gradient-to-r from-white to-[#CFE8F8]",
            compact ? "text-[15px]" : "text-[17px]",
          )}
        >
          IV League
        </span>
        <span
          className={cn(
            "bg-clip-text font-medium uppercase text-transparent",
            onLight
              ? "bg-gradient-to-r from-[#3E86C4] to-[#5FB4DE]"
              : "bg-gradient-to-r from-[#5C8FE0] to-[#7FD0F0]",
            compact
              ? "mt-1 text-[6.5px] tracking-[0.2em]"
              : "mt-1.5 text-[7.5px] tracking-[0.223em]",
          )}
        >
          Infusion Services
        </span>
      </span>
    </span>
  );
}
