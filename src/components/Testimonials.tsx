"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const headRef = useRef<HTMLDivElement>(null);
  const [headV, setHeadV] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadV(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % brand.testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = brand.testimonials[active];

  return (
    <section id="testimonials" className="section-padding" style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 60% at 80% 40%, rgba(36,97,232,0.03) 0%, transparent 70%)",
      }} />

      <div className="container-inner" style={{ position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
          <motion.span
            initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
            className="label-eyebrow" style={{ display: "block", marginBottom: "12px" }}
          >
            Client Results
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={headV ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-headline"
          >
            What happens after launch
          </motion.h2>
        </div>

        {/* Main quote */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
          marginBottom: "48px",
        }}
          className="block md:grid"
        >
          {/* Quote panel */}
          <div style={{
            padding: "clamp(28px, 4vw, 48px)",
            background: "var(--surface)",
            border: "1px solid var(--border-mid)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            minHeight: "280px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: "linear-gradient(90deg, var(--electric), transparent)",
            }} />

            {/* Large quote mark */}
            <div style={{
              position: "absolute", top: "16px", right: "20px",
              fontFamily: "var(--font-display)", fontSize: "120px", fontWeight: 700,
              color: "rgba(36,97,232,0.06)", lineHeight: 1,
              pointerEvents: "none", userSelect: "none",
            }}>
              "
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ flex: 1 }}
              >
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(17px, 2vw, 22px)",
                  fontWeight: 500, color: "var(--text-primary)",
                  lineHeight: 1.55, letterSpacing: "-0.01em",
                  marginBottom: "28px",
                }}>
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "15px",
                    fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px",
                  }}>
                    {current.name}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "11px",
                    letterSpacing: "0.1em", color: "var(--text-dim)",
                  }}>
                    {current.company} · {current.location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav dots */}
            <div style={{ display: "flex", gap: "6px", marginTop: "24px" }}>
              {brand.testimonials.map((_, i) => (
                <button key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? "20px" : "6px",
                    height: "6px", borderRadius: "3px",
                    background: i === active ? "var(--electric)" : "var(--border-mid)",
                    border: "none", cursor: "pointer",
                    transition: "all 400ms var(--ease-expo)",
                    padding: 0,
                    boxShadow: i === active ? "0 0 8px rgba(36,97,232,0.6)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right — other testimonials */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {brand.testimonials.map((t, i) => i !== active && (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                onClick={() => setActive(i)}
                style={{
                  padding: "20px 24px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "border-color 300ms",
                }}
                whileHover={{ borderColor: "var(--border-bright)" }}
              >
                <p style={{
                  fontSize: "13px", color: "var(--text-secondary)",
                  lineHeight: 1.55, marginBottom: "12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "var(--electric-dim)",
                    border: "1px solid var(--border-mid)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: "11px",
                    fontWeight: 700, color: "var(--electric)",
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: "13px",
                      fontWeight: 700, color: "var(--text-primary)",
                    }}>
                      {t.name}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      letterSpacing: "0.08em", color: "var(--text-dim)",
                    }}>
                      {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
