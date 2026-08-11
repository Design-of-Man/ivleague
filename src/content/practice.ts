/**
 * Practice content: intake process, amenities, insurance, FAQs, testimonials,
 * differentiators and provider-facing copy.
 *
 * Facts sourced from ivlinfusions.com are marked with a `// source:` comment.
 */

/* -------------------------------------------------------------------------- */
/*                              THE INTAKE PROCESS                             */
/* -------------------------------------------------------------------------- */
// source: ivlinfusions.com/patient-faq/

export const intakeSteps = [
  {
    n: "01",
    title: "Submit a new patient inquiry",
    body: "Fill out the inquiry form on this site or call us directly. A member of our team gets back to you, usually the same business day, to confirm your diagnosis, your prescribing physician and your insurance.",
    detail:
      "You do not need paperwork in hand to start. A name, a diagnosis and a phone number is enough for us to begin.",
    duration: "5 minutes",
  },
  {
    n: "02",
    title: "We collect your orders",
    body: "We contact your physician's office directly for medication orders, demographics, vitals, recent labs and the clinical documentation your plan will require. You don't chase records. We do.",
    detail:
      "This is where most infusion referrals stall. We treat it as our job, not yours.",
    duration: "1–3 business days",
  },
  {
    n: "03",
    title: "Benefits check & prior authorization",
    body: "Once your chart is complete, we verify your benefits and submit for prior authorization. You'll get a clear picture of your expected out-of-pocket cost before anything is scheduled, so nothing about the cost arrives as a surprise.",
    detail:
      "If a copay assistance program or manufacturer foundation applies to your therapy, we enroll you.",
    duration: "Typically 48 hours to 2 weeks, plan-dependent",
  },
  {
    n: "04",
    title: "We order your medication",
    body: "With authorization in hand, your medication is ordered from a U.S. pharmacy that adheres to strict FDA and USP guidelines. Nothing is compounded off-label and nothing is sourced overseas.",
    detail:
      "Specialty biologics are patient-specific: your drug is ordered for you by name.",
    duration: "2–5 business days",
  },
  {
    n: "05",
    title: "Schedule at your convenience",
    body: "We schedule your infusion for a time that actually works: early mornings, evenings until 6, and weekend mornings. Recurring appointments are locked in so you get the same slot and the same nurse.",
    detail:
      "Most patients are infusing within two to three weeks of first contact.",
    duration: "Your call",
  },
  {
    n: "06",
    title: "Settle in and be treated",
    body: "Arrive, get comfortable in your private or semi-private suite, and let your nurse take it from there. We report back to your prescriber after every visit so your care team stays in sync.",
    detail:
      "Recliners with heat and massage, fast Wi-Fi, a flat screen, blankets, and room for someone to sit with you.",
    duration: "As long as your therapy takes",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                                  AMENITIES                                  */
/* -------------------------------------------------------------------------- */
// source: ivlinfusions.com — suites, recliners, Wi-Fi, TV, guests, free parking

export const amenities = [
  {
    icon: "armchair",
    title: "Electric lift recliners",
    body: "Heated, massaging, fully reclining chairs, not hospital furniture. They lift to help you stand at the end of a long infusion.",
    span: "lg",
  },
  {
    icon: "door-closed",
    title: "Private & semi-private suites",
    body: "Your choice, availability permitting. Private suites are standard for longer infusions and for patients who prefer them.",
    span: "sm",
  },
  {
    icon: "wifi",
    title: "High-speed Wi-Fi",
    body: "Fast enough to work, stream or take a call. Plenty of outlets at every chair.",
    span: "sm",
  },
  {
    icon: "tv",
    title: "Flat-screen TV in every suite",
    body: "Your show, your volume, your call. Headphones available if you'd rather keep it to yourself.",
    span: "sm",
  },
  {
    icon: "users",
    title: "Room for a guest",
    body: "Bring your spouse, your mom or your best friend. Every suite has a seat for someone who came with you.",
    span: "sm",
  },
  {
    icon: "car",
    title: "Free parking at the door",
    body: "No garage, no ticket, no long walk. Park and walk in.",
    span: "sm",
  },
  {
    icon: "thermometer-snowflake",
    title: "Warm blankets & pillows",
    body: "Infusions run cool and so do most suites. Say the word and one appears.",
    span: "sm",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                              WHY IV LEAGUE                                  */
/* -------------------------------------------------------------------------- */

export const differentiators = [
  {
    stat: "Locally owned",
    title: "Not a national chain",
    body: "IV League is owned and run by clinicians who live here. Decisions about your care are made in Delray Beach, not at a corporate headquarters in another state.",
  },
  {
    stat: "One team",
    title: "The same nurses, every visit",
    body: "You will not meet a new person every month. Our nurses learn your veins, your premedication preferences and your kids' names.",
  },
  {
    stat: "U.S. pharmacies only",
    title: "Sourcing you can verify",
    body: "Every medication we administer comes from U.S. pharmacies that adhere to strict FDA and USP guidelines. Nothing gray-market, nothing imported.",
  },
  {
    stat: "Site of care",
    title: "A fraction of hospital cost",
    body: "The same biologic administered in a hospital outpatient department often costs multiples of what it costs here. Same drug, same nurse-to-patient ratio, dramatically lower bill.",
  },
  {
    stat: "48 hours",
    title: "Benefits checks that move",
    body: "We start verification the day we receive your referral. Most patients know their expected cost within two business days.",
  },
  {
    stat: "7 days",
    title: "Including weekend mornings",
    body: "Open Monday through Friday until 6:00 PM and Saturday and Sunday mornings, so treatment fits around work and school.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                            INSURANCE & PAYMENT                              */
/* -------------------------------------------------------------------------- */
// source: ivlinfusions.com/patient-faq/

export const insurancePlans = [
  "Aetna",
  "Anthem",
  "BlueCross BlueShield",
  "Cigna",
  "Coventry",
  "Humana",
  "Tricare",
  "Multi-Plan",
  "United Healthcare",
  "Medicare",
  "Medicaid",
];

export const paymentOptions = [
  {
    title: "Commercial insurance",
    body: "We accept most major commercial plans and handle prior authorization end to end. If we're out of network with your plan, we'll tell you before you schedule, not after you're billed.",
    icon: "shield-check",
  },
  {
    title: "Medicare & Medicaid",
    body: "Both accepted. Medicare Part B covers most physician-administered infusions; we'll confirm your specific coverage and any secondary before your first visit.",
    icon: "landmark",
  },
  {
    title: "HSA & FSA cards",
    body: "Accepted at the time of infusion for eligible services. Bring the card you'd like to use.",
    icon: "credit-card",
  },
  {
    title: "Cherry payment plans",
    body: "Cherry financing lets you spread your responsibility over monthly payments, with approval decisions in minutes and options that don't require perfect credit.",
    icon: "calendar-clock",
  },
  {
    title: "Self-pay",
    body: "Transparent self-pay pricing is available for patients without coverage or for wellness infusions. Ask us for a written estimate before you commit.",
    icon: "receipt",
  },
  {
    title: "Copay assistance",
    body: "Many specialty biologics have manufacturer copay programs or foundation grants. We screen every patient for eligibility and handle enrollment.",
    icon: "hand-coins",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                                    FAQS                                     */
/* -------------------------------------------------------------------------- */
// source: ivlinfusions.com/patient-faq/ (expanded)

export type Faq = {
  q: string;
  a: string;
  category: "Getting started" | "Insurance & cost" | "Your visit" | "Clinical";
};

export const faqs: Faq[] = [
  {
    category: "Getting started",
    q: "Do I need a referral?",
    a: "Yes. IV League Infusions requires a physician referral for every patient, regardless of treatment. If you don't have one yet, call us and we'll talk you through exactly what to ask your physician for, and in most cases we can request it on your behalf once you give us their name.",
  },
  {
    category: "Getting started",
    q: "How do I become a patient?",
    a: "Start by filling out the New Patient Inquiry form on this site, or call (561) 489-7100. A member of our team will be in touch. We then contact your physician for medication orders, insurance details, and clinical information (demographics, vitals, labs) needed to authorize treatment. Once we have everything, we obtain prior authorization, order your medication, and schedule your infusion at a time convenient for you.",
  },
  {
    category: "Getting started",
    q: "How long does it take to get started?",
    a: "Most patients are in the chair within two to three weeks of first contact. The variable is prior authorization, which is controlled by your insurance plan and can range from 48 hours to a couple of weeks. We start the clock the day we receive your information and follow up relentlessly.",
  },
  {
    category: "Getting started",
    q: "Do you treat children?",
    a: "We primarily care for adult patients. Some therapies are approved for adolescents, and we evaluate those case by case with the prescribing physician. Call us with the specifics and we'll give you a straight answer.",
  },
  {
    category: "Insurance & cost",
    q: "What insurance do you accept?",
    a: "We accept most major commercial insurances including Aetna, Anthem, BlueCross/BlueShield, Cigna, Coventry, Humana, Tricare, Multi-Plan and United Healthcare, as well as Medicare, Medicaid and self-pay. Contact us to confirm whether we accept your specific plan, since network participation varies by product line.",
  },
  {
    category: "Insurance & cost",
    q: "Will I know what I owe before I'm treated?",
    a: "Yes. We complete a benefits investigation before scheduling and tell you your expected out-of-pocket responsibility up front. If a copay assistance program or manufacturer foundation can reduce that number, we enroll you before your first infusion.",
  },
  {
    category: "Insurance & cost",
    q: "Do you accept HSA cards or offer payment plans?",
    a: "Both. We accept HSA cards at the time of infusion, and we offer Cherry financing and payment plans so a large responsibility can be spread across monthly payments.",
  },
  {
    category: "Insurance & cost",
    q: "Why is an infusion center less expensive than a hospital?",
    a: "Hospital outpatient departments bill a facility fee on top of the drug and administration. Freestanding infusion centers don't. For the same medication, administered by the same class of clinician, the total cost of care in a center like ours is frequently a fraction of the hospital equivalent, which shows up directly in your coinsurance.",
  },
  {
    category: "Your visit",
    q: "How long will my infusion take?",
    a: "It depends entirely on your therapy. Some take 15 to 30 minutes; IVIG and rituximab can run four hours or more. Your specific medication page lists a typical range, and we'll confirm the exact time when we schedule you.",
  },
  {
    category: "Your visit",
    q: "What should I bring?",
    a: "Your photo ID, insurance card, a current medication list, and anything that makes you comfortable: a laptop, headphones, a book, a snack. We provide blankets, pillows and Wi-Fi. Wear a short-sleeved or loose-sleeved top so we can access your arm easily.",
  },
  {
    category: "Your visit",
    q: "Can someone come with me?",
    a: "Absolutely. Every suite has room for a guest, and we encourage it, especially for your first visit.",
  },
  {
    category: "Your visit",
    q: "Can I eat before my infusion?",
    a: "Yes, and you should. Unless your physician has given you specific fasting instructions, eat a normal meal and hydrate well beforehand. Both make the infusion more comfortable and IV access easier.",
  },
  {
    category: "Your visit",
    q: "Can I drive myself home?",
    a: "For most therapies, yes. Some premedications, particularly antihistamines given before rituximab or pegloticase, can make you drowsy. We'll tell you in advance if you should arrange a ride.",
  },
  {
    category: "Your visit",
    q: "What are your hours?",
    a: "Monday through Friday, 9:00 AM to 6:00 PM. Saturday and Sunday, 9:00 AM to 1:00 PM. Weekend and late-afternoon slots exist specifically so treatment doesn't cost you a workday.",
  },
  {
    category: "Clinical",
    q: "Where do your medications come from?",
    a: "We administer all intravenous therapies and injections in accordance with the highest standards of care and protocols. Every treatment contains only high-quality pharmaceuticals obtained from U.S. pharmacies that adhere to strict FDA and USP guidelines.",
  },
  {
    category: "Clinical",
    q: "Who administers my infusion?",
    a: "Licensed registered nurses experienced in infusion therapy, working under physician-written orders, with emergency protocols and equipment on site. You will see the same small team visit to visit.",
  },
  {
    category: "Clinical",
    q: "What happens if I have a reaction?",
    a: "Our nurses are trained in infusion reaction management and our suites are equipped for it. Rates are titrated slowly on first doses, premedication is given where indicated, and vitals are monitored throughout. Any reaction is documented and communicated to your prescriber the same day.",
  },
  {
    category: "Clinical",
    q: "Will you communicate with my doctor?",
    a: "Yes, after every visit. Your prescriber receives documentation of administration, vitals, tolerance and any issues. Your infusion care and your specialty care stay in sync.",
  },
  {
    category: "Clinical",
    q: "Do you offer wellness infusions too?",
    a: "We do. Alongside our specialty and biologic therapies, we administer wellness and regenerative infusions (hydration, vitamin and nutrient therapy) to help promote a healthy lifestyle. Wellness services are screened by a clinician and are separate from your insurance-covered specialty care.",
  },
];

export const faqCategories = [
  "Getting started",
  "Insurance & cost",
  "Your visit",
  "Clinical",
] as const;

/* -------------------------------------------------------------------------- */
/*                                TESTIMONIALS                                 */
/* -------------------------------------------------------------------------- */
/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — representative of the patient experience but
 * NOT real quotes. Replace with signed, HIPAA-compliant patient statements or
 * verbatim public reviews before launch. See CONTENT-REVIEW.md.
 */

export const testimonials = [
  {
    quote:
      "I spent four years getting infusions in a hospital outpatient department. Same drug here, a fraction of the bill, and I actually look forward to going.",
    name: "Placeholder, Crohn's patient",
    detail: "Entyvio, every 8 weeks",
    rating: 5,
  },
  {
    quote:
      "They handled the prior authorization completely. I got one call telling me it was approved and asking what time worked. That was it.",
    name: "Placeholder, RA patient",
    detail: "Orencia, monthly",
    rating: 5,
  },
  {
    quote:
      "My IVIG days used to wreck me. They slowed the rate down, pushed fluids, and I've been headache-free for a year.",
    name: "Placeholder, immunodeficiency patient",
    detail: "IVIG, every 4 weeks",
    rating: 5,
  },
  {
    quote:
      "The nurses know me. They know I'm a hard stick, they know which arm works, and they know my daughter's name. That's not nothing.",
    name: "Placeholder, MS patient",
    detail: "Ocrevus, every 6 months",
    rating: 5,
  },
  {
    quote:
      "Weekend hours meant I never had to explain another absence at work. I don't know why more places don't do this.",
    name: "Placeholder, psoriatic arthritis patient",
    detail: "Simponi Aria, every 8 weeks",
    rating: 5,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                              FOR PROVIDERS                                  */
/* -------------------------------------------------------------------------- */

export const providerValueProps = [
  {
    title: "Referral to first infusion in 2–3 weeks",
    body: "We own the benefits investigation, prior authorization and drug procurement. Your staff sends the order; we take it from there and close the loop.",
  },
  {
    title: "Site-of-care savings your patients feel",
    body: "Freestanding infusion carries no hospital facility fee. For high-cost biologics that difference routinely determines whether a patient stays on therapy.",
  },
  {
    title: "Documentation after every visit",
    body: "Administration records, vitals, tolerance and any reaction are sent back to your office the same day. No chasing, no gaps in the chart.",
  },
  {
    title: "Capacity when you need it",
    body: "Seven days a week including weekend mornings, with same-week starts when authorization allows. Urgent iron and hydration orders are often accommodated within 48 hours.",
  },
  {
    title: "Broad formulary, one point of contact",
    body: "GI, rheumatology, neurology, immunology, allergy, bone health and infectious disease under a single roof, with one phone number and one person who answers it.",
  },
  {
    title: "Copay and foundation navigation",
    body: "We screen every patient for manufacturer copay programs and foundation grants, and handle enrollment so cost doesn't end therapy prematurely.",
  },
] as const;

export const referralRequirements = [
  "Signed physician order specifying drug, dose, route and frequency",
  "Current demographics and insurance information",
  "Relevant clinical notes supporting medical necessity",
  "Recent labs (including TB screening or hepatitis serologies where indicated)",
  "Prior therapy history for step-edit documentation",
  "Preferred contact information for the patient",
] as const;

/* -------------------------------------------------------------------------- */
/*                                THE PRACTICE                                 */
/* -------------------------------------------------------------------------- */

export const aboutPillars = [
  {
    title: "Clinical rigor",
    body: "Every therapy is administered in accordance with the highest standards of care and established protocols, by registered nurses experienced in infusion, under orders written by your physician.",
  },
  {
    title: "Radical logistics",
    body: "The hardest part of specialty infusion is the insurance, the orders, the authorization and the scheduling. We treat that work as the actual product.",
  },
  {
    title: "Human scale",
    body: "A small center with a small team, on purpose. You get continuity of care that a rotating national staffing model structurally cannot provide.",
  },
] as const;

export const milestones = [
  {
    year: "2021",
    title: "IV League opens in Delray Beach",
    body: "Founded by clinicians who had watched too many patients skip doses because a hospital infusion appointment meant a lost day of work and a four-figure bill.",
  },
  {
    year: "2022",
    title: "Formulary expands beyond GI and rheumatology",
    body: "Neurology, immunology and allergy therapies added, with IVIG capability bringing longer-duration infusions in-house.",
  },
  {
    year: "2023",
    title: "Weekend hours introduced",
    body: "Saturday and Sunday morning appointments open so treatment stops competing with work and school.",
  },
  {
    year: "2024",
    title: "Wellness & regenerative infusions launch",
    body: "The same clinical standard applied to hydration, vitamin and nutrient therapy for patients focused on prevention and performance.",
  },
  {
    year: "Today",
    title: "Thousands of infusions later",
    body: "Still locally owned, still the same nurses, still answering the phone ourselves.",
  },
] as const;
