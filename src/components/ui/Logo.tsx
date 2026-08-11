import { cn } from "@/lib/utils";

/**
 * IV League Infusion Services' actual mark: a droplet with a navy outer shell,
 * a teal body, and a white droplet outlined inside it.
 *
 * ⚠️ Traced from a screenshot of ivlinfusions.com, not from the client's
 * artwork. The practice's domain is blocked by this environment's egress
 * policy, so the real vector could not be downloaded. The proportions and
 * colours here are read off a ~250px-wide screenshot and will be close but not
 * exact. Drop in the original SVG or EPS before launch and delete this note —
 * it is listed in CONTENT-REVIEW.md.
 *
 * Drawn as SVG rather than a raster so it scales from a 16px favicon to a
 * 400px footer lockup, and so the shell colour can adapt: the navy that reads
 * as authoritative on their white site disappears entirely on this one.
 */
export function LogoMark({
  className,
  animated = false,
  /** `onLight` renders the navy shell from the original. Default is the dark-theme treatment. */
  onLight = false,
}: {
  className?: string;
  animated?: boolean;
  onLight?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ivl-body" x1="12" y1="6" x2="38" y2="44">
          <stop offset="0%" stopColor="#5fdcd2" />
          <stop offset="45%" stopColor="#1fcdc0" />
          <stop offset="100%" stopColor="#0b8fa8" />
        </linearGradient>
      </defs>

      {/* Outer shell. Navy on a light ground, as drawn; a teal hairline on dark,
          where navy-on-black would simply vanish. */}
      <path
        d="M24 2.6c0 0 15.4 16.2 15.4 26A15.4 15.4 0 0 1 8.6 28.6c0-9.8 15.4-26 15.4-26Z"
        fill={onLight ? "#14293b" : "none"}
        stroke={onLight ? "none" : "rgba(79,227,215,0.32)"}
        strokeWidth={onLight ? 0 : 1.4}
      />

      {/* Teal body */}
      <path
        d="M24 7.4c0 0 11.7 12.6 11.7 20.3A11.7 11.7 0 0 1 12.3 27.7C12.3 20 24 7.4 24 7.4Z"
        fill="url(#ivl-body)"
      />

      {/* Inner droplet, outlined in white */}
      <path
        d="M24 15.4c0 0 6.1 6.6 6.1 10.6a6.1 6.1 0 0 1-12.2 0c0-4 6.1-10.6 6.1-10.6Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      {animated && (
        <circle
          cx="24"
          cy="28"
          r="15.4"
          stroke="#1fcdc0"
          strokeWidth="1"
          fill="none"
          opacity="0.45"
          className="origin-center animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]"
        />
      )}
    </svg>
  );
}

/**
 * The full lockup. Their wordmark is two tiers: "IV LEAGUE" set large and
 * bold over "INFUSION SERVICES" tracked out to match its width. On their white
 * site both tiers are navy; here the second tier carries the teal so the lockup
 * still reads as two parts on a black ground.
 */
export function Logo({
  className,
  compact = false,
  animated = false,
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark
        animated={animated}
        className={compact ? "h-8 w-8" : "h-9 w-9"}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold uppercase tracking-[0.02em] text-ink-50",
            compact ? "text-[15px]" : "text-[17px]",
          )}
        >
          IV League
        </span>
        <span
          className={cn(
            "font-medium uppercase text-teal-400/85",
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
