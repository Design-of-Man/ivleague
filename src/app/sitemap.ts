import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { therapies } from "@/content/therapies";
import { conditions } from "@/content/conditions";
import { legalDocs } from "@/content/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/therapies", priority: 0.9, changeFrequency: "weekly" },
    { path: "/conditions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/wellness", priority: 0.8, changeFrequency: "monthly" },
    { path: "/patients", priority: 0.8, changeFrequency: "monthly" },
    { path: "/patients/faq", priority: 0.75, changeFrequency: "monthly" },
    { path: "/insurance", priority: 0.8, changeFrequency: "monthly" },
    { path: "/providers", priority: 0.75, changeFrequency: "monthly" },
    { path: "/suite", priority: 0.65, changeFrequency: "monthly" },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path === "/" ? "" : r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...therapies.map((t) => ({
      url: `${base}/therapies/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...conditions.map((c) => ({
      url: `${base}/conditions/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...legalDocs.map((d) => ({
      url: `${base}/legal/${d.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
