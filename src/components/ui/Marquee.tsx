import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee. Children are duplicated once and the track translates
 * -50%, so the loop is seamless regardless of content width.
 */
export function Marquee({
  children,
  className,
  reverse,
  speed = 46,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  /** seconds for a full cycle */
  speed?: number;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex shrink-0 items-center gap-4 pr-4",
            reverse
              ? "animate-[marquee-rev_var(--dur)_linear_infinite]"
              : "animate-[marquee_var(--dur)_linear_infinite]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{ "--dur": `${speed}s` } as React.CSSProperties}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export function MarqueePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-ink-200 backdrop-blur-sm transition-colors duration-300 hover:border-teal-400/35 hover:text-teal-200">
      {children}
    </span>
  );
}
