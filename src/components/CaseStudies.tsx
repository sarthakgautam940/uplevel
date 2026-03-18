"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, v };
}

export default function CaseStudies() {
  const { ref: headRef, v: headV } = useReveal();

  const featured = brand.caseStudies.find(c => c.featured)!;
  const others = brand.caseStudies.filter(c => !c.featured);

  return (
    <section id="case-studies" className="section-padding" style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(36,97,232,0.04) 0%, transparent 70%)",
      }} />

      <div className="container-inner" style={{ position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{
          display: "flex", flexWrap: "wrap", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "clamp(40px, 6vw, 64px)", gap: "24px",
        }}>
          <div>
            <motion.span
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              className="label-eyebrow" style={{ display: "block", marginBottom: "12px" }}
            >
              Our Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} animate={headV ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-headline"
            >
              Built and shipped
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              maxWidth: "360px", fontSize: "15px",
              color: "var(--text-secondary)", lineHeight: 1.65,
              textAlign: "right",
            }}
          >
            Real sites, real AI systems, real clients. Every metric is live.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto auto",
          gap: "16px",
        }}>
          {/* Featured card — spans full width */}
          <FeaturedCard study={featured} />

          {/* Smaller cards */}
          {others.map((study, i) => (
            <SmallCard key={i} study={study} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          style={{ textAlign: "center", marginTop: "48px" }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: "20px" }}>
            4 new client slots per month. Currently:{" "}
            <span style={{ color: "var(--warm)", fontWeight: 600 }}>
              {brand.availability.slotsTotal - brand.availability.slotsTaken} open
            </span>
          </p>
          <a
            href={brand.calendlyUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary"
          >
            Book Your Discovery Call ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCard({ study }: { study: typeof brand.caseStudies[0] }) {
  const { ref, v } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        gridColumn: "1 / -1",
        background: "var(--surface)",
        border: "1px solid var(--border-mid)",
        borderRadius: "8px",
        padding: "clamp(28px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(36,97,232,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "center",
      }}
        className="block md:grid"
      >
        {/* Left */}
        <div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "4px 10px", border: "1px solid var(--border-mid)", borderRadius: "3px",
              color: "var(--electric)",
            }}>
              {study.niche}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "4px 10px", border: "1px solid var(--border-warm)", borderRadius: "3px",
              color: "var(--warm)",
            }}>
              {study.tier}
            </span>
          </div>

          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 2.8vw, 36px)",
            fontWeight: 700, color: "var(--text-primary)",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: "12px",
          }}>
            {study.client}
          </h3>

          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "12px",
            letterSpacing: "0.08em", color: "var(--text-dim)",
            marginBottom: "20px",
          }}>
            {study.location} · {study.year}
          </p>

          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "28px" }}>
            {study.headline}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {study.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "4px 10px",
                background: "rgba(36,97,232,0.06)",
                border: "1px solid var(--border-dim)",
                borderRadius: "3px", color: "var(--text-dim)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            padding: "20px 24px",
            background: "rgba(36,97,232,0.04)",
            border: "1px solid var(--border-dim)",
            borderRadius: "6px",
            marginBottom: "8px",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--electric)", marginBottom: "8px",
            }}>Result</div>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {study.result}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {study.metrics.map(m => (
              <div key={m.label} style={{
                padding: "16px",
                background: "var(--surface-2)",
                border: "1px solid var(--border-dim)",
                borderRadius: "6px", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 500, color: "var(--text-primary)",
                  letterSpacing: "-0.02em", marginBottom: "4px",
                }}>
                  {m.value}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "var(--text-dim)",
                }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ study, index }: { study: typeof brand.caseStudies[0]; index: number }) {
  const { ref, v } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-dim)",
        borderRadius: "8px",
        padding: "clamp(20px, 3vw, 32px)",
        position: "relative", overflow: "hidden",
        gridColumn: "span 1",
      }}
    >
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: "var(--electric)", marginBottom: "12px",
      }}>
        {study.niche}
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2vw, 22px)",
        fontWeight: 700, color: "var(--text-primary)",
        letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: "8px",
      }}>
        {study.client}
      </h3>

      <p style={{
        fontFamily: "var(--font-mono)", fontSize: "11px",
        color: "var(--text-dim)", letterSpacing: "0.08em",
        marginBottom: "16px",
      }}>
        {study.location} · {study.year}
      </p>

      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
        {study.result}
      </p>

      {/* Status badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        padding: "6px 12px",
        background: "rgba(232,160,32,0.08)",
        border: "1px solid var(--border-warm)",
        borderRadius: "3px",
      }}>
        <div style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: "var(--warm)",
          boxShadow: "0 0 6px rgba(232,160,32,0.8)",
        }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--warm)",
        }}>
          {study.tier}
        </span>
      </div>
    </motion.div>
  );
}
