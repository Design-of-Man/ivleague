/**
 * Formulary data.
 *
 * `onCurrentSite: true` marks therapies with a dedicated page on the live
 * ivlinfusions.com today. Everything else is a proposed addition drawn from a
 * standard ambulatory infusion center formulary — confirm availability with
 * the clinical team before launch (see CONTENT-REVIEW.md).
 *
 * Clinical copy is intentionally general and educational. It is not dosing
 * guidance; every order is written by the patient's prescribing physician.
 */

export type SpecialtyId =
  | "gastroenterology"
  | "rheumatology"
  | "neurology"
  | "immunology"
  | "allergy-asthma"
  | "bone-health"
  | "infectious-disease"
  | "endocrinology";

export type Specialty = {
  id: SpecialtyId;
  label: string;
  short: string;
  blurb: string;
};

export const specialties: Specialty[] = [
  {
    id: "gastroenterology",
    label: "Gastroenterology",
    short: "GI",
    blurb:
      "Biologic therapy for inflammatory bowel disease, coordinated with your GI practice.",
  },
  {
    id: "rheumatology",
    label: "Rheumatology",
    short: "Rheum",
    blurb:
      "Infusions for inflammatory arthritis, connective tissue disease and refractory gout.",
  },
  {
    id: "neurology",
    label: "Neurology",
    short: "Neuro",
    blurb:
      "Disease-modifying therapy for multiple sclerosis and preventive treatment for chronic migraine.",
  },
  {
    id: "immunology",
    label: "Immunology",
    short: "Immuno",
    blurb:
      "Immune globulin replacement and immunomodulation for primary and secondary immunodeficiency.",
  },
  {
    id: "allergy-asthma",
    label: "Allergy & Asthma",
    short: "Allergy",
    blurb:
      "Targeted biologics for severe eosinophilic, allergic and steroid-dependent asthma.",
  },
  {
    id: "bone-health",
    label: "Bone & Blood Health",
    short: "Bone/Blood",
    blurb:
      "Bone density therapy and IV iron replacement for anemia and chronic iron deficiency.",
  },
  {
    id: "infectious-disease",
    label: "Infectious Disease",
    short: "ID",
    blurb:
      "Short-course IV antibiotics, antifungals and antivirals with OPAT-style monitoring.",
  },
  {
    id: "endocrinology",
    label: "Endocrinology",
    short: "Endo",
    blurb: "Specialty infusions for thyroid eye disease and metabolic care.",
  },
];

export type Therapy = {
  slug: string;
  brand: string;
  generic: string;
  specialty: SpecialtyId;
  /** Mechanism family, used as a chip on cards */
  drugClass: string;
  onCurrentSite?: boolean;
  /** Shown on cards and in search results */
  summary: string;
  /** Indications this product is FDA-approved for, in plain language */
  treats: string[];
  howItWorks: string;
  /** Typical chair time — always framed as an estimate */
  duration: string;
  frequency: string;
  route: string;
  /** Practical prep instructions */
  prep: string[];
  /** What happens in the chair */
  expect: string[];
  /** Condition slugs for cross-linking */
  conditions: string[];
  /** Bumps a therapy onto the homepage rail */
  featured?: boolean;
};

