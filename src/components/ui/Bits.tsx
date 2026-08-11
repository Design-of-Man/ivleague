import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------- Badge ---------------------------------- */

export function Badge({
  children,
  className,
  tone = "teal",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  tone?: "teal" | "neutral" | "outline";
  size?: "sm" | "md";
}) {
  const tones = {
    teal: "bg-teal-400/10 text-teal-300 ring-teal-400/25",
    neutral: "bg-white/[0.05] text-ink-200 ring-white/10",
    outline: "bg-transparent text-ink-300 ring-white/12",
  };
  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] tracking-[0.14em]",
    md: "px-3 py-1 text-[11px] tracking-[0.12em]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase ring-1 ring-inset",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------- Breadcrumbs ------------------------------ */

export function Breadcrumbs({
  trail,
  className,
}: {
  trail: { name: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px]", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-400">
        {trail.map((t, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={t.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink-200">
                  {t.name}
                </span>
              ) : (
                <Link
                  href={t.href}
                  className="link-underline transition-colors hover:text-teal-300"
                >
                  {t.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="text-ink-600">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------- JSON-LD -------------------------------- */

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema payloads are built from local, non-user content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ------------------------------- Stat tile ------------------------------- */

export function StatTile({
  value,
  label,
  className,
}: {
  value: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="font-display text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-semibold leading-none text-gradient">
        {value}
      </div>
      <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-400">
        {label}
      </div>
    </div>
  );
}

/* --------------------------- Definition row ------------------------------ */

export function SpecRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-1 border-b border-white/6 py-4 sm:grid-cols-[minmax(9rem,11rem)_1fr] sm:gap-6",
        className,
      )}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        {label}
      </dt>
      <dd className="text-[15px] leading-relaxed text-ink-100">{value}</dd>
    </div>
  );
}

/* ------------------------------ Bullet list ------------------------------ */

export function TickList({
  items,
  className,
  tone = "teal",
}: {
  items: readonly string[];
  className?: string;
  tone?: "teal" | "muted";
}) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className={cn(
              "mt-[3px] h-4 w-4 shrink-0",
              tone === "teal" ? "text-teal-400" : "text-ink-500",
            )}
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
            <path
              d="m6 10.2 2.6 2.6L14 7.4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[15px] leading-relaxed text-ink-200">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------- Link arrow ------------------------------ */

export function TextLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-3.5 w-3.5 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/link:translate-x-1"
        aria-hidden="true"
      >
        <path
          d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  const cls = cn(
    "group/link inline-flex items-center gap-1.5 text-[14px] font-medium text-teal-300 transition-colors hover:text-teal-200",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* -------------------------- Medical disclaimer --------------------------- */

export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[12.5px] leading-relaxed text-ink-400",
        className,
      )}
    >
      <strong className="font-semibold text-ink-200">
        This page is educational.
      </strong>{" "}
      It is not medical advice and does not replace a conversation with your
      physician. Every therapy at IV League Infusions requires a physician
      referral and is administered under orders written by your prescriber.
      Individual results, dosing and schedules vary.
    </p>
  );
}
