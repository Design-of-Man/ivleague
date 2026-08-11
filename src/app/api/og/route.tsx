import { ImageResponse } from "next/og";

export const alt = "IV League Infusions";
export const contentType = "image/png";

const TEAL = "#1fcdc0";
const INK = "#04070a";

/**
 * Dynamic Open Graph card. Called as /api/og?title=… from buildMetadata, so
 * every page gets a branded share image with no design work per page.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("title") ?? "Infusion care, elevated.";
  const title = raw.length > 92 ? `${raw.slice(0, 91)}…` : raw;
  const eyebrow = searchParams.get("eyebrow") ?? "IV League Infusions";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {/* Aurora */}
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -160,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(31,205,192,0.32) 0%, rgba(31,205,192,0) 66%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -320,
          right: -180,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(11,178,166,0.26) 0%, rgba(11,178,166,0) 68%)",
          display: "flex",
        }}
      />

      {/* Header — the practice's droplet mark and two-tier wordmark.
            Satori has no SVG-gradient support worth relying on, so the body is
            a flat teal; at 52px the gradient would not be visible anyway. */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg
          width="54"
          height="54"
          viewBox="0 0 48 48"
          style={{ display: "flex" }}
        >
          <path
            d="M24 2.6c0 0 15.4 16.2 15.4 26A15.4 15.4 0 0 1 8.6 28.6c0-9.8 15.4-26 15.4-26Z"
            fill="none"
            stroke="rgba(79,227,215,0.34)"
            strokeWidth="1.4"
          />
          <path
            d="M24 7.4c0 0 11.7 12.6 11.7 20.3A11.7 11.7 0 0 1 12.3 27.7C12.3 20 24 7.4 24 7.4Z"
            fill={TEAL}
          />
          <path
            d="M24 15.4c0 0 6.1 6.6 6.1 10.6a6.1 6.1 0 0 1-12.2 0c0-4 6.1-10.6 6.1-10.6Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 25,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#f1f6f7",
            }}
          >
            IV League
          </span>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 4.6,
              textTransform: "uppercase",
              color: TEAL,
              marginTop: 4,
            }}
          >
            Infusion Services
          </span>
        </div>
      </div>

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
        <span
          style={{
            fontSize: 19,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: TEAL,
            marginBottom: 26,
          }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: title.length > 54 ? 62 : 78,
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: -2.6,
            color: "#f1f6f7",
          }}
        >
          {title}
        </span>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 26,
        }}
      >
        <span style={{ fontSize: 22, color: "#7d919a" }}>
          500 Gulfstream Blvd, Suite 105 · Delray Beach, FL
        </span>
        <span style={{ fontSize: 22, color: "#7d919a" }}>(561) 489-7100</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        /**
         * The card is a pure function of the query string, so a given URL can
         * never produce different bytes. Without this the CDN treats the route
         * as dynamic and re-renders the PNG on every crawl — Satori layout plus
         * a rasterise on each Slack unfurl, for an image that never changes.
         */
        "Cache-Control": "public, max-age=31536000, immutable, no-transform",
      },
    },
  );
}
