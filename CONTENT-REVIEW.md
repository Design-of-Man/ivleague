# Content review — required before launch

Everything on this site is one of three things. This document says which is which,
so nothing unverified reaches a patient.

| Legend | Meaning |
|---|---|
| ✅ **Sourced** | Taken from ivlinfusions.com or a public listing for the practice. Used close to verbatim. |
| 🟡 **Proposed** | Written for this build. Plausible and standard for an ambulatory infusion center, but **not confirmed** by IV League. Needs a yes/no. |
| 🔴 **Placeholder** | Deliberately fake or empty. **Must be replaced before launch.** |

> The practice's live domain is blocked by this environment's egress policy, so sourced
> facts were reconstructed from search-indexed content and public business listings
> rather than read directly off the site. Please spot-check the ✅ items too.

---

## 🔴 Must be replaced before launch

### 1. Testimonials — `src/content/practice.ts` → `testimonials`
Five quotes, each labelled `"Placeholder — <condition> patient"`. They are
**representative, not real**. Replace with signed, HIPAA-compliant patient statements or
verbatim public reviews (Google/Yelp) with attribution. Using a patient's words — even
anonymized — requires written authorization.

### 2. Wellness and injection pricing — `src/content/wellness.ts`
Every `price` is `null` and renders as "Pricing on request". Set the numbers in that one
file and they propagate to the menu cards, the injection grid and future schema markup.
**Do not let anyone guess these.**

### 3. Interior photography — `src/app/suite/page.tsx`
Six tiles render generated art with a "Photo pending" chip. Shot list, in order:
private suite with recliner; semi-private bay; drug prep station; guest seating;
nurses' station with sightlines; entry and parking. Landscape, 3:2, shot dark to match
the palette. Replace `ShotArt` with `next/image`.

### 4. Team bios — `src/app/about/page.tsx`
The team section currently states that profiles are pending. Supply names, credentials,
roles and headshots, or delete the section.

### 5. Instagram feed — `src/lib/instagram.ts`
Renders designed placeholder cards until credentials exist. Set `INSTAGRAM_ACCESS_TOKEN`
(and `INSTAGRAM_USER_ID` if not `me`) and the grid switches to live posts with no code
change. **Confirm the handle** — `@ivleagueinfusions` in `src/content/site.ts` is
inferred, not verified.

### 6. Payer logos — `src/components/ui/PayerLogos.tsx`
The twelve carrier marks on the insurance wall and in the footer marquee are
**original SVG interpretations drawn for this build** — recognisable silhouettes in
each brand's colour, not the carriers' official trademark files. Two things before
launch:

1. Replace them with the real logo assets (every carrier publishes a brand kit).
2. Confirm IV League is permitted to display each mark. Most payer contracts allow
   "we accept" usage, but several — UnitedHealthcare and Aetna in particular — require
   a signed brand-usage request first. Cherry is a vendor, not a payer, and has its own
   partner-marketing terms.

The `payers` array is the only place to edit; the wall, the footer marquee and the
grayscale-to-colour hover all read from it.

### 7. Fax number — `src/content/site.ts` → `contact.fax`
`(804) 566-9020` is a **placeholder**. It appears on the providers page and the contact
page as a referral destination. Replace or remove.

### 8. Legal documents — `src/content/legal.ts`
Privacy Policy, HIPAA Notice of Privacy Practices, Terms of Use, Accessibility
Statement. These are **templates, not legal advice.** The HIPAA notice in particular has
content requirements set by 45 CFR § 164.520 and must be reviewed by counsel and the
practice's Privacy Officer, and must match the notice posted in the office.
Effective dates are set to August 1, 2026 — change them.

### 9. Founding year and milestones — `src/content/practice.ts` → `milestones`
The 2021 founding date and the year-by-year narrative are 🟡 **invented scaffolding**.
Confirm or replace. Delete the section rather than publish an inaccurate history.

### 10. Homepage stats — `src/content/site.ts` → `stats`
`12,000+ infusions`, `30+ therapies`, `48hr benefits check`, `5.0 rating`. Only the
therapy count is derived from real data. **The other three are illustrative.** Any
number stated publicly should be one the practice can defend.

---

## ❓ Questions I need answered before the next pass

1. **Service-area pages.** The brief asks for one page per area the practice actually
   serves — real ones only. I have not built any, because I don't know which they are and
   inventing neighborhood pages is exactly the thing that gets a local site penalised.
   `/locations` currently lists twelve nearby places as an "areas we cover" chip row;
   that list is **inferred from geography, not from the practice.** Tell me which areas
   IV League genuinely draws from and I'll build a real page for each; otherwise I'll cut
   the chip row.
2. **Is Midlothian the only location?** The live site has a `/locations` (plural) page,
   which usually implies more than one. If there are others, everything here is built to
   take them — `site.ts` would become an array.
