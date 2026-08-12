"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  searchContent,
  quickLinks,
  highlight,
  type SearchItem,
  type SearchGroup,
} from "@/lib/search";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * ⌘K palette. Lazily imported by SearchTrigger on first open, so neither the
 * dialog nor the search index is on the critical path for any route.
 *
 * Deliberately no animation library and no combobox dependency — this is a
 * listbox with roving `aria-activedescendant`, which is both smaller and more
 * predictable for screen readers than most packaged versions.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.trim() ? searchContent(query) : quickLinks),
    [query],
  );

  /**
   * Group, ordered by relevance rather than by a fixed category list.
   *
   * `results` is already score-sorted and a Map keeps insertion order, so the
   * group containing the single best match lands first. This matters more than
   * it looks: with a fixed order, searching "crohn" put the Therapies group on
   * top and the highlighted row — the one Enter activates — was a drug, not the
   * Crohn's Disease page the person was obviously looking for.
   */
  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, SearchItem[]>();
    for (const item of results) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()] as (readonly [SearchGroup, SearchItem[]])[];
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  // Flat position per row, so grouped rendering doesn't need a counter it
  // mutates during render.
  const positions = useMemo(
    () => new Map(flat.map((item, i) => [item.id, i])),
    [flat],
  );

  // Reset the highlight when the query changes. Done during render rather than
  // in an effect so the list never paints with a stale selection for a frame.
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const go = useCallback(
    (item: SearchItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown" || (e.key === "n" && e.ctrlKey)) {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp" || (e.key === "p" && e.ctrlKey)) {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(flat.length - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) go(item);
    }
  };

  // Keep the active row in view without smooth-scroll jitter
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Trap focus inside the dialog
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const root = listRef.current?.closest("[data-palette]");
      if (root && e.target instanceof Node && !root.contains(e.target)) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  return (
    <div
      className="fixed inset-0 z-90 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      data-palette
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 cursor-default bg-ink-950/88 backdrop-blur-md"
        onClick={onClose}
        tabIndex={-1}
      />

      <div
        className="relative flex max-h-[68vh] w-full max-w-[38rem] flex-col overflow-hidden rounded-[0.75rem] border border-white/12 bg-ink-900/97 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
        onKeyDown={onKeyDown}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
        />

        {/* Input */}
        <div className="flex items-center gap-3 border-b border-white/8 px-5">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 shrink-0 text-brand-400"
            aria-hidden="true"
          >
            <circle
              cx="7"
              cy="7"
              r="4.6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="m10.5 10.5 3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search therapies, conditions, questions…"
            aria-label="Search therapies, conditions and pages"
            aria-controls="palette-results"
            aria-activedescendant={
              flat[active] ? `row-${flat[active].id}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full bg-transparent text-[15.5px] text-ink-50 placeholder:text-ink-500 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-white/12 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="palette-results"
          role="listbox"
          aria-label="Search results"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          {flat.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-[14.5px] text-ink-200">
                Nothing matches &ldquo;{query}&rdquo;
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-500">
                Try a brand name like Entyvio, a condition like Crohn&apos;s, or
                just call us and we&apos;ll tell you straight whether we can
                help.
              </p>
              <a
                href={site.contact.phoneHref}
                className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-400 px-5 text-[13.5px] font-semibold text-ink-950 transition-colors hover:bg-brand-300"
              >
                {site.contact.phone}
              </a>
            </div>
          ) : (
            <>
              {!query.trim() && (
                <p className="px-5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Jump to
                </p>
              )}
              {grouped.map(([group, items]) => (
                <div key={group} className="pb-1">
                  {query.trim() && (
                    <p className="px-5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {group}
                    </p>
                  )}
                  {items.map((item) => {
                    const myIndex = positions.get(item.id) ?? 0;
                    const isActive = myIndex === active;
                    return (
                      <div
                        key={item.id}
                        id={`row-${item.id}`}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onMouseMove={() => setActive(myIndex)}
                        onClick={() => go(item)}
                        className={cn(
                          "mx-2 flex cursor-pointer items-center gap-3 rounded-[0.5rem] px-3 py-2.5 transition-colors",
                          isActive
                            ? "bg-brand-400/12"
                            : "hover:bg-white/[0.04]",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                            isActive ? "bg-brand-400" : "bg-white/15",
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-[14.5px] font-medium",
                              isActive ? "text-brand-100" : "text-ink-100",
                            )}
                          >
                            {highlight(item.title, query).map(([run, on], i) =>
                              on ? (
                                <mark
                                  key={i}
                                  className="bg-transparent font-semibold text-brand-300"
                                >
                                  {run}
                                </mark>
                              ) : (
                                <span key={i}>{run}</span>
                              ),
                            )}
                          </span>
                          {item.subtitle && (
                            <span className="mt-0.5 block truncate text-[12.5px] text-ink-500">
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5 shrink-0 text-brand-400"
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
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-white/8 px-5 py-3">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
            <span className="flex items-center gap-1.5">
              <Key>↑</Key>
              <Key>↓</Key>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Key>⏎</Key>
              open
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            {flat.length} {flat.length === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid h-4 min-w-4 place-items-center rounded border border-white/12 px-1 font-mono text-[9.5px] text-ink-400">
      {children}
    </kbd>
  );
}
