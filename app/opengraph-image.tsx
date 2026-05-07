import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tax the Rich — Francesca Hong for Wisconsin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#1e2957",
        color: "#faf6e8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Yellow stripe-tape */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          height: 14,
          background:
            "repeating-linear-gradient(-45deg, #c3bc31 0 18px, #1e2957 18px 36px)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 60 }}>
        <div
          style={{
            color: "#c3bc31",
            fontSize: 22,
            letterSpacing: 8,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          ★ The Tax-the-Rich Calculator ★
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 180,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#c3bc31" }}>Tax the</span>
          <span style={{ color: "#faf6e8" }}>rich.</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 30,
            fontWeight: 600,
            color: "rgba(250,246,232,0.9)",
            maxWidth: 760,
            lineHeight: 1.25,
          }}
        >
          <span>For 99% of Wisconsinites: <span style={{ color: "#c3bc31", fontWeight: 800 }}>$0</span>.</span>
          <span style={{ fontSize: 22, color: "rgba(250,246,232,0.6)" }}>Hong for Wisconsin · AB 1209</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
