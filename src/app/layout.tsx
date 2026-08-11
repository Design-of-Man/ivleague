import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import {
  ScrollProgress,
  StickyCta,
  BackToTop,
} from "@/components/layout/Chrome";
import { JsonLd } from "@/components/ui/Bits";
import { medicalBusinessSchema, webSiteSchema } from "@/lib/seo";
import { site } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Only the two weights actually used. Every extra weight is a separate woff2
// on the critical path, and the display face gates LCP.
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  // `optional`, not `swap`, because the H1 is the LCP element. With `swap` the
  // headline paints in the fallback and then repaints when Sora lands, which
  // re-fires LCP seconds later on a slow connection. With `optional` the first
  // uncached paint uses next/font's metric-matched fallback (zero layout
  // shift) and Sora is used from the next navigation on, once it is cached.
  display: "optional",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Outpatient Infusion Center in ${site.address.city}, ${site.address.region}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "Health",
  keywords: [
    "infusion center Delray Beach FL",
    "IV infusion therapy Palm Beach County",
    "biologic infusion Florida",
    "IVIG Delray Beach",
    "Entyvio infusion Palm Beach County",
    "Remicade infusion Florida",
    "Ocrevus infusion Delray Beach",
    "IV iron infusion Palm Beach County",
    "IV vitamin therapy Delray Beach",
    "outpatient infusion center Palm Beach County",
  ],
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  icons: {
    // SVG first so modern browsers take the vector; the ICO is the fallback
    // for older ones and for the crawlers that request /favicon.ico blind.
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32 16x16" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#04070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Scroll reveals start hidden and are unhidden by an IntersectionObserver.
          With JS disabled that observer never runs, so unhide everything.
        */}
        <noscript>
          <style>{`.reveal,.stagger>*{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain min-h-dvh bg-ink-950 antialiased">
        {/*
          Decides, before the hero paints, whether the phone intro runs. It has
          to happen here and not in the component: React hydrates long after
          first paint, and briefly showing the headline and then hiding it is
          worse than never hiding it.

          Everything about it fails toward the copy being visible. No JS and the
          attribute is never set. A throw anywhere — sessionStorage is
          unavailable in some privacy modes — leaves it unset. And it removes
          itself on a timer, so a hydration failure cannot strand the headline
          at opacity 0.

          Kept in sync with `.hero-copy` in globals.css and the `intro` state in
          ScrollHero. The 1023px cutoff is Tailwind's `lg` breakpoint minus one.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{" +
              'if(location.pathname!=="/")return;' +
              "var r=document.documentElement,m=window.matchMedia;" +
              'if(!m("(max-width:1023px)").matches)return;' +
              'if(m("(prefers-reduced-motion: reduce)").matches)return;' +
              "var c=navigator.connection;" +
              'if(c&&(c.saveData||/^(slow-)?2g$|^3g$/.test(c.effectiveType||"")))return;' +
              'if(sessionStorage.getItem("ivl-hero-intro")==="seen")return;' +
              'r.setAttribute("data-hero-intro","run");' +
              'setTimeout(function(){r.removeAttribute("data-hero-intro")},9000);' +
              "}catch(e){}})()",
          }}
        />
        <JsonLd data={[medicalBusinessSchema(), webSiteSchema()]} />
        <ScrollProgress />
        <Nav />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <StickyCta />
        <BackToTop />
      </body>
    </html>
  );
}
