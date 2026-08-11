"use client";

import { useState } from "react";
import { Button, ArrowGlyph } from "@/components/ui/Button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const INTERESTS = [
  "Specialty / biologic infusion",
  "IVIG",
  "IV iron",
  "IV antibiotics",
  "Bone health (Reclast / Prolia)",
  "Wellness or hydration drip",
  "Not sure yet",
];

const HEARD = [
  "My physician referred me",
  "Google search",
  "Instagram or Facebook",
  "Friend or family",
  "Insurance directory",
  "Other",
];

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        setMessage(
          json.message ?? "Something went wrong. Please call us instead.",
        );
        setStatus("error");
        return;
      }

      setMessage(json.message ?? "");
      setStatus("success");
      form.reset();
    } catch {
      setMessage(
        "We couldn't reach the server. Please call us at " +
          site.contact.phone +
          ".",
      );
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      {status === "success" ? (
        <div className="swap-in card relative overflow-hidden p-9 text-center sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,205,192,0.16),transparent_60%)]"
          />
          <div className="relative">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-teal-400/35 bg-teal-400/12 text-teal-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="m5 12.5 4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
              We&apos;ve got it.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-300">
              {message ||
                "A member of our team will reach out — usually the same business day. If it's urgent, call us and we'll pick up."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-11 items-center rounded-full bg-teal-400 px-6 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-teal-300"
              >
                {site.contact.phone}
              </a>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-[13.5px] font-medium text-ink-400 transition-colors hover:text-teal-300"
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="swap-in card p-7 sm:p-9"
          noValidate
        >
          {/* Honeypot — real people never fill this */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <fieldset disabled={status === "submitting"} className="grid gap-5">
            <legend className="sr-only">New patient inquiry</legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="First name"
                name="firstName"
                required
                autoComplete="given-name"
                error={errors.firstName}
              />
              <Field
                label="Last name"
                name="lastName"
                required
                autoComplete="family-name"
                error={errors.lastName}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                error={errors.email}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="(804) 555-0134"
                error={errors.phone}
              />
            </div>

            <SelectField
              label="What are you interested in?"
              name="interest"
              options={INTERESTS}
              error={errors.interest}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Diagnosis or medication"
                name="diagnosis"
                placeholder="Crohn's disease · Entyvio"
                hint="If you know it. If not, leave it blank."
                error={errors.diagnosis}
              />
              <Field
                label="Prescribing physician"
                name="physician"
                placeholder="Dr. Smith, Richmond GI"
                hint="We'll contact their office for orders."
                error={errors.physician}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Insurance carrier"
                name="insurance"
                placeholder="Anthem BCBS"
                error={errors.insurance}
              />
              <SelectField
                label="How did you hear about us?"
                name="referralSource"
                options={HEARD}
                error={errors.referralSource}
              />
            </div>

            <TextareaField
              label="Anything else we should know?"
              name="notes"
              placeholder="Scheduling constraints, prior infusion experience, questions about cost…"
              error={errors.notes}
            />

            <label
              htmlFor="consent"
              className="flex cursor-pointer items-start gap-3 rounded-[0.5rem] border border-white/8 bg-white/[0.02] p-4"
            >
              <input
                id="consent"
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-teal-400"
              />
              <span className="text-[12.5px] leading-relaxed text-ink-400">
                I consent to being contacted by IV League Infusions about my
                inquiry by phone, text or email. I understand this form is{" "}
                <strong className="font-medium text-ink-200">
                  not a secure channel
                </strong>{" "}
                and I should not include detailed medical information here.
              </span>
            </label>

            {status === "error" && message && (
              <p
                role="alert"
                className="rounded-[0.5rem] border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-[13px] text-red-200"
              >
                {message}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {status === "submitting" ? (
                  <>
                    <Spinner />
                    Sending…
                  </>
                ) : (
                  <>
                    Send inquiry
                    <ArrowGlyph />
                  </>
                )}
              </Button>
              <p className="text-[12px] leading-relaxed text-ink-500 sm:max-w-[18rem] sm:text-right">
                Prefer to talk? Call{" "}
                <a
                  href={site.contact.phoneHref}
                  className="font-medium text-teal-300 hover:text-teal-200"
                >
                  {site.contact.phone}
                </a>
              </p>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const inputBase =
  "h-12 w-full rounded-[0.5rem] border bg-white/[0.03] px-4 text-[14.5px] text-ink-50 placeholder:text-ink-600 transition-colors focus:outline-none disabled:opacity-50";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  hint,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[12px] font-medium text-ink-300">
        {label}
        {required && <span className="ml-1 text-teal-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${name}-error` : hint ? `${name}-hint` : undefined
        }
        className={cn(
          inputBase,
          error
            ? "border-red-400/50 focus:border-red-400"
            : "border-white/10 focus:border-teal-400/55 focus:bg-white/[0.05]",
        )}
      />
      {error ? (
        <p id={`${name}-error`} className="text-[11.5px] text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-[11.5px] text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[12px] font-medium text-ink-300">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        aria-invalid={Boolean(error)}
        className={cn(
          inputBase,
          "pr-10",
          error
            ? "border-red-400/50"
            : "border-white/10 focus:border-teal-400/55 focus:bg-white/[0.05]",
        )}
      >
        <option value="" disabled>
          Select one…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-[11.5px] text-red-300">{error}</p>}
    </div>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[12px] font-medium text-ink-300">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          inputBase,
          "h-auto resize-y py-3.5 leading-relaxed",
          error
            ? "border-red-400/50"
            : "border-white/10 focus:border-teal-400/55 focus:bg-white/[0.05]",
        )}
      />
      {error && <p className="text-[11.5px] text-red-300">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.25"
      />
      <path
        d="M14.2 8A6.2 6.2 0 0 0 8 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
