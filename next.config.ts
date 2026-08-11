import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * `inlineCss` was measured here and made things worse: pushing ~17KB of CSS
     * into every HTML document delayed the document itself and cost 4–10
     * Lighthouse points on mobile. Left off deliberately — don't re-add it
     * without re-measuring.
     */
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Instagram CDN, for when a Graph API token is configured.
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
