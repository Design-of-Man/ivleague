# IV League Infusions

Website for [IV League Infusions](https://ivlinfusions.com) — an outpatient infusion
center in Midlothian, Virginia.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Vercel.

**Read [`CONTENT-REVIEW.md`](./CONTENT-REVIEW.md) before launch.** It lists everything
that is a placeholder and must be replaced, and everything that is proposed and needs the
practice to confirm it.

[`DESIGN.md`](./DESIGN.md) documents the design system, the reference teardown behind it,
and the motion spec for the drip chamber.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint, zero warnings expected
```

## Environment variables

Everything is optional — the site builds and runs with none of them set. Copy
`.env.example` to `.env.local` to enable the live integrations.

| Variable | Effect when unset |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs and JSON-LD fall back to `https://ivlinfusions.com` |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram grid renders designed placeholder cards |
| `INSTAGRAM_USER_ID` | Defaults to `me` |
| `RESEND_API_KEY` | Inquiry submissions are logged to the server console instead of emailed |
| `INQUIRY_TO_EMAIL` | Same as above. Comma-separate for multiple recipients. |
| `INQUIRY_FROM_EMAIL` | Falls back to Resend's onboarding sender |

The inquiry form always returns success to the patient, so a missing key never surfaces
as a broken form — but check the logs.

## Content model

All copy lives in `src/content/`. There is no CMS; these files *are* the CMS, and they're
typed, so a bad edit fails the build rather than the page.

| File | Owns |
|---|---|
| `site.ts` | Name, address, phone, hours, socials, navigation, footer, stats |
| `therapies.ts` | 31 therapies + 8 specialties. Drives `/therapies` and every `/therapies/[slug]` |
| `conditions.ts` | 22 conditions. Drives `/conditions` and every `/conditions/[slug]` |
| `wellness.ts` | Drip menu and injections. **All prices are `null` — set them here.** |
| `practice.ts` | Intake steps, amenities, differentiators, insurance, FAQs, testimonials, provider copy |
| `legal.ts` | Privacy, HIPAA notice, terms, accessibility |

Adding a therapy is one object in `therapies.ts`: the detail page, the directory entry,
the specialty count, the sitemap entry and the cross-links from related conditions all
follow automatically.

Hours changes in `site.ts` propagate to the header's live open/closed badge, the
locations table, the footer and the `openingHoursSpecification` in JSON-LD.

## Routes

```
/                          Home
/therapies                 Filterable directory (?specialty= and ?q= are shareable)
/therapies/[slug]          31 static pages
/conditions                Grouped by specialty
/conditions/[slug]         22 static pages
/wellness                  Drip menu + injections
/patients                  What to expect
/patients/faq              Searchable, filterable FAQ
/insurance                 Coverage, prior auth, financial assistance
/providers                 Referral requirements and site-of-care case (B2B)
/suite                     The infusion center
/locations                 Map, directions, hours
/about                     Practice story
/contact                   New patient inquiry form
/legal/[slug]              privacy · hipaa · terms · accessibility
/api/inquiry               POST — form handler
/api/og                    Dynamic Open Graph images
/sitemap.xml  /robots.txt  /manifest.webmanifest
```

75 pages, 71 of them prerendered as static HTML.

## Notable implementation details

**The drip chamber** (`src/components/ui/DripChamber.tsx`) is the site's signature. Pure
SVG + CSS keyframes with per-phase easing that models surface tension; two droplets run
half a cycle apart so the loop has no seam. See `DESIGN.md` §4.

**Accessibility.** Skip link, landmark structure, keyboard-operable nav and lightbox,
visible focus rings, AA contrast targets, labelled form fields with programmatic error
association, and a global `prefers-reduced-motion` rule that suppresses every animation
on the site.

**SEO.** Per-page metadata and canonicals, dynamic OG images, and JSON-LD for
`MedicalBusiness`, `WebSite`, `BreadcrumbList`, `FAQPage`, `MedicalTherapy` and
`MedicalCondition`.

**No client-side data fetching.** The Instagram feed is fetched server-side with hourly
revalidation, so the grid ships as static HTML.

## Deploying to Vercel

Import the repo, framework preset **Next.js**, no build overrides needed. Add the
environment variables above in Project Settings. Set `NEXT_PUBLIC_SITE_URL` to the
production domain so canonicals and JSON-LD resolve correctly.
