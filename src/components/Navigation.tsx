"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

const NAV_ITEMS = [
  { label: "Work", href: "#case-studies" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function BookBtn() {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagneticEffect(ref as React.RefObject<HTMLElement>, 0.3);

  return (
    <a ref={ref} href="#book" className="btn-primary" style={{ padding: "10px 22px", fontSize: "12px" }}>
      Book 15 Min ↗
    </a>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_ITEMS.map(i => i.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "background 400ms, backdrop-filter 400ms, border-color 400ms",
        background: scrolled ? "rgba(5,7,9,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-dim)" : "1px solid transparent",
      }}>
        <div className="container-inner" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>
          {/* Logo */}
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            {/* Logo mark — electric U */}
            <div style={{
              width: "30px", height: "30px", borderRadius: "6px",
              background: "var(--electric)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 20px rgba(36,97,232,0.4)",
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 2V10C3 12.2 5.2 14 8 14C10.8 14 13 12.2 13 10V2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px",
              letterSpacing: "-0.01em", color: "var(--text-primary)",
            }}>
              UpLevel<span style={{ color: "var(--electric)" }}>.</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}
            className="hidden md:flex">
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button key={item.label}
                  onClick={() => handleNav(item.href)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "8px 14px", borderRadius: "4px",
                    fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "500",
                    color: isActive ? "var(--text-primary)" : "var(--text-dim)",
                    transition: "color 200ms, background 200ms",
                    position: "relative",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? "var(--text-primary)" : "var(--text-dim)")}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute", bottom: "2px", left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px", height: "4px", borderRadius: "50%",
                        background: "var(--electric)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Availability dot */}
            <div className="hidden md:flex" style={{
              alignItems: "center", gap: "7px",
              fontFamily: "var(--font-mono)", fontSize: "11px",
              color: "var(--text-dim)", letterSpacing: "0.08em",
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#22d3a0",
                boxShadow: "0 0 8px rgba(34,211,160,0.8)",
                animation: "pulse 2s ease-in-out infinite",
              }} />
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
              {brand.availability.slotsTotal - brand.availability.slotsTaken} slots open
            </div>
            <BookBtn />
            {/* Mobile hamburger */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", display: "flex", flexDirection: "column",
                gap: "5px", alignItems: "flex-end",
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: "block", width: mobileOpen ? "20px" : "20px", height: "1.5px",
                background: "var(--text-primary)",
                transform: mobileOpen ? "rotate(45deg) translate(4px,4px)" : "none",
                transition: "transform 300ms",
              }} />
              <span style={{
                display: "block", width: mobileOpen ? "20px" : "14px", height: "1.5px",
                background: "var(--text-primary)",
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity 200ms, width 200ms",
              }} />
              <span style={{
                display: "block", width: "20px", height: "1.5px",
                background: "var(--text-primary)",
                transform: mobileOpen ? "rotate(-45deg) translate(4px,-4px)" : "none",
                transition: "transform 300ms",
              }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: "64px", left: 0, right: 0, zIndex: 999,
              background: "rgba(5,7,9,0.97)", backdropFilter: "blur(20px)",
              borderBottom: "1px solid var(--border-dim)",
              padding: "24px",
              display: "flex", flexDirection: "column", gap: "4px",
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(item.href)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "14px 0",
                  fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600,
                  color: "var(--text-primary)", textAlign: "left",
                  borderBottom: "1px solid var(--border-ghost)",
                }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href={brand.calendlyUrl}
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="btn-primary"
              style={{ marginTop: "16px", justifyContent: "center" }}
            >
              Book 15 Min ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
