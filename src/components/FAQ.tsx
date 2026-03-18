"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { brand } from "../../lib/brand.config";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const headRef = useRef<HTMLDivElement>(null);
  const [headV, setHeadV] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadV(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="faq" className="section-padding" style={{ position: "relative" }}>
      <div className="container-inner">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "clamp(32px, 6vw, 96px)",
          alignItems: "start",
        }}
          className="block md:grid"
        >
          {/* Left — sticky header */}
          <div ref={headRef} style={{ position: "sticky", top: "100px" }}>
            <motion.span
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              className="label-eyebrow" style={{ display: "block", marginBottom: "12px" }}
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={headV ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-headline" style={{ marginBottom: "20px" }}
            >
              Every question answered.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "28px" }}
            >
              If you have one that isn&apos;t here, ask it on the discovery call.
            </motion.p>
            <motion.a
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              href={brand.calendlyUrl} target="_blank" rel="noopener noreferrer"
              className="btn-secondary" style={{ display: "inline-flex" }}
            >
              Book a Call ↗
            </motion.a>
          </div>

          {/* Right — accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {brand.faq.map((item, i) => (
              <FAQItem
                key={i} item={item} index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  item, index, isOpen, onToggle,
}: {
  item: typeof brand.faq[0]; index: number;
  isOpen: boolean; onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      style={{
        borderBottom: "1px solid var(--border-dim)",
        background: isOpen ? "rgba(36,97,232,0.02)" : "transparent",
        transition: "background 300ms",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "clamp(16px, 2.5vw, 22px) 0",
          textAlign: "left", gap: "16px",
        }}
      >
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(15px, 1.6vw, 17px)",
          fontWeight: isOpen ? 600 : 500,
          color: isOpen ? "var(--text-primary)" : "var(--text-secondary)",
          lineHeight: 1.4, transition: "color 200ms",
        }}>
          {item.q}
        </span>
        <div style={{
          width: "24px", height: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid",
          borderColor: isOpen ? "var(--electric)" : "var(--border-mid)",
          borderRadius: "50%",
          color: isOpen ? "var(--electric)" : "var(--text-dim)",
          flexShrink: 0,
          transition: "all 200ms",
        }}>
          {isOpen
            ? <Minus size={12} />
            : <Plus size={12} />
          }
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              paddingBottom: "clamp(16px, 2.5vw, 22px)",
              fontSize: "15px", color: "var(--text-secondary)",
              lineHeight: 1.7, paddingRight: "40px",
            }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
