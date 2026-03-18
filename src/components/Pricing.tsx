"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { brand } from "@lib/brand.config";

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

export default function Pricing() {
  const { ref: headRef, v: headV } = useReveal();

  // Reorder: Authority (decoy) → Conversion (recommended) → Starter
  const ordered = [...brand.pricing].sort((a, b) => b.tierNumber - a.tierNumber);

  return (
    <section id="pricing" className="section-padding" style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(36,97,232,0.04) 0%, transparent 70%)",
      }} />

      <div className="container-inner" style={{ position: "relative" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 72px)" }}>
          <motion.span
            initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
            className="label-eyebrow" style={{ display: "block", marginBottom: "16px" }}
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={headV ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-headline"
          >
            One job pays it back.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--text-secondary)",
              marginTop: "16px", maxWidth: "480px", margin: "16px auto 0",
              lineHeight: 1.65,
            }}
          >
            Pool builders make $75K–$250K per job. One closed lead from your AI system returns
            the entire year&apos;s investment.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          alignItems: "stretch",
        }}>
          {ordered.map((tier, i) => (
            <PricingCard key={tier.tier} tier={tier} index={i} />
          ))}
        </div>

        {/* Add-ons */}
        <AddOns />
      </div>
    </section>
  );
}

function PricingCard({ tier, index }: { tier: typeof brand.pricing[0]; index: number }) {
  const { ref, v } = useReveal();
  const isHighlighted = tier.highlight;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        background: isHighlighted ? "var(--surface-2)" : "var(--surface)",
        border: isHighlighted ? "1px solid var(--border-bright)" : "1px solid var(--border-dim)",
        borderRadius: "8px",
        padding: "clamp(24px, 3.5vw, 40px)",
        display: "flex", flexDirection: "column",
        boxShadow: isHighlighted ? "0 0 60px rgba(36,97,232,0.10), inset 0 0 60px rgba(36,97,232,0.03)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Highlighted top accent */}
      {isHighlighted && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, var(--electric) 0%, var(--glow) 100%)",
        }} />
      )}

      {/* Badge */}
      {tier.badge && (
        <div style={{
          position: "absolute", top: "16px", right: "16px",
          fontFamily: "var(--font-mono)", fontSize: "9px",
          letterSpacing: "0.18em", textTransform: "uppercase",
          padding: "5px 10px",
          background: "var(--electric)",
          color: "white",
          borderRadius: "3px",
        }}>
          {tier.badge}
        </div>
      )}

      {/* Tier name */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "11px",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: isHighlighted ? "var(--electric)" : "var(--text-dim)",
        marginBottom: "16px",
      }}>
        {tier.tier}
      </div>

      {/* Price */}
      <div style={{ marginBottom: "8px" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 500, color: "var(--text-primary)",
          letterSpacing: "-0.04em",
        }}>
          ${tier.price.toLocaleString()}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "12px",
          color: "var(--text-dim)", marginLeft: "6px",
        }}>
          setup
        </span>
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "14px",
        color: "var(--text-secondary)", marginBottom: "8px",
      }}>
        + ${tier.monthly}/mo
      </div>

      {/* Note */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.12em", color: "var(--text-dim)",
        marginBottom: "24px",
      }}>
        {tier.note}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-dim)", marginBottom: "24px" }} />

      {/* Description */}
      <p style={{
        fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65,
        marginBottom: "24px",
      }}>
        {tier.description}
      </p>

      {/* Features */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", flex: 1, marginBottom: "28px" }}>
        {tier.features.map(f => (
          <li key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Check size={14} style={{
              color: isHighlighted ? "var(--electric)" : "var(--text-dim)",
              flexShrink: 0, marginTop: "2px",
            }} />
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={brand.calendlyUrl} target="_blank" rel="noopener noreferrer"
        className={isHighlighted ? "btn-primary" : "btn-secondary"}
        style={{ textAlign: "center", textDecoration: "none", display: "block" }}
      >
        {tier.cta} ↗
      </a>
    </motion.div>
  );
}

function AddOns() {
  const { ref, v } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: "clamp(32px, 5vw, 56px)",
        padding: "clamp(24px, 4vw, 40px)",
        background: "var(--surface)",
        border: "1px solid var(--border-dim)",
        borderRadius: "8px",
      }}
    >
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--electric)", marginBottom: "20px",
      }}>
        Add-On Services
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
      }}>
        {brand.addOns.map(addon => (
          <div key={addon.name} style={{
            padding: "16px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-dim)",
            borderRadius: "6px",
          }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "14px",
              fontWeight: 600, color: "var(--text-primary)",
              marginBottom: "4px",
            }}>
              {addon.name}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "12px",
              color: "var(--warm)", marginBottom: "6px",
            }}>
              ${addon.price}/{addon.period}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-dim)", lineHeight: 1.5 }}>
              {addon.desc}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
