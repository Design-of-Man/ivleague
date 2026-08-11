"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { navigation, site, getOpenState } from "@/content/site";
import { SearchHost, SearchButton } from "@/components/search/SearchTrigger";
import { useScrolledPast } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * The header renders on every route, so it imports no animation library.
 * The mega menu and the mobile drawer stay mounted and are shown or hidden
 * with CSS transitions plus `inert`, which is cheaper than mount/unmount
 * animation and keeps hidden panels out of the tab order and the a11y tree.
 */
export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(24);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation. Adjusting state during render (rather than
  // in an effect) avoids a frame where the drawer is still open on the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Lock body scroll behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hoverOpen = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-teal-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Skip to content
      </a>

      <SearchHost />
      <TopBar />

      <header
        className={cn(
          "fixed inset-x-0 z-60 transition-[background-color,backdrop-filter,border-color,box-shadow,top] duration-500 ease-[var(--ease-out-expo)]",
          scrolled
            ? "top-0 border-b border-white/8 bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)]"
            : "top-0 border-b border-transparent lg:top-9",
        )}
        onMouseLeave={hoverClose}
      >
        <nav
          className="shell-wide flex h-18 items-center justify-between gap-6"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="relative z-10 shrink-0 transition-opacity hover:opacity-85"
          >
            <Logo animated />
          </Link>

          {/* ---------------------------- Desktop ---------------------------- */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const hasMenu = Boolean(item.children?.length);
              const active = isActive(item.href);
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => (hasMenu ? hoverOpen(item.label) : hoverClose())}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-full px-3.5 py-3 text-[14px] font-medium transition-colors duration-300",
                      active ? "text-teal-300" : "text-ink-200 hover:text-ink-50",
                    )}
                    aria-expanded={hasMenu ? openMenu === item.label : undefined}
                  >
                    {item.label}
                    {hasMenu && (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className={cn(
                          "h-2.5 w-2.5 transition-transform duration-300",
                          openMenu === item.label && "rotate-180",
                        )}
                        aria-hidden="true"
                      >
                        <path
                          d="m2.5 4.5 3.5 3.5 3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full ring-1 ring-inset transition-all duration-400 ease-[var(--ease-out-expo)]",
                        active
                          ? "bg-teal-400/10 opacity-100 ring-teal-400/20"
                          : "bg-transparent opacity-0 ring-transparent",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2.5 lg:flex">
            <SearchButton />
            <ButtonLink href={site.contact.phoneHref} variant="ghost" size="sm">
              <PhoneGlyph />
              {site.contact.phone}
            </ButtonLink>
            <ButtonLink href="/contact#inquiry" size="sm">
              Become a patient
              <ArrowGlyph />
            </ButtonLink>
          </div>

          {/* ----------------------------- Mobile ---------------------------- */}
          <div className="flex items-center gap-2 lg:hidden">
            <SearchButton iconOnly />
            <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 h-[1.5px] w-5 rounded-full bg-ink-50 transition-all duration-400 ease-[var(--ease-out-expo)]",
                  mobileOpen ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-[1.5px] w-5 rounded-full bg-ink-50 transition-all duration-400 ease-[var(--ease-out-expo)]",
                  mobileOpen ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
            </button>
          </div>
        </nav>

        {/* -------------------------- Mega menu ---------------------------- */}
        {navigation
          .filter((item) => item.children?.length)
          .map((item) => {
            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                inert={!open}
                className={cn(
                  "absolute inset-x-0 top-full hidden transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] lg:block",
                  open
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0",
                )}
                onMouseEnter={() => hoverOpen(item.label)}
              >
                <div className="shell-wide pt-2">
                  <MegaPanel label={item.label} />
                </div>
              </div>
            );
          })}
      </header>

      {/* --------------------------- Mobile drawer ------------------------- */}
      <div
        inert={!mobileOpen}
        className={cn(
          "fixed inset-0 z-55 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-ink-950/92 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col overflow-y-auto border-l border-white/8 bg-ink-900 pb-8 pt-24 transition-transform duration-500 ease-[var(--ease-out-expo)]",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex flex-col gap-1 px-6">
            {navigation.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "block border-b border-white/6 py-3.5 font-display text-[22px] font-medium tracking-tight transition-colors",
                    isActive(item.href) ? "text-teal-300" : "text-ink-50",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="grid gap-0.5 pb-2 pt-2">
                    {item.children.slice(0, 6).map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="py-1.5 text-[14px] text-ink-400 transition-colors hover:text-teal-300"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 px-6">
            <ButtonLink href="/contact#inquiry" size="lg" className="w-full">
              Become a patient
              <ArrowGlyph />
            </ButtonLink>
            <ButtonLink
              href={site.contact.phoneHref}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              <PhoneGlyph />
              {site.contact.phone}
            </ButtonLink>
          </div>

          <div className="mt-auto px-6 pt-10 text-[13px] leading-relaxed text-ink-400">
            <p className="font-medium text-ink-200">{site.address.street}</p>
            <p>
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </p>
            <p className="mt-3">Mon–Fri 9–6 · Sat–Sun 9–1</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function MegaPanel({ label }: { label: string }) {
  const item = navigation.find((n) => n.label === label);
  if (!item?.children) return null;

  return (
    <div className="glass overflow-hidden rounded-[0.625rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
      <div className="grid gap-px bg-white/6 md:grid-cols-[1.1fr_1.6fr]">
        {item.featured ? (
          <Link
            href={item.featured.href}
            className="group relative flex flex-col justify-between gap-8 bg-ink-900 p-7 transition-colors hover:bg-ink-850"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(31,205,192,0.14),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
                {item.label}
              </p>
              <p className="mt-3 font-display text-xl font-semibold tracking-tight text-ink-50">
                {item.featured.label}
              </p>
              <p className="mt-2.5 max-w-xs text-[13.5px] leading-relaxed text-ink-400">
                {item.featured.blurb}
              </p>
            </div>
            <span className="relative inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-300">
              Explore
              <ArrowGlyph />
            </span>
          </Link>
        ) : (
          <div className="bg-ink-900 p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
              {item.label}
            </p>
          </div>
        )}

        <div className="grid gap-px bg-white/6 sm:grid-cols-2">
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group bg-ink-900 px-6 py-5 transition-colors hover:bg-ink-850"
            >
              <span className="flex items-center gap-2 text-[14.5px] font-medium text-ink-50 transition-colors group-hover:text-teal-200">
                {c.label}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {c.blurb && (
                <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-400">
                  {c.blurb}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The clock is an external system, so the open/closed badge reads it through
 * useSyncExternalStore: the server snapshot is empty (avoiding a hydration
 * mismatch against whatever time the build ran at) and the client re-reads it
 * once a minute.
 */
const clockStore = {
  subscribe(onChange: () => void) {
    const id = setInterval(onChange, 60_000);
    return () => clearInterval(id);
  },
  getSnapshot() {
    const s = getOpenState();
    return `${s.open ? "1" : "0"}|${s.label}|${s.detail}`;
  },
  getServerSnapshot() {
    return "";
  },
};

function TopBar() {
  const snapshot = useSyncExternalStore(
    clockStore.subscribe,
    clockStore.getSnapshot,
    clockStore.getServerSnapshot,
  );

  const state = snapshot
    ? (() => {
        const [open, label, detail] = snapshot.split("|");
        return { open: open === "1", label, detail };
      })()
    : null;

  return (
    <div className="fixed inset-x-0 top-0 z-40 hidden h-9 items-center border-b border-white/6 bg-ink-950 lg:flex">
      <div className="shell-wide flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-5 text-ink-400">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "relative flex h-1.5 w-1.5",
                state?.open ? "text-teal-400" : "text-ink-500",
              )}
            >
              {state?.open && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-70 animate-[pulse-ring_3.2s_var(--ease-out-expo)_infinite]" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            <span className={state?.open ? "text-teal-300" : "text-ink-400"}>
              {state ? state.label : "Hours"}
            </span>
            {state?.detail && <span className="text-ink-500">· {state.detail}</span>}
          </span>
          <span className="hidden xl:inline">
            {site.address.street}, {site.address.city}, {site.address.region}
          </span>
        </div>
        <div className="flex items-center gap-5 text-ink-400">
          <span>Physician referral required for all therapies</span>
          <a
            href={site.contact.emailHref}
            className="link-underline transition-colors hover:text-teal-300"
          >
            {site.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M5.2 2.5 6.6 5 5.4 6.4a8.4 8.4 0 0 0 4.2 4.2L11 9.4l2.5 1.4v2.3c0 .5-.4.9-.9.8A11.6 11.6 0 0 1 2.1 3.4c0-.5.3-.9.8-.9h2.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
