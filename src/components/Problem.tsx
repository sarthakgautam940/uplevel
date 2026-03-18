"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "@lib/brand.config";

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Problem() {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.3);

  return (
    <section id="problem" className="section-padding" style={{ position: "relative" }}>
      {/* Subtle background gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(36,97,232,0.03) 0%, transparent 70%)",
      }} />

      <div className="container-inner" style={{ position: "relative" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={headerVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="label-eyebrow"
            style={{ display: "block", marginBottom: "16px" }}
          >
            The Problem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-headline"
            style={{ maxWidth: "640px" }}
          >
            {brand.problem.headline}
          </motion.h2>
        </div>

        {/* Problem cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1px",
          background: "var(--border-dim)",
          border: "1px solid var(--border-dim)",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          {brand.problem.items.map((item, i) => (
            <ProblemCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ item, index }: {
  item: typeof brand.problem.items[0]; index: number;
}) {
  const { ref, visible } = useReveal(0.15);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "var(--surface)",
        padding: "clamp(28px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Number */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "11px",
        letterSpacing: "0.18em", color: "var(--electric)",
        marginBottom: "24px",
      }}>
        {item.number}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 26px)",
        fontWeight: 700, color: "var(--text-primary)",
        letterSpacing: "-0.02em", lineHeight: 1.1,
        marginBottom: "16px",
      }}>
        {item.title}
      </h3>

      {/* Body */}
      <p style={{
        fontSize: "15px", color: "var(--text-secondary)",
        lineHeight: 1.65, marginBottom: "28px",
      }}>
        {item.body}
      </p>

      {/* Stat pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "8px 14px",
        background: "rgba(36,97,232,0.08)",
        border: "1px solid var(--border-mid)",
        borderRadius: "4px",
      }}>
        <div style={{
          width: "4px", height: "4px", borderRadius: "50%",
          background: "var(--electric)",
          boxShadow: "0 0 6px rgba(36,97,232,0.8)",
        }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--text-dim)",
        }}>
          {item.stat}
        </span>
      </div>

      {/* Corner electric accent */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: "120px", height: "120px",
        background: `radial-gradient(circle at 100% 100%, rgba(36,97,232,0.06) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
    </motion.div>
  );
}