export const therapies: Therapy[] = [
  /* ------------------------------ GI ------------------------------------ */
  {
    slug: "entyvio",
    brand: "Entyvio",
    generic: "vedolizumab",
    specialty: "gastroenterology",
    drugClass: "Integrin receptor antagonist",
    onCurrentSite: true,
    featured: true,
    summary:
      "A gut-selective biologic for moderately to severely active ulcerative colitis and Crohn's disease.",
    treats: [
      "Moderately to severely active ulcerative colitis",
      "Moderately to severely active Crohn's disease",
    ],
    howItWorks:
      "Entyvio blocks the α4β7 integrin, a docking protein that inflammatory white blood cells use to enter the lining of the gut. Because that receptor is concentrated in gastrointestinal tissue, the effect is largely gut-selective rather than body-wide immunosuppression.",
    duration: "About 30 minutes of infusion time, plus check-in and observation",
    frequency:
      "Loading doses at weeks 0, 2 and 6, then maintenance every 8 weeks",
    route: "Intravenous infusion",
    prep: [
      "Eat a normal meal and hydrate well before you arrive",
      "Bring a current medication list, including over-the-counter supplements",
      "Tell your nurse about any recent infection, fever or upcoming surgery",
    ],
    expect: [
      "Vitals and a brief nursing assessment at check-in",
      "IV start, then a 30-minute infusion in your suite",
      "A short observation period before you're cleared to drive home",
    ],
    conditions: ["crohns-disease", "ulcerative-colitis"],
  },
  {
    slug: "stelara-iv",
    brand: "Stelara IV",
    generic: "ustekinumab",
    specialty: "gastroenterology",
    drugClass: "IL-12/IL-23 antagonist",
    onCurrentSite: true,
    featured: true,
    summary:
      "A single weight-based IV induction dose that starts therapy for Crohn's disease and ulcerative colitis.",
    treats: [
      "Moderately to severely active Crohn's disease",
      "Moderately to severely active ulcerative colitis",
    ],
    howItWorks:
      "Stelara targets interleukin-12 and interleukin-23, two signalling proteins associated with plaque psoriasis and with inflammation in the gut, joints and skin. Blocking them interrupts the inflammatory cascade upstream.",
    duration: "At least one hour of infusion time for the induction dose",
    frequency:
      "One IV induction dose, then subcutaneous maintenance dosing every 8 weeks",
    route: "Intravenous induction, then subcutaneous maintenance",
    prep: [
      "Plan for roughly two hours door-to-door on induction day",
      "Confirm your weight-based dose has been received from your prescriber",
      "Bring a sweater — infusions run cool",
    ],
    expect: [
      "Weight recorded at check-in, since the induction dose is weight-based",
      "One hour or more in the chair with continuous monitoring",
      "Instructions for transitioning to your at-home maintenance injections",
    ],
    conditions: ["crohns-disease", "ulcerative-colitis", "plaque-psoriasis"],
  },
  {
    slug: "remicade",
    brand: "Remicade",
    generic: "infliximab",
    specialty: "gastroenterology",
    drugClass: "TNF-alpha inhibitor",
    featured: true,
    summary:
      "The original infliximab: a TNF blocker used across GI, rheumatologic and dermatologic disease.",
    treats: [
      "Crohn's disease and ulcerative colitis",
      "Rheumatoid arthritis (with methotrexate)",
      "Ankylosing spondylitis",
      "Psoriatic arthritis and chronic severe plaque psoriasis",
    ],
    howItWorks:
      "Infliximab binds tumor necrosis factor alpha (TNF-α), an inflammatory messenger that is overproduced in autoimmune disease, and neutralizes it before it can drive tissue damage.",
    duration: "Approximately 2 hours, plus observation",
    frequency: "Weeks 0, 2 and 6, then every 8 weeks (schedules vary)",
    route: "Intravenous infusion",
    prep: [
      "Complete TB screening and any labs your physician ordered",
      "Let us know about any infusion reaction you've had previously",
      "Arrive hydrated — it makes IV access faster and more comfortable",
    ],
    expect: [
      "Pre-medication if your physician has ordered it",
      "A two-hour infusion with vitals taken at set intervals",
      "A 30-minute post-infusion observation window on early doses",
    ],
    conditions: [
      "crohns-disease",
      "ulcerative-colitis",
      "rheumatoid-arthritis",
      "ankylosing-spondylitis",
      "psoriatic-arthritis",
      "plaque-psoriasis",
    ],
  },
  {
    slug: "avsola",
    brand: "Avsola",
    generic: "infliximab-axxq",
    specialty: "gastroenterology",
    drugClass: "TNF-alpha inhibitor (biosimilar)",
    onCurrentSite: true,
    summary:
      "An infliximab biosimilar offering the same mechanism as Remicade, often at a lower cost of care.",
    treats: [
      "Moderately to severely active ulcerative colitis",
      "Moderately to severely active Crohn's disease",
      "Moderately to severely active rheumatoid arthritis",
      "Psoriatic arthritis",
      "Ankylosing spondylitis",
      "Chronic severe plaque psoriasis",
    ],
    howItWorks:
      "Avsola is a biosimilar to infliximab — highly similar in structure, safety and effectiveness — and works the same way, by binding and neutralizing TNF-α.",
    duration: "Approximately 2 hours, plus observation",
    frequency: "Weeks 0, 2 and 6, then every 8 weeks (schedules vary)",
    route: "Intravenous infusion",
    prep: [
      "Bring your insurance card; biosimilar preference can be plan-specific",
      "Complete pre-treatment TB screening if you haven't already",
      "Eat before your appointment",
    ],
    expect: [
      "A nursing assessment and vitals at check-in",
      "Roughly two hours of infusion time in a private or semi-private suite",
      "Observation before discharge, longer for your first few doses",
    ],
    conditions: [
      "crohns-disease",
      "ulcerative-colitis",
      "rheumatoid-arthritis",
      "ankylosing-spondylitis",
      "psoriatic-arthritis",
      "plaque-psoriasis",
    ],
  },
  {
    slug: "renflexis",
    brand: "Renflexis",
    generic: "infliximab-abda",
    specialty: "gastroenterology",
    drugClass: "TNF-alpha inhibitor (biosimilar)",
    onCurrentSite: true,
    summary:
      "An infliximab biosimilar used across inflammatory bowel, joint and skin disease.",
    treats: [
      "Moderately to severely active ulcerative colitis",
      "Moderately to severely active Crohn's disease",
      "Moderately to severely active rheumatoid arthritis",
      "Psoriatic arthritis",
      "Ankylosing spondylitis",
      "Chronic severe plaque psoriasis",
    ],
    howItWorks:
      "Like other infliximab products, Renflexis neutralizes TNF-α to reduce the inflammation that drives joint erosion, gut ulceration and skin plaques.",
    duration: "Usually around 2 hours",
    frequency: "Weeks 0, 2 and 6, then every 8 weeks (schedules vary)",
    route: "Intravenous infusion",
    prep: [
      "Hydrate the day before and the morning of your infusion",
      "Bring headphones or a laptop — the Wi-Fi is fast",
      "Notify us of any change in your health since your last visit",
    ],
    expect: [
      "Check-in, vitals and IV placement",
      "About two hours in the chair with periodic monitoring",
      "Scheduling for your next dose before you leave",
    ],
    conditions: [
      "crohns-disease",
      "ulcerative-colitis",
      "rheumatoid-arthritis",
      "ankylosing-spondylitis",
      "psoriatic-arthritis",
      "plaque-psoriasis",
    ],
  },
  {
    slug: "inflectra",
    brand: "Inflectra",
    generic: "infliximab-dyyb",
    specialty: "gastroenterology",
    drugClass: "TNF-alpha inhibitor (biosimilar)",
    summary:
      "A widely covered infliximab biosimilar for IBD and inflammatory arthritis.",
    treats: [
      "Crohn's disease and ulcerative colitis",
      "Rheumatoid arthritis",
      "Ankylosing spondylitis",
      "Psoriatic arthritis and plaque psoriasis",
    ],
    howItWorks:
      "Inflectra binds soluble and transmembrane TNF-α, blocking a central driver of autoimmune inflammation.",
    duration: "Approximately 2 hours",
    frequency: "Weeks 0, 2 and 6, then every 8 weeks (schedules vary)",
    route: "Intravenous infusion",
    prep: [
      "Confirm which infliximab product your plan prefers — we'll help",
      "Complete required screening labs",
      "Plan for a longer first visit",
    ],
    expect: [
      "Standard pre-infusion assessment",
      "Two hours of monitored infusion",
      "Post-infusion observation",
    ],
    conditions: [
      "crohns-disease",
      "ulcerative-colitis",
      "rheumatoid-arthritis",
      "ankylosing-spondylitis",
      "psoriatic-arthritis",
    ],
  },
  {
    slug: "skyrizi-iv",
    brand: "Skyrizi IV",
    generic: "risankizumab-rzaa",
    specialty: "gastroenterology",
    drugClass: "IL-23 inhibitor",
    summary:
      "IV induction therapy for Crohn's disease and ulcerative colitis, followed by at-home maintenance.",
    treats: [
      "Moderately to severely active Crohn's disease",
      "Moderately to severely active ulcerative colitis",
    ],
    howItWorks:
      "Risankizumab selectively blocks interleukin-23, a cytokine that sustains the inflammatory cells responsible for intestinal damage.",
    duration: "About 1 hour per induction dose",
    frequency: "Three IV induction doses, then subcutaneous maintenance",
    route: "Intravenous induction, then subcutaneous maintenance",
    prep: [
      "Expect three induction visits spaced four weeks apart",
      "Bring a list of current medications",
      "Eat before you arrive",
    ],
    expect: [
      "One hour in the chair per induction dose",
      "Monitoring throughout the infusion",
      "Transition planning for your maintenance pen",
    ],
    conditions: ["crohns-disease", "ulcerative-colitis"],
  },

  /* --------------------------- RHEUMATOLOGY ----------------------------- */
  {
    slug: "orencia",
    brand: "Orencia",
    generic: "abatacept",
    specialty: "rheumatology",
    drugClass: "T-cell costimulation modulator",
    featured: true,
    summary:
      "A selective T-cell modulator for moderate to severe rheumatoid and psoriatic arthritis.",
    treats: [
      "Moderately to severely active rheumatoid arthritis",
      "Psoriatic arthritis",
      "Polyarticular juvenile idiopathic arthritis",
    ],
    howItWorks:
      "Rather than blocking a single cytokine, abatacept interrupts the costimulatory signal that activates T-cells in the first place — a step further upstream in the inflammatory cascade.",
    duration: "About 30 minutes",
    frequency: "Weeks 0, 2 and 4, then every 4 weeks",
    route: "Intravenous infusion",
    prep: [
      "Weight is recorded each visit — dosing is weight-tiered",
      "Report any signs of infection before your infusion",
      "Hydrate well",
    ],
    expect: [
      "Vitals and assessment at check-in",
      "A 30-minute infusion",
      "Next appointment scheduled before discharge",
    ],
    conditions: ["rheumatoid-arthritis", "psoriatic-arthritis"],
  },
  {
    slug: "actemra",
    brand: "Actemra",
    generic: "tocilizumab",
    specialty: "rheumatology",
    drugClass: "IL-6 receptor antagonist",
    summary:
      "An IL-6 receptor blocker for rheumatoid arthritis, giant cell arteritis and related disease.",
    treats: [
      "Moderately to severely active rheumatoid arthritis",
      "Giant cell arteritis",
      "Systemic and polyarticular juvenile idiopathic arthritis",
    ],
    howItWorks:
      "Tocilizumab binds the interleukin-6 receptor. IL-6 is a driver of both joint inflammation and the systemic symptoms — fatigue, fever, anemia — that often accompany it.",
    duration: "About 1 hour",
    frequency: "Every 4 weeks",
    route: "Intravenous infusion",
    prep: [
      "Lab work is typically required before each dose",
      "Tell us about any recent infection or diverticulitis history",
      "Eat before arriving",
    ],
    expect: [
      "Labs reviewed before the infusion is released",
      "One hour in the chair",
      "Brief observation before discharge",
    ],
    conditions: ["rheumatoid-arthritis", "giant-cell-arteritis"],
  },
  {
    slug: "simponi-aria",
    brand: "Simponi Aria",
    generic: "golimumab",
    specialty: "rheumatology",
    drugClass: "TNF-alpha inhibitor",
    summary:
      "A short, 30-minute TNF inhibitor infusion given every eight weeks after loading.",
    treats: [
      "Moderately to severely active rheumatoid arthritis",
      "Active psoriatic arthritis",
      "Active ankylosing spondylitis",
    ],
    howItWorks:
      "Golimumab is a fully human monoclonal antibody that neutralizes TNF-α, reducing the inflammatory signalling behind joint swelling, stiffness and structural damage.",
    duration: "About 30 minutes",
    frequency: "Weeks 0 and 4, then every 8 weeks",
    route: "Intravenous infusion",
    prep: [
      "Complete TB screening before your first dose",
      "Bring your insurance card to every visit",
      "Report any fever or infection",
    ],
    expect: [
      "Quick check-in and vitals",
      "A 30-minute infusion — one of our shortest",
      "Out the door in well under two hours",
    ],
    conditions: [
      "rheumatoid-arthritis",
      "psoriatic-arthritis",
      "ankylosing-spondylitis",
    ],
  },
  {
    slug: "rituxan",
    brand: "Rituxan",
    generic: "rituximab",
    specialty: "rheumatology",
    drugClass: "Anti-CD20 monoclonal antibody",
    summary:
      "A B-cell depleting antibody used in rheumatoid arthritis and ANCA-associated vasculitis.",
    treats: [
      "Moderately to severely active rheumatoid arthritis (with methotrexate)",
      "Granulomatosis with polyangiitis and microscopic polyangiitis",
      "Pemphigus vulgaris",
    ],
    howItWorks:
      "Rituximab targets CD20 on the surface of B-cells and depletes them. Because B-cells produce the autoantibodies driving several rheumatic diseases, removing them can quiet disease activity for months.",
    duration: "4 to 6 hours for the first infusion; shorter for later doses",
    frequency: "Two infusions two weeks apart, repeated every 6 months",
    route: "Intravenous infusion",
    prep: [
      "Plan for a long first visit — bring lunch, a book and a charger",
      "Pre-medication is standard and will be given before the infusion starts",
      "Arrange a ride if you're sensitive to antihistamines",
    ],
    expect: [
      "Pre-medication with acetaminophen, an antihistamine and a steroid",
      "A slow titrated infusion rate with frequent vitals",
      "A private suite for longer infusion days when available",
    ],
    conditions: ["rheumatoid-arthritis", "vasculitis"],
  },
  {
    slug: "benlysta",
    brand: "Benlysta",
    generic: "belimumab",
    specialty: "rheumatology",
    drugClass: "BLyS-specific inhibitor",
    summary:
      "The first biologic approved specifically for systemic lupus erythematosus and lupus nephritis.",
    treats: [
      "Active systemic lupus erythematosus (SLE)",
      "Active lupus nephritis",
    ],
    howItWorks:
      "Belimumab blocks B-lymphocyte stimulator (BLyS), a protein that keeps autoreactive B-cells alive. Reducing BLyS shortens the lifespan of the cells producing lupus autoantibodies.",
    duration: "About 1 hour",
    frequency: "Weeks 0, 2 and 4, then every 4 weeks",
    route: "Intravenous infusion",
    prep: [
      "Report any new depression or mood change to your physician",
      "Bring a light layer — lupus patients often run cold",
      "Hydrate",
    ],
    expect: [
      "One hour of infusion time",
      "Vitals throughout",
      "Consistent nursing team visit to visit",
    ],
    conditions: ["lupus"],
  },
  {
    slug: "krystexxa",
    brand: "Krystexxa",
    generic: "pegloticase",
    specialty: "rheumatology",
    drugClass: "PEGylated uric acid-specific enzyme",
    summary:
      "An enzyme infusion for chronic gout that has not responded to conventional therapy.",
    treats: [
      "Chronic gout refractory to conventional therapy",
      "Tophaceous gout",
    ],
    howItWorks:
      "Pegloticase is an enzyme that converts uric acid into allantoin, a far more water-soluble compound the kidneys can clear. It can dissolve tophi that oral therapy cannot touch.",
    duration: "At least 2 hours",
    frequency: "Every 2 weeks",
    route: "Intravenous infusion",
    prep: [
      "G6PD testing is required before your first dose",
      "Pre-medication is given to reduce reaction risk",
      "Expect closer monitoring than most infusions",
    ],
    expect: [
      "Pre-medication with an antihistamine and corticosteroid",
      "A slow two-hour-plus infusion with close nursing observation",
      "Uric acid checked before each dose",
    ],
    conditions: ["chronic-gout"],
  },

  /* ------------------------------ NEUROLOGY ----------------------------- */
  {
    slug: "ocrevus",
    brand: "Ocrevus",
    generic: "ocrelizumab",
    specialty: "neurology",
    drugClass: "Anti-CD20 monoclonal antibody",
    featured: true,
    summary:
      "A twice-yearly disease-modifying therapy for relapsing and primary progressive multiple sclerosis.",
    treats: [
      "Relapsing forms of multiple sclerosis",
      "Primary progressive multiple sclerosis",
    ],
    howItWorks:
      "Ocrelizumab selectively depletes CD20-positive B-cells, which are now understood to play a central role in the demyelination and nerve injury of MS.",
    duration:
      "Around 2 to 3.5 hours depending on the dosing schedule your neurologist selects",
    frequency:
      "Two half-doses two weeks apart to start, then a single dose every 6 months",
    route: "Intravenous infusion",
    prep: [
      "Hepatitis B screening is required before your first dose",
      "Plan a full morning or afternoon for infusion day",
      "Bring entertainment and a snack",
    ],
    expect: [
      "Pre-medication with a steroid and antihistamine",
      "A gradually titrated infusion rate with frequent vitals",
      "A one-hour observation period after your first two infusions",
    ],
    conditions: ["multiple-sclerosis"],
  },
  {
    slug: "tysabri",
    brand: "Tysabri",
    generic: "natalizumab",
    specialty: "neurology",
    drugClass: "Integrin receptor antagonist",
    summary:
      "A monthly infusion for relapsing MS and, in select cases, Crohn's disease.",
    treats: [
      "Relapsing forms of multiple sclerosis",
      "Moderately to severely active Crohn's disease in select patients",
    ],
    howItWorks:
      "Natalizumab blocks α4-integrin, preventing inflammatory immune cells from crossing the blood-brain barrier into the central nervous system.",
    duration: "About 1 hour of infusion plus a 1-hour observation period",
    frequency: "Every 4 weeks",
    route: "Intravenous infusion",
    prep: [
      "Enrollment in the prescriber-managed safety program is required",
      "JC virus antibody status is monitored on an ongoing basis",
      "Plan for roughly two and a half hours on site",
    ],
    expect: [
      "Program verification at every visit",
      "One hour of infusion",
      "A mandatory one-hour observation period afterward",
    ],
    conditions: ["multiple-sclerosis", "crohns-disease"],
  },
  {
    slug: "briumvi",
    brand: "Briumvi",
    generic: "ublituximab-xiiy",
    specialty: "neurology",
    drugClass: "Anti-CD20 monoclonal antibody",
    summary:
      "A one-hour maintenance infusion for relapsing forms of multiple sclerosis.",
    treats: ["Relapsing forms of multiple sclerosis"],
    howItWorks:
      "Ublituximab is a glycoengineered anti-CD20 antibody designed for efficient B-cell depletion, which allows a shorter maintenance infusion than earlier agents in its class.",
    duration: "About 4 hours for the first dose, then roughly 1 hour",
    frequency:
      "Day 1 and day 15 to start, then every 24 weeks",
    route: "Intravenous infusion",
    prep: [
      "Hepatitis B screening before initiation",
      "Pre-medication is given before every dose",
      "Plan a longer first visit",
    ],
    expect: [
      "Steroid and antihistamine pre-medication",
      "Rate titration during the first infusion",
      "Short one-hour maintenance visits thereafter",
    ],
    conditions: ["multiple-sclerosis"],
  },
  {
    slug: "vyepti",
    brand: "Vyepti",
    generic: "eptinezumab-jjmr",
    specialty: "neurology",
    drugClass: "CGRP antagonist",
    summary:
      "A 30-minute quarterly infusion for the preventive treatment of migraine.",
    treats: ["Preventive treatment of episodic and chronic migraine"],
    howItWorks:
      "Eptinezumab binds calcitonin gene-related peptide (CGRP), a neuropeptide released during migraine attacks. Because it is given intravenously, blood levels peak immediately rather than over days.",
    duration: "About 30 minutes",
    frequency: "Every 3 months",
    route: "Intravenous infusion",
    prep: [
      "Bring your headache diary if you keep one",
      "No fasting or special preparation required",
      "Let us know if bright light is a trigger — we'll dim your suite",
    ],
    expect: [
      "A quiet, low-light suite on request",
      "A 30-minute infusion",
      "Quarterly scheduling handled before you leave",
    ],
    conditions: ["chronic-migraine"],
  },

  /* ----------------------------- IMMUNOLOGY ----------------------------- */
  {
    slug: "ivig",
    brand: "IVIG",
    generic: "immune globulin, intravenous",
    specialty: "immunology",
    drugClass: "Human immune globulin",
    onCurrentSite: true,
    featured: true,
    summary:
      "Pooled human antibodies that replace or modulate immune function in a wide range of conditions.",
    treats: [
      "Primary immunodeficiency",
      "Secondary immunodeficiency (including CLL and myeloma)",
      "Chronic inflammatory demyelinating polyneuropathy (CIDP)",
      "Immune thrombocytopenic purpura (ITP)",
      "Multifocal motor neuropathy",
    ],
    howItWorks:
      "IVIG is purified immunoglobulin G collected from thousands of screened human plasma donors. For patients who cannot make enough antibodies it provides replacement; at higher doses it modulates an overactive immune system.",
    duration: "3 to 5 hours depending on dose, product and tolerated rate",
    frequency: "Typically every 3 to 4 weeks",
    route: "Intravenous infusion",
    prep: [
      "Hydrate aggressively for 24 hours before and after — it is the single best defense against post-infusion headache",
      "Take any pre-medication your physician has prescribed",
      "Plan for a long visit and bring lunch",
    ],
    expect: [
      "A slow starting rate that is titrated up as you tolerate it",
      "Frequent vitals throughout",
      "Rate adjustments any time you feel a headache or flushing starting",
    ],
    conditions: [
      "primary-immunodeficiency",
      "cidp",
      "immune-thrombocytopenia",
    ],
  },

  /* -------------------------- ALLERGY & ASTHMA -------------------------- */
  {
    slug: "xolair",
    brand: "Xolair",
    generic: "omalizumab",
    specialty: "allergy-asthma",
    drugClass: "Anti-IgE monoclonal antibody",
    onCurrentSite: true,
    summary:
      "An anti-IgE biologic for moderate to severe persistent allergic asthma and chronic hives.",
    treats: [
      "Moderate to severe persistent allergic asthma",
      "Chronic spontaneous urticaria",
      "Nasal polyps",
      "IgE-mediated food allergy",
    ],
    howItWorks:
      "Omalizumab binds free IgE — the antibody responsible for allergic reactions — before it can attach to mast cells and basophils, interrupting the allergic cascade at its source.",
    duration: "Injection plus a monitored observation period",
    frequency: "Every 2 or 4 weeks based on weight and serum IgE",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Bring your rescue inhaler",
      "Do not schedule around a same-day flight — observation is required",
      "Report any recent asthma exacerbation",
    ],
    expect: [
      "One or more subcutaneous injections",
      "A supervised observation period per anaphylaxis precautions",
      "Consistent nursing staff who track your response over time",
    ],
    conditions: ["severe-and-allergic-asthma", "chronic-urticaria"],
  },
  {
    slug: "fasenra",
    brand: "Fasenra",
    generic: "benralizumab",
    specialty: "allergy-asthma",
    drugClass: "IL-5 receptor antagonist",
    summary:
      "An add-on maintenance biologic for severe eosinophilic asthma, given every eight weeks.",
    treats: ["Severe eosinophilic asthma", "EGPA"],
    howItWorks:
      "Benralizumab binds the IL-5 receptor on eosinophils and recruits natural killer cells to remove them, producing near-complete eosinophil depletion.",
    duration: "Injection plus brief observation",
    frequency: "Every 4 weeks for three doses, then every 8 weeks",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Bring your controller and rescue inhalers",
      "Recent eosinophil counts are helpful",
      "No fasting needed",
    ],
    expect: [
      "A quick subcutaneous injection",
      "Short observation",
      "Eight-week scheduling after the loading phase",
    ],
    conditions: ["severe-and-allergic-asthma"],
  },
  {
    slug: "nucala",
    brand: "Nucala",
    generic: "mepolizumab",
    specialty: "allergy-asthma",
    drugClass: "IL-5 antagonist",
    summary:
      "A monthly IL-5 biologic for severe eosinophilic asthma, EGPA, HES and nasal polyps.",
    treats: [
      "Severe eosinophilic asthma",
      "Eosinophilic granulomatosis with polyangiitis (EGPA)",
      "Hypereosinophilic syndrome",
      "Chronic rhinosinusitis with nasal polyps",
    ],
    howItWorks:
      "Mepolizumab neutralizes interleukin-5, the primary growth and survival signal for eosinophils, reducing the eosinophil-driven inflammation behind exacerbations.",
    duration: "Injection plus brief observation",
    frequency: "Every 4 weeks",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Continue your inhaled controller therapy as prescribed",
      "Report any shingles history",
      "No special preparation required",
    ],
    expect: [
      "A single subcutaneous injection",
      "Brief observation",
      "Same nurse, same chair, every month",
    ],
    conditions: ["severe-and-allergic-asthma"],
  },
  {
    slug: "tezspire",
    brand: "Tezspire",
    generic: "tezepelumab-ekko",
    specialty: "allergy-asthma",
    drugClass: "Anti-TSLP monoclonal antibody",
    summary:
      "A severe asthma biologic that works regardless of eosinophil count or allergic phenotype.",
    treats: ["Severe asthma as add-on maintenance treatment"],
    howItWorks:
      "Tezepelumab blocks thymic stromal lymphopoietin (TSLP), an epithelial cytokine released at the very top of the inflammatory cascade — which is why it works across asthma phenotypes.",
    duration: "Injection plus brief observation",
    frequency: "Every 4 weeks",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Bring your rescue inhaler",
      "No fasting or labs required",
      "Report any recent exacerbation",
    ],
    expect: [
      "A quick in-office injection",
      "Short observation",
      "Monthly cadence with predictable scheduling",
    ],
    conditions: ["severe-and-allergic-asthma"],
  },

  /* -------------------------- BONE & BLOOD ------------------------------ */
  {
    slug: "reclast",
    brand: "Reclast",
    generic: "zoledronic acid",
    specialty: "bone-health",
    drugClass: "Bisphosphonate",
    summary:
      "A once-yearly 15-minute infusion for osteoporosis and Paget's disease of bone.",
    treats: [
      "Postmenopausal osteoporosis",
      "Osteoporosis in men",
      "Glucocorticoid-induced osteoporosis",
      "Paget's disease of bone",
    ],
    howItWorks:
      "Zoledronic acid binds to bone and inhibits osteoclasts — the cells that break bone down — shifting the remodeling balance toward density.",
    duration: "At least 15 minutes of infusion time",
    frequency: "Once yearly (every 2 years for prevention)",
    route: "Intravenous infusion",
    prep: [
      "Drink at least two glasses of water before your appointment",
      "Take acetaminophen beforehand if your physician approves — it blunts the flu-like feeling some patients get after the first dose",
      "Confirm your calcium and vitamin D levels are adequate",
    ],
    expect: [
      "A 15-minute infusion — the fastest on our formulary",
      "Extra hydration encouraged before and after",
      "A reminder call when next year's dose is due",
    ],
    conditions: ["osteoporosis"],
  },
  {
    slug: "prolia",
    brand: "Prolia",
    generic: "denosumab",
    specialty: "bone-health",
    drugClass: "RANK ligand inhibitor",
    summary:
      "A twice-yearly injection for osteoporosis in patients at high risk of fracture.",
    treats: [
      "Postmenopausal osteoporosis at high fracture risk",
      "Bone loss from androgen or aromatase inhibitor therapy",
      "Glucocorticoid-induced osteoporosis",
    ],
    howItWorks:
      "Denosumab is an antibody against RANK ligand, the signal that tells osteoclast precursors to mature. Blocking it markedly slows bone resorption.",
    duration: "A few minutes, plus check-in",
    frequency: "Every 6 months",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Ensure adequate calcium and vitamin D intake",
      "Mention any planned dental surgery",
      "Do not skip or delay doses without speaking to your physician",
    ],
    expect: [
      "A brief visit — often under 20 minutes door to door",
      "Injection administered by an RN",
      "Automatic six-month recall scheduling",
    ],
    conditions: ["osteoporosis"],
  },
  {
    slug: "evenity",
    brand: "Evenity",
    generic: "romosozumab-aqqg",
    specialty: "bone-health",
    drugClass: "Sclerostin inhibitor",
    summary:
      "A bone-building monthly injection for postmenopausal women at very high fracture risk.",
    treats: ["Postmenopausal osteoporosis at very high risk of fracture"],
    howItWorks:
      "Romosozumab inhibits sclerostin, which both increases bone formation and decreases bone resorption — a dual effect unique among osteoporosis therapies.",
    duration: "Two injections, plus check-in",
    frequency: "Monthly for 12 doses",
    route: "Subcutaneous injection administered in-center",
    prep: [
      "Cardiovascular history is reviewed before initiation",
      "Maintain calcium and vitamin D",
      "Plan for 12 monthly visits",
    ],
    expect: [
      "Two injections given at the same visit",
      "Short observation",
      "A defined 12-month course with a follow-on plan",
    ],
    conditions: ["osteoporosis"],
  },
  {
    slug: "injectafer",
    brand: "Injectafer",
    generic: "ferric carboxymaltose",
    specialty: "bone-health",
    drugClass: "IV iron replacement",
    featured: true,
    summary:
      "High-dose IV iron in two visits for iron deficiency anemia when oral iron isn't enough.",
    treats: [
      "Iron deficiency anemia intolerant of or unresponsive to oral iron",
      "Iron deficiency anemia in chronic kidney disease",
      "Iron deficiency in heart failure",
    ],
    howItWorks:
      "Injectafer delivers iron directly into the bloodstream in a stable carbohydrate complex, bypassing the gut absorption that limits oral iron and causes its side effects.",
    duration: "At least 15 minutes per dose",
    frequency: "Two doses given at least 7 days apart",
    route: "Intravenous infusion",
    prep: [
      "Recent iron studies and CBC should be on file",
      "Eat before your visit",
      "Wear a short-sleeved top",
    ],
    expect: [
      "A short infusion with monitoring",
      "A 30-minute observation period",
      "Repeat labs a few weeks later to confirm response",
    ],
    conditions: ["iron-deficiency-anemia"],
  },
  {
    slug: "feraheme",
    brand: "Feraheme",
    generic: "ferumoxytol",
    specialty: "bone-health",
    drugClass: "IV iron replacement",
    summary:
      "A two-dose IV iron option for adults with iron deficiency anemia.",
    treats: [
      "Iron deficiency anemia in adults intolerant of oral iron",
      "Iron deficiency anemia in chronic kidney disease",
    ],
    howItWorks:
      "Ferumoxytol is an iron oxide core in a carbohydrate shell that is taken up by macrophages and released gradually into the iron transport system.",
    duration: "At least 15 minutes per dose",
    frequency: "Two doses 3 to 8 days apart",
    route: "Intravenous infusion",
    prep: [
      "Report any prior reaction to IV iron",
      "Tell imaging providers you've had ferumoxytol — it can affect MRI",
      "Hydrate",
    ],
    expect: [
      "A short monitored infusion",
      "A 30-minute observation period",
      "Follow-up labs to confirm repletion",
    ],
    conditions: ["iron-deficiency-anemia"],
  },
  {
    slug: "venofer",
    brand: "Venofer",
    generic: "iron sucrose",
    specialty: "bone-health",
    drugClass: "IV iron replacement",
    summary:
      "A well-tolerated iron sucrose infusion, often used across several smaller doses.",
    treats: ["Iron deficiency anemia in chronic kidney disease"],
    howItWorks:
      "Iron sucrose delivers elemental iron in a form the reticuloendothelial system processes readily, restoring hemoglobin and iron stores over a short series of doses.",
    duration: "15 minutes to 2 hours depending on dose",
    frequency: "A series of doses per your physician's plan",
    route: "Intravenous infusion",
    prep: [
      "Bring recent labs if drawn elsewhere",
      "Eat beforehand",
      "Plan for several visits",
    ],
    expect: [
      "Short infusions on a predictable schedule",
      "Monitoring throughout",
      "Coordination with your nephrologist or hematologist",
    ],
    conditions: ["iron-deficiency-anemia"],
  },

  /* --------------------------- ENDOCRINOLOGY ---------------------------- */
  {
    slug: "tepezza",
    brand: "Tepezza",
    generic: "teprotumumab-trbw",
    specialty: "endocrinology",
    drugClass: "IGF-1R inhibitor",
    summary:
      "The first therapy approved specifically for thyroid eye disease.",
    treats: ["Thyroid eye disease (Graves' orbitopathy)"],
    howItWorks:
      "Teprotumumab blocks the insulin-like growth factor-1 receptor on orbital fibroblasts, reducing the tissue expansion behind the eye that causes proptosis and double vision.",
    duration: "60 to 90 minutes per infusion",
    frequency: "Every 3 weeks for a total of 8 infusions",
    route: "Intravenous infusion",
    prep: [
      "Baseline hearing assessment is recommended",
      "Blood sugar is monitored, especially if you are diabetic",
      "Plan for eight visits over about six months",
    ],
    expect: [
      "A 60-to-90-minute infusion, longer for the first dose",
      "Monitoring for infusion reactions",
      "A defined eight-dose course with a clear end date",
    ],
    conditions: ["thyroid-eye-disease"],
  },

  /* ------------------------ INFECTIOUS DISEASE -------------------------- */
  {
    slug: "iv-anti-infectives",
    brand: "IV Antibiotics & Anti-Infectives",
    generic: "antibiotic, antifungal and antiviral therapy",
    specialty: "infectious-disease",
    drugClass: "Anti-infective therapy",
    onCurrentSite: true,
    featured: true,
    summary:
      "Short-course IV antibiotics, antifungals and antivirals — an alternative to a hospital stay.",
    treats: [
      "Osteomyelitis and bone or joint infection",
      "Cellulitis and complicated skin and soft tissue infection",
      "Endocarditis and bacteremia step-down therapy",
      "Complicated urinary tract and intra-abdominal infection",
      "Lyme disease requiring IV therapy",
    ],
    howItWorks:
      "Outpatient parenteral antimicrobial therapy delivers full-strength IV antibiotics on a fixed schedule while you sleep in your own bed — with the same drug, dose and monitoring you would receive as an inpatient.",
    duration: "30 minutes to 2 hours depending on the agent",
    frequency: "Daily to several times weekly for the ordered course",
    route: "Intravenous infusion",
    prep: [
      "Central line or PICC care is coordinated with your ID physician",
      "Weekly labs are typically required",
      "Consistent appointment times are reserved for the length of your course",
    ],
    expect: [
      "A standing appointment slot for the duration of therapy",
      "Line assessment and dressing checks at each visit",
      "Direct communication back to your infectious disease team",
    ],
    conditions: ["serious-infection"],
  },
  {
    slug: "hydration-therapy",
    brand: "Clinical Hydration Therapy",
    generic: "IV fluid and electrolyte replacement",
    specialty: "infectious-disease",
    drugClass: "Fluid & electrolyte therapy",
    summary:
      "Physician-ordered IV fluids and electrolytes for dehydration, malabsorption and post-procedure recovery.",
    treats: [
      "Dehydration from illness or malabsorption",
      "Hyperemesis and post-operative fluid deficits",
      "Chronic conditions requiring scheduled fluid support",
    ],
    howItWorks:
      "Balanced crystalloid solutions restore intravascular volume and correct electrolyte deficits immediately, without depending on gut absorption.",
    duration: "1 to 2 hours per liter",
    frequency: "As ordered by your physician",
    route: "Intravenous infusion",
    prep: [
      "Bring recent labs if you have them",
      "Wear comfortable clothing",
      "Bring a companion if you're feeling unwell",
    ],
    expect: [
      "Vitals and assessment at check-in",
      "Fluids run at a rate matched to your orders",
      "Reassessment before discharge",
    ],
    conditions: ["dehydration"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  SELECTORS                                  */
/* -------------------------------------------------------------------------- */

export const therapyBySlug = (slug: string) =>
  therapies.find((t) => t.slug === slug);

export const therapiesBySpecialty = (id: SpecialtyId) =>
  therapies.filter((t) => t.specialty === id);

export const featuredTherapies = () => therapies.filter((t) => t.featured);

export const specialtyById = (id: SpecialtyId) =>
  specialties.find((s) => s.id === id)!;

export const therapyCount = therapies.length;
