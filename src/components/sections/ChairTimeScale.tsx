import {
  chairTimeOf,
  chairTimeDistribution,
  longestChairTime,
  formatMinutes,
  shorterThanCount,
} from "@/lib/duration";
import type { Therapy } from "@/content/therapies";
import { therapyArticle } from "@/lib/answers";

/**
 * Where this therapy sits against the whole formulary by chair time.
 *
 * "How long will I be there" is the single most practical question a patient
 * has once treatment is decided — it determines childcare, a day off, whether
 * they can drive themselves. A range in a sentence answers it; showing the
 * range against every other therapy answers the question behind it, which is
 * whether this is a short visit or a long one.
 *
 * Server-rendered, no JS: it's a static chart of static data.
 */
export function ChairTimeScale({ therapy }: { therapy: Therapy }) {
  const ct = chairTimeOf(therapy);
  const scaleMax = Math.ceil(longestChairTime / 60) * 60;
  const pct = (m: number) => Math.min((m / scaleMax) * 100, 100);

  const shorter = shorterThanCount(ct.typical);
  const total = chairTimeDistribution.length;
  const isRange = ct.max > ct.min && !ct.openEnded;

  // Hour gridlines across the axis
  const ticks = Array.from({ length: scaleMax / 60 + 1 }, (_, i) => i * 60);

  return (
    <section aria-labelledby="chair-time-heading" className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2
          id="chair-time-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400"
        >
          How long does {therapyArticle(therapy)} {therapy.brand} infusion take?
        </h2>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
          {total} therapies on formulary
        </p>
      </div>

      <p className="mt-5 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.1rem)] font-semibold leading-none tracking-tight text-ink-50">
        {ct.openEnded
          ? `${formatMinutes(ct.min)}+`
          : isRange
            ? `${formatMinutes(ct.min)} – ${formatMinutes(ct.max)}`
            : formatMinutes(ct.typical)}
      </p>
      <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-ink-400">
        {shorter === 0
          ? "The shortest visit on our formulary."
          : shorter >= total - 1
            ? "One of the longest visits we schedule, so plan the day around it."
            : `Shorter than ${total - shorter - 1} of our ${total} therapies, longer than ${shorter}.`}{" "}
        This is infusion time; add check-in and any observation your physician
        orders.
      </p>

      {/* Distribution */}
      <div className="mt-8">
        <div className="relative h-24">
          {/* gridlines */}
          <div aria-hidden="true" className="absolute inset-0">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute top-0 h-14 w-px bg-white/6"
                style={{ left: `${pct(t)}%` }}
              />
            ))}
          </div>

          {/* every other therapy, as a faint tick */}
          <div aria-hidden="true" className="absolute inset-x-0 top-4 h-6">
            {chairTimeDistribution.map((d) => (
              <span
                key={d.slug}
                className={
                  d.slug === therapy.slug
                    ? "absolute top-0 h-6 w-[2.5px] -translate-x-1/2 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(31,205,192,0.85)]"
                    : "absolute top-1.5 h-3 w-px -translate-x-1/2 rounded-full bg-white/20"
                }
                style={{ left: `${pct(d.typical)}%` }}
              />
            ))}
          </div>

          {/* this therapy's range */}
          {isRange && (
            <div
              aria-hidden="true"
              className="absolute top-[1.19rem] h-2.5 rounded-full bg-brand-400/25 ring-1 ring-inset ring-brand-400/40"
              style={{
                left: `${pct(ct.min)}%`,
                width: `${Math.max(pct(ct.max) - pct(ct.min), 0.8)}%`,
              }}
            />
          )}

          {/* axis labels */}
          <div aria-hidden="true" className="absolute inset-x-0 top-16 h-4">
            {ticks.map((t, i) => (
              <span
                key={t}
                className="absolute -translate-x-1/2 font-mono text-[9.5px] tracking-[0.1em] text-ink-500"
                style={{
                  left: `${pct(t)}%`,
                  transform:
                    i === 0
                      ? "translateX(0)"
                      : i === ticks.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {t === 0 ? "0" : `${t / 60}h`}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/6 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
          <span className="flex items-center gap-2">
            <span className="h-3 w-[2.5px] rounded-full bg-brand-400" />
            {therapy.brand}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-px rounded-full bg-white/45" />
            Other therapies
          </span>
        </p>
      </div>
    </section>
  );
}
