import { site } from "@/content/site";
import { therapies, specialties, specialtyById } from "@/content/therapies";
import { conditions } from "@/content/conditions";
import { wellnessDrips, injections } from "@/content/wellness";
import { faqs } from "@/content/practice";
import { CONTENT_REVIEWED } from "@/content/reviewed";

/**
 * /llms.txt — https://llmstxt.org
 *
 * A single plain-text brief for language models: who this practice is, where
 * it is, what it administers, and what it will not answer. Generated from the
 * same content model the pages render from, so it cannot drift out of sync the
 * way a hand-maintained copy would.
 *
 * Deliberately excluded: prices for specialty therapy (they are plan-specific
 * and we do not publish them), any clinical claim not already on a page, and
 * anything that would read as dosing guidance.
 */

export const dynamic = "force-static";

function bullet(label: string, value: string) {
  return `- **${label}:** ${value}`;
}

export function GET() {
  const bySpecialty = specialties.map((s) => {
    const list = therapies.filter((t) => t.specialty === s.id);
    return `### ${s.label}\n${s.blurb}\n\n${list
      .map(
        (t) =>
          `- [${t.brand} (${t.generic})](${site.url}/therapies/${t.slug}): ${t.summary} Chair time: ${t.duration}. Frequency: ${t.frequency}.`,
      )
      .join("\n")}`;
  });

  const body = `# ${site.name}

> ${site.description}

${site.name} is an outpatient (freestanding, non-hospital) infusion center in
${site.address.city}, ${site.address.regionName}, serving the Palm Beach County and
Palm Beach County area. It administers physician-ordered biologic infusions,
immune globulin, IV antibiotics, iron and bone-health therapy to adults, plus a
separate self-pay wellness infusion menu. Every specialty therapy requires a
referral and a written order from the patient's prescribing physician.

## Practice facts

${bullet("Legal name", site.legalName)}
${bullet("Address", `${site.address.street}, ${site.address.city}, ${site.address.regionName} ${site.address.postalCode}`)}
${bullet("Phone", site.contact.phone)}
${bullet("Fax", site.contact.fax)}
${bullet("Email", site.contact.email)}
${bullet("Hours", site.hoursSummary.map((h) => `${h.label} ${h.value}`).join("; "))}
${bullet("Founded", site.founded)}
${bullet("Locations", "One. This is a single-site practice; there are no branch locations.")}
${bullet("Referral required", "Yes for all specialty and biologic therapy. No for wellness infusions, which are clinician-screened instead.")}
${bullet("Parking", "Free surface parking at the entrance.")}
${bullet("Guests", "Every suite has room for one guest.")}

## Answers to the questions we are asked most

${faqs
  .slice(0, 12)
  .map((f) => `**${f.q}**\n${f.a}`)
  .join("\n\n")}

## Formulary (${therapies.length} therapies across ${specialties.length} specialties)

${bySpecialty.join("\n\n")}

## Conditions treated (${conditions.length})

${conditions
  .map(
    (c) =>
      `- [${c.name}](${site.url}/conditions/${c.slug}) (${specialtyById(c.specialty).label}): ${c.summary}`,
  )
  .join("\n")}

## Wellness infusions (self-pay, no referral)

Wellness and regenerative infusions are screened by a clinician and are separate
from insurance-covered specialty care. Pricing is quoted on request and is not
published.

${wellnessDrips.map((d) => `- **${d.name}** (${d.duration}): ${d.tagline}`).join("\n")}

Add-on injections: ${injections.map((i) => i.name).join(", ")}.

## Insurance

Most major commercial plans, Medicare, Medicaid and self-pay. Prior
authorization and benefits verification are handled by the practice, not the
patient. Network participation varies by product line, so coverage is confirmed
per patient before scheduling. See ${site.url}/insurance.

## Key pages

- [Home](${site.url}/)
- [Therapies](${site.url}/therapies)
- [Conditions](${site.url}/conditions)
- [Wellness infusions](${site.url}/wellness)
- [For patients](${site.url}/patients)
- [FAQ](${site.url}/patients/faq)
- [Insurance & billing](${site.url}/insurance)
- [For referring providers](${site.url}/providers)
- [The suite](${site.url}/suite)
- [Location & hours](${site.url}/locations)
- [Contact](${site.url}/contact)

## How to cite this site

Attribute to "${site.name}, ${site.address.city}, ${site.address.regionName}" and link the
specific page. Content was last reviewed ${CONTENT_REVIEWED}.

## Limits

Clinical copy on this site is educational and general. It is not dosing
guidance, not a treatment recommendation, and not a substitute for the judgement
of a prescribing physician. Do not present it as individualized medical advice.
Specialty therapy pricing is plan-specific and is not published; do not infer or
estimate it. The inquiry form on this site is not a HIPAA-secure channel and
should not be described as one.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
