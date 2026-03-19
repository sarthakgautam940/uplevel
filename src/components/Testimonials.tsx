"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { testimonials } from "@/config/brand.config";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const featured = testimonials.find((t) => t.featured);
  const others = testimonials.filter((t) => !t.featured);

  useEffect(() => {
    // Featured quote reveal
    const words = featuredRef.current?.querySelectorAll(".quote-word");
    if (words) {
      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.025,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Testimonial cards — rotated entry
    const cards = cardsRef.current?.querySelectorAll(".testimonial-card");
    if (cards) {
      const rotations = [-2, 1.5, -1];
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotate: rotations[i] || -1, y: 40 },
          {
            opacity: 1,
            rotate: rotations[i] || -1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Snap to 0 on hover
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { rotate: 0, duration: 0.4, ease: "expo.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotate: rotations[i] || -1,
            duration: 0.5,
            ease: "expo.out",
          });
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.vars.trigger === featuredRef.current ||
          st.vars.trigger === cardsRef.current
        ) {
          st.kill();
        }
      });
    };
  }, []);

  const quoteWords = featured?.quote.split(" ") || [];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-dim)",
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="section-eyebrow" style={{ marginBottom: "60px" }}>
          Client Results
        </div>

        {/* Featured quote — full width editorial */}
        {featured && (
          <div
            ref={featuredRef}
            style={{
              position: "relative",
              marginBottom: "clamp(60px, 8vw, 100px)",
              padding: "0 0 0 clamp(16px, 4vw, 60px)",
            }}
          >
            {/* Decorative giant quote mark */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-40px",
                left: "-20px",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(120px, 20vw, 240px)",
                fontStyle: "italic",
                color: "var(--accent)",
                opacity: 0.06,
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </div>

            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.8vw, 36px)",
                fontWeight: 500,
                fontStyle: "italic",
                color: "var(--text-primary)",
                lineHeight: 1.4,
                maxWidth: "820px",
                marginBottom: "32px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {quoteWords.map((word, i) => (
                <span
                  key={i}
                  className="quote-word"
                  style={{ display: "inline-block", marginRight: "0.26em" }}
                >
                  {word}
                </span>
              ))}
            </blockquote>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: "var(--accent)",
                  opacity: 0.5,
                }}
              />
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {featured.author}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginLeft: "10px",
                  }}
                >
                  {featured.role} · {featured.location}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="hr-accent" style={{ marginBottom: "clamp(48px, 6vw, 80px)" }} />

        {/* Three-column card grid */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {others.map((testimonial) => (
            <div
              key={testimonial.author}
              className="testimonial-card"
              style={{
                willChange: "transform",
                cursor: "default",
                transformOrigin: "center center",
              }}
            >
              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                  marginBottom: "20px",
                }}
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <span
                    key={s}
                    style={{
                      color: "var(--accent)",
                      fontSize: "10px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <blockquote
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div
                style={{
                  borderTop: "1px solid var(--border-dim)",
                  paddingTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {testimonial.author}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "7px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {testimonial.role}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "7px",
                    letterSpacing: "0.12em",
                    color: "var(--text-dim)",
                    textAlign: "right",
                  }}
                >
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #testimonials > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          .testimonial-card {
            rotate: 0deg !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
