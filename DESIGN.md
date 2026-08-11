# IV League Infusions — Design System

Written in response to the reference-teardown brief. Read the caveats first — two of
the brief's premises don't match the real business, and that changed the answer.

---

## 0. Two corrections to the brief before anything else

**The brief describes an "IV and hydration therapy clinic" whose single job is booking.
That is not what this business is.** ivlinfusions.com is an outpatient *infusion center*:
biologics for Crohn's, RA and MS; IVIG for immunodeficiency; IV antibiotics; IV iron.
Wellness drips are a real but secondary line. Every therapy requires a physician
referral, and the practice's own FAQ makes that the first thing it says.

That flips the page's job. It is not "book an appointment" — you cannot book a Remicade
infusion off a website. It is **start an intake**: get a name, a diagnosis and a
prescriber, so the practice can chase the orders and the prior authorization. Every CTA
on the site says some version of *become a patient* / *start intake* rather than *book
now*, and the second-most-prominent CTA on the whole site is the phone number, because
that is how these patients actually convert.

The wellness menu keeps a booking-shaped CTA, since that side genuinely is walk-in.

**The audience is also not primarily "nervous first-timers with discretionary income."**
It is two audiences with opposite needs:

| | What they're afraid of | What the page owes them |
|---|---|---|
| **Chronic patients** (majority) | Another lost workday. A four-figure facility-fee bill. An authorization nobody chased. | Logistics, cost transparency, hours, continuity of staff |
| **Referring physicians** (the actual demand driver) | Their staff absorbing benefits work | Turnaround times, formulary breadth, documentation back in the chart |
| Wellness walk-ins (minority) | Needles, feeling upsold | Clinical credibility, no vending-machine energy |

So the site has a `/providers` page with fax numbers and referral requirements — a
B2B page inside a B2C-looking site. That's unusual for the category, and it's the
highest-leverage page on the whole build.

**Also: prices are `null` everywhere.** The brief says not to let me invent services,
location or pricing, and I haven't. Real, sourced facts (address, phone, hours, insurers,
amenities, intake process, five confirmed therapy pages) are used verbatim. Everything
proposed rather than confirmed is flagged in `CONTENT-REVIEW.md`.

---

## 1. Reference teardown

Per the brief's advice, no IV clinics. Both references are from adjacent worlds that
already solved "clinical but expensive."

> These are analyzed from close familiarity, not from a live audit — this build
> environment's egress policy blocks outbound page fetches, so I could not re-measure
> either site today. Treat the rem values as characterizations, not measurements.

### Reference A — Aesop

**Hero.** In the first two seconds there is almost nothing: a wordmark, a thin nav, a
single product photographed like a laboratory specimen against a flat wall, and one line
of text. No slider. No badge. No cookie modal fighting a newsletter modal. The restraint
*is* the message — a brand that doesn't need to shout has already told you its price
point.

**Type over image.** Text almost never sits on top of the image. It sits *beside* it, in
its own column, on a flat ground. That single decision removes the need for scrims,
drop shadows and dark overlays — all the chrome that makes a page feel cheap.

**Type scale.** One family doing everything, differentiated by size and case rather than
by weight. Display sizes are modest — the hero headline is closer to 2.5rem than 5rem —
and body copy is unusually large (~1.0625–1.125rem) with a generous measure. The gap
between "headline" and "body" is small. That compression reads as editorial confidence:
the copy is worth reading, so it's set to be read.

**Vertical rhythm.** Very few section breaks, each enormous. Roughly 8–10rem of air above
and below a section, and the air is doing work — it's what tells you the thing inside is
worth looking at.

**Palette.** Warm off-white ground (~`#FFFCF7`), near-black text (~`#33322E`), and a
narrow range of muted botanical greens and browns pulled from the packaging. No pure
white and no pure black anywhere.

**Motion.** Almost none. Fades on scroll, measured in ~400ms. No parallax, no counters,
no scroll-jacking.

**Deliberately left out.** Faces. Testimonials. Star ratings. Urgency. Any element that
asks you to hurry.

### Reference B — Equinox

