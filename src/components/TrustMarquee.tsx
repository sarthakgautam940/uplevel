"use client";

const items = [
  "WEBSITES",
  "AI SYSTEMS",
  "LOCAL SEO",
  "BRAND IDENTITY",
  "LEAD AUTOMATION",
  "48-HOUR DELIVERY",
  "VOICE AI",
  "CONVERSION",
  "CUSTOM CODE",
  "NO TEMPLATES",
];

function MarqueeItem({ text }: { text: string }) {
  return (
    <>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,235,200,0.2)",
          padding: "0 20px",
          whiteSpace: "nowrap",
          transition: "color 0.3s ease",
        }}
        className="marquee-item"
      >
        {text}
      </span>
      <span
        style={{
          color: "rgba(201,168,124,0.3)",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          flexShrink: 0,
        }}
      >
        ◆
      </span>
    </>
  );
}

export default function TrustMarquee() {
  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div
      style={{
        height: "44px",
        background: "rgba(201,168,124,0.04)",
        borderTop: "1px solid rgba(255,235,200,0.06)",
        borderBottom: "1px solid rgba(255,235,200,0.06)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(to right, var(--bg), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(to left, var(--bg), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="marquee-track"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {allItems.map((item, i) => (
          <MarqueeItem key={`${item}-${i}`} text={item} />
        ))}
      </div>

      <style>{`
        .marquee-item:hover {
          color: rgba(255,235,200,0.6) !important;
        }
      `}</style>
    </div>
  );
}
