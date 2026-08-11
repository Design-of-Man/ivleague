import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { EdgeGlow } from "@/components/ui/Backdrop";
import { site } from "@/content/site";

export function Stats() {
  return (
    <section className="relative border-y border-white/8 bg-ink-900/40">
      <EdgeGlow />
      <div className="shell">
        <dl className="grid grid-cols-2 divide-white/6 md:grid-cols-4 md:divide-x">
          {site.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="border-b border-white/6 px-2 py-10 text-center md:border-b-0 md:px-6 md:py-14"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <div className="font-display text-[clamp(2.25rem,1.5rem+2.6vw,3.5rem)] font-semibold leading-none text-gradient">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-ink-400">
                  {s.label}
                </div>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
