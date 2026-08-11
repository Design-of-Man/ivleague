import { cn } from "@/lib/utils";

/**
 * IV League mark: a droplet whose negative space forms a serif "IV",
 * set on a teal gradient. Drawn as pure SVG so it scales to a favicon
 * and to a 400px footer lockup without a raster asset.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ivl-drop" x1="8" y1="2" x2="40" y2="46">
          <stop offset="0%" stopColor="#8ff1e8" />
          <stop offset="42%" stopColor="#1fcdc0" />
          <stop offset="100%" stopColor="#068e86" />
        </linearGradient>
        <linearGradient id="ivl-ring" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#4fe3d7" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#0bb2a6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4fe3d7" stopOpacity="0.6" />
        </linearGradient>
        <filter id="ivl-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="url(#ivl-ring)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Droplet body */}
      <path
        d="M24 7.5c0 0 12 12.4 12 20.1C36 34.9 30.6 40.5 24 40.5S12 34.9 12 27.6C12 19.9 24 7.5 24 7.5Z"
        fill="url(#ivl-drop)"
        filter="url(#ivl-glow)"
      />

      {/* Negative-space "IV" */}
      <g fill="#04070a">
        {/* I */}
        <rect x="17.1" y="23.2" width="2.1" height="9.4" rx="0.7" />
        <rect x="15.5" y="22.2" width="5.3" height="1.5" rx="0.7" />
        <rect x="15.5" y="32.1" width="5.3" height="1.5" rx="0.7" />
        {/* V */}
        <path d="M23.2 22.2h2.4l3.1 7.7 3.1-7.7h2.4l-4.4 11.4h-2.2L23.2 22.2Z" />
      </g>

      {/* Drip highlight */}
      <ellipse cx="20" cy="20.5" rx="2.6" ry="3.6" fill="#e8fdfa" opacity="0.28" transform="rotate(-18 20 20.5)" />

      {animated && (
        <circle cx="24" cy="24" r="22" stroke="#1fcdc0" strokeWidth="1" fill="none" className="origin-center animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" opacity="0.5" />
      )}
    </svg>
  );
}

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
      <LogoMark animated={animated} className={compact ? "h-8 w-8" : "h-9 w-9"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.04em] text-ink-50",
            compact ? "text-[15px]" : "text-[17px]",
          )}
        >
          IV League
        </span>
        <span
          className={cn(
            "font-medium uppercase tracking-[0.28em] text-teal-400/80",
            compact ? "text-[7.5px] mt-0.5" : "text-[8.5px] mt-1",
          )}
        >
          Infusions
        </span>
      </span>
    </span>
  );
}
