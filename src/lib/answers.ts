import { site } from "@/content/site";
import type { Therapy } from "@/content/therapies";
import type { Condition } from "@/content/conditions";
import { therapiesForCondition } from "@/content/conditions";

/**
 * Extractable answers for AI search.
 *
 * Answer engines quote passages, not pages. A passage only survives the trip if
 * it stands on its own: a reader who sees nothing but that paragraph should
 * still learn what the drug is, who administers it, and where. The detail pages
 * open with a sentence fragment ("A gut-selective biologic for…"), which reads
 * well under a display headline and carries nothing once it is lifted out of
 * the layout.
 *
 * Everything below is assembled from fields the pages already render. Nothing
 * here introduces a clinical claim, a number, or a price that isn't already in
 * the content model. A fabricated dose in an AI answer attributed to a real
 * medical practice is the worst failure this site could have.
 */

const PLACE = `${site.name} in ${site.address.city}, ${site.address.regionName}`;

/**
 * Lowercases a leading word only when it is ordinary prose.
 *
 * The formulary is full of strings that begin with an acronym or a proper noun
 * — "IL-5 antagonist", "Anti-CD20 monoclonal antibody", "BLyS-specific
 * inhibitor", "Crohn's disease". A blanket `.toLowerCase()` turns those into
 * "il-5" and "crohn's disease", which is exactly the sort of tell that marks
 * copy as machine-assembled. So: lowercase the first letter only if the rest of
 * that first word is already lowercase.
 */
