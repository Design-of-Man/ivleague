/**
 * Instagram feed.
 *
 * Live mode: set INSTAGRAM_ACCESS_TOKEN (Instagram Basic Display or a
 * Graph API token for the connected Business account). The route revalidates
 * hourly so the page stays static-fast while the grid stays fresh.
 *
 * Fallback mode: with no token configured — or if Meta returns an error, which
 * long-lived tokens eventually do — the grid renders curated placeholder tiles
 * so the section never collapses into an empty box on a live site.
 *
 * Swapping in real content later requires zero component changes.
 */

import { site } from "@/content/site";

export type InstagramPost = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
  /** true when the tile is generated art rather than a real post */
  placeholder?: boolean;
  /** short overlay headline, placeholder tiles only */
  label?: string;
};

type GraphMedia = {
  id: string;
  caption?: string;
  media_type: InstagramPost["mediaType"];
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

const FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

export async function fetchInstagramPosts(
  limit = 9,
): Promise<{ posts: InstagramPost[]; live: boolean }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID ?? "me";

  if (!token) return { posts: placeholderPosts(limit), live: false };

  try {
    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=${FIELDS}&limit=${limit}&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error(`Instagram API ${res.status}`);

    const json = (await res.json()) as { data?: GraphMedia[] };
    const data = json.data ?? [];
    if (data.length === 0)
      return { posts: placeholderPosts(limit), live: false };

    return {
      posts: data.map((m) => ({
        id: m.id,
        caption: m.caption ?? "",
        mediaType: m.media_type,
        mediaUrl: m.media_url,
        thumbnailUrl: m.thumbnail_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
      })),
      live: true,
    };
  } catch (err) {
    console.warn(
      "[instagram] falling back to placeholder tiles:",
      err instanceof Error ? err.message : err,
    );
    return { posts: placeholderPosts(limit), live: false };
  }
}

/* -------------------------------------------------------------------------- */
/*                             PLACEHOLDER CONTENT                             */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_CAPTIONS = [
  "Suite 3 is open and the recliner has heat. Weekend mornings are for catching up on treatment, not falling behind. 🩵",
  "Prior authorization approved in 36 hours. That's the part of this job nobody posts about, and the part that gets you infusing.",
  "New on the formulary: quarterly CGRP infusions for chronic migraine. Thirty minutes, four times a year, lights low.",
  'Iron deficiency is not just "being tired." Two visits and most patients feel the difference within weeks.',
  "Same nurse. Same chair. Same time. Continuity is clinical care, not a perk.",
  "Behind the scenes: every biologic we hang comes from a U.S. pharmacy held to FDA and USP standards. Every single one.",
  "Hydration season is here. Bring a friend. Every suite has a seat for someone who came with you.",
  "Referral to first infusion in under three weeks. Providers: send the order, we'll take it from there.",
  "The Myers' Cocktail has been around since the 1960s and it's still the most requested bag in the building.",
  "Free parking at the door. No garage, no ticket, no long walk in the rain.",
  "Reminder: eat before your infusion and hydrate the day before. It makes IV access faster and the whole visit easier.",
  "Twelve thousand infusions and counting. Thank you, Delray Beach. 🩵",
];

/**
 * Short overlay label for each placeholder tile. Real posts don't need this —
 * the component only reads it when `placeholder` is true.
 */
const PLACEHOLDER_LABELS = [
  "Weekend hours",
  "Prior auth · 36 hrs",
  "New: quarterly CGRP",
  "IV iron, two visits",
  "Same nurse, same chair",
  "U.S. pharmacy sourced",
  "Hydration season",
  "Referral to chair · 3 wks",
  "The Myers' Cocktail",
  "Free parking, at the door",
  "Before your infusion",
  "12,000 infusions",
];

function placeholderPosts(limit: number): InstagramPost[] {
  // Fixed epoch so server and client render identical markup (no hydration drift)
  const base = Date.UTC(2026, 6, 28, 15, 0, 0);
  return Array.from({ length: limit }, (_, i) => ({
    id: `placeholder-${i}`,
    caption: PLACEHOLDER_CAPTIONS[i % PLACEHOLDER_CAPTIONS.length],
    label: PLACEHOLDER_LABELS[i % PLACEHOLDER_LABELS.length],
    mediaType: (i % 5 === 3
      ? "VIDEO"
      : i % 4 === 1
        ? "CAROUSEL_ALBUM"
        : "IMAGE") as InstagramPost["mediaType"],
    mediaUrl: "",
    permalink: site.social.instagram,
    timestamp: new Date(base - i * 86400000 * 3).toISOString(),
    placeholder: true,
  }));
}
