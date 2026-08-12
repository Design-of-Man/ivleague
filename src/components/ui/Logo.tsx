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
  navy: "#1B4C9B",
  blue: "#1E7FC4",
  cyan: "#3FBDEA",
  /** The shield rule and wordmark on a white ground. */
  ink: "#1F5FA8",
  /** The same rule, lightened enough to survive on near-black. */
  onDark: "#63ACE2",
} as const;

const SHIELD_OUTER =
  "M8.8 8A2 2 0 0 1 10.8 6h26.4A2 2 0 0 1 39.2 8v17.2c0 8.2-6 14.4-15.2 18.4-9.2-4-15.2-10.2-15.2-18.4Z";
const SHIELD_INNER =
  "M11 9.6A1.4 1.4 0 0 1 12.4 8.2h23.2A1.4 1.4 0 0 1 37 9.6V25c0 7.2-5.2 12.6-13 16.2-7.8-3.6-13-9-13-16.2Z";
const DROP =
  "M24 12.8c0 0 7.4 9 7.4 14.4a7.4 7.4 0 0 1-14.8 0c0-5.4 7.4-14.4 7.4-14.4Z";

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
  const rule = onLight ? BRAND.ink : BRAND.onDark;

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
          x1="17"
          y1="34"
          x2="31"
          y2="12.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={BRAND.cyan} />
          <stop offset="52%" stopColor={BRAND.blue} />
          <stop offset="100%" stopColor={BRAND.navy} />
        </linearGradient>
      </defs>

      <path
        d={SHIELD_OUTER}
        stroke={rule}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d={SHIELD_INNER}
        stroke={rule}
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity={onLight ? 0.9 : 0.62}
      />

      <path d={DROP} fill={`url(#${gid})`} />
      {/* Specular sliver on the low-left of the drop, as in the original. */}
      <path
        d="M19.4 30.2a5.4 5.4 0 0 0 3 4"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {animated && (
        <circle
          cx="24"
          cy="24"
          r="18"
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
        <span
          className={cn(
            "font-display font-bold uppercase tracking-[0.02em]",
            onLight ? "text-[#1F5FA8]" : "text-ink-50",
            compact ? "text-[15px]" : "text-[17px]",
          )}
        >
          IV League
        </span>
        <span
          className={cn(
            "font-medium uppercase",
            onLight ? "text-[#4E9CD3]" : "text-[#63ACE2]",
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
