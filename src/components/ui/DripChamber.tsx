"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * THE SIGNATURE ELEMENT.
 *
 * An extreme-macro view of a drip chamber: the spike nozzle at the top, one
 * droplet forming and falling, the fluid pool below. Deliberately contained —
 * it lives inside a framed panel, never full-bleed, so it reads as an object
 * you are looking at rather than a background you are standing in.
 *
 * WHY SVG + CSS KEYFRAMES, NOT CANVAS
 * There are four moving parts, not four hundred, so canvas's throughput
 * advantage never applies. SVG gives crisp geometry at any DPI, real gradient
 * and blur fills for the glass and meniscus, and — because everything animates
 * through `transform` and `opacity` — the whole thing composites on the GPU
 * without a single JS frame. It also inherits the global
 * prefers-reduced-motion rule for free, and the browser pauses it when the tab
 * is hidden. A canvas version would need a rAF loop, an IntersectionObserver,
 * DPR handling and a reduced-motion branch to reach parity.
 *
 * HOW THE LOOP SEAMS
 * There is no start or end frame. Two identical droplets run the same
 * animation half a cycle apart, so while one is falling the next is already
 * swelling at the nozzle. What the eye reads is not a repeating clip but a
 * steady drip rate — the same reason a real chamber looks continuous.
 *
 * THE EASING IS THE POINT
 * A drop is not a linear translate. It swells while decelerating, hangs almost
 * motionless at the neck while surface tension holds, loses that fight over
 * about 5% of the cycle, snaps free and rebounds toward a sphere, then falls
 * on a quadratic curve, then flattens. Each phase carries its own
 * timing function; see @keyframes drop-cycle in globals.css.
 */

const CYCLE = "4.6s";

export function DripChamber({
  className,
  label,
}: {
  className?: string;
  /** Optional caption rendered under the chamber */
  label?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 200 340"
        fill="none"
        className="h-full w-auto"
        role="img"
        aria-label="Illustration of an intravenous drip chamber with a droplet falling into fluid"
      >
        <defs>
          <linearGradient id="dc-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-teal-300)" stopOpacity="0.30" />
            <stop offset="18%" stopColor="var(--color-teal-50)" stopOpacity="0.10" />
            <stop offset="50%" stopColor="var(--color-teal-500)" stopOpacity="0.05" />
            <stop offset="86%" stopColor="var(--color-teal-200)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-teal-600)" stopOpacity="0.30" />
          </linearGradient>
          <linearGradient id="dc-wall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-teal-200)" stopOpacity="0.62" />
            <stop offset="42%" stopColor="var(--color-teal-400)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-teal-300)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="dc-fluid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-teal-300)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-teal-600)" stopOpacity="0.30" />
          </linearGradient>
          <radialGradient id="dc-drop" cx="0.36" cy="0.3" r="0.78">
            <stop offset="0%" stopColor="var(--color-ink-50)" stopOpacity="0.95" />
            <stop offset="34%" stopColor="var(--color-teal-200)" />
            <stop offset="100%" stopColor="var(--color-teal-500)" />
          </radialGradient>
          <filter id="dc-soft" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <clipPath id="dc-inside">
            <rect x="52" y="46" width="96" height="252" rx="8" />
          </clipPath>
        </defs>

        {/* ---- spike / nozzle assembly ------------------------------------ */}
        <path
          d="M100 0v18"
          stroke="var(--color-ink-500)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M78 18h44l-6 16H84L78 18Z"
          fill="var(--color-ink-800)"
          stroke="url(#dc-wall)"
          strokeWidth="1.2"
        />
        <path d="M92 34h16v14h-16z" fill="var(--color-ink-850)" stroke="var(--color-ink-600)" strokeWidth="1" />
        {/* nozzle tip — where the drop is born */}
        <path
          d="M94 48h12l-6 9-6-9Z"
          fill="var(--color-ink-700)"
          stroke="url(#dc-wall)"
          strokeWidth="1.1"
        />

        {/* ---- chamber body ------------------------------------------------ */}
        <rect
          x="52"
          y="46"
          width="96"
          height="252"
          rx="8"
          fill="url(#dc-glass)"
          stroke="url(#dc-wall)"
          strokeWidth="1.4"
        />
        {/* specular highlights on the glass */}
        <rect x="62" y="60" width="4" height="222" rx="2" fill="var(--color-teal-50)" opacity="0.13" />
        <rect x="134" y="76" width="2.5" height="190" rx="1.25" fill="var(--color-teal-50)" opacity="0.09" />

        <g clipPath="url(#dc-inside)">
          {/* fluid pool */}
          <rect x="52" y="262" width="96" height="36" fill="url(#dc-fluid)" />
          <g
            style={
              reduce
                ? undefined
                : {
                    animation: `meniscus-bob ${CYCLE} linear infinite`,
                    transformOrigin: "100px 262px",
                  }
            }
          >
            <ellipse cx="100" cy="262" rx="48" ry="5" fill="var(--color-teal-200)" opacity="0.5" />
            <ellipse cx="100" cy="262" rx="48" ry="5" fill="none" stroke="var(--color-teal-50)" strokeWidth="0.8" opacity="0.4" />
          </g>

          {/* ripples — two sets, offset like the droplets they belong to */}
          {!reduce &&
            [0, 1].map((set) =>
              [0, 1, 2].map((ring) => (
                <ellipse
                  key={`${set}-${ring}`}
                  cx="100"
                  cy="262"
                  rx="16"
                  ry="3"
                  fill="none"
                  stroke="var(--color-teal-100)"
                  strokeWidth="0.9"
                  style={{
                    transformOrigin: "100px 262px",
                    animation: `drop-ripple ${CYCLE} linear infinite`,
                    animationDelay: `${(set === 1 ? -2.3 : 0) + ring * 0.16}s`,
                    opacity: 0,
                  }}
                />
              )),
            )}

          {/* droplets — same animation, half a cycle apart */}
          {(reduce ? [0] : [0, 1]).map((i) => (
            <g
              key={i}
              style={
                reduce
                  ? { transform: "translateY(24px)" }
                  : {
                      transformBox: "fill-box",
                      transformOrigin: "center top",
                      animation: `drop-cycle ${CYCLE} linear infinite`,
                      animationDelay: i === 1 ? "-2.3s" : "0s",
                    }
              }
            >
              <path
                d="M100 55c0 0 11 12.4 11 19.3 0 6.1-4.9 11-11 11s-11-4.9-11-11C89 67.4 100 55 100 55Z"
                fill="url(#dc-drop)"
              />
              <ellipse cx="96" cy="71" rx="3" ry="4" fill="var(--color-ink-50)" opacity="0.5" />
            </g>
          ))}
        </g>

        {/* ---- outlet ------------------------------------------------------ */}
        <path d="M88 298h24v10a6 6 0 0 1-6 6H94a6 6 0 0 1-6-6v-10Z" fill="var(--color-ink-800)" stroke="url(#dc-wall)" strokeWidth="1.2" />
        <path d="M100 314v26" stroke="var(--color-ink-600)" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 314v26" stroke="url(#dc-wall)" strokeWidth="1.1" strokeLinecap="round" />

        {/* ---- ambient glow behind the pool -------------------------------- */}
        <ellipse
          cx="100"
          cy="272"
          rx="52"
          ry="26"
          fill="var(--color-teal-400)"
          opacity="0.14"
          filter="url(#dc-soft)"
        />
      </svg>

      {label && (
        <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-500">
          {label}
        </p>
      )}
    </div>
  );
}