**Hero.** The opposite strategy, same confidence: full-bleed, high-contrast, aggressively
art-directed imagery with type set *into* the composition rather than centered on it.
Text is small relative to the frame. The image is allowed to be the loud element and the
typography stays quiet — which is what stops it becoming a car ad.

**Type.** A tight, high-contrast grotesque used at large sizes with heavy negative
tracking (−0.02 to −0.04em), against small all-caps utility text at wide positive
tracking (0.15–0.25em). That *contrast between two tracking extremes* is most of the
premium feel, and it costs nothing.

**Vertical rhythm.** Tighter than Aesop, ~5–7rem, because there's more to say. Full-bleed
sections alternate with contained ones, which keeps a long page from reading as a list.

**Palette.** Effectively two values — black and white — plus photography. Colour is
rationed to almost zero, which is why the photography looks expensive.

**Motion.** Slow reveals on scroll (600–900ms), long easing curves, and image scale on
hover that is barely perceptible (1.02–1.05). Nothing bounces.

**Deliberately left out.** Explanations. It never justifies the price. Sites that explain
why they're worth it, aren't.

### What actually makes both read as expensive

Neither is expensive because of a gradient or a font. They're expensive because:

1. **One idea per screen.** Never two competing focal points.
2. **A large air budget, spent unevenly.** Air is concentrated around the things that
   matter, not distributed evenly like padding.
3. **Rationed colour.** One accent, used maybe six times on a page.
4. **Tracking contrast.** Tight display type against wide small-caps utility type.
5. **Motion you notice only when it stops.** Nothing announces itself.
6. **Refusal.** No badges, no urgency, no stock smiles, no "as seen in."

That's the discipline to borrow. Not the look.

---

## 2. The collegiate question

The name is a pun on Ivy League. Does a collegiate direction — serif wordmark, crest,
deep navy or racing green, varsity striping — earn its place?

### The case for

- It's the most differentiated move available in the category, by a distance. Zero IV
  clinics look like a university press.
- Ivy League connotes *selectivity and rigor*, which for a medical service is on-brief.
  "IV League" as a promise of the best-in-class version of a commodity service is a
  genuinely good positioning idea.
- The pun exists whether or not the design acknowledges it. Ignoring it can read as
  timidity.
- A crest gives the practice an ownable mark that isn't a droplet — and every competitor
  is a droplet.
- Serif + navy is the visual language of trust institutions: universities, banks,
  hospitals with endowments.

### The case against

- **The pun is a joke about status, and the service is chemotherapy-adjacent.** The
  patient reading this page has Crohn's disease and is about to spend four hours a month
  in a chair for the rest of their life. A varsity crest on that page is tone-deaf. It
  works for a hangover-drip storefront in a college town. It does not work for IVIG.
- **Varsity striping and crests read as *bar*, not *clinic*.** The nearest visual
  neighbours are craft breweries, barbershops and intramural leagues. That association
  is one glance away and it's fatal for a medical service.
- **Navy and racing green are the two most common "we're serious" colours in
  healthcare.** Choosing them to be distinctive lands you in the middle of the pack.
- **The client already has a teal logo.** Bolting collegiate iconography onto an existing
  teal mark produces a brand at war with itself.
- **A crest hides the actual proof.** The differentiators here are boring and enormous:
  no facility fee, 48-hour benefits checks, weekend hours, the same nurse every visit.
  Heraldry cannot say any of that. Data can.

### Decision: reject the collegiate *look*, keep the collegiate *discipline*

No crest, no varsity stripe, no navy, no serif wordmark.

What survives is the part of the university-press tradition that isn't costume:

- **Small caps at wide tracking for every utility label** — the section eyebrows, spec
  labels, and metadata are set in a mono face at 0.16–0.24em tracking, uppercase, at
  9.5–11px. That's academic-catalogue typography, not sportswear.
- **Numerals as structure.** Process steps are `01`–`06`. Milestones are years.
  Therapies carry chair times and cadences. The page is organized like a reference work.
- **Hairline rules instead of boxes** wherever a divider will do the job of a card.
- **A defined measure.** Long-form copy is capped around 46rem, not stretched to the
  container.
