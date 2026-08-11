import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils";

/**
 * Per-page Q&A, phrased the way patients actually type the question.
 *
 * Two reasons this exists on every therapy and condition page rather than only
 * on /patients/faq. First, an answer engine matches a heading against a query,
 * and "How long does an Entyvio infusion take?" is retrievable in a way that
 * "Schedule & logistics" is not. Second, the accordion keeps closed answers in
 * the HTML behind `inert`, so all of it is crawlable without turning the page
 * into a wall of text for the person reading it.
 *
 * The questions are generated from the same fields the page renders, so the
 * answers can never contradict the page above them.
 */
export function AnswerFaqs({
  heading,
  items,
  className,
}: {
  heading: string;
  items: { q: string; a: string }[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <section className={cn(className)} aria-labelledby="page-faq">
      <h2 id="page-faq" className="text-2xl font-semibold">
        {heading}
      </h2>
      <Accordion
        className="mt-6"
        items={items.map((f, i) => ({
          id: `q-${i}`,
          title: f.q,
          content: <p>{f.a}</p>,
        }))}
      />
    </section>
  );
}
