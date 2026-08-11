/**
 * Wellness & regenerative infusion menu.
 *
 * ⚠️ PRICING: every `price` is intentionally `null` until IV League supplies
 * real numbers. Setting a number here makes it render everywhere at once
 * (menu cards, comparison table, JSON-LD offers). Do not invent values.
 *
 * Wellness infusions are not a substitute for medical care and are not
 * FDA-evaluated to diagnose, treat, cure or prevent disease. All patients are
 * screened by a licensed clinician before treatment.
 */

export type WellnessDrip = {
  slug: string;
  name: string;
  /** One-line hook used on the card */
  tagline: string;
  /** Longer description on the detail row */
  description: string;
  /** e.g. "45–60 min" */
  duration: string;
  /** null until real pricing is provided */
  price: number | null;
  ingredients: string[];
  benefits: string[];
  bestFor: string;
  /** Tailwind-ready accent for the card's gradient */
  accent: "teal" | "cyan" | "emerald" | "violet" | "amber" | "rose";
  featured?: boolean;
};

export const wellnessDrips: WellnessDrip[] = [
  {
    slug: "myers-cocktail",
    name: "The Myers' Cocktail",
    tagline: "The original. Still the benchmark.",
    description:
      "Named for Dr. John Myers, this is the formulation that started modern IV nutrient therapy: a balanced blend of B and C vitamins with magnesium and calcium. It remains the most requested infusion in the country for good reason: it addresses energy, immune function and general depletion in a single bag.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "Vitamin C (ascorbic acid)",
      "B-complex",
      "Vitamin B12 (methylcobalamin)",
      "Magnesium chloride",
      "Calcium gluconate",
      "Balanced electrolyte base",
    ],
    benefits: [
      "Supports immune function",
      "Counteracts fatigue",
      "Replenishes depleted micronutrients",
      "Supports overall wellness",
    ],
    bestFor: "Anyone running on empty. This is the all-purpose starting point.",
    accent: "teal",
    featured: true,
  },
  {
    slug: "nad-restore",
    name: "NAD+ Restore",
    tagline: "Cellular energy at the source.",
    description:
      "NAD+ is a coenzyme present in every living cell, central to how mitochondria convert fuel into usable energy, and levels decline measurably with age. Infused NAD+ is delivered slowly, over a longer session, because the rate of administration is what determines comfort.",
    duration: "2–4 hrs",
    price: null,
    ingredients: [
      "Nicotinamide adenine dinucleotide (NAD+)",
      "Balanced electrolyte base",
      "Optional B-complex add-on",
    ],
    benefits: [
      "Supports cellular energy metabolism",
      "Supports mental clarity and focus",
      "Supports recovery and athletic performance",
      "Supports healthy aging",
    ],
    bestFor:
      "Longevity-focused patients and anyone rebuilding after a long stretch of depletion.",
    accent: "violet",
    featured: true,
  },
  {
    slug: "immunity-shield",
    name: "Immunity Shield",
    tagline: "Get ahead of it.",
    description:
      "A high-dose vitamin C and zinc infusion built for the moment you feel something coming on, or the week before you travel, present, compete or host. Nutrients arrive at 100% bioavailability rather than whatever your gut absorbs.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "High-dose Vitamin C",
      "Zinc",
      "B-complex",
      "Glutathione push",
      "Balanced electrolyte base",
    ],
    benefits: [
      "Supports immune defenses",
      "Supports recovery from seasonal illness",
      "Antioxidant support",
      "Rapid rehydration",
    ],
    bestFor: "The first tickle in your throat, or the week before you travel.",
    accent: "emerald",
  },
  {
    slug: "rehydrate",
    name: "Rehydrate",
    tagline: "A liter of relief.",
    description:
      "Straightforward, fast and effective: a full liter of balanced electrolyte solution with anti-nausea and anti-inflammatory support available as add-ons. Absorption is immediate and complete, which is why one bag outperforms hours of sipping.",
    duration: "30–45 min",
    price: null,
    ingredients: [
      "1L balanced electrolyte solution",
      "Optional anti-nausea medication",
      "Optional anti-inflammatory",
      "Optional B-complex",
    ],
    benefits: [
      "Rapid rehydration",
      "Relieves headache from dehydration",
      "Settles nausea",
      "Restores electrolyte balance",
    ],
    bestFor:
      "Travel, heat, illness, a hard training block, or a long night you'd rather not discuss.",
    accent: "cyan",
    featured: true,
  },
  {
    slug: "recovery-performance",
    name: "Recovery & Performance",
    tagline: "Built for the day after.",
    description:
      "Amino acids and minerals formulated for athletes and anyone whose body is the equipment. Supports muscle repair, reduces the duration of post-exertion soreness, and restores what a hard effort or a long race takes out of you.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "Amino acid blend",
      "B-complex",
      "Magnesium",
      "Vitamin C",
      "Glutathione",
      "Balanced electrolyte base",
    ],
    benefits: [
      "Supports muscle recovery",
      "Reduces post-exertion fatigue",
      "Replenishes electrolytes lost in training",
      "Antioxidant support",
    ],
    bestFor: "Race week, two-a-days, and the Monday after a big weekend.",
    accent: "amber",
  },
  {
    slug: "glow",
    name: "Glow",
    tagline: "Skin, hair and nails, from the inside.",
    description:
      "A glutathione-forward infusion with biotin and vitamin C. Glutathione is the body's master antioxidant, binding free radicals and supporting the detoxification pathways that show up first in your skin.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "Glutathione (high dose)",
      "Biotin",
      "Vitamin C",
      "B-complex",
      "Balanced electrolyte base",
    ],
    benefits: [
      "Antioxidant and detoxification support",
      "Supports skin brightness and tone",
      "Supports hair and nail strength",
      "Supports hydration",
    ],
    bestFor: "Before an event, a shoot, or a season you want to look rested for.",
    accent: "rose",
  },
  {
    slug: "executive",
    name: "The Executive",
    tagline: "Focus, without the crash.",
    description:
      "A B-complex and amino acid infusion designed for cognitive stamina rather than stimulation. No caffeine and no jitter, just the substrates your brain uses to make neurotransmitters, delivered at full strength.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "B-complex",
      "Vitamin B12",
      "Amino acid blend",
      "Magnesium",
      "Balanced electrolyte base",
    ],
    benefits: [
      "Supports mental clarity and focus",
      "Supports sustained energy",
      "Supports stress resilience",
      "No stimulant crash",
    ],
    bestFor: "Quarter close, board week, bar exam, launch day.",
    accent: "teal",
  },
  {
    slug: "relief",
    name: "Relief",
    tagline: "For the days that start badly.",
    description:
      "Built for migraine, nausea and the aftermath of overindulgence. Fluids plus targeted medication to address the headache and the stomach at the same time, in a dim, quiet suite.",
    duration: "45–60 min",
    price: null,
    ingredients: [
      "1L balanced electrolyte solution",
      "Anti-nausea medication",
      "Anti-inflammatory",
      "B-complex",
      "Magnesium",
    ],
    benefits: [
      "Relieves headache and migraine symptoms",
      "Settles nausea",
      "Rapid rehydration",
      "Restores electrolytes",
    ],
    bestFor: "Migraine days, morning-after days, and stomach-bug recovery.",
    accent: "cyan",
  },
];

