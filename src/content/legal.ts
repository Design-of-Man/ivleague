/**
 * Legal page content.
 *
 * ⚠️ THESE ARE TEMPLATES, NOT LEGAL ADVICE. They cover the structure a
 * healthcare practice site normally needs, with IV League's specifics filled
 * in. They MUST be reviewed by the practice's counsel and privacy officer
 * before launch — particularly the HIPAA Notice of Privacy Practices, which
 * has content requirements set by 45 CFR § 164.520. See CONTENT-REVIEW.md.
 */

import { site } from "./site";

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
};

const EFFECTIVE = "August 1, 2026";

export const legalDocs: LegalDoc[] = [
  /* ------------------------------ PRIVACY -------------------------------- */
  {
    slug: "privacy",
    title: "Website Privacy Policy",
    description:
      "How IV League Infusions collects, uses and protects information submitted through this website.",
    updated: EFFECTIVE,
    intro:
      "This policy explains what information this website collects, how it is used, and the choices available to you. It covers the website only. Protected health information created or maintained in the course of your care is governed separately by our Notice of Privacy Practices.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect information you choose to give us and a limited amount of technical information collected automatically when you visit.",
        ],
        list: [
          "Information you submit: name, email address, phone number, and any diagnosis, prescriber, insurance or free-text detail you enter into the new patient inquiry form.",
          "Technical information: IP address, browser type, device type, referring page and pages viewed, collected in server logs and any analytics we operate.",
          "Communications: the content of emails, texts or voicemails you send us.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use the information you submit to respond to your inquiry, contact your prescribing physician for orders, verify your insurance benefits, and coordinate your care. We use technical information to keep the site secure, diagnose problems and understand which pages are useful.",
          "We do not sell your information. We do not share it with advertisers.",
        ],
      },
      {
        heading: "Website forms are not a secure channel",
        body: [
          "Email and web forms are not encrypted end to end and are not an appropriate channel for detailed medical information. Please do not submit clinical detail beyond what the form asks for. If you need to send us clinical records, call us and we will give you a secure route.",
        ],
      },
      {
        heading: "Service providers",
        body: [
          "We use third parties to operate this site — hosting, email delivery, and any analytics or social media embeds. These providers process information only as needed to provide their service. Where a provider may handle protected health information on our behalf, we require a business associate agreement.",
        ],
      },
      {
        heading: "Cookies and tracking",
        body: [
          "This site uses only the cookies necessary to serve pages and remember your preferences. If we add analytics or advertising technology in the future, this policy will be updated and, where required, we will ask for your consent first.",
          "Most browsers let you refuse cookies. Doing so will not prevent you from using this site.",
        ],
      },
      {
        heading: "Data retention",
        body: [
          "Inquiry submissions are retained for as long as needed to respond and, where you become a patient, for the period required by Virginia medical records law and applicable federal requirements. Server logs are retained for a limited period for security purposes.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can ask us to stop contacting you at any time by replying to any message or calling the office. You can ask what information we hold about you and request correction of anything inaccurate.",
        ],
      },
      {
        heading: "Children",
        body: [
          "This website is directed to adults. We do not knowingly collect information from children under 13 through this site.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "We may update this policy. The effective date at the top of this page reflects the most recent revision. Material changes will be highlighted on this page.",
        ],
      },
      {
        heading: "Contact us",
        body: [
          `Questions about this policy can be directed to ${site.legalName}, ${site.address.full}, by phone at ${site.contact.phone}, or by email at ${site.contact.email}.`,
        ],
      },
    ],
  },

  /* -------------------------------- HIPAA -------------------------------- */
  {
    slug: "hipaa",
    title: "Notice of Privacy Practices",
    description:
      "How IV League Infusions may use and disclose your protected health information, and your rights regarding that information.",
    updated: EFFECTIVE,
    intro:
      "THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY. We are required by law to maintain the privacy of your protected health information, to give you this notice of our legal duties and privacy practices, and to follow the terms of the notice currently in effect.",
    sections: [
      {
        heading: "How we may use and disclose your health information",
        body: [
          "We may use and disclose your protected health information without your written authorization for the following purposes:",
        ],
        list: [
          "Treatment — to provide, coordinate or manage your care, including sharing information with your prescribing physician, referring providers, pharmacies and laboratories.",
          "Payment — to obtain prior authorization, verify benefits, bill your health plan and collect payment for services.",
          "Health care operations — for quality assessment, staff training, licensing, accreditation, business planning and administration.",
          "As required by law — including public health reporting, reporting suspected abuse or neglect, health oversight activities, judicial and administrative proceedings, and law enforcement purposes as permitted by law.",
          "To avert a serious threat to health or safety.",
          "Appointment reminders and treatment alternatives — including calls, texts and emails about scheduled infusions.",
        ],
      },
      {
        heading: "Uses that require your written authorization",
        body: [
          "Most uses and disclosures of psychotherapy notes, uses and disclosures for marketing purposes, and any sale of protected health information require your written authorization. You may revoke an authorization in writing at any time, except to the extent we have already acted in reliance on it.",
        ],
      },
      {
        heading: "Your rights",
        body: ["You have the following rights regarding your health information:"],
        list: [
          "Right to inspect and copy — you may request access to your records, including an electronic copy where we maintain them electronically.",
          "Right to amend — you may request a correction to information you believe is incorrect or incomplete.",
          "Right to an accounting of disclosures — a list of certain disclosures we have made.",
          "Right to request restrictions — you may ask us to limit certain uses or disclosures. We are required to agree to a request to restrict disclosure to a health plan for a service you paid for in full out of pocket.",
          "Right to confidential communications — you may ask us to contact you at a specific number or address.",
          "Right to a paper copy of this notice — available on request, even if you agreed to receive it electronically.",
          "Right to be notified of a breach of unsecured protected health information.",
        ],
      },
      {
        heading: "How to exercise your rights or file a complaint",
        body: [
          `To exercise any right described above, contact our Privacy Officer at ${site.legalName}, ${site.address.full}, or call ${site.contact.phone}.`,
          "If you believe your privacy rights have been violated, you may file a complaint with us or with the Secretary of the U.S. Department of Health and Human Services, Office for Civil Rights. You will not be retaliated against for filing a complaint.",
        ],
      },
      {
        heading: "Changes to this notice",
        body: [
          "We reserve the right to change this notice and to make the revised notice effective for health information we already have as well as any information we receive in the future. A current copy is posted in our office and on this page.",
        ],
      },
    ],
  },

  /* -------------------------------- TERMS -------------------------------- */
  {
    slug: "terms",
    title: "Terms of Use",
    description:
      "The terms governing your use of the IV League Infusions website.",
    updated: EFFECTIVE,
    intro:
      "By accessing or using this website you agree to these terms. If you do not agree, please do not use the site.",
    sections: [
      {
        heading: "Not medical advice",
        body: [
          "The content on this site is educational and general in nature. It is not medical advice, does not create a physician-patient relationship, and is not a substitute for consultation with a qualified healthcare professional. Never disregard professional medical advice or delay seeking it because of something you read here.",
          "If you think you may have a medical emergency, call 911 or go to the nearest emergency department immediately.",
        ],
      },
      {
        heading: "Therapy and condition information",
        body: [
          "Descriptions of medications, therapies and conditions are simplified summaries provided for orientation only. Indications, dosing, infusion durations and schedules vary by patient and are determined solely by your prescribing physician. Listing a therapy on this site is not an offer to provide it, a representation that it is appropriate for you, or a guarantee of availability.",
          "Brand names and trademarks referenced on this site belong to their respective owners. Their use here is descriptive and does not imply endorsement by, or affiliation with, those owners.",
        ],
      },
      {
        heading: "No guarantee of coverage or outcome",
        body: [
          "Insurance information on this site describes plans we generally accept. Network participation, benefits and prior authorization requirements vary by plan, product line and employer group, and change over time. Nothing here is a guarantee of coverage or of a specific out-of-pocket amount.",
          "Individual results from any therapy vary. No outcome is promised or guaranteed.",
        ],
      },
      {
        heading: "Wellness services",
        body: [
          "Statements regarding wellness and regenerative infusions have not been evaluated by the Food and Drug Administration. These services are not intended to diagnose, treat, cure or prevent any disease.",
        ],
      },
      {
        heading: "Website use",
        body: [
          "You agree not to use this site to transmit unlawful content, attempt unauthorized access, interfere with its operation, or scrape it by automated means without permission. Content on this site is owned by us or our licensors and may not be reproduced commercially without written permission.",
        ],
      },
      {
        heading: "Third-party links",
        body: [
          "We link to third-party sites, including social media and mapping services, for convenience. We do not control and are not responsible for their content or privacy practices.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "This site is provided on an \"as is\" basis without warranties of any kind. To the fullest extent permitted by law, we disclaim liability for any damages arising from your use of, or inability to use, this site or its content.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the Commonwealth of Virginia, without regard to conflict of law principles.",
        ],
      },
    ],
  },

  /* ---------------------------- ACCESSIBILITY ---------------------------- */
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description:
      "Our commitment to making this website and our infusion center usable by everyone.",
    updated: EFFECTIVE,
    intro:
      "IV League Infusions is committed to making both our physical center and this website accessible to people with disabilities. Accessibility is not a compliance exercise for us — a meaningful share of our patients live with mobility, vision, fatigue and cognitive challenges as part of the conditions we treat.",
    sections: [
      {
        heading: "What we've done on this site",
        body: ["This site was built with the following in mind:"],
        list: [
          "Semantic HTML structure with a logical heading hierarchy and landmark regions.",
          "Keyboard operability throughout, including a skip-to-content link and visible focus indicators.",
          "Color contrast targeting WCAG 2.1 Level AA for text and interactive elements.",
          "Full support for the prefers-reduced-motion setting — all animation is suppressed when your system requests it.",
          "Descriptive text alternatives for meaningful images, and decorative graphics hidden from assistive technology.",
          "Form fields with programmatically associated labels, hints and error messages.",
          "Text that reflows without horizontal scrolling at 320px width and remains readable when zoomed to 200%.",
        ],
      },
      {
        heading: "In the center",
        body: [
          "Our entrance is step-free with free parking directly at the door. Suites accommodate wheelchairs and walkers, our recliners are electric lift chairs that assist you in standing, and every suite has seating for a companion or caregiver.",
          "If you need an accommodation for your visit — an interpreter, extra time, a quiet or low-light suite, or assistance with mobility — tell us when you schedule and we will arrange it.",
        ],
      },
      {
        heading: "Ongoing work",
        body: [
          "Accessibility is continuous. We test with keyboard navigation and screen readers, and we fix issues as we find them. Some third-party embedded content, such as maps and social media feeds, is outside our direct control; where it presents a barrier, we provide an accessible alternative.",
        ],
      },
      {
        heading: "Tell us about a barrier",
        body: [
          `If any part of this site or our center is difficult for you to use, we want to hear about it. Call ${site.contact.phone} or email ${site.contact.email} and describe the problem and the page or area involved. We will respond and, where we can, provide the information you need in another format while we fix it.`,
        ],
      },
    ],
  },
];

export const legalBySlug = (slug: string) =>
  legalDocs.find((d) => d.slug === slug);
