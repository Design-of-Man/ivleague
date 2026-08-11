/**
 * Canonical business data for IV League Infusions.
 * Everything user-facing (NAP, hours, nav, legal) resolves from here so a
 * single edit propagates to the header, footer, contact page, schema.org
 * JSON-LD, sitemap and metadata.
 */

export const site = {
  /**
   * "Infusion Services", not "Infusions". The practice's own logo lockup and
   * its hero copy both use the full form, so that is what the site says and
   * what goes into schema.org.
   *
   * The short form survives in the domain (ivlinfusions.com) and the Instagram
   * handle (@ivleagueinfusions), which is where the ambiguity comes from.
   * Worth confirming against the Google Business Profile listing before
   * launch: the schema `name` should match GBP exactly, and a mismatch there
   * costs local-pack visibility. See CONTENT-REVIEW.md.
   */
  name: "IV League Infusion Services",
  shortName: "IV League",
  legalName: "IV League Infusion Services",
  tagline: "Infusion care without the hospital.",
  description:
    "An outpatient infusion center in Delray Beach, Florida. Biologic infusions, IVIG, IV antibiotics, injections and wellness therapies delivered in private and semi-private suites by nurses with decades of experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivlinfusions.com",
  locale: "en-US",
  founded: "2021",

  /**
   * From the practice's own "Our Team" page. Used for `reviewedBy` on the 53
   * clinical pages, which is the strongest E-E-A-T field available on YMYL
   * health content — and the one field that was deliberately left empty until
   * there was a real name to put in it.
   */
  medicalDirector: {
    name: "Dr. James Frank",
    credential: "MD",
    role: "Medical Director",
    get full() {
      return `${this.name}, ${this.credential}`;
    },
  },

  contact: {
    phone: "(561) 489-7100",
    phoneHref: "tel:+15614897100",
    fax: "(561) 680-3630",
    email: "info@IVLinfusions.com",
    emailHref: "mailto:info@IVLinfusions.com",
  },

  address: {
    street: "500 Gulfstream Blvd",
    suite: "Suite 105",
    city: "Delray Beach",
    region: "FL",
    regionName: "Florida",
    postalCode: "33483",
    country: "US",
    /** The building the suite is in, per the property record. */
    building: "Gulfstream Professional Building",
    get full() {
      return `${this.street}, ${this.suite}, ${this.city}, ${this.region} ${this.postalCode}`;
    },
    /**
     * Deliberately null. A lat/lng was invented once already and pinned this
     * practice in the wrong state; a map pin for a medical facility is not
     * something to approximate. `medicalBusinessSchema` omits `geo` while this
     * is null, which costs nothing — Google geocodes the postal address. Fill
     * it in from the real Google Business Profile listing.
     */
    geo: null as { lat: number; lng: number } | null,
    get mapsUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.full)}`;
    },
    get directionsUrl() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.full)}`;
    },
    get embedUrl() {
      return `https://www.google.com/maps?q=${encodeURIComponent(this.full)}&output=embed`;
    },
  },

  /**
   * From the practice's own site: "Located southeast from Woolbright Road exit
   * off I-95". Everything else about getting here is unverified, so there is
   * nothing else here.
   */
  directions: "Southeast of the Woolbright Road exit off I-95.",

  /**
   * NOT CONFIRMED. These are the placeholder hours the build was scaffolded
   * with and they have never been checked against the practice. While
   * `hoursConfirmed` is false nothing renders them as fact: `getOpenState`
   * returns a "call for hours" state instead of an Open/Closed pill, and
   * `medicalBusinessSchema` omits `openingHoursSpecification` rather than
   * publish a schedule a patient could turn up on. Set the real hours, then
   * flip the flag.
   *
   * What *is* sourced, from the practice's own copy: "flexible scheduling
   * including weekend appointments".
   */
  hoursConfirmed: false,

  hours: [
    { day: "Monday", short: "Mon", open: "09:00", close: "18:00" },
    { day: "Tuesday", short: "Tue", open: "09:00", close: "18:00" },
    { day: "Wednesday", short: "Wed", open: "09:00", close: "18:00" },
    { day: "Thursday", short: "Thu", open: "09:00", close: "18:00" },
    { day: "Friday", short: "Fri", open: "09:00", close: "18:00" },
    { day: "Saturday", short: "Sat", open: "09:00", close: "13:00" },
    { day: "Sunday", short: "Sun", open: "09:00", close: "13:00" },
  ],

  /** Also unconfirmed — gated on `hoursConfirmed` everywhere it is read. */
  hoursSummary: [
    { label: "Monday – Friday", value: "9:00 AM – 6:00 PM" },
    { label: "Saturday – Sunday", value: "9:00 AM – 1:00 PM" },
  ],

  social: {
    instagram: "https://www.instagram.com/ivleagueinfusionservices/",
    instagramHandle: "@ivleagueinfusionservices",
    facebook: "https://www.facebook.com/IVLeagueInfusionServices/",
  },

  /** Marketing proof points. Numbers are rendered with a "+" and animate up. */
  stats: [
    { value: 12000, suffix: "+", label: "Infusions administered" },
    { value: 30, suffix: "+", label: "Therapies on formulary" },
    { value: 48, suffix: "hr", label: "Typical benefits check" },
    { value: 5, suffix: ".0", label: "Average patient rating" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*                                 NAVIGATION                                  */
/* -------------------------------------------------------------------------- */

export type NavChild = {
  label: string;
  href: string;
  blurb?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  /** Optional column heading grouping inside a mega-menu */
  featured?: { label: string; href: string; blurb: string };
};

export const navigation: NavItem[] = [
  {
    label: "Therapies",
    href: "/therapies",
    featured: {
      label: "Browse the full formulary",
      href: "/therapies",
      blurb:
        "Biologics, IVIG, iron, bone health and IV anti-infectives. Filter by specialty or search by brand.",
    },
    children: [
      {
        label: "Gastroenterology",
        href: "/therapies?specialty=gastroenterology",
        blurb: "Entyvio, Stelara, Remicade & biosimilars",
      },
      {
        label: "Rheumatology",
        href: "/therapies?specialty=rheumatology",
        blurb: "Orencia, Actemra, Simponi Aria, Krystexxa",
      },
      {
        label: "Neurology",
        href: "/therapies?specialty=neurology",
        blurb: "Ocrevus, Tysabri, Briumvi, Vyepti",
      },
      {
        label: "Immunology",
        href: "/therapies?specialty=immunology",
        blurb: "IVIG and immune globulin products",
      },
      {
        label: "Allergy & Asthma",
        href: "/therapies?specialty=allergy-asthma",
        blurb: "Xolair, Fasenra, Nucala, Tezspire",
      },
      {
        label: "Bone & Blood Health",
        href: "/therapies?specialty=bone-health",
        blurb: "Reclast, Prolia, Injectafer, Venofer",
      },
    ],
  },
  {
    label: "Conditions",
    href: "/conditions",
    featured: {
      label: "Conditions we treat",
      href: "/conditions",
      blurb:
        "Chronic, complex and autoimmune diagnoses managed alongside your prescribing physician.",
    },
    children: [
      { label: "Crohn's Disease", href: "/conditions/crohns-disease" },
      { label: "Ulcerative Colitis", href: "/conditions/ulcerative-colitis" },
      {
        label: "Rheumatoid Arthritis",
        href: "/conditions/rheumatoid-arthritis",
      },
      { label: "Multiple Sclerosis", href: "/conditions/multiple-sclerosis" },
      {
        label: "Ankylosing Spondylitis",
        href: "/conditions/ankylosing-spondylitis",
      },
      {
        label: "Severe & Allergic Asthma",
        href: "/conditions/severe-and-allergic-asthma",
      },
      {
        label: "Immune Deficiency",
        href: "/conditions/primary-immunodeficiency",
      },
      { label: "See all conditions", href: "/conditions" },
    ],
  },
  { label: "Wellness", href: "/wellness" },
  {
    label: "Patients",
    href: "/patients",
    children: [
      {
        label: "What to Expect",
        href: "/patients",
        blurb: "Your first visit, start to finish",
      },
      {
        label: "Insurance & Billing",
        href: "/insurance",
        blurb: "Coverage, prior auth, HSA and Cherry financing",
      },
      {
        label: "Patient FAQ",
        href: "/patients/faq",
        blurb: "Answers to the questions we hear most",
      },
      {
        label: "The Suite",
        href: "/suite",
        blurb: "A look inside the infusion center",
      },
    ],
  },
  {
    label: "Providers",
    href: "/providers",
    children: [
      {
        label: "Refer a Patient",
        href: "/providers#refer",
        blurb: "Send orders in under two minutes",
      },
      {
        label: "Why Refer to IVL",
        href: "/providers",
        blurb: "Site-of-care economics and turnaround",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = [
  {
    heading: "Care",
    links: [
      { label: "All Therapies", href: "/therapies" },
      { label: "Conditions We Treat", href: "/conditions" },
      { label: "Wellness Infusions", href: "/wellness" },
      { label: "IVIG Therapy", href: "/therapies/ivig" },
      { label: "IV Antibiotics", href: "/therapies/iv-anti-infectives" },
    ],
  },
  {
    heading: "Patients",
    links: [
      { label: "What to Expect", href: "/patients" },
      { label: "Patient FAQ", href: "/patients/faq" },
      { label: "Insurance & Billing", href: "/insurance" },
      { label: "The Suite", href: "/suite" },
      { label: "New Patient Inquiry", href: "/contact#inquiry" },
    ],
  },
  {
    heading: "Practice",
    links: [
      { label: "About IV League", href: "/about" },
      { label: "For Providers", href: "/providers" },
      { label: "Visit Us", href: "/locations" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Notice of Privacy Practices", href: "/legal/hipaa" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                   */
/* -------------------------------------------------------------------------- */

/** "09:00" -> "9:00 AM" */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Open/closed state for the "Open now" pill.
 * Evaluated in America/New_York regardless of the visitor's timezone.
 */
export function getOpenState(now: Date = new Date()): {
  open: boolean;
  label: string;
  detail: string;
  /** False while the real hours are unknown — see `site.hoursConfirmed`. */
  known?: boolean;
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Monday";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const mins = hour * 60 + minute;

  if (!site.hoursConfirmed) {
    return { open: false, label: "Call for hours", detail: "", known: false };
  }

  const today = site.hours.find((h) => h.day === weekday);
  if (!today) return { open: false, label: "Closed", detail: "" };

  const toMins = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  const open = mins >= toMins(today.open) && mins < toMins(today.close);

  if (open) {
    return {
      open: true,
      label: "Open now",
      detail: `Closes ${formatTime(today.close)}`,
    };
  }

  // Find next opening
  const order: string[] = site.hours.map((h) => h.day);
  const idx = order.indexOf(weekday);
  for (let i = 0; i < 7; i++) {
    const cand = site.hours[(idx + i) % 7];
    if (i === 0 && mins < toMins(cand.open)) {
      return {
        open: false,
        label: "Closed",
        detail: `Opens ${formatTime(cand.open)}`,
      };
    }
    if (i > 0) {
      return {
        open: false,
        label: "Closed",
        detail: `Opens ${cand.short} ${formatTime(cand.open)}`,
      };
    }
  }
  return { open: false, label: "Closed", detail: "" };
}
