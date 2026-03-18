"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

const GridPulseCanvas = dynamic(() => import("./GridPulseCanvas"), { ssr: false });

/* ─── Scramble text ──────────────────────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·×÷#@%&";
function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)]; }

function ScrambleText({ text, trigger, className, style }: {
  text: string; trigger: boolean;
  className?: string; style?: React.CSSProperties;
}) {
  const [chars, setChars] = useState(() => text.split("").map(c => ({ c, resolved: false })));

  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    const start = performance.now();
    const STAGGER = 40;
    const DURATION = 700;

    const tick = () => {
      const now = performance.now() - start;
      setChars(text.split("").map((final, i) => {
        const staggerStart = i * STAGGER;
        if (now < staggerStart) return { c: final === " " ? " " : randChar(), resolved: false };
        if (now >= staggerStart + DURATION) return { c: final, resolved: true };
        return { c: Math.random() < 0.35 ? final : randChar(), resolved: false };
      }));
      const totalDone = (text.length - 1) * STAGGER + DURATION;
      if (now < totalDone + 100) raf = requestAnimationFrame(tick);
      else setChars(text.split("").map(c => ({ c, resolved: true })));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, text]);

  return (
    <span className={className} style={style}>
      {chars.map((g, i) => (
        <span key={i} style={{
          color: g.resolved ? "inherit" : "rgba(77,126,255,0.8)",
          transition: g.resolved ? "color 200ms" : "none",
        }}>{g.c}</span>
      ))}
    </span>
  );
}

/* ─── Count-up ────────────────────────────────────────────── */
function CountUp({ target, suffix = "", trigger }: { target: number; suffix?: string; trigger: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const DURATION = 2200;
    const startTime = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - startTime) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target]);
  return <>{val}{suffix}</>;
}

/* ─── CTA button with magnetic ──────────────────────────── */
function CTAButton({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagneticEffect(ref as React.RefObject<HTMLElement>, 0.25);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <a ref={ref} href={href} onClick={handleClick}
      className={primary ? "btn-primary" : "btn-secondary"}>
      {children}
    </a>
  );
}

export default function Hero() {
  const [triggered, setTriggered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 300);
    return () => clearTimeout(t);
  }, []);

  const heroLines = brand.hero.headlineLines;

  return (
    <section ref={containerRef} style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", overflow: "hidden",
    }}>
      {/* Dot grid canvas */}
      <GridPulseCanvas />

      {/* Radial gradient vignette — center glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(36,97,232,0.06) 0%, transparent 70%)",
      }} />

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
        pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent, var(--void))",
      }} />

      <div className="container-inner" style={{ position: "relative", zIndex: 2 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: "32px" }}
        >
          <span className="label-eyebrow">
            <ScrambleText text={brand.hero.eyebrow} trigger={triggered} />
          </span>
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: "32px" }}>
          {heroLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-display" style={{
                fontSize: "clamp(52px, 8.5vw, 120px)",
                display: "block",
                // Last line gets the warm/electric gradient
                background: i === heroLines.length - 1
                  ? "linear-gradient(90deg, var(--text-primary) 0%, var(--electric) 50%, var(--glow) 100%)"
                  : undefined,
                WebkitBackgroundClip: i === heroLines.length - 1 ? "text" : undefined,
                WebkitTextFillColor: i === heroLines.length - 1 ? "transparent" : "var(--text-primary)",
                backgroundClip: i === heroLines.length - 1 ? "text" : undefined,
              }}>
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 400, color: "var(--text-secondary)", lineHeight: 1.6,
            maxWidth: "540px", marginBottom: "44px",
          }}
        >
          {brand.hero.subtext}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBottom: "72px" }}
        >
          <CTAButton href="#case-studies" primary>{brand.hero.ctaPrimary}</CTAButton>
          <CTAButton href="#book">{brand.hero.ctaSecondary}</CTAButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{
            display: "flex", flexWrap: "wrap", gap: "0",
            borderTop: "1px solid var(--border-dim)",
            paddingTop: "32px",
          }}
        >
          {brand.stats.map((stat, i) => (
            <div key={stat.label} style={{
              flex: "1 1 140px",
              padding: "0 32px 0 0",
              borderRight: i < brand.stats.length - 1 ? "1px solid var(--border-dim)" : "none",
              marginRight: i < brand.stats.length - 1 ? "32px" : 0,
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 500, color: "var(--text-primary)",
                letterSpacing: "-0.03em", lineHeight: 1,
                marginBottom: "6px",
              }}>
                <CountUp target={stat.value} suffix={stat.suffix} trigger={triggered} />
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "var(--electric)", marginBottom: "3px",
              }}>{stat.label}</div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{stat.description}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{
          position: "absolute", bottom: "40px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "9px",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--text-dim)",
        }}>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{
            width: "1px", height: "32px",
            background: "linear-gradient(to bottom, var(--electric), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