function softLower(s: string): string {
  const [first = ""] = s.split(" ");
  const rest = first.slice(1);
  if (!/^[a-z'’-]*$/.test(rest)) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * "a" or "an", by sound rather than spelling. Acronyms are read letter by
 * letter, so "an IL-5 antagonist" and "an IGF-1R inhibitor" are correct while
 * "a CGRP antagonist" and "a TNF inhibitor" are.
 */
const VOWEL_SOUND_LETTERS = "AEFHILMNORSX";

/**
 * All-caps tokens that are said as a word rather than spelled out, so they take
 * the article their spelling implies: "a RANK ligand inhibitor", not "an R-A-N-K
 * ligand inhibitor". Everything else in the formulary is an initialism (IL-5,
 * CGRP, IGF-1R, TNF), which is why the default is letter-by-letter.
 */
const SPOKEN_AS_WORD = new Set(["RANK", "PEG", "NAD", "IVIG", "OPAT"]);

function article(phrase: string): "a" | "an" {
  const first = phrase.split(/[\s-/]/)[0] ?? "";
  const isAcronym =
    first.length > 1 &&
    first === first.toUpperCase() &&
    /[A-Z]/.test(first) &&
    !SPOKEN_AS_WORD.has(first);
  if (isAcronym) return VOWEL_SOUND_LETTERS.includes(first[0]) ? "an" : "a";
  return /^[aeiou]/i.test(phrase) ? "an" : "a";
}

const withArticle = (phrase: string) => `${article(phrase)} ${phrase}`;

/** Trims a trailing period so a field can be dropped mid-sentence. */
const bare = (s: string) => s.replace(/\.\s*$/, "");

/** Makes a bare field into its own sentence. */
const sentence = (s: string) => {
  const t = bare(s).trim();
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}.`;
};

/**
 * `preserveCase` exists because `softLower` cannot tell a proper noun from an
 * ordinary capitalized word: "Entyvio" and "Persistent" look identical to it.
 * Symptom and indication fragments want lowercasing mid-sentence; brand names
 * never do.
 */
function joinProse(items: string[], max: number, preserveCase = false): string {
  const list = items
    .slice(0, max)
    .map((s) => (preserveCase ? bare(s) : softLower(bare(s))));
  if (list.length <= 1) return list[0] ?? "";
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")} and ${list.at(-1)}`;
}

/* -------------------------------------------------------------------------- */
/*                                  THERAPIES                                  */
/* -------------------------------------------------------------------------- */

/** How the brand name reads with an indefinite article: "an Entyvio infusion". */
export const therapyArticle = (t: Therapy) => article(t.brand);

/**
 * Self-contained definition of a therapy: what it is, what it treats, how long
 * an appointment takes, how often, and that an order is required.
 */
export function therapyAnswer(t: Therapy): string {
  return [
    `${t.brand} (${t.generic}) is ${withArticle(softLower(t.drugClass))} given by ${softLower(bare(t.route))}.`,
    `It treats ${joinProse([...t.treats], 2)}.`,
    `At ${PLACE}, appointments run ${softLower(bare(t.duration))}.`,
    sentence(t.frequency),
    `A physician's order is required.`,
  ].join(" ");
}

export function therapyFaqs(t: Therapy): { q: string; a: string }[] {
  const an = therapyArticle(t);
  return [
    {
      q: `What is ${t.brand} used for?`,
      a: `${t.brand} (${t.generic}) is ${withArticle(softLower(t.drugClass))}. ${t.summary} It is used in the management of ${joinProse([...t.treats], 4)}. Whether it is right for you is a decision for you and your prescribing physician.`,
    },
    {
      q: `How long does ${an} ${t.brand} infusion take?`,
      a: `Plan for ${softLower(bare(t.duration))} at ${PLACE}. That is treatment time and does not include check-in or any observation period your physician's orders call for. First appointments usually run longer than maintenance appointments.`,
    },
    {
      q: `How often is ${t.brand} given?`,
      a: `${sentence(t.frequency)} Your prescribing physician sets the schedule. Recurring appointments at ${site.name} are booked in advance so you keep the same time slot and the same nurse.`,
    },
    {
      q: `How does ${t.brand} work?`,
      a: t.howItWorks,
    },
    {
      q: `Do I need a referral for ${t.brand}?`,
      a: `Yes. ${site.name} requires a physician referral and a written order for every specialty and biologic therapy. If you do not have one yet, call ${site.contact.phone} and we will tell you exactly what to ask your physician for. In most cases we can request it on your behalf once you give us their name.`,
    },
    {
      q: `Is ${t.brand} covered by insurance?`,
      a: `${site.name} accepts most major commercial plans, Medicare and Medicaid. Coverage for a specific drug depends on your plan and its prior authorization criteria, so we verify benefits and submit the authorization before anything is scheduled, then tell you your expected out-of-pocket cost. Network participation varies by product line.`,
    },
    {
      q: `Where can I get ${an} ${t.brand} infusion near Palm Beach County?`,
      a: `${site.name} administers ${t.brand} at ${site.address.street}, ${site.address.city}, ${site.address.regionName} ${site.address.postalCode}, southeast of the Woolbright Road exit off I-95. It is a freestanding outpatient infusion center rather than a hospital outpatient department, with free parking at the entrance. Call ${site.contact.phone}.`,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                                  CONDITIONS                                 */
/* -------------------------------------------------------------------------- */

export function conditionAnswer(c: Condition): string {
  const list = therapiesForCondition(c.slug);
  const named = list.length
    ? ` ${PLACE} administers ${list.length} infusion ${list.length === 1 ? "therapy" : "therapies"} for it, including ${joinProse(
        list.map((t) => t.brand),
        3,
        true,
      )}.`
    : "";
  return `${c.name} is ${softLower(bare(c.summary))}.${named} All treatment is ordered by your prescribing physician; we handle benefits, prior authorization and administration.`;
}

export function conditionFaqs(c: Condition): { q: string; a: string }[] {
  const list = therapiesForCondition(c.slug);
  const short = c.shortName ?? c.name;

  const out = [
    { q: `What is ${c.name}?`, a: `${c.summary} ${c.overview}` },
    {
      q: `What are the symptoms of ${short}?`,
      a: `Commonly reported signs and symptoms include ${joinProse([...c.symptoms], 5)}. Symptoms vary between patients, and diagnosis belongs to your physician.`,
    },
    {
      q: `How does infusion therapy treat ${short}?`,
      a: c.howInfusionHelps,
    },
  ];

  if (list.length) {
    out.push({
      q: `Which infusion therapies are used for ${short}?`,
      a: `${PLACE} administers ${joinProse(
        list.map((t) => `${t.brand} (${t.generic})`),
        6,
        true,
      )}${list.length > 6 ? `, and ${list.length - 6} more` : ""}. Which one is right for you depends on disease activity, prior treatment and your physician's judgement, not on what we happen to stock.`,
    });
  }

  out.push({
    q: `Where can I get infusion treatment for ${short} near Palm Beach County?`,
    a: `${site.name} is an outpatient infusion center at ${site.address.street}, ${site.address.city}, ${site.address.regionName} ${site.address.postalCode}, serving Palm Beach County. Appointments run ${site.hoursSummary[0].value} on weekdays and ${site.hoursSummary[1].value} on weekends. A physician referral is required. Call ${site.contact.phone}.`,
  });

  return out;
}