- **The wordmark is a monogram, not a logotype.** "IV" set inside a droplet, in the
  negative space — which reads simultaneously as the roman numeral four, as the
  abbreviation for intravenous, and as an academic monogram. That's the one place the
  pun is allowed to live, and it's silent.

The joke is acknowledged and never told out loud. That's the version that survives being
read by someone on their fourth infusion.

---

## 3. The system

### Colour — six values, one accent

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#04070A` | Page ground. Near-black with a blue cast, never `#000` — pure black kills the sense of depth and makes teal look radioactive. |
| `ink-900` | `#070B0F` | Raised surfaces, alternating section bands |
| `ink-700` | `#152128` | Hardware, chart furniture, inactive strokes |
| `ink-300` | `#7D919A` | Body copy on dark. Passes AA at body sizes. |
| `ink-50` | `#F1F6F7` | Headings and primary text |
| **`teal-400`** | **`#1FCDC0`** | **The only accent.** |

The teal ships as a full 50→950 scale so tints stay in-family, but exactly one value is
the accent, and it's rationed: the pulse dot in an eyebrow, one primary button per
viewport, the droplet, the active nav pill, the rule under a heading. Everything else is
grey. When teal appears, it means *this is the thing*.

Black-and-teal was the client's directive. The discipline applied to it — near-black
rather than black, one accent value rather than a teal palette, grey doing 95% of the
work — is what keeps it from becoming the neon-aqua category look the brief warns about.

### Type — three faces, stated scale

| Role | Face | Used for |
|---|---|---|
| Display | **Sora**, 600 | Headings only. Geometric, slightly condensed, low-contrast — reads as engineered rather than friendly. |
| Body | **Inter**, 400/500 | All running copy, UI, labels |
| Utility | **JetBrains Mono**, 400/500 | Every uppercase micro-label, spec value, step number, timestamp |

Scale (fluid; min → max):

```
hero      clamp(2.6rem,  1.5rem + 4.6vw, 5.5rem)   tracking -0.045em
display   clamp(2.1rem,  1.3rem + 3.2vw, 4.25rem)  tracking -0.035em
title     clamp(1.7rem,  1.15rem + 2.1vw, 3rem)    tracking -0.035em
lead      clamp(1.06rem, 0.98rem + 0.42vw, 1.31rem)
body      0.9375rem / 1.75            (15px, generous leading)
small     0.8125–0.875rem             (13–14px)
utility   0.594–0.688rem              (9.5–11px, uppercase, 0.16–0.24em tracking)
```

The Equinox move is doing the heavy lifting: display type at −0.045em tracking sitting
directly against mono utility type at +0.20em. Two extremes, no middle.

**Radii were deliberately tightened to `0.625rem`** across every card, panel and tile.
The brief calls out "rounded cards" as a category tell, and the original 1.25rem read as
wellness-app. At 10px the same components read as instrument housing.

### Layout — section order, and why each exists

| # | Section | Why it exists |
|---|---|---|
| 1 | Hero + drip chamber | State what this is and who it's for in two seconds; the chamber does the emotional work so the copy doesn't have to. |
| 2 | Stat band | Four numbers, immediately, before any claim — proof precedes pitch. |
| 3 | Specialties (8) | Answer "do you treat *me*" faster than a nav menu can. |
| 4 | Therapy rail | Answer "do you carry *my drug*" — the actual query patients arrive with. |
| 5 | Intake process (01–06) | The core differentiator: five of six steps are ours, not yours. Scroll-linked so the rail fills as you read. |
| 6 | The suite (bento) | The only place comfort is sold, and only after competence is established. |
| 7 | Why IV League | Six differentiators as facts, not adjectives. |
| 8 | Insurance | The real objection. Named carriers, HSA, Cherry, copay assistance. |
| 9 | Wellness | The second business, deliberately downstream of the first so it never dilutes clinical credibility. |
| 10 | Testimonials | Social proof placed after the argument, not before it. |
| 11 | Instagram | Proof the place is alive and staffed by humans. |
| 12 | FAQ | Catch the long tail before it becomes a phone call. |
| 13 | Location + hours | Local intent; free parking and weekend hours are conversion facts. |
| 14 | CTA band | One ask, restated. |

### Signature

