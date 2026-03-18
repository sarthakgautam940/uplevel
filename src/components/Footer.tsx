"use client";

import { brand } from "../../lib/brand.config";

const YEAR = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Work", href: "#case-studies" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Book a Call", href: "#book" },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{
      position: "relative",
      borderTop: "1px solid var(--border-dim)",
      background: "var(--void)",
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, var(--electric), var(--glow), transparent)",
        opacity: 0.4,
      }} />

      <div className="container-inner">
        {/* Main footer row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "clamp(32px, 5vw, 64px) 0",
          gap: "32px",
          borderBottom: "1px solid var(--border-dim)",
        }}
          className="block md:grid"
        >
          {/* Logo + tagline */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "12px",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: "var(--electric)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(36,97,232,0.35)",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2V10C3 12.2 5.2 14 8 14C10.8 14 13 12.2 13 10V2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "15px", color: "var(--text-primary)",
              }}>
                UpLevel<span style={{ color: "var(--electric)" }}>.</span>
              </span>
            </div>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "11px",
              letterSpacing: "0.1em", color: "var(--text-dim)",
              lineHeight: 1.6, maxWidth: "280px",
            }}>
              {brand.tagline}
            </p>
          </div>

          {/* Center nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "14px",
                  color: "var(--text-dim)",
                  padding: "3px 0",
                  transition: "color 200ms",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right — contact */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--electric)", marginBottom: "10px",
            }}>
              Contact
            </div>
            <a href={`mailto:${brand.email}`}
              style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                color: "var(--text-secondary)", textDecoration: "none",
                display: "block", marginBottom: "6px",
                transition: "color 200ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {brand.email}
            </a>
            <div style={{
              display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px",
            }}>
              <a href={brand.instagram} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--text-dim)", textDecoration: "none",
                  padding: "6px 12px", border: "1px solid var(--border-dim)",
                  borderRadius: "3px", transition: "all 200ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-dim)";
                }}
              >
                Instagram ↗
              </a>
              <a href={brand.linkedin} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--text-dim)", textDecoration: "none",
                  padding: "6px 12px", border: "1px solid var(--border-dim)",
                  borderRadius: "3px", transition: "all 200ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-dim)";
                }}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 0", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.12em", color: "var(--text-dim)",
          }}>
            © {YEAR} UpLevel Services LLC · Virginia
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.12em", color: "var(--text-dim)",
          }}>
            Built with{" "}
            <span style={{ color: "var(--electric)" }}>Next.js</span>
            {" "}· Deployed on{" "}
            <span style={{ color: "var(--electric)" }}>Vercel</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
