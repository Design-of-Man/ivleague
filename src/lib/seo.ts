import type { Metadata } from "next";
import { site } from "@/content/site";
import { CONTENT_REVIEWED_ISO } from "@/content/reviewed";

const BASE = site.url;

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  /** Overrides the generated OG image */
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
  keywords,
}: MetaInput): Metadata {
  const url = `${BASE}${path === "/" ? "" : path}`;
  const ogImage =
    image ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/* -------------------------------------------------------------------------- */
/*                                  JSON-LD                                    */
/* -------------------------------------------------------------------------- */

const dayMap: Record<string, string> = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

export function medicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalClinic", "LocalBusiness"],
    "@id": `${BASE}/#organization`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: BASE,
    telephone: site.contact.phone,
    email: site.contact.email,
    logo: `${BASE}/logo.svg`,
    image: `${BASE}/og-default.png`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted:
      "Cash, Credit Card, HSA, FSA, Insurance, Medicare, Medicaid, Cherry Financing",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    hasMap: site.address.mapsUrl,
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayMap[h.day]}`,
      opens: h.open,
      closes: h.close,
    })),
    sameAs: [
      site.social.instagram,
      site.social.facebook,
      site.social.linkedin,
    ],
    areaServed: [
      { "@type": "City", name: "Midlothian" },
      { "@type": "City", name: "Richmond" },
      { "@type": "City", name: "Chesterfield" },
      { "@type": "City", name: "Brandermill" },
      { "@type": "City", name: "Woodlake" },
      { "@type": "State", name: "Virginia" },
    ],
    medicalSpecialty: [
      "Gastroenterology",
      "Rheumatology",
      "Neurology",
      "Immunology",
      "Allergy",
      "InfectiousDisease",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: site.name,
    publisher: { "@id": `${BASE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/therapies?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * MedicalWebPage wrapper for the clinical detail templates.
 *
 * This is the schema that matters most for YMYL health content: `lastReviewed`
 * is an explicit freshness and accountability signal, and answer engines weight
 * recency heavily when choosing between two sources that say the same thing.
 * `speakable` marks the standalone answer paragraph as the passage to read
 * aloud for a voice query.
 *
 * `reviewedBy` is deliberately absent. It is the single strongest E-E-A-T field
 * available here and it needs a named clinician with credentials. Inventing one
 * for a real medical practice is not a trade worth making for a ranking signal,
 * so it stays out until the client supplies a name (see CONTENT-REVIEW.md).
 */
export function medicalWebPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  specialty?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: opts.name,
    description: opts.description,
    url: `${BASE}${opts.path}`,
    inLanguage: "en-US",
    lastReviewed: CONTENT_REVIEWED_ISO,
    dateModified: CONTENT_REVIEWED_ISO,
    ...(opts.specialty ? { specialty: opts.specialty } : {}),
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
    about: { "@id": `${BASE}${opts.path}#subject` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-answer]"],
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${BASE}${t.href === "/" ? "" : t.href}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Directory pages as a structured set.
 *
 * A crawler can reach all 31 therapy pages through links, but an answer engine
 * asked "what does IV League treat?" benefits from one object that says the
 * formulary is 31 items and names them in order. Cheap, and it is the honest
 * shape of the page.
 */
export function itemListSchema(opts: {
  name: string;
  path: string;
  items: { name: string; path: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: `${BASE}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${BASE}${it.path}`,
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}

export function medicalTherapySchema(t: {
  brand: string;
  generic: string;
  summary: string;
  slug: string;
  treats: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    "@id": `${BASE}/therapies/${t.slug}#subject`,
    name: t.brand,
    alternateName: t.generic,
    description: t.summary,
    url: `${BASE}/therapies/${t.slug}`,
    relevantSpecialty: "Medicine",
    provider: { "@id": `${BASE}/#organization` },
    indication: t.treats.map((x) => ({
      "@type": "MedicalIndication",
      description: x,
    })),
  };
}

export function medicalConditionSchema(c: {
  name: string;
  summary: string;
  slug: string;
  symptoms: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "@id": `${BASE}/conditions/${c.slug}#subject`,
    name: c.name,
    description: c.summary,
    url: `${BASE}/conditions/${c.slug}`,
    signOrSymptom: c.symptoms.map((s) => ({
      "@type": "MedicalSymptom",
      name: s,
    })),
    possibleTreatment: { "@id": `${BASE}/#organization` },
  };
}
