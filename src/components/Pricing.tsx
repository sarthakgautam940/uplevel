"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { pricing } from "@/config/brand.config";
import { brand } from "@/config/brand.config";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".pricing-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === gridRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border-dim)",
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Warm gradient bleeding in from top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "30%",
          right: "30%",
          height: "200px",
          background:
            "radial-gradient(ellipse, rgba(201,168,124,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <div className="section-eyebrow" style={{ justifyContent: "center", display: "flex" }}>
            Investment
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Transparent pricing.{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              No surprises.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            One new client from our system pays back your entire annual investment.
          </p>
        </div>

        {/* Pricing grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            alignItems: "end",
          }}
        >
          {pricing.map((plan) => (
            <div
              key={plan.tier}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}

              {/* Tier */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: plan.popular ? "var(--accent)" : "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                {plan.tier}
              </div>

              {/* Price */}
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {typeof plan.setup === "number"
                    ? `$${plan.setup.toLocaleString()}`
                    : `$${plan.setup}`}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    color: "var(--text-secondary)",
                    marginLeft: "6px",
                    letterSpacing: "0.08em",
                  }}
                >
                  setup
                </span>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  marginBottom: "16px",
                }}
              >
                + ${plan.monthly}/mo
              </div>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "28px",
                  flexGrow: 0,
                }}
              >
                {plan.description}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border-dim)",
                  marginBottom: "24px",
                }}
              />

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    <Check
                      size={12}
                      color="var(--accent)"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={brand.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  background: plan.popular ? "var(--accent)" : "transparent",
                  color: plan.popular ? "#0C0B0B" : "var(--accent)",
                  textDecoration: "none",
                }}
                data-cursor="BOOK"
              >
                <span>{plan.cta}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.18em",
            color: "var(--text-dim)",
            textTransform: "uppercase",
          }}
        >
          Month-to-month · No long-term contracts · Cancel anytime
          &nbsp;·&nbsp; We cap intake at 5 clients/month for quality
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #pricing > div > div:last-of-type {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .pricing-card.popular {
            transform: none !important;
          }
        }
        @media (max-width: 640px) {
          #pricing > div > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
