import { therapies, specialtyById } from "@/content/therapies";
import { conditions } from "@/content/conditions";
import { wellnessDrips, injections } from "@/content/wellness";
import { faqs } from "@/content/practice";

/**
 * Flat search index for the command palette.
 *
 * Built once at module scope from the same content modules that render the
 * pages, so it can never drift out of sync with the site — add a therapy and
 * it becomes searchable with no extra step. Small enough (a few hundred rows of
 * strings) to ship with the lazily-loaded palette rather than needing an API.
 */

export type SearchGroup =
  | "Therapies"
  | "Conditions"
  | "Wellness"
  | "Questions"
  | "Pages";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  /** Extra text matched against but not displayed */
  keywords: string;
  href: string;
  group: SearchGroup;
  /**
   * How much a `keywords` hit is worth. Pages carry a hand-picked synonym list
   * ("cost price copay…") so a hit there is a strong signal. Therapies and
   * conditions carry prose — Avsola's summary happens to contain the phrase
   * "lower cost of care" — so a hit there is weak. Same field, very different
   * evidence, hence different weights.
   */
  keywordWeight?: number;
};

const pages: SearchItem[] = [
  ["Home", "", "/", "start beginning"],
  [
    "All therapies",
    "Full formulary, filterable",
    "/therapies",
    "drugs medications formulary browse",
  ],
  [
    "Conditions we treat",
    "By specialty",
    "/conditions",
    "diagnosis disease illness",
  ],
  [
    "Wellness & regenerative",
    "Drip menu and injections",
    "/wellness",
    "vitamin hydration iv bar myers nad",
  ],
  [
    "What to expect",
    "Your first visit, start to finish",
    "/patients",
    "first visit new patient prepare bring",
  ],
  [
    "Patient FAQ",
    "Answers to common questions",
    "/patients/faq",
    "questions help answers",
  ],
  [
    "Insurance & billing",
    "Coverage, prior auth, assistance",
    "/insurance",
    "cost price copay coverage cherry hsa medicare payment",
  ],
  [
    "For providers",
    "Referral requirements",
    "/providers",
    "refer referral physician doctor fax order",
  ],
  [
    "The suite",
    "Inside the infusion center",
    "/suite",
    "photos chairs recliner amenities wifi parking",
  ],
  [
    "Visit us",
    "Map, directions and hours",
    "/locations",
    "address directions map hours parking midlothian",
  ],
  ["About IV League", "The practice", "/about", "story team who we are"],
  [
    "Contact",
    "New patient inquiry",
    "/contact",
    "call email phone inquiry get started book",
  ],
  [
    "Notice of Privacy Practices",
    "HIPAA",
    "/legal/hipaa",
    "hipaa privacy phi rights",
  ],
  ["Privacy Policy", "", "/legal/privacy", "privacy data cookies"],
  ["Terms of Use", "", "/legal/terms", "terms legal"],
  ["Accessibility", "", "/legal/accessibility", "accessibility wcag a11y"],
].map(([title, subtitle, href, keywords]) => ({
  id: `page-${href}`,
  title,
  subtitle: subtitle || undefined,
  href,
  keywords,
  group: "Pages" as const,
  keywordWeight: 34,
}));

export const searchIndex: SearchItem[] = [
  ...therapies.map((t) => ({
    id: `therapy-${t.slug}`,
    title: t.brand,
    subtitle: `${t.generic} · ${specialtyById(t.specialty).label}`,
    keywords: `${t.generic} ${t.drugClass} ${t.summary} ${t.treats.join(" ")}`,
    href: `/therapies/${t.slug}`,
    group: "Therapies" as const,
  })),
  ...conditions.map((c) => ({
    id: `condition-${c.slug}`,
    title: c.name,
    subtitle: specialtyById(c.specialty).label,
    keywords: `${c.shortName ?? ""} ${c.summary} ${c.symptoms.join(" ")}`,
    href: `/conditions/${c.slug}`,
    group: "Conditions" as const,
  })),
  ...wellnessDrips.map((d) => ({
    id: `wellness-${d.slug}`,
    title: d.name,
    subtitle: d.tagline,
    keywords: `${d.description} ${d.ingredients.join(" ")} ${d.bestFor}`,
    href: `/wellness#${d.slug}`,
    group: "Wellness" as const,
  })),
  ...injections.map((i) => ({
    id: `injection-${i.slug}`,
    title: i.name,
    subtitle: `Injection · ${i.duration}`,
    keywords: i.description,
    href: `/wellness#injections`,
    group: "Wellness" as const,
  })),
  ...faqs.map((f, i) => ({
    id: `faq-${i}`,
    title: f.q,
    subtitle: f.category,
    keywords: f.a,
    href: "/patients/faq",
    group: "Questions" as const,
  })),
  ...pages,
];

/**
 * Scored substring search. Not fuzzy — for a controlled vocabulary of drug and
 * condition names, fuzzy matching produces more noise than it saves, and an
 * exact prefix on "ent" should always put Entyvio first.
 */
export function searchContent(query: string, limit = 24): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = searchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = (item.subtitle ?? "").toLowerCase();
      const keywords = item.keywords.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (title === term) score += 120;
        else if (title.startsWith(term)) score += 80;
        else if (title.includes(term)) score += 50;
        // Subtitles are often category metadata ("Insurance & cost") rather
        // than content, so a subtitle hit is weak evidence.
        else if (subtitle.includes(term)) score += 14;
        else if (keywords.includes(term)) score += item.keywordWeight ?? 10;
        else return null; // every term must match something
      }

      // Small tiebreak only — the match tier above should do the real work.
      if (item.group === "Therapies" || item.group === "Conditions") score += 4;
      // Shorter titles are usually the more specific match
      score -= Math.min(title.length / 12, 6);

      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/** Shown before the user types anything. */
export const quickLinks: SearchItem[] = [
  searchIndex.find((i) => i.id === "page-/contact")!,
  searchIndex.find((i) => i.id === "page-/therapies")!,
  searchIndex.find((i) => i.id === "page-/insurance")!,
  searchIndex.find((i) => i.id === "page-/patients/faq")!,
  searchIndex.find((i) => i.id === "page-/locations")!,
].filter(Boolean);

/** Split a title into matched / unmatched runs for highlighting. */
export function highlight(text: string, query: string): [string, boolean][] {
  const q = query.trim().toLowerCase();
  if (!q) return [[text, false]];

  const terms = [...new Set(q.split(/\s+/).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  const lower = text.toLowerCase();
  const hit = new Array<boolean>(text.length).fill(false);

  for (const term of terms) {
    let from = 0;
    for (;;) {
      const at = lower.indexOf(term, from);
      if (at === -1) break;
      for (let i = at; i < at + term.length; i++) hit[i] = true;
      from = at + term.length;
    }
  }

  const runs: [string, boolean][] = [];
  let buf = "";
  let mode = hit[0] ?? false;
  for (let i = 0; i < text.length; i++) {
    if (hit[i] === mode) buf += text[i];
    else {
      runs.push([buf, mode]);
      buf = text[i];
      mode = hit[i];
    }
  }
  if (buf) runs.push([buf, mode]);
  return runs;
}
