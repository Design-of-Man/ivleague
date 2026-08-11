import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Payer marks for the insurance logo wall.
 *
 * ⚠️ PROOF OF CONCEPT. These are original SVG interpretations drawn for layout
 * and visual review — recognisable silhouettes and brand colours, not the
 * carriers' official trademark files. Before launch they must be replaced with
 * the real assets, and the practice should confirm it has permission to display
 * each one (most payer contracts permit it; some require a brand-usage form).
 * Tracked in CONTENT-REVIEW.md.
 *
 * Each mark is drawn on a 40×40 grid so the wall optically aligns without
 * per-logo nudging, and every fill uses `currentColor` or an explicit brand hex
 * so the grayscale→colour hover works uniformly.
 */

export type Payer = {
  id: string;
  /** Wordmark text */
  name: string;
  /** Second line of the wordmark, when the brand is two words */
  sub?: string;
  /** Brand colour, used for the mark and on hover */
  color: string;
  mark: ReactNode;
  /** Wider wordmarks need a smaller type size to keep the wall even */
  tight?: boolean;
};

export const payers: Payer[] = [
  {
    id: "aetna",
    name: "aetna",
    color: "#7D3F98",
    tight: true,
    mark: (
      <>
        <circle cx="20" cy="20" r="17" fill="currentColor" opacity="0.16" />
        <path
          d="M25.5 27V13m0 8.5c0-3.6-2.6-6-6-6s-6.5 2.9-6.5 6.6c0 3.6 2.6 6.4 6.2 6.4 2.6 0 4.6-1.3 6.3-3.8"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
  },
  {
    id: "anthem",
    name: "Anthem",
    color: "#0079C1",
    mark: (
      <>
        <path
          d="M6 30c6-14 12-21 18-21s10 5 10 11"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 30c3.5-7.5 7-11.5 10.5-11.5 2.5 0 4 1.7 4 4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </>
    ),
  },
  {
    id: "bcbs",
    name: "BlueCross",
    sub: "BlueShield",
    color: "#0072CE",
    mark: (
      <>
        {/* cross */}
        <path d="M4 14h6V8h8v6h6v8h-6v6h-8v-6H4v-8Z" fill="currentColor" />
        {/* shield */}
        <path
          d="M28 6c3.5 1.6 6.5 2.2 9 2.2v11.4c0 6-4 10.4-9 12.4-5-2-9-6.4-9-12.4V8.2c2.5 0 5.5-.6 9-2.2Z"
          fill="currentColor"
          opacity="0.72"
        />
      </>
    ),
  },
  {
    id: "cigna",
    name: "Cigna",
    color: "#F58025",
    mark: (
      <>
        {/* tree of life */}
        <path
          d="M20 34V16"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M20.5 17c-.5-7 3-12 10-13.5C31 11 27.5 15.5 20.5 17Z"
          fill="currentColor"
        />
        <path
          d="M19.5 22c.4-6-2.8-10.2-9-11.5-.4 6.2 2.6 10 9 11.5Z"
          fill="currentColor"
          opacity="0.62"
        />
        <path
          d="M20.5 30c-.3-5 2.2-8.4 8-9.6.3 5.2-2 8.2-8 9.6Z"
          fill="currentColor"
          opacity="0.42"
        />
      </>
    ),
  },
  {
    id: "coventry",
    name: "Coventry",
    color: "#0091DA",
    tight: true,
    mark: (
      <>
        <circle
          cx="20"
          cy="20"
          r="13"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray="58 24"
          strokeLinecap="round"
          transform="rotate(-40 20 20)"
        />
        <circle cx="20" cy="20" r="4.5" fill="currentColor" />
      </>
    ),
  },
  {
    id: "humana",
    name: "Humana",
    color: "#6CC24A",
    mark: (
      <>
        <path
          d="M9 9v14a11 11 0 0 0 22 0V9"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="9" r="3.2" fill="currentColor" />
      </>
    ),
  },
  {
    id: "tricare",
    name: "TRICARE",
    color: "#1B5FAA",
    tight: true,
    mark: (
      <>
        <path
          d="M20 4l14 5v10c0 8-5.8 14.6-14 17-8.2-2.4-14-9-14-17V9l14-5Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M20 4l14 5v10c0 8-5.8 14.6-14 17-8.2-2.4-14-9-14-17V9l14-5Z"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M20 11v14M13.5 18h13"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: "multiplan",
    name: "MultiPlan",
    color: "#00A0AF",
    mark: (
      <>
        <path
          d="M6 27l7-13 7 8 7-13 7 18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  },
  {
    id: "uhc",
    name: "UnitedHealthcare",
    color: "#002677",
    tight: true,
    mark: (
      <>
        <path
          d="M20 3l15 5.5v12C35 30 28.4 36.6 20 39 11.6 36.6 5 30 5 20.5v-12L20 3Z"
          fill="currentColor"
        />
        <path
          d="M14.5 14v9.5a5.5 5.5 0 0 0 11 0V14"
          stroke="#FF612B"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
  },
  {
    id: "medicare",
    name: "Medicare",
    color: "#1D4F91",
    mark: (
      <>
        <rect
          x="3"
          y="10"
          width="34"
          height="21"
          rx="3"
          fill="currentColor"
          opacity="0.18"
        />
        <rect
          x="3"
          y="10"
          width="34"
          height="21"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
        />
        <path d="M3 17h34" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M8 24h9M22 24h10"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </>
    ),
  },
  {
    id: "medicaid",
    name: "Medicaid",
    color: "#00857D",
    mark: (
      <>
        <path
          d="M20 34S6 26 6 16.5A7.5 7.5 0 0 1 20 12a7.5 7.5 0 0 1 14 4.5C34 26 20 34 20 34Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M20 34S6 26 6 16.5A7.5 7.5 0 0 1 20 12a7.5 7.5 0 0 1 14 4.5C34 26 20 34 20 34Z"
          stroke="currentColor"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M11 21h5l2.5-4 3 8 2.5-4h5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  },
  {
    id: "cherry",
    name: "Cherry",
    color: "#E8546B",
    mark: (
      <>
        <path
          d="M25 6c-6 3-9 8-9 15"
          stroke="#6CC24A"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M25 6c-2 4.5-5.5 7-10 8"
          stroke="#6CC24A"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="27" r="7" fill="currentColor" />
        <circle cx="27" cy="30" r="5.5" fill="currentColor" opacity="0.72" />
      </>
    ),
  },
];

/** A single logo lockup: mark + wordmark, colour-on-hover. */
export function PayerLogo({
  payer,
  className,
}: {
  payer: Payer;
  className?: string;
}) {
  return (
    <span
      className={`group/logo inline-flex items-center gap-2.5 ${className ?? ""}`}
      // The mark inherits the brand colour and is desaturated by CSS filter, so
      // one rule handles single- and multi-colour marks identically.
      style={{ color: payer.color }}
    >
      <svg
        viewBox="0 0 40 40"
        className={cn(
          "h-7 w-7 shrink-0 opacity-75 grayscale transition-[filter,opacity] duration-500",
          "group-hover/logo:opacity-100 group-hover/logo:grayscale-0",
          "group-hover/wall:opacity-100 group-hover/wall:grayscale-0",
          // Touch devices never hover, so the wall would stay grey forever.
          // Show brand colour outright where there is no hover to give.
          "[@media(hover:none)]:opacity-100 [@media(hover:none)]:grayscale-0",
        )}
        aria-hidden="true"
      >
        {payer.mark}
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-[-0.03em] text-ink-200 transition-colors duration-500 group-hover/logo:text-ink-50 group-hover/wall:text-ink-50 ${
            payer.tight ? "text-[13.5px]" : "text-[15px]"
          }`}
        >
          {payer.name}
        </span>
        {payer.sub && (
          <span
            className={`font-display font-semibold tracking-[-0.03em] text-ink-300 transition-colors duration-500 group-hover/logo:text-ink-100 group-hover/wall:text-ink-100 ${
              payer.tight ? "text-[13.5px]" : "text-[15px]"
            }`}
          >
            {payer.sub}
          </span>
        )}
      </span>
    </span>
  );
}
