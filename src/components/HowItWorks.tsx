"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeaderVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance through steps when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        let step = 0;
        const interval = setInterval(() => {
          step = (step + 1) % brand.process.length;
          setActiveStep(step);
        }, 3200);
        return () => clearInterval(interval);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="section-padding" style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(36,97,232,0.04) 0%, transparent 70%)",
      }} />

      <div className="container-inner" style={{ position: "relative" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <motion.span
            initial={{ opacity: 0 }} animate={headerVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="label-eyebrow" style={{ display: "block", marginBottom: "16px" }}
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={headerVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-headline" style={{ maxWidth: "560px" }}
          >
            Four steps from deposit to live
          </motion.h2>
        </div>

        {/* Split layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "start",
        }}
          className="block md:grid"
        >
          {/* Left — step list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {brand.process.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <motion.div
                  key={step.step}
                  onClick={() => setActiveStep(i)}
                  style={{
                    padding: "clamp(16px, 2.5vw, 24px)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: isActive ? "var(--surface-2)" : "transparent",
                    border: isActive ? "1px solid var(--border-mid)" : "1px solid transparent",
                    transition: "all 300ms var(--ease-expo)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Active left border */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
                    background: isActive ? "var(--electric)" : "transparent",
                    transition: "background 300ms",
                    boxShadow: isActive ? "0 0 12px rgba(36,97,232,0.6)" : "none",
                  }} />

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Step number */}
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "11px",
                      letterSpacing: "0.15em",
                      color: isActive ? "var(--electric)" : "var(--text-dim)",
                      minWidth: "24px", transition: "color 300ms",
                    }}>
                      {step.step}
                    </div>

                    {/* Label + title */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: "10px",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: isActive ? "var(--electric)" : "var(--text-dim)",
                        marginBottom: "4px", transition: "color 300ms",
                      }}>
                        {step.label}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: "clamp(17px, 2vw, 21px)",
                        fontWeight: 700, color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        transition: "color 300ms",
                      }}>
                        {step.title}
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      letterSpacing: "0.12em", color: "var(--text-dim)",
                      padding: "4px 10px",
                      border: "1px solid var(--border-dim)",
                      borderRadius: "3px",
                      whiteSpace: "nowrap",
                    }}>
                      {step.duration}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right — detail panel */}
          <div style={{
            position: "sticky", top: "100px",
            padding: "clamp(28px, 4vw, 48px)",
            background: "var(--surface)",
            border: "1px solid var(--border-dim)",
            borderRadius: "8px",
            minHeight: "300px",
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {(() => {
                  const step = brand.process[activeStep];
                  return (
                    <>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: "10px",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "var(--electric)", marginBottom: "12px",
                      }}>
                        Step {step.step} — {step.label}
                      </div>

                      <h3 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(24px, 3vw, 36px)",
                        fontWeight: 700, color: "var(--text-primary)",
                        letterSpacing: "-0.02em", lineHeight: 1.1,
                        marginBottom: "20px",
                      }}>
                        {step.title}
                      </h3>

                      <p style={{
                        fontSize: "16px", color: "var(--text-secondary)",
                        lineHeight: 1.7, marginBottom: "28px",
                      }}>
                        {step.body}
                      </p>

                      {/* Detail note */}
                      <div style={{
                        padding: "14px 18px",
                        background: "rgba(36,97,232,0.06)",
                        border: "1px solid var(--border-mid)",
                        borderRadius: "4px",
                        fontFamily: "var(--font-mono)", fontSize: "12px",
                        color: "var(--text-dim)", letterSpacing: "0.04em",
                        lineHeight: 1.6,
                      }}>
                        {step.detail}
                      </div>

                      {/* Progress dots */}
                      <div style={{
                        display: "flex", gap: "6px", marginTop: "32px",
                      }}>
                        {brand.process.map((_, i) => (
                          <div key={i}
                            onClick={() => setActiveStep(i)}
                            style={{
                              width: i === activeStep ? "20px" : "6px",
                              height: "6px",
                              borderRadius: "3px",
                              background: i === activeStep ? "var(--electric)" : "var(--border-mid)",
                              cursor: "pointer",
                              transition: "all 400ms var(--ease-expo)",
                              boxShadow: i === activeStep ? "0 0 8px rgba(36,97,232,0.6)" : "none",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
