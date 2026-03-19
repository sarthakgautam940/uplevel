"use client";

import Link from "next/link";
import { projects } from "@/config/brand.config";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/config/brand.config";

type Project = (typeof projects)[number];

export default function CaseStudyClient({ project }: { project: Project }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&family=DM+Mono:wght@300;400&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&display=swap");
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0C0B0B; color: #F5F0E8; font-family: 'DM Sans', sans-serif; }
        :root {
          --bg: #0C0B0B; --surface-2: #161514; --surface-3: #1C1A19;
          --accent: #C9A87C; --accent-rgb: 201,168,124;
          --text-primary: #F5F0E8; --text-secondary: #6B635A;
          --border-dim: rgba(255,235,200,0.05); --border-mid: rgba(255,235,200,0.09);
          --font-display: 'Playfair Display', Georgia, serif;
          --font-sans: 'DM Sans', system-ui, sans-serif;
          --font-mono: 'DM Mono', monospace;
        }
      `}</style>

      {/* Hero */}
      <div
        style={{
          height: "70vh",
          background: `linear-gradient(135deg, ${project.palette.primary} 0%, ${project.palette.secondary} 60%, ${project.palette.accent}22 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(24px, 5vw, 80px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Back nav */}
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "40px",
            left: "clamp(24px, 5vw, 80px)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
        >
          <ArrowLeft size={14} />
          Back to UpLevel
        </Link>

        <div style={{ maxWidth: "900px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: project.palette.accent,
              marginBottom: "16px",
            }}
          >
            {project.category} · {project.location}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 8vw, 100px)",
              fontWeight: 700,
              color: "#F5F0E8",
              lineHeight: 0.95,
            }}
          >
            {project.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(48px, 7vw, 100px) clamp(24px, 5vw, 80px)",
        }}
      >
        {/* Result callout */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3.5vw, 48px)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#F5F0E8",
            marginBottom: "40px",
            lineHeight: 1.2,
          }}
        >
          &ldquo;{project.result}&rdquo;
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "60px",
          }}
        >
          {project.stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-dim)",
                borderRadius: "4px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3vw, 40px)",
                  fontWeight: 700,
                  color: project.palette.accent,
                  marginBottom: "6px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            fontWeight: 300,
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxWidth: "620px",
            marginBottom: "60px",
          }}
        >
          {project.description}
        </p>

        {/* CTA */}
        <a
          href={brand.calendly}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "var(--accent)",
            border: "1px solid rgba(201,168,124,0.35)",
            padding: "14px 32px",
            borderRadius: "2px",
            textDecoration: "none",
            transition: "background 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--accent)";
            (e.currentTarget as HTMLElement).style.color = "#0C0B0B";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
          }}
        >
          Start a Similar Project →
        </a>
      </div>
    </div>
  );
}