**The macro drip chamber.** One element, contained in a framed instrument panel, never
full-bleed. It is the only piece of the page that moves on its own, and it's the thing
you'd describe to someone if you were describing the site.

---

## 4. Motion spec — the drip chamber

`src/components/ui/DripChamber.tsx` + `@keyframes drop-cycle` in `globals.css`.

### The easing is the whole point

A drop is not a linear translate. Five phases, each with its own timing function:

| Cycle % | Phase | Timing function | What's happening |
|---|---|---|---|
| 0–30% | **Form** | `cubic-bezier(.22,.9,.35,1)` | Bead swells at the nozzle, decelerating as it fills |
| 30–40% | **Hang** | `cubic-bezier(.4,0,.6,1)` | Almost motionless. Surface tension is winning, barely. This pause is what sells it. |
| 40–45% | **Neck** | `cubic-bezier(.7,0,.9,.3)` | Tension loses; the waist thins fast. `scale(0.82, 1.48)` |
| 45–48% | **Snap** | `cubic-bezier(.2,.8,.3,1)` | Pinch-off. The drop springs back toward a sphere — a real drop overshoots here. |
| 48–70% | **Fall** | `cubic-bezier(.55,0,1,.45)` | Gravity. This curve approximates `y = t²`. |
| 70–78% | **Impact** | `ease-out` → `linear` | Flattens to `scale(1.7, 0.14)` and is absorbed. |

Three concentric rings fire at 73% with 0.16s stagger; the meniscus dips 1.6px and
recovers on a spring curve.

### Why SVG + CSS keyframes, not canvas

Four moving parts, not four hundred — canvas's throughput advantage never applies. SVG
gives crisp geometry at any DPI plus real gradient and blur fills for the glass. Because
everything animates through `transform` and `opacity`, the whole thing composites on the
GPU without a single JS frame; the browser also pauses it when the tab is hidden, and
`prefers-reduced-motion` is handled by one global rule. A canvas version would need a rAF
loop, an IntersectionObserver, DPR handling and a reduced-motion branch to reach parity.

### How it loops seamlessly

There is no start or end frame. **Two identical droplets run the same animation half a
cycle apart** (`animation-delay: -2.3s` on a 4.6s cycle), so while one falls the next is
already swelling. The ripples are offset the same way. What the eye reads is not a
repeating clip — it's a steady drip rate, which is exactly how a real chamber looks.

### Constraints, measured

| Requirement | Result |
|---|---|
| Inline SVG, graphic not photorealistic | ✅ Flat gradients and one blur for the pool glow. No refraction, no caustics. |
| Animate `transform` and `opacity` only | ✅ Nothing else is touched — no geometry attributes, no filters, no layout properties. |
| Seamless loop | ✅ Cycle starts and ends on identical state; two droplets offset half a cycle mean there is no visible seam to land on. |
| Under 30KB | ✅ **6.8KB** — 5.4KB of rendered SVG markup + 1.6KB of keyframe CSS. |
| Text is LCP and paints immediately | ✅ Verified: LCP element is the `<h1>`, and it carries no entrance animation and no hydration dependency. |
| Colors from the token system | ✅ Every fill and stroke is a `var(--color-*)`; there is not one hex literal in the component. |
| `prefers-reduced-motion` freezes to a composed frame | ✅ Verified frame-identical across a 2.5s window — one droplet suspended mid-chamber, meniscus at rest. |

### Measured performance

Production build, Lighthouse, eight templates:

| | Perf | A11y | Best practices | SEO | CLS |
|---|---|---|---|---|---|
| **Desktop** | 98–100 | **100** | 100 | 100 | 0 |
| **Mobile** — interior templates | **93–95** | **100** | 100 | 100 | 0 |
| **Mobile** — homepage | **92** | **100** | 100 | 100 | 0 |

The things that actually moved the number, most of them counter-intuitive:

**1. Never put the LCP element inside a scroll reveal.** A reveal starts at
`opacity: 0`, and an invisible element cannot be the Largest Contentful Paint — so LCP
doesn't fire until the IntersectionObserver runs after hydration. Every interior page
had its `<h1>` *and its lead paragraph* wrapped in a reveal. Removing reveals from
everything above the fold took interior templates from **81–83 to 93–96** and cut LCP
from 4.6–5.0s to 2.7–3.0s. Nothing else came close to that.

