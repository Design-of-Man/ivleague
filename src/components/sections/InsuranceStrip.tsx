import { Section, SectionHeading } from "@/components/ui/Section";
import { Marquee, MarqueePill } from "@/components/ui/Marquee";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { insurancePlans, paymentOptions } from "@/content/practice";
import { chunk } from "@/lib/utils";
import {
  ShieldCheck,
  Landmark,
  CreditCard,
  CalendarClock,
  Receipt,
  HandCoins,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  landmark: Landmark,
  "credit-card": CreditCard,
  "calendar-clock": CalendarClock,
  receipt: Receipt,
  "hand-coins": HandCoins,
};

export function InsuranceStrip() {
  const rows = chunk(insurancePlans, Math.ceil(insurancePlans.length / 2));

  return (
    <Section className="relative border-y border-white/8 bg-ink-900/40">
      <SectionHeading
        eyebrow="Insurance & cost"
        title={
          <>
            We fight the benefits battle
            <br />
            <span className="text-gradient">so you don&apos;t have to.</span>
          </>
        }
        lead="Most major commercial plans, Medicare and Medicaid accepted — plus HSA cards at the time of infusion and Cherry payment plans when you need to spread the cost."
        action={
          <ButtonLink href="/insurance" variant="secondary">
            Insurance details
            <ArrowGlyph />
          </ButtonLink>
        }
      />

      <Reveal delay={0.1} className="mt-12 flex flex-col gap-3">
        {rows.map((row, i) => (
          <Marquee key={i} reverse={i % 2 === 1} speed={i % 2 === 1 ? 52 : 44}>
            {row.map((p) => (
              <MarqueePill key={p}>{p}</MarqueePill>
            ))}
          </Marquee>
        ))}
      </Reveal>

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paymentOptions.map((o) => {
          const Icon = icons[o.icon] ?? ShieldCheck;
          return (
            <StaggerItem key={o.title}>
              <div className="group card card-hover flex h-full gap-4 p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-teal-400/20 bg-teal-400/[0.07] text-teal-300 transition-colors duration-500 group-hover:border-teal-400/45">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[15.5px] font-semibold tracking-tight text-ink-50">
                    {o.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-400">
                    {o.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal delay={0.12}>
        <p className="mt-8 text-[12.5px] leading-relaxed text-ink-500">
          Network participation varies by plan and product line. Contact us to confirm
          whether we accept your specific plan before scheduling.
        </p>
      </Reveal>
    </Section>
  );
}
