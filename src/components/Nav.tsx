"use client";
import { useState, useEffect, useRef } from "react";
import { B } from "../../lib/brand";

const links = [
  { l: "Services", h: "#services" },
  { l: "Work", h: "#work" },
  { l: "Process", h: "#process" },
  { l: "Pricing", h: "#pricing" },
  { l: "FAQ", h: "#faq" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mob ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mob]);

  const go = (h: string) => {
    setMob(false);
    setTimeout(() => {
      document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });
    }, mob ? 300 : 0);
  };

  return (
    <>
      <header className={`nav ${stuck ? "stuck" : ""}`}>
        <a className="nav-logo" href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} data-cursor="">
          UP<span className="gld">LEVEL</span>
          <span className="sub">SERVICES</span>
        </a>

        <nav className="nav-links">
          {links.map(l => (
            <a key={l.l} href={l.h} onClick={e => { e.preventDefault(); go(l.h); }}
              className="nav-link" data-cursor="">{l.l}</a>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="nav-badge mob-hide">
            <div className="nav-badge-dot" />
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
              {B.slots} slot open
            </span>
          </div>
          <a href="#contact" onClick={e => { e.preventDefault(); go("#contact"); }}
            className="btn btn-gold" style={{ fontSize: 9 }} data-cursor="START">
            Start a Project
          </a>
          {/* Hamburger */}
          <button onClick={() => setMob(!mob)}
            style={{ display: "none", background: "none", border: "1px solid var(--bd-hi)", width: 36, height: 36, cursor: "pointer", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}
            className="mob-btn" aria-label="Menu">
            <span style={{ width: 16, height: 1, background: mob ? "var(--gold)" : "var(--t1)", transition: "transform 0.3s", display: "block", transform: mob ? "rotate(45deg) translate(4px,4px)" : "none" }} />
            <span style={{ width: 16, height: 1, background: mob ? "var(--gold)" : "var(--t1)", transition: "opacity 0.3s", display: "block", opacity: mob ? 0 : 1 }} />
            <span style={{ width: 16, height: 1, background: mob ? "var(--gold)" : "var(--t1)", transition: "transform 0.3s", display: "block", transform: mob ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mob && (
        <div style={{ position: "fixed", inset: 0, zIndex: 490, background: "rgba(12,11,11,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", padding: "80px clamp(20px,4vw,64px) 40px", gap: 0, animation: "mobIn 0.3s ease" }}>
          {links.map((l, i) => (
            <button key={l.l} onClick={() => go(l.h)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,8vw,48px)", color: "var(--t1)", textAlign: "left", padding: "14px 0", borderBottom: "1px solid var(--bd)", letterSpacing: "-0.02em", animationDelay: `${i * 0.05}s`, animation: "mobLi 0.4s var(--expo) both" }}>
              {l.l}
            </button>
          ))}
          <a href="#contact" onClick={e => { e.preventDefault(); go("#contact"); }}
            className="btn btn-gold" style={{ marginTop: 32, alignSelf: "flex-start" }} data-cursor="">
            Start a Project →
          </a>
        </div>
      )}

      <style>{`
        @media(max-width:860px){.mob-btn{display:flex!important;}}
        @keyframes mobIn{from{opacity:0}to{opacity:1}}
        @keyframes mobLi{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </>
  );
}
