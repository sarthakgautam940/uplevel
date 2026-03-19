"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { processSteps } from "@/config/brand.config";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const steps = stepsRef.current?.querySelectorAll(".process-step");
    if (!steps || !sectionRef.current) return;

    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActiveStep(i),
        onEnterBack: () => setActiveStep(i),
      });
    });

    // Progress line
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 20%",
      end: "bottom 80%",
      scrub: 0.5,
      onUpdate: (self) => {
        if (progressLineRef.current) {
          progressLineRef.current.style.height = `${self.progress * 100}%`;
        }
      },
    });

    // Animate step content in
    steps.forEach((step) => {
      const items = step.querySelectorAll(".step-animate");
      gsap.fromTo(
        items,
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: step,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.vars.trigger === sectionRef.current ||
          (st.vars.trigger as Element)?.closest?.("#process")
        ) {
          st.kill();
        }
      });
    };
  }, []);

  const step = processSteps[activeStep];

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-dim)",
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: "clamp(60px, 8vw, 100px)" }}>
          <div className="section-eyebrow">How It Works</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            From signed to{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              live in 48 hours.
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Left — sticky panel */}
          <div
            className="process-left"
            style={{
              position: "sticky",
              top: "100px",
            }}
          >
            {/* Vertical progress line */}
            <div
              style={{
                position: "relative",
                paddingLeft: "20px",
                marginBottom: "40px",
              }}
            >
              {/* Track */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  background: "var(--border-mid)",
                  borderRadius: "1px",
                }}
              />
              {/* Fill */}
              <div
                ref={progressLineRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "2px",
                  height: "0%",
                  background: "var(--accent)",
                  borderRadius: "1px",
                  transition: "height 0.1s linear",
                }}
              />

              {/* Giant step number */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(80px, 12vw, 140px)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "var(--text-primary)",
                  opacity: 0.05,
                  lineHeight: 1,
                  marginBottom: "-20px",
                  transition: "opacity 0.3s ease",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {step?.number}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "12px",
                  transition: "opacity 0.3s ease",
                }}
              >
                {step?.label}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                  transition: "all 0.4s ease",
                }}
              >
                {step?.title}
              </h3>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(201,168,124,0.25)",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                ⏱ {step?.duration}
              </div>
            </div>

            {/* Step dots navigation */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                paddingLeft: "20px",
              }}
            >
              {processSteps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeStep ? "24px" : "6px",
                    height: "2px",
                    background:
                      i === activeStep ? "var(--accent)" : "var(--border-mid)",
                    borderRadius: "1px",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right — scrolling steps */}
          <div ref={stepsRef}>
            {processSteps.map((step, i) => (
              <div
                key={step.number}
                className="process-step"
                style={{
                  paddingBottom: i < processSteps.length - 1 ? "120px" : "0",
                }}
              >
                {/* Step header */}
                <div
                  className="step-animate"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      border: `1px solid ${activeStep === i ? "var(--accent)" : "var(--border-mid)"}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: activeStep === i ? "var(--accent)" : "var(--text-secondary)",
                      transition: "all 0.4s ease",
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "8px",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: activeStep === i ? "var(--accent)" : "var(--text-secondary)",
                      transition: "color 0.4s ease",
                    }}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Description */}
                <p
                  className="step-animate"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: "var(--text-secondary)",
                    marginBottom: "32px",
                    maxWidth: "480px",
                  }}
                >
                  {step.description}
                </p>

                {/* What happens */}
                <div
                  className="step-animate"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-dim)",
                    borderRadius: "4px",
                    padding: "28px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "8px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "16px",
                    }}
                  >
                    What Happens
                  </div>
                  <ul className="check-list" style={{ listStyle: "none", padding: 0 }}>
                    {step.whatHappens.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Your role vs our role */}
                <div
                  className="step-animate"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--border-dim)",
                      borderRadius: "4px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "7px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                        marginBottom: "10px",
                      }}
                    >
                      Your Role
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: "var(--text-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {step.yourRole}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid rgba(201,168,124,0.1)",
                      borderRadius: "4px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "7px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        marginBottom: "10px",
                      }}
                    >
                      Our Role
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: "var(--text-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {step.ourRole}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #process > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .process-left {
            position: static !important;
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
