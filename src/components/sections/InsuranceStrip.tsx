import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/Button";
import { paymentOptions } from "@/content/practice";
import { payers, PayerLogo } from "@/components/ui/PayerLogos";
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

      <Stagger className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[0.625rem] border border-white/8 bg-white/6 sm:grid-cols-3 lg:grid-cols-4">
        {payers.map((p) => (
          <StaggerItem key={p.id}>
            <div className="group/wall relative flex h-full items-center justify-center bg-ink-950 px-5 py-8 transition-colors duration-500 hover:bg-ink-900">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/wall:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${p.color}22, transparent 70%)`,
                }}
              />
              <PayerLogo payer={p} className="relative" />
            </div>
          </StaggerItem>
        ))}
      </Stagger>

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
