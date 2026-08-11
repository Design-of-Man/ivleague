import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  children,
  className,
  id,
  tight,
  wide,
  bleed,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
  wide?: boolean;
  /** Skip the shell wrapper entirely */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        tight ? "py-14 sm:py-18" : "py-18 sm:py-24 lg:py-28",
        className,
      )}
    >
      {bleed ? children : <div className={wide ? "shell-wide" : "shell"}>{children}</div>}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-70 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-400">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  action,
  size = "md",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const titleSize = {
    sm: "text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)]",
    md: "text-title",
    lg: "text-display",
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-5",
          align === "center" && "items-center",
          action && "md:max-w-3xl",
        )}
      >
        {eyebrow && (
          <Reveal direction="none" duration={0.6}>
            <Eyebrow align={align}>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <h2 className={cn(titleSize, "font-semibold leading-[1.03]")}>{title}</h2>
        {lead && (
          <Reveal delay={0.12}>
            <p
              className={cn(
                "text-lead leading-relaxed text-ink-300",
                align === "center" ? "max-w-2xl" : "max-w-2xl",
              )}
            >
              {lead}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.18} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}

/** Thin animated divider used between major sections. */
export function Hairline({ className }: { className?: string }) {
  return <div className={cn("hairline w-full", className)} aria-hidden="true" />;
}
