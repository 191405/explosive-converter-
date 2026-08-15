import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Private In-Browser Engineering Studio";
    const subtitle =
      searchParams.get("subtitle") ||
      "100% Client-Side WebAssembly Compute · Zero Uploads · Hardware SIMD";
    const suite = searchParams.get("suite") || "Explosive Studio";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#07080b",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1a1d28 2%, transparent 0%), radial-gradient(circle at 75px 75px, #11131a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000",
                fontSize: "24px",
                fontWeight: "900",
              }}
            >
              ⚡
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                EXPLOSIVE STUDIO
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                {suite}
              </span>
            </div>
          </div>

          {/* Center Title Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontSize: "58px",
                fontWeight: "800",
                lineHeight: "1.1",
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "400",
                lineHeight: "1.4",
                color: "#a1a1aa",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#11131a",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#f4f4f5",
              }}
            >
              🔒 100% Client-Side Privacy
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#11131a",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#f4f4f5",
              }}
            >
              🚀 WebAssembly SIMD
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#11131a",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#f4f4f5",
              }}
            >
              📴 Offline PWA
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
