"use client";

import { useState } from "react";
import { faqs } from "@/config/brand.config";
import { brand } from "@/config/brand.config";
import { Plus } from "lucide-react";

const categories = ["All", "Timeline", "Pricing", "AI & Technology", "Results"];

export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? faqs
      : faqs.filter((f) => f.category === category);

  return (
    <section
      id="faq"
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border-dim)",
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "80px",
          alignItems: "start",
        }}
      >
        {/* Left sticky column */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div className="section-eyebrow">FAQ</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 2.8vw, 36px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Questions we
            <br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              get a lot.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Still have questions? Book a free 15-minute discovery call — no pitch, just answers.
          </p>

          <a
            href={brand.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: "inline-flex", marginBottom: "40px" }}
            data-cursor="BOOK"
          >
            <span>Book Free Call →</span>
          </a>

          {/* Category filter */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setActive(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:
                    category === cat
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  padding: "8px 0",
                  borderBottom: `1px solid ${
                    category === cat
                      ? "rgba(201,168,124,0.25)"
                      : "transparent"
                  }`,
                  transition: "all 0.25s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right accordion */}
        <div>
          {filtered.map((faq, i) => (
            <div key={`${faq.question}`} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setActive(active === i ? null : i)}
              >
                {faq.question}
                <Plus
                  size={16}
                  className={`faq-icon ${active === i ? "open" : ""}`}
                />
              </button>
              <div className={`faq-answer ${active === i ? "open" : ""}`}>
                {faq.answer}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 300,
                color: "var(--text-secondary)",
                padding: "40px 0",
              }}
            >
              No questions in this category yet.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #faq > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          #faq > div > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
