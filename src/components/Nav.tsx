"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { B } from "../../lib/brand";

const links = [
  { l: "Work", h: "/work" },
  { l: "Services", h: "/services" },
  { l: "Process", h: "/#process" },
  { l: "Pricing", h: "/#pricing" },
  { l: "Contact", h: "/contact" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [mob, setMob] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (h: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMob(false);
    if (h.startsWith("/#")) {
      if (path === "/") {
        document.querySelector(h.slice(1))?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = h;
      }
    } else {
      window.location.href = h;
    }
  };

  return (
    <>
      <header className={`nav ${stuck ? "stuck" : ""}`}>
        <Link href="/" className="nav-logo" data-cursor="">
          UP<span className="g">LEVEL</span>
          <span className="s">SERVICES</span>
        </Link>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
          {links.map(l => (
            <a key={l.l} href={l.h} onClick={e => go(l.h, e)}
              className="nav-link" data-cursor=""
              style={{ color: path === l.h ? "var(--white)" : undefined }}>
              {l.l}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="nav-avail mob-off">
            <div className="nav-dot" />
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
              {B.slots} slot open
            </span>
          </div>
          <a href="/contact" onClick={e => go("/contact", e)}
            className="btn btn-gold" style={{ fontSize: 9, padding: "10px 22px" }} data-cursor="START">
            Start a Project
          </a>
          <button onClick={() => setMob(!mob)} aria-label="Menu"
            style={{ display: "none", background: "none", border: "1px solid var(--bd-hi)", width: 36, height: 36, cursor: "pointer", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}
            className="mob-btn">
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 16, height: 1, background: "var(--white)", display: "block",
                transition: "transform 0.3s, opacity 0.3s",
                transform: mob && i === 0 ? "rotate(45deg) translate(4px,4px)" : mob && i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none",
                opacity: mob && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </header>

      {mob && (
        <div style={{ position:"fixed",inset:0,zIndex:490,background:"rgba(5,5,6,0.97)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",padding:"80px clamp(20px,4vw,64px) 40px",animation:"mobIn 0.28s ease" }}>
          {links.map((l, i) => (
            <a key={l.l} href={l.h} onClick={e => go(l.h, e)}
              style={{ fontFamily:"var(--serif)",fontWeight:700,fontSize:"clamp(28px,7vw,44px)",color:"var(--white)",textDecoration:"none",padding:"12px 0",borderBottom:"1px solid var(--bd)",letterSpacing:"-0.02em",animationDelay:`${i*0.04}s`,animation:"mobLi 0.38s var(--expo) both" }}>
              {l.l}
            </a>
          ))}
          <a href="/contact" onClick={e => go("/contact", e)}
            className="btn btn-gold" style={{ marginTop:32, alignSelf:"flex-start" }} data-cursor="">
            Start a Project →
          </a>
        </div>
      )}
      <style>{`
        @media(max-width:860px){.mob-btn{display:flex!important;}}
        @keyframes mobIn{from{opacity:0}to{opacity:1}}
        @keyframes mobLi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </>
  );
}
