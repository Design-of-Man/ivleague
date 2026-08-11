"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { useRevealOnce } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal, CSS-only.
 *
 * This used to be a motion/react component. It is used on nearly every page,
 * which meant the animation runtime shipped with almost every route. The same
 * effect is a class, a transition and one shared IntersectionObserver — so the
 * therapy and condition detail pages (53 of 76 routes) now load no animation
 * library at all.
 *
 * Progressive enhancement: `.reveal` is hidden until `is-visible` is added, so
 * a `<noscript>` rule in the document head unhides everything when JS is off,
 * and the global prefers-reduced-motion rule shows it instantly.
 */

type Direction = "up" | "down" | "left" | "right" | "none";
type Tag = "div" | "section" | "li" | "article" | "span";

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.8,
  as = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
  /** Retained for API compatibility; reveals never replay. */
  once?: boolean;
  as?: Tag;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useRevealOnce(ref);

  const props = {
    id,
    className: cn("reveal", `reveal-${direction}`, className),
    style: {
      "--reveal-delay": `${delay}s`,
      "--reveal-duration": `${duration}s`,
    } as CSSProperties,
  };

  switch (as) {
    case "section":
      return (
        <section ref={ref as React.RefObject<HTMLElement>} {...props}>
          {children}
        </section>
      );
    case "li":
      return (
        <li ref={ref as React.RefObject<HTMLLIElement>} {...props}>
          {children}
        </li>
      );
    case "article":
      return (
        <article ref={ref as React.RefObject<HTMLElement>} {...props}>
          {children}
        </article>
      );
    case "span":
      return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} {...props}>
          {children}
        </span>
      );
    default:
      return (
        <div ref={ref as React.RefObject<HTMLDivElement>} {...props}>
          {children}
        </div>
      );
  }
}

/**
 * Staggered container. Child delays come from `:nth-child` in CSS rather than
 * from per-item JS, so a 30-card grid costs one observer and zero React state.
 */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Retained for API compatibility. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealOnce(ref);

  return (
    <div ref={ref} className={cn("stagger", className)}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  if (as === "li") return <li className={className}>{children}</li>;
  if (as === "article") return <article className={className}>{children}</article>;
  return <div className={className}>{children}</div>;
}
