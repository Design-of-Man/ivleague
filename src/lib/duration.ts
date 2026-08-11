import { therapies, type Therapy } from "@/content/therapies";

/**
 * Chair time, parsed out of the human-readable duration strings.
 *
 * The content is written for patients ("About 30 minutes of infusion time,
 * plus check-in and observation"), not for a database — and it should stay that
 * way, because that sentence is what a nervous person needs to read. So the
 * numbers are derived here rather than duplicated as a second field that would
 * inevitably drift from the prose.
 */

export type ChairTime = {
  /** Lower bound in minutes */
  min: number;
  /** Upper bound in minutes; equals `min` for a single figure */
  max: number;
  /** What we sort and plot by */
  typical: number;
  /**
   * True when the source says "at least 15 minutes" — there is a floor but no
   * stated ceiling. Rendering that as "15–23 min" would be inventing precision
   * the clinical copy deliberately doesn't claim, so it renders as "15 min+".
   */
  openEnded: boolean;
};

const HOUR = 60;

export function parseChairTime(duration: string): ChairTime {
  const d = duration.toLowerCase();

  // "3 to 5 hours", "1 to 2 hours", "60 to 90 minutes"
  const range = d.match(
    /(\d+(?:\.\d+)?)\s*(?:to|–|-)\s*(\d+(?:\.\d+)?)\s*(hour|minute|min)/,
  );
  if (range) {
    const unit = range[3].startsWith("hour") ? HOUR : 1;
    const min = Number(range[1]) * unit;
    const max = Number(range[2]) * unit;
    return { min, max, typical: (min + max) / 2, openEnded: false };
  }

  // "about 2 hours", "at least 15 minutes", "around 1 hour"
  const single = d.match(/(\d+(?:\.\d+)?)\s*(hour|minute|min)/);
  if (single) {
    const unit = single[2].startsWith("hour") ? HOUR : 1;
    const v = Number(single[1]) * unit;
    // "at least" and "or more" mean the real number skews longer
    const openEnded = /at least|or more|plus/.test(d);
    // The plotted position still skews longer than the floor — a visit billed
    // as "at least 15 minutes" is not a 15-minute visit — but the label says
    // what the copy says.
    return {
      min: v,
      max: openEnded ? v * 1.5 : v,
      typical: openEnded ? v * 1.25 : v,
      openEnded,
    };
  }

  // Injections: "Injection plus brief observation", "A few minutes, plus check-in"
  return { min: 15, max: 30, typical: 20, openEnded: false };
}

export function chairTimeOf(t: Therapy): ChairTime {
  return parseChairTime(t.duration);
}

/** Minutes → "30 min" / "1 hr 30 min" / "4 hrs" */
export function formatMinutes(mins: number): string {
  const m = Math.round(mins);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const hLabel = `${h} hr${h === 1 ? "" : "s"}`;
  return rest ? `${hLabel} ${rest} min` : hLabel;
}

/** The longest typical chair time on the formulary, for scaling the axis. */
export const longestChairTime = Math.max(
  ...therapies.map((t) => chairTimeOf(t).typical),
);

/**
 * Every therapy's typical chair time, sorted — used to plot the distribution
 * behind a single therapy's marker.
 */
export const chairTimeDistribution = therapies
  .map((t) => ({ slug: t.slug, brand: t.brand, typical: chairTimeOf(t).typical }))
  .sort((a, b) => a.typical - b.typical);

/** How many therapies on the formulary are shorter than this one. */
export function shorterThanCount(typical: number): number {
  return chairTimeDistribution.filter((d) => d.typical < typical).length;
}
