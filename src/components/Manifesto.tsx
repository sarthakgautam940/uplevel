"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manifestoText =
  "Your craft is extraordinary. Your digital presence should say so.";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const vertLineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const words = headline.querySelectorAll(".manifesto-word-inner");

    // Word-by-word reveal synced to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 40%",
        scrub: 1.5,
      },
    });

    tl.fromTo(
      words,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        stagger: 0.035,
        ease: "expo.out",
      }
    );

    // Vertical line grows
    gsap.fromTo(
      vertLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 60%",
          scrub: 1,
        },
      }
    );

    // Body + stats fade in
    gsap.fromTo(
      [bodyRef.current, statsRef.current],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  // Build word spans
  const words = manifestoText.split(" ");

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Decorative left label */}
      <div
        style={{
          position: "absolute",
          left: "clamp(16px, 3vw, 40px)",
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,235,200,0.1)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        PHILOSOPHY
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "clamp(40px, 8vw, 120px)",
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            paddingLeft: "24px",
          }}
        >
          {/* Vertical line */}
          <div
            ref={vertLineRef}
            style={{
              width: "1px",
              height: "200px",
              background: "linear-gradient(to bottom, var(--accent), transparent)",
              flexShrink: 0,
            }}
          />

          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "16px",
              }}
            >
              Our Belief
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              We believe the gap between world-class work and world-class digital presence is a{" "}
              <span style={{ color: "var(--text-primary)" }}>solvable problem.</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Giant italic headline — word reveal */}
          <div
            ref={headlineRef}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.5vw, 64px)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.15,
              color: "var(--text-primary)",
              marginBottom: "48px",
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="manifesto-word"
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  marginRight: "0.25em",
                }}
              >
                <span
                  className="manifesto-word-inner"
                  style={{ display: "inline-block" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            style={{
              borderLeft: "1px solid rgba(201,168,124,0.25)",
              paddingLeft: "24px",
              marginBottom: "48px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                maxWidth: "480px",
              }}
            >
              High-ticket contractors build extraordinary things — custom pools, wine cellars, dream homes. But most are invisible online. We fix that. Every UpLevel system is designed for one goal:{" "}
              <span style={{ color: "var(--text-primary)" }}>
                making your work impossible to ignore.
              </span>
            </p>
          </div>

          {/* Micro-stats */}
          <div
            ref={statsRef}
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "47+", label: "Clients" },
              { value: "98%", label: "Satisfaction" },
              { value: "48hr", label: "Launch" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {value}
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
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #manifesto > div > div {
            grid-template-columns: 1fr !important;
          }
          #manifesto > div > div > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
