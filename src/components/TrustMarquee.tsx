"use client";

import { brand } from "../../lib/brand.config";

const ITEMS = [
  "AI Voice — 24/7 Lead Capture",
  "Instant SMS Routing",
  "14-Day Delivery",
  "Month-to-Month — No Lock-in",
  "Next.js — Sub-2s Load Times",
  "Google Analytics Day One",
  "3 Revision Rounds Included",
  "Vercel Enterprise Hosting",
  ...brand.trustItems,
];

const SEP = "  ✦  ";

export default function TrustMarquee() {
  const fullTrack = [...ITEMS, ...ITEMS].map((item, i) => (
    <span key={i} style={{
      whiteSpace: "nowrap",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-dim)",
      padding: "0 2px",
    }}>
      {item}
      <span style={{ color: "var(--electric)", margin: "0 12px" }}>{SEP}</span>
    </span>
  ));

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderTop: "1px solid var(--border-dim)",
      borderBottom: "1px solid var(--border-dim)",
      padding: "14px 0",
      background: "rgba(36,97,232,0.02)",
    }}>
      {/* Fade edges */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(to right, var(--void), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(to left, var(--void), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      <div style={{ display: "flex", width: "max-content" }} className="marquee-track">
        {fullTrack}
      </div>
    </div>
  );
}
