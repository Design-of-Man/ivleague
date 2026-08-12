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

### 0. ~~The practice was in the wrong state~~ — FIXED, with gaps

The whole site was built on Midlothian, Virginia. The practice is in Delray
Beach, Florida. That is corrected: address, phone, fax, socials, directions,
metadata, `areaServed`, the `/locations` page and all 53 clinical pages now
carry the real details, verified against the practice's own copy.

| Field | Now | Source |
|---|---|---|
| Address | 500 Gulfstream Blvd, Suite 105, Delray Beach, FL 33483 | ✅ client, confirmed by the FL facility register |
| Building | Gulfstream Professional Building | ✅ property record |
| Phone | (561) 489-7100 | ✅ public listings |
| Fax | (561) 680-3630 | ✅ public listings |
| Email | info@IVLinfusions.com | ✅ their site |
| Legal name | IV League Infusion Services LLC | ✅ Sunbiz |
| Instagram | @ivleagueinfusionservices | ✅ — the old handle was wrong |
| Facebook | /IVLeagueInfusionServices | ✅ |
| LinkedIn | *removed* | 🔴 was invented; no verified page found |
| Directions | "Southeast of the Woolbright Road exit off I-95" | ✅ their copy |
| Parking | "Free, convenient parking" | ✅ their copy |
| Medical director | Dr. James Frank, MD | ✅ their Our Team page |

**Still needed from IV League:**

1. **Opening hours.** Genuinely unknown. `site.hoursConfirmed` is `false`, which
   suppresses the Open/Closed pill, the hours table and
   `openingHoursSpecification` in the schema — a patient cannot turn up on a
   schedule this site never states. All the site claims is what their own copy
   claims: weekend appointments are available. Set the hours and flip the flag.
2. **Latitude and longitude.** `site.address.geo` is `null` and the schema omits
   `geo` entirely rather than carry an approximate pin for a medical facility.
   Take it from the Google Business Profile listing.
3. **Service area.** `/locations` and `areaServed` name only Delray Beach and
   Palm Beach County, because those are the two things that are true by virtue
   of where the suite is. The previous list of twelve towns was invented. Which
   communities do they actually draw from?
4. **One location or several?** Their site has a `/locations` page and their copy
   says "Local centers offer flexible scheduling" and "Find an Infusion Center",
   both plural. Only the Delray Beach suite is in this build.
5. **The specialty list does not match.** Their site lists Hematology, Neurology,
   Immunology, Rheumatology, Endocrinology and Orthopedics. This build's nav and
   filters use Gastroenterology, Rheumatology, Neurology, Immunology, Allergy &
   Asthma, and Bone & Blood Health. Some of that is a naming difference and some
   is a real gap — there is no Endocrinology or Orthopedics grouping here, and GI
   is prominent here but absent from their list. Needs a line-by-line pass.
6. **In-home infusion.** A public directory describes them as providing in-home
   infusion by certified RNs. Nothing on this site mentions it. If it is a real
   service line it deserves a page.

---

### 1. Testimonials — `src/content/practice.ts` → `testimonials`
Five quotes, each labelled `"Placeholder — <condition> patient"`. They are
**representative, not real**. Replace with signed, HIPAA-compliant patient statements or
verbatim public reviews (Google/Yelp) with attribution. Using a patient's words — even
anonymized — requires written authorization.

### 2. ~~A named clinical reviewer~~ — DONE (Dr. James Frank, MD)

The 53 therapy and condition pages carry `MedicalWebPage` schema with a
`lastReviewed` date, but no `reviewedBy`. That field is the strongest trust
signal available for health content, both to search engines and to a patient
reading the page, and it needs a real person: name, credential (MD, DO, NP, RN)
and role. **Ask IV League who signs off on the clinical copy**, then add them to
`medicalWebPageSchema` and surface the name next to the review date in
`ReviewedOn`.

It was left out rather than filled with a plausible-sounding name. An invented
clinician attesting to medical content is not a shortcut worth taking.

