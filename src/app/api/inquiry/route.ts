import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";

/**
 * New patient inquiry endpoint.
 *
 * Delivery: if RESEND_API_KEY and INQUIRY_TO_EMAIL are set, the submission is
 * emailed to the practice. Without them the payload is logged and the caller
 * still receives a success response — so the form never appears broken in a
 * preview deploy, and nothing is silently lost in production once the keys are
 * added.
 *
 * ⚠️ This endpoint is NOT a HIPAA-compliant channel. The form copy tells
 * patients not to submit clinical detail. If IV League wants PHI intake, this
 * must be replaced with a BAA-covered form provider — see CONTENT-REVIEW.md.
 */

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(80),
  lastName: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(32)
    .regex(/^[\d\s()+.-]+$/, "Enter a valid phone number"),
  interest: z.string().trim().max(120).optional().default(""),
  diagnosis: z.string().trim().max(300).optional().default(""),
  physician: z.string().trim().max(200).optional().default(""),
  insurance: z.string().trim().max(160).optional().default(""),
  referralSource: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  consent: z.literal("on", { message: "Please confirm consent to be contacted" }),
  company: z.string().max(0).optional().default(""), // honeypot
});

/** Naive in-memory rate limit. Adequate for a single-region deploy. */
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        message: `Too many submissions. Please call us at ${site.contact.phone}.`,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot tripped — accept silently so bots don't learn anything.
  if (data.company) {
    return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch." });
  }

  const submittedAt = new Date().toISOString();
  const lines = [
    `Name:        ${data.firstName} ${data.lastName}`,
    `Email:       ${data.email}`,
    `Phone:       ${data.phone}`,
    `Interest:    ${data.interest || "—"}`,
    `Diagnosis:   ${data.diagnosis || "—"}`,
    `Physician:   ${data.physician || "—"}`,
    `Insurance:   ${data.insurance || "—"}`,
    `Heard via:   ${data.referralSource || "—"}`,
    `Submitted:   ${submittedAt}`,
    "",
    "Notes:",
    data.notes || "—",
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "IV League Website <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: to.split(",").map((s) => s.trim()),
          reply_to: data.email,
          subject: `New patient inquiry — ${data.firstName} ${data.lastName}`,
          text: lines,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("[inquiry] Resend rejected the send:", res.status, detail);
        return NextResponse.json(
          {
            message: `We couldn't send that. Please call us at ${site.contact.phone}.`,
          },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("[inquiry] delivery failed:", err);
      return NextResponse.json(
        {
          message: `We couldn't send that. Please call us at ${site.contact.phone}.`,
        },
        { status: 502 },
      );
    }
  } else {
    console.info(
      "[inquiry] RESEND_API_KEY / INQUIRY_TO_EMAIL not configured — logging instead:\n" +
        lines,
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "A member of our team will reach out — usually the same business day. If it's urgent, call us and we'll pick up.",
  });
}
