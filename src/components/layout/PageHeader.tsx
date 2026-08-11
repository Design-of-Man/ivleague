import type { ReactNode } from "react";
import { Aurora, GridBackdrop, EdgeGlow } from "@/components/ui/Backdrop";
import { Breadcrumbs } from "@/components/ui/Bits";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lead,
  trail,
  aside,
  children,
  className,
  size = "md",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  trail?: { name: string; href: string }[];
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const pad = {
    sm: "pt-30 pb-12 sm:pt-36 sm:pb-14",
    md: "pt-30 pb-14 sm:pt-38 sm:pb-18",
    lg: "pt-32 pb-16 sm:pt-42 sm:pb-24",
  }[size];

  const titleSize = {
    sm: "text-[clamp(1.9rem,1.35rem+2.1vw,2.85rem)]",
    md: "text-display",
    lg: "text-[clamp(2.4rem,1.5rem+3.6vw,4.75rem)]",
  }[size];

  return (
    <header className={cn("relative isolate overflow-hidden", pad, className)}>
      <Aurora intensity="subtle" />
      <GridBackdrop fade="top" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
      <EdgeGlow className="top-auto bottom-0 opacity-60" />

      <div className="shell relative">
        {trail && <Breadcrumbs trail={trail} className="mb-8" />}

        <div
          className={cn(
            "flex flex-col gap-10",
            aside && "lg:flex-row lg:items-end lg:justify-between lg:gap-16",
          )}
        >
          <div className={cn("flex flex-col gap-6", aside && "lg:max-w-3xl")}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {/*
              Not wrapped in a Reveal. On every interior template this h1 is the
              LCP element, and a reveal starts at opacity 0 — which means LCP
              can't fire until the IntersectionObserver runs after hydration.
              Measured cost of getting this wrong: +1.2s LCP. The heading paints
              from the server HTML; everything around it can arrive late.
            */}
            <h1 className={cn(titleSize, "font-semibold leading-[1.02]")}>
              {title}
            </h1>
            {lead && (
              <p className="max-w-[46rem] text-lead leading-relaxed text-ink-300">
                {lead}
              </p>
            )}
            {children}
          </div>

          {aside && <div className="lg:shrink-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