**2. `experimental.inlineCss` made it worse**, by 4–10 points, because it pushes 17KB
into every HTML document and delays the document itself. It's off, with a comment in
`next.config.ts` saying not to re-add it blind.

**3. One `getBoundingClientRect()` in a mount effect cost 107ms.** The scroll-reveal hook
measured each element to see whether it was already on screen, so it could skip the
observer. With dozens of reveals on a page, each of those reads lands between React's own
DOM mutations and forces a synchronous layout — classic thrash. `IntersectionObserver`
already fires for targets that are intersecting when observation begins, so the
early-out bought nothing. Deleting it took homepage TBT from **242ms to 108ms** and the
score from 89 to 92.

**4. `motion` is gone entirely** — not just from the shared shell. It was still on four
of the homepage's fourteen sections, so every visitor paid ~79KB transferred and ~330ms
of script evaluation for what amounted to six fades, one height transition and one
scroll-linked line. Each was replaced with the platform equivalent:

| Was | Now |
|---|---|
| `AnimatePresence` crossfades (testimonials, form states, lightbox) | A changed React `key` plus a CSS entrance animation. No exit half — under `mode="wait"` the outgoing animation was pure latency before the content the user asked for appeared. |
| `useScroll` + `useSpring` + `useTransform` on the intake rail | `animation-timeline: view()`. `IntakeProcess` is now a server component with no client bundle at all. |
| `motion.div` height-auto accordion | `grid-template-rows: 0fr → 1fr`, the one height-to-content transition that works in every current browser. |
| `layout` + `popLayout` FLIP on the therapy filter | Native View Transitions — `view-transition-name` per card and `flushSync` inside `startViewTransition`, so the browser does the same FLIP on the compositor. |

The accordion change has a second benefit: closed panels stay in the DOM behind `inert`
instead of unmounting, so every FAQ answer is in the HTML for crawlers while staying out
of the tab order.

Also done earlier: third font family dropped (JetBrains Mono → platform mono stack,
−25KB), display face cut from four weights to two, Gaussian blur removed from the aurora
layers, and the hero particle canvas skipped on coarse pointers.

**And the embarrassing one:** the site was shipping `create-next-app`'s default
`favicon.ico` — 25.9KB of Vercel triangle in the browser tab of a client's website — with
`apple-touch-icon` pointing at a file that 404'd. Replaced with the IV League mark at
1.7KB, a real 180px Apple touch icon, and 192/512 PNGs (plus a maskable variant) in the
web manifest.

The homepage stays a couple of points behind the rest because its hero is genuinely the
heaviest thing on the site — a full-viewport composition with the drip chamber, aurora
and a 5.5rem headline. That's a deliberate trade, not an oversight.

## 5. Self-critique — what was generic, and what replaced it

The brief asked me to name anything I'd produce for any wellness clinic. Honestly:

**1. The Instagram section was gradient mush.** Nine blurred teal squares that read as
skeleton loaders, not content. *Replaced:* placeholder tiles are now designed post cards
— handle, headline, date, hairline rule — so the section is legible on day one and swaps
to real photography the moment a token is set. Same component, no rework.

**2. Radii were wellness-app soft.** 1.25rem on every card is the exact tell the brief
called out. *Replaced:* 0.625rem everywhere. Same components now read as instrument
housing.

**3. The hero visual was a whole IV bag.** Legible but literal, and small in frame —
generic medical clip-art at any size. *Replaced:* extreme macro on the chamber alone.
Cropping is what makes it a signature instead of an illustration.

**4. Section padding was 10rem and uniform.** Borrowed Aesop's air budget without Aesop's
editing. On a 14-section page it just produced 17,000px of scroll. *Fixed:* 4.5–7rem,
spent unevenly — the intake timeline and the hero keep their air, transitional sections
don't.

**5. The stat band is still the most generic thing here.** Four animated counters is a
2019 SaaS move. It stays because the numbers genuinely are the argument for this business
and putting them above the fold beats writing a paragraph — but if the practice supplies
real figures, this section should be rebuilt around one number, not four.

