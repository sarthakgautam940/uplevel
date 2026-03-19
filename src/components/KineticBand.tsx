"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const R1 = "WEBSITES THAT WORK WHILE YOU SLEEP ·";
const R2 = "AI · AUTOMATION · SEO · DESIGN · GROWTH ·";
const R3 = "BUILD. LAUNCH. DOMINATE. REPEAT. ·";

export default function KineticBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);

  const rows = [
    { text: R1 + R1 + R1, x: x1, solid: false },
    { text: R2 + R2 + R2, x: x2, solid: true },
    { text: R3 + R3 + R3, x: x3, solid: false },
  ];

  return (
    <div ref={ref} style={{
      overflow: "hidden",
      padding: "clamp(56px,8vw,100px) 0",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      background: "var(--s1)",
      position: "relative",
    }}>
      {/* Fade edges */}
      {["left","right"].map(side => (
        <div key={side} style={{
          position:"absolute", top:0, bottom:0,
          [side]: 0, width: "12%",
          background: `linear-gradient(to ${side==="left"?"right":"left"},var(--s1),transparent)`,
          zIndex:2, pointerEvents:"none",
        }}/>
      ))}

      {rows.map((row, i) => (
        <motion.div key={i} style={{
          x: row.x, whiteSpace: "nowrap",
          marginBottom: i < 2 ? 4 : 0, display: "block",
        }}>
          <span style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(42px,7.5vw,106px)", lineHeight:0.95,
            letterSpacing:"-0.02em",
            color: row.solid ? "#fff" : "transparent",
            WebkitTextStroke: row.solid ? undefined : "1px rgba(0,229,255,0.12)",
            display:"block",
          }}>{row.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
