import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Every AI search crawler is allowed, deliberately.
 *
 * A blocked crawler cannot cite you. For a single-location practice whose
 * patients increasingly ask an assistant "where can I get an Ocrevus infusion
 * near Richmond" before they ask a search engine, being absent from those
 * answers is the expensive outcome, and there is nothing on this site worth
 * withholding: it is all public patient-education copy.
 *
 * They are named individually rather than left to the `*` rule so that the
 * decision is visible in the file. If the practice ever wants to opt out of a
 * specific engine, the line to change is right here.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — ChatGPT training
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — user-initiated browsing
  "ClaudeBot", // Anthropic — Claude
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "Google-Extended", // Gemini + AI Overviews grounding
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", // Copilot, via Bing
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The inquiry endpoint accepts patient-entered data. Nothing to index,
        // and it should never be crawled.
        disallow: ["/api/"],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
