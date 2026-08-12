"use client";

import Link from "next/link";
import { useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card that tracks the pointer and paints a teal radial highlight behind the
 * content. Writes CSS custom properties directly rather than re-rendering, so
 * a grid of 30 of these still moves at 60fps.
 */
export function SpotlightCard({
  children,
  className,
  href,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  as?: "div" | "article" | "li";
}) {
  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const classes = cn(
    "spotlight card card-hover relative isolate overflow-hidden",
    href && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} onMouseMove={onMove}>
        {children}
      </Link>
    );
  }

  const Tag = as;
  return (
    <Tag className={classes} onMouseMove={onMove}>
      {children}
    </Tag>
  );
}

/** Corner tick marks — a technical-drawing detail on feature cards. */
export function CornerTicks({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-l border-b",
        "right-3 bottom-3 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          className={cn(
            "absolute h-2.5 w-2.5 border-brand-400/30 transition-colors duration-500 group-hover:border-brand-400/70",
            pos,
          )}
        />
      ))}
    </div>
  );
}
