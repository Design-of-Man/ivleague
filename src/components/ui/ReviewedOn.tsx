import { CONTENT_REVIEWED, CONTENT_REVIEWED_ISO } from "@/content/reviewed";
import { cn } from "@/lib/utils";

/**
 * Visible review date on clinical pages.
 *
 * Undated health content loses to dated health content, both in search and in
 * the judgement of a reader deciding whether to trust it. The `<time>` element
 * carries the machine-readable value that pairs with `lastReviewed` in the
 * page's MedicalWebPage schema.
 */
export function ReviewedOn({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500",
        className,
      )}
    >
      Content last reviewed{" "}
      <time dateTime={CONTENT_REVIEWED_ISO}>{CONTENT_REVIEWED}</time>
    </p>
  );
}
