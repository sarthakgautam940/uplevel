"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";

// Word-by-word staggered reveal (Antonsson-style)
function WordReveal({ text, vis, delay = 0, style }: {
  text: string; vis: boolean; delay?: number; style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline" }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <motion.span
            initial={{ y: "108%", opacity: 0 }}
            animate={vis ? { y: "0%", opacity: 1 } : {}}
            transition={{ delay: delay + i * 0.042, duration: 0.75, ease: [0.16,1,0.3,1] }}
            style={{ display: "inline-block", ...style }}
          >{word}</motion.span>
          {i < words.length - 1 && <span style={{ display: "inline-block", width: "0.26em" }} />}
        </span>
      ))}
    </span>
  );
}

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: "clamp(100px,14vw,180px) clamp(20px,4vw,64px)",
      position: "relative", overflow: "hidden", background: "#000",
    }}>
      {/* Vertical label */}
      <motion.div
        initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          position: "absolute", left: "clamp(20px,4vw,64px)", top: "clamp(100px,14vw,180px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}
        className="mob-hide"
      >
        <div style={{ width: 1, height: 50, background: "var(--border)" }} />
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.24em",
          textTransform: "uppercase", color: "#222",
          writingMode: "vertical-rl", transform: "rotate(180deg)",
        }}>PHILOSOPHY</span>
      </motion.div>

      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ maxWidth: 900, marginLeft: "auto", paddingLeft: "clamp(0px,5vw,80px)" }}>
          <motion.div initial={{ opacity:0,y:12 }} animate={vis?{opacity:1,y:0}:{}}
            style={{ display:"flex", alignItems:"center", gap:12, marginBottom:36 }}>
            <div style={{ width:24, height:1, background:"var(--accent)", opacity:0.5 }} />
            <span className="eyebrow" style={{ fontSize:8 }}>Our Belief</span>
          </motion.div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem,4.5vw,4.5rem)", lineHeight: 1.05,
            letterSpacing: "-0.03em", marginBottom: 36,
          }}>
            <WordReveal text={brand.manifesto.statement} vis={vis} style={{ color: "#fff" }} />
          </h2>

          <motion.p
            initial={{ opacity:0, y:20 }}
            animate={vis ? { opacity:1, y:0 } : {}}
            transition={{ delay: 0.55, duration: 0.85, ease:[0.16,1,0.3,1] }}
            className="body"
            style={{
              maxWidth: 560, borderLeft: "1px solid rgba(0,229,255,0.15)",
              paddingLeft: 22, marginBottom: 52, fontSize: 15,
            }}
          >
            {brand.manifesto.body}
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:0.7 }}
            style={{ display:"flex", flexWrap:"wrap", gap:40, paddingTop:36, borderTop:"1px solid var(--border)" }}>
            {[
              { v: `${brand.stats.projects}+`, l: "Clients Served" },
              { v: `${brand.stats.satisfaction}%`, l: "Satisfaction" },
              { v: "48hr", l: "Avg. Launch" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontWeight:800,
                  fontSize:"clamp(28px,4vw,48px)", lineHeight:1,
                  color:"#fff", marginBottom:6,
                }}>{s.v}</div>
                <div style={{
                  fontFamily:"'Space Mono',monospace", fontSize:8,
                  letterSpacing:"0.18em", textTransform:"uppercase", color:"#2a2a2a",
                }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
