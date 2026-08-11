import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-400 ease-[var(--ease-out-expo)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-teal-400 text-ink-950 shadow-[0_0_0_1px_rgba(31,205,192,0.55),0_10px_36px_-12px_rgba(31,205,192,0.75)] hover:bg-teal-300 hover:shadow-[0_0_0_1px_rgba(79,227,215,0.8),0_16px_50px_-14px_rgba(31,205,192,0.95)] hover:-translate-y-0.5 font-semibold",
  secondary:
    "bg-white/[0.07] text-ink-50 ring-1 ring-inset ring-white/12 hover:bg-white/[0.11] hover:ring-teal-400/40 hover:-translate-y-0.5",
  ghost: "text-ink-200 hover:text-teal-300 hover:bg-white/[0.04]",
  outline:
    "text-teal-300 ring-1 ring-inset ring-teal-400/35 hover:bg-teal-400/10 hover:ring-teal-400/70 hover:-translate-y-0.5",
  dark: "bg-ink-950 text-ink-50 ring-1 ring-inset ring-white/10 hover:ring-white/25 hover:-translate-y-0.5",
  // For the white hero plate. Everything above assumes a dark ground.
  onLight:
    "text-ink-950 ring-1 ring-inset ring-ink-950/25 hover:bg-ink-950/[0.06] hover:ring-ink-950/45 hover:-translate-y-0.5",
} as const;

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-13 px-7 text-[15px]",
  xl: "h-14 px-8 text-[15px] sm:text-base",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...props
}: Common & { href: string; external?: boolean } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >) {
  const cls = cn(base, variants[variant], sizes[size], className);

  if (
    external ||
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  ) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}

/** Arrow that slides on parent hover — pair with `group/btn`. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "h-3.5 w-3.5 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1",
        className,
      )}
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
  );
}
