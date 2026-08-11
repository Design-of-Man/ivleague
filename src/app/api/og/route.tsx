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
    (
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

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 9999,
              background: `linear-gradient(140deg, #8ff1e8, ${TEAL} 45%, #068e86)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 21,
              fontWeight: 700,
              color: INK,
            }}
          >
            IV
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 25, fontWeight: 600, color: "#f1f6f7" }}>
              IV League
            </span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: TEAL,
                marginTop: 3,
              }}
            >
              Infusions
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
            2949 Fox Chase Lane · Midlothian, VA
          </span>
          <span style={{ fontSize: 22, color: "#7d919a" }}>(804) 397-6286</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
