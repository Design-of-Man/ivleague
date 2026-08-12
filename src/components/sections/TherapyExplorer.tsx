"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { flushSync } from "react-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  therapies,
  specialties,
  specialtyById,
  type SpecialtyId,
} from "@/content/therapies";
import { Badge } from "@/components/ui/Bits";
import { parseChairTime } from "@/lib/duration";
import { cn } from "@/lib/utils";

type SortKey = "specialty" | "az" | "duration";

/**
 * Filtering used to be a Framer `layout` animation — thirty-one cards measured
 * and interpolated on the main thread. The browser can do the same FLIP itself
 * for nothing: give each card a `view-transition-name` and run the state change
 * inside a View Transition, and cards slide to their new positions on the
 * compositor.
 *
 * `flushSync` is required, not incidental: `startViewTransition` snapshots the
 * DOM when its callback returns, and React would otherwise still be holding the
 * update in a queue at that point, so the "after" snapshot would equal the
 * "before" one and nothing would move.
 *
 * Where View Transitions aren't supported — or the reader asked for less
 * motion — the update simply applies. Instant is a fine outcome.
 */
function withViewTransition(update: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !document.startViewTransition) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

export function TherapyExplorer() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [active, setActive] = useState<SpecialtyId | "all">(
    (params.get("specialty") as SpecialtyId) ?? "all",
  );
  const [sort, setSort] = useState<SortKey>("specialty");

  // Keep the URL shareable without pushing a history entry per keystroke
  useEffect(() => {
    const next = new URLSearchParams();
    if (active !== "all") next.set("specialty", active);
    if (query.trim()) next.set("q", query.trim());
    const qs = next.toString();
    router.replace(qs ? `/therapies?${qs}` : "/therapies", { scroll: false });
  }, [active, query, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = therapies.filter((t) => {
      const specOk = active === "all" || t.specialty === active;
      if (!specOk) return false;
      if (!q) return true;
      return (
        t.brand.toLowerCase().includes(q) ||
        t.generic.toLowerCase().includes(q) ||
        t.drugClass.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.treats.some((x) => x.toLowerCase().includes(q))
      );
    });

    return [...list].sort((a, b) => {
      if (sort === "az") return a.brand.localeCompare(b.brand);
      if (sort === "duration")
        return (
          parseChairTime(a.duration).typical -
          parseChairTime(b.duration).typical
        );
      const sa = specialties.findIndex((s) => s.id === a.specialty);
      const sb = specialties.findIndex((s) => s.id === b.specialty);
      return sa === sb ? a.brand.localeCompare(b.brand) : sa - sb;
    });
  }, [query, active, sort]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of therapies)
      m.set(t.specialty, (m.get(t.specialty) ?? 0) + 1);
    return m;
  }, []);

  const reset = useCallback(() => {
    withViewTransition(() => {
      setQuery("");
      setActive("all");
    });
  }, []);

  return (
    <div>
      {/* --------------------------- Filter bar --------------------------- */}
      <div className="sticky top-[4.4rem] z-30 -mx-5 mb-10 border-y border-white/8 bg-ink-950/96 px-5 py-4 sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="4.6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="m10.5 10.5 3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by brand, generic name or condition…"
                aria-label="Search therapies"
                className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[14px] text-ink-50 placeholder:text-ink-500 transition-colors focus:border-brand-400/50 focus:bg-white/[0.05] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500"
              >
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) =>
                  withViewTransition(() => setSort(e.target.value as SortKey))
                }
                className="h-12 rounded-full border border-white/10 bg-white/[0.03] px-4 pr-8 text-[13.5px] text-ink-100 transition-colors focus:border-brand-400/50 focus:outline-none"
              >
                <option value="specialty">Specialty</option>
                <option value="az">A–Z</option>
                <option value="duration">Chair time</option>
              </select>
            </div>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            <FilterChip
              active={active === "all"}
              onClick={() => withViewTransition(() => setActive("all"))}
              count={therapies.length}
            >
              All
            </FilterChip>
            {specialties.map((s) => (
              <FilterChip
                key={s.id}
                active={active === s.id}
                onClick={() => withViewTransition(() => setActive(s.id))}
                count={counts.get(s.id) ?? 0}
              >
                {s.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------- Results ----------------------------- */}
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
          {results.length} {results.length === 1 ? "therapy" : "therapies"}
          {active !== "all" && ` · ${specialtyById(active).label}`}
        </p>
        {(query || active !== "all") && (
          <button
            type="button"
            onClick={reset}
            className="text-[13px] font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-[0.625rem] border border-white/8 bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-[16px] font-medium text-ink-100">
            No therapy matches &ldquo;{query}&rdquo;
          </p>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-400">
            Our formulary grows with what our referring physicians order. If
            your medication isn&apos;t listed, call us. We can often bring it
            on.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-400 px-6 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-brand-300"
          >
            Ask about a medication
          </Link>
        </div>
      ) : (
        <ul className="therapy-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => {
            const sp = specialtyById(t.specialty);
            return (
              <li key={t.slug} style={{ viewTransitionName: `card-${t.slug}` }}>
                <Link
                  href={`/therapies/${t.slug}`}
                  className="group card card-hover flex h-full flex-col justify-between gap-6 p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <Badge tone="neutral" size="sm">
                        {sp.short}
                      </Badge>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                        {t.route.includes("Subcutaneous") &&
                        !t.route.includes("Intravenous")
                          ? "Injection"
                          : "Infusion"}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-50 transition-colors group-hover:text-brand-100">
                      {t.brand}
                    </h2>
                    <p className="mt-1 font-mono text-[11px] lowercase tracking-wide text-ink-500">
                      {t.generic}
                    </p>
                    <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-400">
                      {t.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-white/6 pt-4">
                    <span className="text-[12px] text-ink-500">
                      {t.drugClass}
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3.5 w-3.5 shrink-0 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
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
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  count,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300",
        active
          ? "border-brand-400/45 bg-brand-400/10 text-brand-200"
          : "border-white/8 bg-white/[0.02] text-ink-400 hover:border-white/16 hover:text-ink-100",
      )}
    >
      {children}
      <span
        className={cn(
          "font-mono text-[10px] transition-colors",
          active ? "text-brand-300" : "text-ink-400",
        )}
      >
        {count}
      </span>
    </button>
  );
}
