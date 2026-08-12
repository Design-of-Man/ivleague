"use client";

import { useMemo, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { faqs, faqCategories, type Faq } from "@/content/practice";
import { cn } from "@/lib/utils";

export function FaqSection({
  items = faqs,
  showFilters = true,
  showSearch = false,
  eyebrow = "Questions",
  title,
  lead,
  cta = true,
}: {
  items?: Faq[];
  showFilters?: boolean;
  showSearch?: boolean;
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  cta?: boolean;
}) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((f) => {
      const catOk = category === "All" || f.category === category;
      const qOk =
        !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [items, category, query]);

  return (
    <Section id="faq" className="relative">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow={eyebrow}
            title={
              title ?? (
                <>
                  Straight answers,
                  <br />
                  <span className="text-gradient">before you call.</span>
                </>
              )
            }
            lead={
              lead ??
              "Everything patients ask us in the first phone call: referrals, insurance, timing, and what the day actually looks like."
            }
          />

          {cta && (
            <Reveal delay={0.18} className="mt-8">
              <div className="rounded-[0.625rem] border border-white/8 bg-white/[0.02] p-6">
                <p className="text-[14.5px] font-medium text-ink-50">
                  Still not sure if we can help?
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-400">
                  Call and describe your situation. If we&apos;re not the right
                  site of care, we&apos;ll tell you who is.
                </p>
                <ButtonLink
                  href="/contact"
                  variant="outline"
                  size="sm"
                  className="mt-5"
                >
                  Talk to us
                  <ArrowGlyph />
                </ButtonLink>
              </div>
            </Reveal>
          )}
        </div>

        <div>
          {(showFilters || showSearch) && (
            <Reveal className="mb-8 flex flex-col gap-4">
              {showSearch && (
                <div className="relative">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
                    aria-hidden="true"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="4.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="m10.5 10.5 3 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search questions…"
                    aria-label="Search frequently asked questions"
                    className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[14px] text-ink-50 placeholder:text-ink-500 transition-colors focus:border-brand-400/50 focus:outline-none"
                  />
                </div>
              )}

              {showFilters && (
                <div className="flex flex-wrap gap-2">
                  {["All", ...faqCategories].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300",
                        category === c
                          ? "border-brand-400/45 bg-brand-400/10 text-brand-200"
                          : "border-white/8 bg-white/[0.02] text-ink-400 hover:border-white/16 hover:text-ink-100",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </Reveal>
          )}

          {filtered.length > 0 ? (
            <Accordion
              items={filtered.map((f, i) => ({
                id: `${f.category}-${i}`,
                title: f.q,
                meta:
                  showFilters && category === "All" ? f.category : undefined,
                content: <p>{f.a}</p>,
              }))}
              defaultOpen={`${filtered[0].category}-0`}
            />
          ) : (
            <p className="rounded-[0.625rem] border border-white/8 bg-white/[0.02] px-6 py-10 text-center text-[14px] text-ink-400">
              No questions match that search. Try a different term, or just{" "}
              <a
                href="/contact"
                className="text-brand-300 underline underline-offset-4"
              >
                ask us directly
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
