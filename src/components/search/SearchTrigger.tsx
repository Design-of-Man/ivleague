"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Search is split into a host and a button on purpose.
 *
 * The nav renders a trigger at two breakpoints. If each trigger owned its own
 * state, opening one would mount two palettes and register the ⌘K listener
 * twice. So `SearchHost` is mounted exactly once and owns everything; buttons
 * are dumb and just fire an event.
 *
 * The palette and its index are pulled in with `next/dynamic` on first open, so
 * a visitor who never searches never downloads them — which is what keeps this
 * off the critical path of all 76 routes.
 */

const OPEN_EVENT = "ivl:search-open";

const CommandPalette = dynamic(
  () => import("./CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

/**
 * Platform is an external, never-changing fact — read it through
 * useSyncExternalStore so the server renders the neutral "Ctrl K" and the
 * client corrects to "⌘K" without an effect-driven second render.
 */
const platformStore = {
  subscribe() {
    return () => {};
  },
  getSnapshot() {
    return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  },
  getServerSnapshot() {
    return false;
  },
};

/** Mount once. Owns the open state, the hotkeys and the dialog. */
export function SearchHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, openIt);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens too, unless the visitor is already typing somewhere
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const el = document.activeElement;
        const typing =
          el instanceof HTMLElement &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT" ||
            el.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener(OPEN_EVENT, openIt);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return <CommandPalette onClose={() => setOpen(false)} />;
}

/** Render as many of these as the layout needs. */
export function SearchButton({
  className,
  iconOnly,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const mac = useSyncExternalStore(
    platformStore.subscribe,
    platformStore.getSnapshot,
    platformStore.getServerSnapshot,
  );

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      aria-label="Search the site"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "group flex items-center rounded-full border border-white/10 bg-white/[0.03] text-ink-400 transition-colors duration-300 hover:border-teal-400/35 hover:text-ink-100",
        iconOnly
          ? "h-11 w-11 justify-center"
          : "gap-2.5 py-2 pl-3.5 pr-2.5 text-[13px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={iconOnly ? "h-4 w-4" : "h-3.5 w-3.5"}
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="m10.5 10.5 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {!iconOnly && (
        <>
          <span className="hidden xl:inline">Search</span>
          <kbd className="hidden rounded border border-white/12 px-1.5 py-0.5 font-mono text-[10px] leading-none text-ink-500 transition-colors group-hover:border-teal-400/30 xl:block">
            {mac ? "⌘" : "Ctrl "}K
          </kbd>
        </>
      )}
    </button>
  );
}
