"use client";
import { useState, useEffect, useRef } from "react";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

const links = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);
  useMagneticEffect(btnRef, 0.35);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const slots = brand.availability.slotsTotal - brand.availability.slotsTaken;

  return (
    <>
      <header className={`nav ${solid ? "solid" : ""}`}>
        <a className="nav-logo" href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} data-cursor="HOME">
          UP<span className="nl-accent">LEVEL</span>
          <span className="nl-sub">SERVICES</span>
        </a>

        <nav className="nav-links">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => { e.preventDefault(); go(l.href); }} data-cursor="">
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="nav-badge mob-hide">
            <div className="nav-badge-dot" />
            <span>{slots} slot{slots !== 1 ? "s" : ""} open</span>
          </div>
          <a
            ref={btnRef}
            href="#contact"
            onClick={e => { e.preventDefault(); go("#contact"); }}
            className="btn btn-fill"
            style={{ padding: "10px 22px", fontSize: 9 }}
            data-cursor="BOOK"
          >
            BOOK CALL <span style={{ fontSize: 12, lineHeight: 1 }}>→</span>
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none", background: "none", border: "1px solid var(--border)",
              width: 36, height: 36, color: "#fff", cursor: "pointer",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            }}
            className="mob-btn"
            aria-label="Menu"
          >
            <span style={{ width: 16, height: 1, background: "currentColor", display: "block" }} />
            <span style={{ width: 16, height: 1, background: "currentColor", display: "block" }} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          padding: "100px 32px 40px",
          animation: "fadeIn 0.25s ease",
        }}>
          {links.map((l, i) => (
            <button
              key={l.label}
              onClick={() => go(l.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 32, letterSpacing: "-0.02em", color: "#fff",
                textAlign: "left", padding: "14px 0",
                borderBottom: "1px solid var(--border)",
                animationDelay: `${i * 0.04}s`,
                animation: "slideUp 0.4s var(--eX) both",
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); go("#contact"); }}
            className="btn btn-fill"
            style={{ marginTop: 32, alignSelf: "flex-start" }}
          >
            BOOK CALL →
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) { .mob-btn { display: flex !important; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}