3. **Confirm the NAP** exactly as it should appear in Google Business Profile: legal
   entity name, street line, suite number if any, and the phone patients should call
   versus the one providers should call.
4. **Instagram handle**, and whether the account is a Business/Creator account (required
   for a long-lived Graph API token).
5. **Wellness pricing**, per item, and whether wellness is genuinely walk-in or
   appointment-only.
6. **The two reference screenshots** mentioned in the brief didn't come through. The
   teardown in `DESIGN.md` works from Aesop and Equinox as characterizations rather than
   from images, and says so. Send them and I'll redo that section against what's actually
   in them.

---

## 🟡 Confirm — clinical and operational

### Formulary — `src/content/therapies.ts`
31 therapies. Five carry `onCurrentSite: true` and are confirmed present on the live
site today:

- **Entyvio** (vedolizumab)
- **Stelara IV** (ustekinumab)
- **Avsola** (infliximab-axxq)
- **Renflexis** (infliximab-abda)
- **IVIG**
- *(also: Xolair and IV anti-infectives, inferred from the asthma and infection pages)*

**The other ~24 are proposed** from a standard ambulatory infusion center formulary.
Please confirm each, or set `onCurrentSite` and let us prune. Specifically confirm
whether the practice administers: Ocrevus, Tysabri, Briumvi, Vyepti, Rituxan, Krystexxa,
Tepezza, Evenity, and the IV iron products.

Also confirm per therapy: **typical chair times and dosing cadences.** These are written
as general ranges with "typical" hedging, but a patient will read them as a promise about
their appointment length.

### Conditions — `src/content/conditions.ts`
22 conditions. Nine carry `onCurrentSite: true` (Crohn's, ulcerative colitis, RA,
psoriatic arthritis, ankylosing spondylitis, plaque psoriasis, MS, severe & allergic
asthma, immunodeficiency, IV-antibiotic infections). The rest are proposed.

All clinical copy is educational and general, with a disclaimer component on every
therapy and condition page. **It still needs a clinician's read.**

### Intake process — `src/content/practice.ts` → `intakeSteps`
Steps and sequence are ✅ sourced from the patient FAQ. The **durations** attached to each
step (1–3 business days, 2–5 business days, "2 to 3 weeks to first infusion") are 🟡
proposed. These become expectations — confirm them.

### Provider claims — `src/app/providers/page.tsx`
"Referral to first infusion in 2–3 weeks", "same-day confirmation", "documentation back
within 24 hours", "urgent iron and hydration within 48 hours". All 🟡. Referring offices
will hold you to these.

---

## ✅ Sourced — spot-check only

- Address: 2949 Fox Chase Lane, Midlothian, VA 23112
- Phone: (804) 397-6286 · Email: info@IVLinfusions.com
- Hours: Mon–Fri 9:00 AM–6:00 PM; Sat–Sun 9:00 AM–1:00 PM
- Physician referral required for every patient, regardless of treatment
- Insurers: Aetna, Anthem, BlueCross/BlueShield, Cigna, Coventry, Humana, Tricare,
  Multi-Plan, United Healthcare, Medicare, Medicaid, self-pay
- HSA cards accepted at time of infusion; Cherry financing available
- Intake sequence: inquiry form → team contact → physician orders, demographics, vitals,
  labs → prior authorization → medication ordered → scheduling
- Amenities: private and semi-private suites; electric lift recliners with massage and
  heat; pillows and blankets; high-speed Wi-Fi; flat-screen TVs; room for guests;
  free parking
- Sourcing language: "highest standards of care and protocols", "high-quality
  pharmaceuticals obtained only from U.S. pharmacies that adhere to strict FDA and USP
  guidelines"
- Treats adult patients with complex chronic conditions; also administers wellness and
  regenerative infusions

---

## Compliance notes

**The inquiry form is not a HIPAA-compliant channel.** `/api/inquiry` posts over HTTPS to
a plain email relay. The form copy tells patients not to include clinical detail, and the
privacy policy repeats it. If IV League wants to accept PHI through the website, replace
this endpoint with a BAA-covered form provider before launch — do not simply add fields.

**Drug brand names** (Entyvio, Remicade, Ocrevus, etc.) are trademarks of their
respective owners. Use is descriptive; the Terms of Use says so. Some manufacturers have
specific rules about how their marks may appear on a provider site — worth a check if the
practice participates in any manufacturer program.

**Wellness claims** use "supports" language throughout and carry the FDA disclaimer.
Do not let anyone upgrade these to "treats", "cures" or "boosts immunity."

**Accessibility statement** describes what was actually built (keyboard operability,
AA contrast targets, reduced-motion support, labelled form fields). If the site changes
materially, re-verify before leaving the claims up.
