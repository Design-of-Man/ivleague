/**
 * Conditions treated at IV League Infusions.
 *
 * `onCurrentSite: true` marks conditions already named on ivlinfusions.com.
 * Copy here is educational and general — diagnosis and treatment decisions
 * belong to the patient's prescribing physician.
 */

import { therapies, type SpecialtyId } from "./therapies";

export type Condition = {
  slug: string;
  name: string;
  /** Short label for chips and breadcrumbs */
  shortName?: string;
  specialty: SpecialtyId;
  onCurrentSite?: boolean;
  summary: string;
  overview: string;
  symptoms: string[];
  howInfusionHelps: string;
  /** Things patients most often ask about living with the diagnosis */
  livingWith: string[];
  featured?: boolean;
};

export const conditions: Condition[] = [
  {
    slug: "crohns-disease",
    name: "Crohn's Disease",
    specialty: "gastroenterology",
    onCurrentSite: true,
    featured: true,
    summary:
      "A chronic inflammatory bowel disease that can affect any part of the digestive tract, from mouth to anus.",
    overview:
      "Crohn's disease causes inflammation that extends through the full thickness of the bowel wall, often in patchy segments separated by healthy tissue. Left unchecked, that inflammation can lead to strictures, fistulas and abscesses. Biologic therapy has changed the trajectory of the disease for many patients by targeting the specific immune signals driving it rather than suppressing the immune system broadly.",
    symptoms: [
      "Persistent diarrhea, often with urgency",
      "Abdominal pain and cramping, frequently in the lower right quadrant",
      "Unintended weight loss and fatigue",
      "Blood in the stool",
      "Mouth sores, joint pain or skin lesions outside the gut",
    ],
    howInfusionHelps:
      "Infused biologics deliver a full, verified dose directly into the bloodstream on a fixed schedule: no missed injections, no absorption questions. Your gastroenterologist writes the order; we handle prior authorization, drug procurement and administration, then report back after every visit.",
    livingWith: [
      "Flares and remission are both normal, but a change in symptoms is worth a call to your GI rather than a wait-and-see",
      "Staying on schedule matters more than almost anything else with biologics; gaps in dosing can lead to antibodies against the drug",
      "Keep vaccinations current and talk to your physician before any live vaccine",
    ],
  },
  {
    slug: "ulcerative-colitis",
    name: "Ulcerative Colitis",
    specialty: "gastroenterology",
    onCurrentSite: true,
    featured: true,
    summary:
      "Continuous inflammation and ulceration of the colon's inner lining, beginning at the rectum.",
    overview:
      "Unlike Crohn's disease, ulcerative colitis is confined to the colon and affects only the innermost lining, spreading continuously rather than in patches. Disease extent (proctitis, left-sided colitis or pancolitis) shapes both symptoms and treatment. Biologic therapy is now first-line for many patients with moderate to severe disease.",
    symptoms: [
      "Bloody diarrhea and mucus in the stool",
      "Urgency and tenesmus, the feeling of incomplete evacuation",
      "Lower abdominal cramping relieved by a bowel movement",
      "Fatigue and anemia from ongoing blood loss",
      "Weight loss during flares",
    ],
    howInfusionHelps:
      "Infusion therapy targets the specific inflammatory pathways behind UC (TNF-α, integrin trafficking, IL-12/23 or IL-23) and can induce and maintain remission when oral therapy has stopped working. Consistent scheduling in a dedicated center means fewer missed doses and faster escalation when disease activity changes.",
    livingWith: [
      "Track your symptoms between visits; trend data helps your GI adjust therapy earlier",
      "Iron deficiency is common with ongoing blood loss and is often treatable with IV iron in the same chair",
      "Colonoscopic surveillance remains important even when you feel well",
    ],
  },
  {
    slug: "rheumatoid-arthritis",
    name: "Rheumatoid Arthritis",
    shortName: "RA",
    specialty: "rheumatology",
    onCurrentSite: true,
    featured: true,
    summary:
      "An autoimmune disease in which the immune system attacks the synovial lining of the joints.",
    overview:
      "Rheumatoid arthritis is symmetric and systemic. It typically starts in the small joints of the hands and feet and, untreated, erodes cartilage and bone within the first two years. Modern treat-to-target strategy aims for remission or low disease activity, and infused biologics are a central tool when methotrexate alone is not enough.",
    symptoms: [
      "Symmetric joint pain and swelling, usually hands, wrists and feet",
      "Morning stiffness lasting more than an hour",
      "Fatigue and low-grade fever",
      "Rheumatoid nodules under the skin",
      "Reduced grip strength and difficulty with fine motor tasks",
    ],
    howInfusionHelps:
      "Infused biologics (TNF inhibitors, IL-6 blockade, T-cell modulation, B-cell depletion) interrupt different points in the inflammatory cascade, giving your rheumatologist options when one mechanism stops working. Infusion also removes adherence from the equation: every dose is documented and delivered.",
    livingWith: [
      "Gentle, consistent movement protects joints better than rest during low disease activity",
      "Report new infections promptly, because biologic therapy raises infection risk",
      "Keep your rheumatologist and infusion team aligned on labs; we send reports after every visit",
    ],
  },
  {
    slug: "psoriatic-arthritis",
    name: "Psoriatic Arthritis",
    shortName: "PsA",
    specialty: "rheumatology",
    onCurrentSite: true,
    summary:
      "Inflammatory arthritis that develops in some people with psoriasis, affecting joints, tendons and skin.",
    overview:
      "Psoriatic arthritis is heterogeneous: it can present as a few swollen joints, a whole swollen finger or toe (dactylitis), inflammation where tendons insert into bone (enthesitis), spine involvement, or nail disease. Because it can be erosive, early recognition and systemic treatment matter.",
    symptoms: [
      "Joint pain and swelling, often asymmetric",
      "Sausage-like swelling of an entire finger or toe",
      "Heel or sole pain from enthesitis",
      "Nail pitting, ridging or separation from the nail bed",
      "Psoriasis plaques on the skin",
    ],
    howInfusionHelps:
      "Infused TNF inhibitors and T-cell modulators treat joint, entheseal and skin disease at once, which is why they are often chosen for patients with multi-domain involvement. Scheduled infusions also make it easier to measure response objectively over time.",
    livingWith: [
      "Skin and joint disease do not always flare together, so treat the whole picture",
      "Cardiovascular and metabolic screening is part of good PsA care",
      "Physical therapy for enthesitis pays real dividends",
    ],
  },
  {
    slug: "ankylosing-spondylitis",
    name: "Ankylosing Spondylitis",
    shortName: "AS",
    specialty: "rheumatology",
    onCurrentSite: true,
    summary:
      "An inflammatory arthritis of the spine and sacroiliac joints that can progressively fuse vertebrae.",
    overview:
      "Ankylosing spondylitis, part of the axial spondyloarthritis spectrum, usually begins before age 45 with inflammatory back pain that improves with movement and worsens with rest. Chronic inflammation can lead to new bone formation and, over years, spinal fusion. Anti-TNF therapy remains a cornerstone of treatment for patients who fail NSAIDs.",
    symptoms: [
      "Low back and buttock pain that improves with exercise, not rest",
      "Morning stiffness lasting over 30 minutes",
      "Pain that wakes you in the second half of the night",
      "Reduced spinal flexibility and chest expansion",
      "Eye inflammation (uveitis) in some patients",
    ],
    howInfusionHelps:
      "TNF inhibition reduces spinal inflammation, improves mobility and can slow radiographic progression. Delivered by infusion, dosing is precise and verified, which matters for a disease measured over decades rather than weeks.",
    livingWith: [
      "Posture and extension exercises are disease-modifying; do them daily",
      "Sudden eye pain or light sensitivity needs same-day ophthalmology attention",
      "Smoking accelerates spinal progression more in AS than in most conditions",
    ],
  },
  {
    slug: "plaque-psoriasis",
    name: "Plaque Psoriasis",
    specialty: "rheumatology",
    onCurrentSite: true,
    summary:
      "A chronic immune-mediated skin disease producing thick, scaly, well-demarcated plaques.",
    overview:
      "Plaque psoriasis results from accelerated keratinocyte turnover driven by an overactive IL-23/Th17 axis. It is a systemic inflammatory condition, not simply a skin problem, which is why it associates with arthritis, cardiovascular disease and metabolic syndrome.",
    symptoms: [
      "Raised, red plaques with silvery scale, commonly on elbows, knees and scalp",
      "Itching, burning or soreness",
      "Cracked skin that may bleed",
      "Nail changes",
      "Joint pain in up to a third of patients",
    ],
    howInfusionHelps:
      "For chronic severe plaque psoriasis, infused systemic therapy can clear skin substantially and treat coexisting joint disease at the same time. Infusion sidesteps the injection-site reactions some patients experience with self-administered biologics.",
    livingWith: [
      "Moisturize aggressively. Barrier care improves the effect of systemic therapy",
      "Screen for joint symptoms at every visit; PsA can be silent early",
      "Ask your physician about cardiovascular risk screening",
    ],
  },
  {
    slug: "multiple-sclerosis",
    name: "Multiple Sclerosis",
    shortName: "MS",
    specialty: "neurology",
    onCurrentSite: true,
    featured: true,
    summary:
      "An immune-mediated disease in which the body attacks the myelin sheath insulating nerve fibers.",
    overview:
      "In multiple sclerosis the immune system damages myelin in the brain, spinal cord and optic nerves, disrupting signal conduction. Disease-modifying therapy is now started early and pushed hard, because preventing relapses and new lesions is far more effective than treating accumulated disability later.",
    symptoms: [
      "Numbness, tingling or weakness, often on one side",
      "Vision changes including optic neuritis and double vision",
      "Fatigue disproportionate to activity",
      "Balance and coordination difficulty",
      "Heat sensitivity that temporarily worsens symptoms",
    ],
    howInfusionHelps:
      "High-efficacy infused disease-modifying therapies (anti-CD20 antibodies and integrin blockers) meaningfully reduce relapse rate and new MRI lesion activity. Receiving them in an outpatient suite rather than a hospital infusion floor makes a twice-yearly or monthly commitment far easier to keep.",
    livingWith: [
      "Cooling strategies help heat-related symptom flares",
      "Stay current on MRI surveillance even when you feel stable",
      "Tell your neurologist about new symptoms lasting more than 24 hours",
    ],
  },
  {
    slug: "severe-and-allergic-asthma",
    name: "Severe & Allergic Asthma",
    specialty: "allergy-asthma",
    onCurrentSite: true,
    featured: true,
    summary:
      "Asthma that stays uncontrolled despite high-dose inhaled therapy, often driven by allergic or eosinophilic inflammation.",
    overview:
      "Severe asthma is defined by what it takes to control it. When high-dose inhaled corticosteroids plus a second controller aren't enough, or when control requires repeated oral steroid courses, biologic therapy targeted to your inflammatory phenotype can dramatically reduce exacerbations and steroid exposure.",
    symptoms: [
      "Frequent exacerbations requiring oral steroids",
      "Daily or nighttime symptoms despite controller therapy",
      "Reliance on rescue inhalers more than twice a week",
      "Reduced lung function on spirometry",
      "Missed work or school from breathing symptoms",
    ],
    howInfusionHelps:
      "Phenotype-matched biologics (anti-IgE, anti-IL-5, anti-IL-5R, anti-TSLP) are administered here on a fixed schedule with the observation period anaphylaxis precautions require. That's safer than home administration for many patients and removes the burden of remembering.",
    livingWith: [
      "Keep an up-to-date asthma action plan and bring it to every visit",
      "Biologics reduce exacerbations; they do not replace your controller inhaler",
      "Track peak flow or symptom scores so response can be measured objectively",
    ],
  },
  {
    slug: "primary-immunodeficiency",
    name: "Primary & Secondary Immunodeficiency",
    shortName: "Immunodeficiency",
    specialty: "immunology",
    onCurrentSite: true,
    featured: true,
    summary:
      "Inherited or acquired conditions in which the body cannot produce enough functional antibodies.",
    overview:
      "Primary immunodeficiencies are genetic disorders of immune function; secondary immunodeficiencies develop from another cause: chronic lymphocytic leukemia, multiple myeloma, certain medications or B-cell depleting therapy. Both can leave patients vulnerable to repeated sinopulmonary infections. Immune globulin replacement restores the missing antibody pool.",
    symptoms: [
      "Recurrent sinus, ear or lung infections",
      "Infections that need IV antibiotics or take unusually long to clear",
      "Bronchiectasis from repeated pulmonary infection",
      "Chronic diarrhea or unexplained weight loss",
      "Family history of immune deficiency",
    ],
    howInfusionHelps:
      "IVIG supplies pooled immunoglobulin G from thousands of screened donors, giving you a working antibody repertoire until the next dose. Trough levels and infection frequency guide dosing, and infusing in-center lets nurses titrate rate carefully to prevent headache and other rate-related effects.",
    livingWith: [
      "Hydration before and after IVIG is the single most effective way to prevent post-infusion headache",
      "Report every infection, since the pattern drives dose adjustment",
      "Keep a record of your trough IgG levels over time",
    ],
  },
  {
    slug: "cidp",
    name: "Chronic Inflammatory Demyelinating Polyneuropathy",
    shortName: "CIDP",
    specialty: "immunology",
    summary:
      "A treatable autoimmune neuropathy causing progressive weakness and sensory loss in the arms and legs.",
    overview:
      "CIDP is the chronic counterpart of Guillain-Barré syndrome. The immune system attacks peripheral nerve myelin, producing symmetric weakness that develops over more than eight weeks. It is one of the few neuropathies that responds well to treatment, which makes recognizing it important.",
    symptoms: [
      "Progressive symmetric weakness in arms and legs",
      "Numbness or tingling in hands and feet",
      "Loss of deep tendon reflexes",
      "Difficulty climbing stairs or rising from a chair",
      "Unsteady gait",
    ],
    howInfusionHelps:
      "IVIG is a first-line therapy for CIDP and can produce measurable improvement in strength and function. Because response often depends on maintaining a consistent interval, a dedicated infusion schedule matters.",
    livingWith: [
      "Track functional milestones (stairs, grip, walking distance), not just how you feel",
      "Discuss interval adjustments with your neurologist if symptoms return before the next dose",
      "Physical therapy amplifies the benefit of immunotherapy",
    ],
  },
  {
    slug: "immune-thrombocytopenia",
    name: "Immune Thrombocytopenia",
    shortName: "ITP",
    specialty: "immunology",
    summary:
      "An autoimmune condition in which platelets are destroyed faster than the body can replace them.",
    overview:
      "In ITP, autoantibodies mark platelets for destruction in the spleen while also impairing platelet production. Treatment is driven by bleeding risk and platelet count rather than the number alone, and IVIG can raise counts quickly when a rapid response is needed.",
    symptoms: [
      "Easy bruising and pinpoint red spots (petechiae)",
      "Prolonged bleeding from small cuts",
      "Nosebleeds or bleeding gums",
      "Heavy menstrual bleeding",
      "Fatigue",
    ],
    howInfusionHelps:
      "IVIG temporarily blocks the receptors the spleen uses to clear antibody-coated platelets, producing a rapid rise in platelet count, which is useful before procedures or during active bleeding.",
    livingWith: [
      "Avoid NSAIDs and aspirin unless your hematologist approves",
      "Know your most recent platelet count before any dental or surgical procedure",
      "Report any headache after a head injury immediately",
    ],
  },
  {
    slug: "lupus",
    name: "Systemic Lupus Erythematosus",
    shortName: "Lupus",
    specialty: "rheumatology",
    summary:
      "A multi-system autoimmune disease that can affect skin, joints, kidneys, blood and the nervous system.",
    overview:
      "Lupus is defined by its variability. Autoantibodies form immune complexes that deposit in tissue and drive inflammation almost anywhere in the body. Management aims to control disease activity while minimizing lifetime steroid exposure, a goal targeted biologics have made more achievable.",
    symptoms: [
      "Joint pain and swelling",
      "Malar (butterfly) rash and photosensitivity",
      "Profound fatigue",
      "Mouth ulcers and hair loss",
      "Kidney involvement detected on urine testing",
    ],
    howInfusionHelps:
      "Belimumab reduces the survival signal for autoreactive B-cells, lowering disease activity and, for many patients, allowing steroid tapering. Monthly infusion also creates a regular clinical touchpoint where changes get caught early.",
    livingWith: [
      "Sun protection is treatment, not cosmetics",
      "Steroid-sparing is a legitimate treatment goal, so ask about it",
      "Routine urine protein checks catch kidney involvement before symptoms",
    ],
  },
  {
    slug: "giant-cell-arteritis",
    name: "Giant Cell Arteritis",
    shortName: "GCA",
    specialty: "rheumatology",
    summary:
      "Inflammation of medium and large arteries, most often the temporal arteries, that threatens vision if untreated.",
    overview:
      "Giant cell arteritis is a medical urgency. Inflammation of the arterial wall can occlude the ophthalmic artery and cause sudden, permanent vision loss. High-dose steroids are started immediately on suspicion; IL-6 blockade has since become a key steroid-sparing partner.",
    symptoms: [
      "New headache, often over the temple",
      "Scalp tenderness",
      "Jaw pain when chewing",
      "Vision changes or transient vision loss",
      "Shoulder and hip girdle stiffness (polymyalgia rheumatica)",
    ],
    howInfusionHelps:
      "Tocilizumab blocks IL-6 signalling, a central driver of GCA, and allows faster steroid tapering than steroids alone, which meaningfully reduces the cumulative toxicity of long-term prednisone.",
    livingWith: [
      "Any new vision change is an emergency. Do not wait for your next appointment",
      "Bone protection matters while you're on steroids",
      "Keep a steroid taper card with you",
    ],
  },
  {
    slug: "vasculitis",
    name: "ANCA-Associated Vasculitis",
    shortName: "Vasculitis",
    specialty: "rheumatology",
    summary:
      "Inflammation of small blood vessels that can affect the sinuses, lungs, kidneys and nerves.",
    overview:
      "Granulomatosis with polyangiitis and microscopic polyangiitis are ANCA-associated vasculitides: autoimmune diseases in which antibodies against neutrophil components drive small-vessel inflammation. Rituximab has become a mainstay for both remission induction and maintenance.",
    symptoms: [
      "Chronic sinus symptoms, crusting or nosebleeds",
      "Cough, shortness of breath or coughing blood",
      "Blood or protein in the urine",
      "Numbness or foot drop from nerve involvement",
      "Fever, weight loss and fatigue",
    ],
    howInfusionHelps:
      "B-cell depletion with rituximab induces and maintains remission in ANCA-associated vasculitis with less cumulative cyclophosphamide exposure. Scheduled maintenance infusions keep patients in remission over years.",
    livingWith: [
      "Monitor urine and kidney function on the schedule your nephrologist sets",
      "Report new sinus or pulmonary symptoms early, because relapse is treatable when caught",
      "Infection prophylaxis is often part of the plan; take it as prescribed",
    ],
  },
  {
    slug: "chronic-gout",
    name: "Chronic Refractory Gout",
    shortName: "Gout",
    specialty: "rheumatology",
    summary:
      "Gout that continues to flare and deposit tophi despite maximal oral urate-lowering therapy.",
    overview:
      "Most gout responds to allopurinol or febuxostat. A minority does not. Uric acid stays elevated, flares continue, and tophi accumulate in joints and soft tissue, causing erosion and disability. For those patients, enzymatic uric acid degradation is a different order of treatment.",
    symptoms: [
      "Recurrent, severe joint flares despite oral therapy",
      "Visible tophi on hands, elbows, ears or feet",
      "Persistent joint pain between flares",
      "Joint damage visible on imaging",
      "Serum uric acid that stays above target",
    ],
    howInfusionHelps:
      "Pegloticase converts uric acid into allantoin, dramatically lowering serum urate and dissolving tophi that oral therapy cannot reach. It requires structured monitoring, which is exactly what a dedicated infusion suite provides.",
    livingWith: [
      "Flares often increase early in therapy as tophi mobilize; this is expected, not failure",
      "Prophylactic anti-inflammatory therapy is usually prescribed alongside",
      "Uric acid is checked before every dose",
    ],
  },
  {
    slug: "chronic-migraine",
    name: "Chronic Migraine",
    specialty: "neurology",
    summary:
      "Fifteen or more headache days a month, at least eight of which have migraine features.",
    overview:
      "Chronic migraine is a distinct diagnosis, not just frequent headaches. It carries higher disability than most chronic conditions and responds to preventive therapy aimed at the CGRP pathway. IV preventive dosing produces immediate peak levels rather than the gradual onset of subcutaneous administration.",
    symptoms: [
      "Headache on 15 or more days per month",
      "Throbbing, often one-sided pain",
      "Nausea, light and sound sensitivity",
      "Aura in some patients",
      "Escalating use of acute medication",
    ],
    howInfusionHelps:
      "Quarterly CGRP infusion is one of the lowest-burden preventive options available: four visits a year, thirty minutes each. We keep the lights low and the room quiet for migraine patients.",
    livingWith: [
      "Limit acute medication to avoid medication-overuse headache",
      "Keep a simple headache diary; it's the clearest evidence of response",
      "Sleep regularity is one of the strongest modifiable triggers",
    ],
  },
  {
    slug: "osteoporosis",
    name: "Osteoporosis",
    specialty: "bone-health",
    summary:
      "Loss of bone density and quality that raises the risk of fracture from minor trauma.",
    overview:
      "Osteoporosis is silent until a fracture occurs, and the first fracture sharply raises the risk of the next. Treatment selection depends on fracture risk, kidney function and prior therapy, with IV and injectable options available for patients who cannot tolerate oral bisphosphonates.",
    symptoms: [
      "Fracture from a fall at standing height or less",
      "Loss of height over time",
      "Stooped posture",
      "Back pain from vertebral compression fracture",
      "Low T-score on DEXA scan",
    ],
    howInfusionHelps:
      "A once-yearly infusion or twice-yearly injection eliminates the daily-pill adherence problem entirely, and avoids the esophageal irritation that makes oral bisphosphonates hard to tolerate for many patients.",
    livingWith: [
      "Calcium and vitamin D are prerequisites, not optional add-ons",
      "Do not stop denosumab without a transition plan. Rebound bone loss is real",
      "Weight-bearing exercise and fall prevention are part of treatment",
    ],
  },
  {
    slug: "iron-deficiency-anemia",
    name: "Iron Deficiency Anemia",
    specialty: "bone-health",
    summary:
      "Low hemoglobin from inadequate iron stores, the most common nutritional deficiency worldwide.",
    overview:
      "Iron deficiency causes fatigue long before hemoglobin drops enough to be called anemia. Oral iron is poorly absorbed and often poorly tolerated, and in patients with inflammatory bowel disease, chronic kidney disease, heavy menstrual bleeding or heart failure, IV repletion is both faster and more reliable.",
    symptoms: [
      "Fatigue and reduced exercise tolerance",
      "Shortness of breath with exertion",
      "Pale skin, brittle nails, hair shedding",
      "Restless legs at night",
      "Craving ice or non-food substances",
    ],
    howInfusionHelps:
      "IV iron bypasses the gut entirely. Most patients complete repletion in one or two short visits and feel the difference within weeks, without the constipation and nausea that make oral iron so hard to stay on.",
    livingWith: [
      "Find and treat the source of the loss; repletion alone isn't a plan",
      "Recheck iron studies a few weeks after your last dose",
      "Ferritin below 30 ng/mL means deficiency even with normal hemoglobin",
    ],
  },
  {
    slug: "thyroid-eye-disease",
    name: "Thyroid Eye Disease",
    shortName: "TED",
    specialty: "endocrinology",
    summary:
      "An autoimmune inflammation of the tissues behind the eye, most often associated with Graves' disease.",
    overview:
      "Thyroid eye disease causes the muscles and fat behind the eye to expand, pushing the eye forward. There is an active inflammatory phase, typically 6 to 24 months, during which treatment can meaningfully change the outcome, followed by a stable phase in which only surgery helps.",
    symptoms: [
      "Bulging eyes (proptosis)",
      "Double vision",
      "Eye pain, pressure or grittiness",
      "Redness and swelling of the lids and conjunctiva",
      "Difficulty closing the eyes fully",
    ],
    howInfusionHelps:
      "Teprotumumab targets the IGF-1 receptor pathway that drives orbital tissue expansion. Given as eight infusions over roughly six months, it can reduce proptosis and double vision during the active phase.",
    livingWith: [
      "Stopping smoking has one of the largest effects on TED outcomes of any intervention",
      "Treat the thyroid disease and the eye disease in parallel",
      "Report any sudden change in color vision urgently",
    ],
  },
  {
    slug: "chronic-urticaria",
    name: "Chronic Spontaneous Urticaria",
    shortName: "Chronic Hives",
    specialty: "allergy-asthma",
    summary:
      "Recurrent hives lasting more than six weeks without an identifiable external trigger.",
    overview:
      "Chronic spontaneous urticaria is driven by mast cell activation, often through autoimmune mechanisms. Antihistamines at up to four times the standard dose are first-line; when they fail, anti-IgE therapy is the established next step.",
    symptoms: [
      "Itchy welts appearing and resolving within 24 hours",
      "Deeper swelling of lips, eyelids or hands (angioedema)",
      "Symptoms worse in the evening or overnight",
      "Flares with heat, pressure or stress",
      "Sleep disruption from itching",
    ],
    howInfusionHelps:
      "Omalizumab reduces free IgE and, over weeks, downregulates mast cell reactivity. Administering it in-center provides the observation window anaphylaxis precautions call for.",
    livingWith: [
      "Keep taking your antihistamine as prescribed even after biologic therapy starts",
      "Photograph flares. The pattern helps your allergist",
      "Most patients eventually remit; this is usually not permanent",
    ],
  },
  {
    slug: "serious-infection",
    name: "Infections Requiring IV Therapy",
    shortName: "IV Antibiotics",
    specialty: "infectious-disease",
    onCurrentSite: true,
    summary:
      "Bone, joint, skin, bloodstream and other infections needing a course of intravenous anti-infectives.",
    overview:
      "Some infections need weeks of IV antibiotics but not weeks in a hospital bed. Outpatient parenteral antimicrobial therapy delivers the same drug, dose and monitoring in a comfortable outpatient suite, with the infection specialist directing therapy and labs tracked throughout.",
    symptoms: [
      "An infection diagnosed as requiring intravenous rather than oral therapy",
      "Bone or joint infection following surgery or injury",
      "Cellulitis not responding to oral antibiotics",
      "Bloodstream infection requiring step-down therapy after discharge",
      "Complicated urinary or intra-abdominal infection",
    ],
    howInfusionHelps:
      "You sleep at home and keep working where you can, while receiving full-strength therapy on schedule. Line care, weekly labs and direct reporting to your infectious disease physician are built into every visit.",
    livingWith: [
      "Protect your line: keep the dressing dry and call immediately about redness or fever",
      "Do not skip doses at the end of a course. Relapse risk is real",
      "Weekly labs catch drug toxicity before it becomes a problem",
    ],
  },
  {
    slug: "dehydration",
    name: "Dehydration & Fluid Support",
    specialty: "infectious-disease",
    summary:
      "Physician-ordered IV fluid replacement for illness, malabsorption or chronic fluid needs.",
    overview:
      "When oral intake cannot keep up (hyperemesis, gastroenteritis, malabsorption, dysautonomia, post-operative losses), scheduled IV fluid support restores volume and electrolytes reliably and quickly.",
    symptoms: [
      "Persistent nausea and vomiting",
      "Lightheadedness on standing",
      "Reduced urine output and dark urine",
      "Fatigue and headache",
      "Electrolyte abnormalities on labs",
    ],
    howInfusionHelps:
      "Balanced crystalloid, dosed and paced to your physician's orders, restores intravascular volume immediately. Chronic conditions requiring recurring fluid support can be scheduled into a standing weekly slot.",
    livingWith: [
      "Track your weight; it is the most sensitive daily marker of fluid status",
      "Oral rehydration between visits still matters",
      "Report worsening orthostatic symptoms to your physician",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  SELECTORS                                  */
/* -------------------------------------------------------------------------- */

export const conditionBySlug = (slug: string) =>
  conditions.find((c) => c.slug === slug);

export const featuredConditions = () => conditions.filter((c) => c.featured);

/** Therapies whose `conditions` array includes this condition slug. */
export const therapiesForCondition = (slug: string) =>
  therapies.filter((t) => t.conditions.includes(slug));

/** Conditions referenced by a therapy, resolved to full objects. */
export const conditionsForTherapy = (slugs: readonly string[]) =>
  slugs
    .map((s) => conditions.find((c) => c.slug === s))
    .filter((c): c is Condition => Boolean(c));

export const conditionCount = conditions.length;
