"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------- */
/*                             prefers-reduced-motion                          */
/* -------------------------------------------------------------------------- */

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Drop-in replacement for motion/react's hook, so components that only needed
 * that one function don't pull the animation runtime into their route bundle.
 * Returns false during SSR and on the first client render, which matches the
 * CSS default (animation on, then suppressed by the global media query).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

/* -------------------------------------------------------------------------- */
/*                            shared scroll reveal                             */
/* -------------------------------------------------------------------------- */

/**
 * One IntersectionObserver for every reveal on the page rather than one per
 * element. Elements unobserve themselves as soon as they've been seen.
 */
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -80px 0px", threshold: 0.01 },
  );
  return observer;
}

/** Adds `is-visible` to the element the first time it enters the viewport. */
export function useRevealOnce<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already on screen at mount, skip the observer entirely
    // so above-the-fold content never waits a frame to become visible.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      return;
    }

    const io = getObserver();
    callbacks.set(el, () => el.classList.add("is-visible"));
    io.observe(el);

    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, [ref]);
}

/* -------------------------------------------------------------------------- */
/*                                scroll state                                 */
/* -------------------------------------------------------------------------- */

/**
 * `true` once the page has scrolled past `threshold`. Uses a passive listener
 * coalesced into a single rAF — cheaper than a motion value subscription and
 * it costs no bundle.
 */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPast(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return past;
}