Related: `src/content/reviewed.ts` holds the review date as a hand-edited
constant, deliberately not a build timestamp. Bump it when someone has actually
re-read the content, not on every deploy.

### 3. The logo — redrawn, still needs the vector

**Fixed:** the mark is now IV League's real crest — a double-ruled shield with a
blue-to-cyan droplet — and it replaces the bare teal droplet that was there,
which had been traced off a screenshot of the website and was simply the wrong
mark. It is applied to the header, the footer, `icon.svg`, `favicon.ico`
(16 + 32, multi-resolution), the Apple touch icon, both PWA icons and the
maskable icon.

**Still needed:** it is redrawn in SVG from the raster you sent, so the curve of
the shield, the exact gradient stops and the wordmark tracking are close but not
exact. Send the original **AI / EPS / SVG** and it drops straight into
`LogoMark` — one definition feeds every size. Regenerate the raster icons with
`tools/icons/generate.mjs` afterwards.

🟡 **Worth a decision: the brand is blue, the site is teal.** The original brief
asked for "their logo colour of their teal", but their actual mark is blue
(`#1B4C9B` → `#3FBDEA`), not teal. The site's entire accent scale is teal
(`#1fcdc0`). Right now the lockup renders in its true blue and everything around
it stays teal — adjacent hues, so it reads as deliberate rather than broken, but
it is two accents. The options are to leave it, or to retune the accent scale to
the brand blue, which is a contained change (one block of CSS custom properties
in `globals.css`). Say which and it is done.

**Separately: which name is correct?** Your logo lockup and your homepage copy
both say "IV League Infusion Services", and Sunbiz has the LLC under that name,
so that is what the site and the schema use. The short form survives in the
domain (ivlinfusions.com) and nothing else. Worth confirming it matches the
Google Business Profile exactly — a mismatch there costs local-pack visibility.

### 4. Wellness and injection pricing — `src/content/wellness.ts`
Every `price` is `null` and renders as "Pricing on request". Set the numbers in that one
file and they propagate to the menu cards, the injection grid and future schema markup.
**Do not let anyone guess these.**

### 5. Interior photography — `src/app/suite/page.tsx`
Six tiles render generated art with a "Photo pending" chip. Shot list, in order:
private suite with recliner; semi-private bay; drug prep station; guest seating;
nurses' station with sightlines; entry and parking. Landscape, 3:2, shot dark to match
the palette. Replace `ShotArt` with `next/image`.

### 6. Team bios — `src/app/about/page.tsx`
The team section currently states that profiles are pending. Supply names, credentials,
roles and headshots, or delete the section.

### 7. Instagram feed — `src/lib/instagram.ts`
Renders designed placeholder cards until credentials exist. Set `INSTAGRAM_ACCESS_TOKEN`
(and `INSTAGRAM_USER_ID` if not `me`) and the grid switches to live posts with no code
change. **Confirm the handle** — `@ivleagueinfusions` in `src/content/site.ts` is
inferred, not verified.

### 8. Payer logos — `src/components/ui/PayerLogos.tsx`
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

### 9. Fax number — `src/content/site.ts` → `contact.fax`
`(804) 566-9020` is a **placeholder**. It appears on the providers page and the contact
page as a referral destination. Replace or remove.

### 10. Legal documents — `src/content/legal.ts`
Privacy Policy, HIPAA Notice of Privacy Practices, Terms of Use, Accessibility
Statement. These are **templates, not legal advice.** The HIPAA notice in particular has
content requirements set by 45 CFR § 164.520 and must be reviewed by counsel and the
practice's Privacy Officer, and must match the notice posted in the office.
Effective dates are set to August 1, 2026 — change them.

### 11. Founding year and milestones — `src/content/practice.ts` → `milestones`
The 2021 founding date and the year-by-year narrative are 🟡 **invented scaffolding**.
Confirm or replace. Delete the section rather than publish an inaccurate history.

### 12. Homepage stats — `src/content/site.ts` → `stats`
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
