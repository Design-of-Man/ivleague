import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Deterministic 0–1 pseudo-random from a string. Used for decorative layout. */
export function hashUnit(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function formatPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function truncate(str: string, n: number) {
  return str.length > n ? `${str.slice(0, n - 1).trimEnd()}…` : str;
}

/** Chunk an array into groups of n — used for marquee rows and grids. */
export function chunk<T>(arr: readonly T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n) as T[]);
  return out;
}
