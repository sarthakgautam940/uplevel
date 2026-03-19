"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/config/brand.config";
import LogoMark from "./LogoMark";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          background: scrolled ? "rgba(12,11,11,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,235,200,0.06)"
            : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
          data-cursor="HOME"
        >
          <LogoMark size={28} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              UP<span style={{ color: "var(--accent)" }}>LEVEL</span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "6px",
                letterSpacing: "0.35em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              SERVICES
            </span>
          </div>
        </a>

        {/* Desktop nav links */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              className="nav-link"
              onClick={() => handleNavClick(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "none",
              }}
              data-cursor="VIEW"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Availability badge */}
          <div className="availability-badge" style={{ display: "flex" }}>
            <span className="availability-dot" />
            {brand.availability.label}
          </div>

          {/* CTA */}
          <a
            href={brand.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: "11px" }}
            data-cursor="BOOK"
          >
            <span>Start a Project</span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--text-primary)",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--text-primary)",
                transition: "opacity 0.3s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--text-primary)",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              className="mobile-nav-link"
              onClick={() => handleNavClick(link.href)}
              style={{
                background: "none",
                border: "none",
                transitionDelay: menuOpen ? `${i * 0.06}s` : "0s",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div className="availability-badge">
            <span className="availability-dot" />
            {brand.availability.label}
          </div>
          <a
            href={brand.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={() => setMenuOpen(false)}
          >
            <span>Start a Project</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .availability-badge { display: none !important; }
        }
      `}</style>
    </>
  );
}