**Still outstanding, and honestly so:** the testimonials are placeholders, the interior
photography is placeholder art, and wellness pricing is `null`. All three are flagged in
`CONTENT-REVIEW.md` rather than invented.

---

## 6. What was deliberately left out

Following the references: no stock photography of a smiling woman in a recliner. No star
ratings in the hero. No "as seen in" logo bar. No countdown or urgency. No chat bubble.
No newsletter modal. No before/after imagery. No claims about outcomes.

No cookie banner either — the site sets no tracking cookies, so it doesn't need to
apologize for any.

## 7. AI search, and the writing

Two passes after the first build, both aimed at how the site reads rather than
how it looks.

### Answer engine optimization

People increasingly ask an assistant "where can I get an Ocrevus infusion near
Richmond" before they ask a search engine, and the practice was invisible to
that question. Five changes, all built from the existing content model so
nothing is invented:

**A standalone answer paragraph on all 53 clinical pages.** Answer engines quote
passages, not pages. Every detail page opened with a fragment written to sit
under a display headline ("A gut-selective biologic for ulcerative colitis"),
which carries nothing once it is lifted out of the layout. Each page now leads
with a self-contained 39-66 word paragraph naming the drug, its class, its
route, what it treats, appointment length, dosing schedule and the fact that an
order is required. Marked `speakable` for voice queries.

**Headings phrased the way patients type.** "Schedule & logistics" became "How
often is Entyvio given?"; "Understanding Crohn's Disease" became "What is
Crohn's Disease?". Same content, retrievable.

**Per-page FAQ, 5-7 questions each**, generated from the same fields the page
renders so the answers cannot contradict the page above them. This added ~4,400
words of crawlable content at no measurable performance cost, because the
accordion keeps closed answers in the HTML behind `inert` rather than
unmounting them.

**Schema.** `MedicalWebPage` with `lastReviewed` on every clinical page (the
strongest freshness signal for health content), `FAQPage` on 55 pages,
`ItemList` on the two directories, and stable `@id`s so the therapy and
condition entities resolve as the subject of their page.

**`/llms.txt` and an explicit crawler policy.** The llms.txt is generated from
the content model, so it cannot drift: practice facts, the full formulary with
chair times, every condition, the wellness menu, and a "Limits" section telling
a model not to present the clinical copy as individualized advice or to estimate
pricing. `robots.ts` names all thirteen AI crawlers and allows them, with the
reasoning in a comment. A blocked crawler cannot cite you.

One field is deliberately missing. `reviewedBy` is the single strongest E-E-A-T
signal available and it needs a named clinician with credentials. Inventing one
for a real medical practice is not a trade worth making for a ranking signal, so
it is a launch blocker in CONTENT-REVIEW.md instead.

### Removing the AI tells

Measured over 17,679 words of rendered prose across 17 routes.

The vocabulary was already clean: five hits total, no "delve", no "robust", no
"seamless". The tell was punctuation. **7.9 em dashes per 1,000 words against a
ceiling of 1** is the most recognizable machine-writing signature there is, and
211 of them were spliced through the patient copy. Roughly a quarter were a
single repeated shape: `imperative — justification`, over and over down every
"Living with it" list. The uniform rhythm was as much the tell as the dash.

Fixed per instance rather than by regex, and deliberately varied: parentheses
for appositives, colons where the gloss is a list, and a spread of periods,
semicolons and connectors for the rest. Swapping every dash for a semicolon
would have traded one tic for another. Now **zero**.

Three other edits. `genuinely` twice, cut. The 30 "X, Y and Z" triads turned out
to be genuine clinical lists (anatomy, complications, carriers) and were left
alone; only one was rhetorical. And the H1 was "Infusion care, elevated." —
`elevate` is a flagged word, "X, elevated" is the shape of every wellness
tagline written this decade, and it carried no keyword for a local practice. It
is now "Infusion care without the hospital", which is differentiating, true, and
the thing the insurance page spends 800 words explaining.

What was deliberately *not* edited: code comments, and the medical enumerations
above. Over-editing to satisfy a checker produces its own uniformity.
