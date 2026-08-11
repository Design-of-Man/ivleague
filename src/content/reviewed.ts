/**
 * When the clinical and practice copy on this site was last read end to end.
 *
 * Freshness is a real ranking and citation input: AI answer engines weight
 * recency, and for medical content a visible review date is part of the E-E-A-T
 * signal rather than decoration. It is deliberately a hand-edited constant and
 * not a build timestamp, because a date that advances every deploy claims a
 * review that nobody performed.
 *
 * Bump this only when someone has actually re-read the content.
 */
export const CONTENT_REVIEWED_ISO = "2026-08-11";

export const CONTENT_REVIEWED = new Date(
  `${CONTENT_REVIEWED_ISO}T12:00:00Z`,
).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
