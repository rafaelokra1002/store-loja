import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lojinha Digital - Bots & Automações";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 900,
              background: "linear-gradient(90deg, #00ff88, #00d4ff)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Lojinha Digital
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              marginTop: "10px",
            }}
          >
            Bots & Automações Premium
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            {["Discord", "WhatsApp", "Telegram", "Instagram"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "10px 24px",
                  borderRadius: "999px",
                  border: "1px solid #00ff88",
                  color: "#00ff88",
                  fontSize: "20px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
