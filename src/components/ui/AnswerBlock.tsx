import { cn } from "@/lib/utils";

/**
 * The one paragraph on the page that has to survive being quoted alone.
 *
 * Answer engines lift passages out of their layout, and the page's opening
 * line is written to sit under a display headline — "A gut-selective biologic
 * for ulcerative colitis" reads well there and says nothing once the headline
 * is gone. This block restates the same facts as a self-contained sentence set,
 * so a reader who only ever sees this paragraph still learns what the drug is,
 * who administers it and where.
 *
 * It is not hidden, not duplicated markup, and not written for machines at the
 * expense of people: it is the plain-language summary the page should have led
 * with anyway. `speakable` marks it for voice assistants.
 */
export function AnswerBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-answer
      className={cn(
        "relative rounded-[0.625rem] border border-teal-400/20 bg-teal-400/[0.045] p-6 sm:p-7",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-6 h-10 w-px bg-gradient-to-b from-teal-300 to-transparent"
      />
      <p className="text-[15.5px] leading-relaxed text-ink-100">{children}</p>
    </div>
  );
}