/* --------------------------- Vitamin injections --------------------------- */

export type Injection = {
  slug: string;
  name: string;
  description: string;
  price: number | null;
  duration: string;
};

export const injections: Injection[] = [
  {
    slug: "b12",
    name: "Vitamin B12",
    description:
      "Methylcobalamin for energy metabolism, nerve function and red blood cell formation. The quickest visit on the menu.",
    price: null,
    duration: "5 min",
  },
  {
    slug: "lipo-c",
    name: "Lipo-C (MIC-B12)",
    description:
      "Methionine, inositol and choline with B12: lipotropic compounds that support fat metabolism alongside diet and exercise.",
    price: null,
    duration: "5 min",
  },
  {
    slug: "vitamin-d",
    name: "Vitamin D3",
    description:
      "A single intramuscular dose for documented deficiency, supporting bone health and immune function.",
    price: null,
    duration: "5 min",
  },
  {
    slug: "glutathione-push",
    name: "Glutathione Push",
    description:
      "The master antioxidant, given as a direct IV push. Add to any infusion or take on its own.",
    price: null,
    duration: "10 min",
  },
  {
    slug: "toradol",
    name: "Toradol",
    description:
      "A non-narcotic anti-inflammatory injection for acute pain and headache, when clinically appropriate.",
    price: null,
    duration: "5 min",
  },
  {
    slug: "zofran",
    name: "Zofran",
    description:
      "Anti-nausea medication that can be added to any infusion or given alone for acute nausea.",
    price: null,
    duration: "5 min",
  },
];

export const wellnessBySlug = (slug: string) =>
  wellnessDrips.find((d) => d.slug === slug);

export const featuredWellness = () => wellnessDrips.filter((d) => d.featured);

/** Gradient tokens per accent — kept here so cards and detail pages agree. */
export const accentMap: Record<
  WellnessDrip["accent"],
  { from: string; to: string; ring: string; text: string }
> = {
  teal: {
    from: "from-teal-400/25",
    to: "to-teal-600/5",
    ring: "ring-teal-400/30",
    text: "text-teal-300",
  },
  cyan: {
    from: "from-cyan-400/25",
    to: "to-cyan-600/5",
    ring: "ring-cyan-400/30",
    text: "text-cyan-300",
  },
  emerald: {
    from: "from-emerald-400/25",
    to: "to-emerald-600/5",
    ring: "ring-emerald-400/30",
    text: "text-emerald-300",
  },
  violet: {
    from: "from-violet-400/25",
    to: "to-violet-600/5",
    ring: "ring-violet-400/30",
    text: "text-violet-300",
  },
  amber: {
    from: "from-amber-400/25",
    to: "to-amber-600/5",
    ring: "ring-amber-400/30",
    text: "text-amber-300",
  },
  rose: {
    from: "from-rose-400/25",
    to: "to-rose-600/5",
    ring: "ring-rose-400/30",
    text: "text-rose-300",
  },
};
