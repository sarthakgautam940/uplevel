"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";

function useCountUp(target: number, trigger: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);
  return val;
}

function StatCard({ stat, index, trigger }: {
  stat: typeof brand.stats[0]; index: number; trigger: boolean;
}) {
  const count = useCountUp(stat.value, trigger);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: "1 1 200px",
        padding: "clamp(24px, 3vw, 40px)",
        borderRight: index < brand.stats.length - 1 ? "1px solid var(--border-dim)" : "none",
        position: "relative",
      }}
    >
      {/* Value */}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(44px, 5.5vw, 72px)",
        fontWeight: 500, lineHeight: 1,
        letterSpacing: "-0.04em",
        marginBottom: "12px",
        background: "linear-gradient(135deg, var(--text-primary) 0%, rgba(237,240,247,0.6) 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {count}{stat.suffix}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--electric)", marginBottom: "6px",
      }}>
        {stat.label}
      </div>

      {/* Description */}
      <div style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.5 }}>
        {stat.description}
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, var(--electric), transparent)",
        opacity: 0.3,
      }} />
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ position: "relative" }}>
      <div className="section-line" />
      <div ref={ref} className="container-inner">
        <div style={{
          display: "flex", flexWrap: "wrap",
          border: "1px solid var(--border-dim)",
          borderRadius: "8px",
          overflow: "hidden",
          background: "var(--surface)",
          margin: "clamp(48px, 8vw, 80px) 0",
        }}>
          {brand.stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} trigger={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}
