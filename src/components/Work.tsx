"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/config/brand.config";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  onOpen,
}: {
  project: (typeof projects)[number];
  onOpen: (slug: string, rect: DOMRect) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      className="project-card"
      data-project={project.slug}
      style={{
        background: `linear-gradient(135deg, ${project.palette.primary} 0%, ${project.palette.secondary} 60%, ${project.palette.accent}22 100%)`,
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (cardRef.current) {
          onOpen(project.slug, cardRef.current.getBoundingClientRect());
        }
      }}
      data-cursor="OPEN"
    >
      {/* Texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.4,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

      {/* Accent color top edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(to right, ${project.palette.accent}, transparent)`,
          opacity: hovered ? 0.8 : 0.3,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Category badge */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "28px",
          fontFamily: "var(--font-mono)",
          fontSize: "7px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: `${project.palette.accent}`,
          background: `rgba(0,0,0,0.3)`,
          border: `1px solid ${project.palette.accent}33`,
          padding: "4px 10px",
          borderRadius: "100px",
          backdropFilter: "blur(8px)",
        }}
      >
        {project.category}
      </div>

      {/* Main overlay */}
      <div className="project-card-overlay">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          {project.name}
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: project.palette.accent,
            marginBottom: "12px",
          }}
        >
          {project.result}
        </div>

        <div
          className="project-card-details"
          style={{
            borderTop: `1px solid rgba(255,255,255,0.12)`,
            paddingTop: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            {project.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: project.palette.accent,
            }}
          >
            Open Case Study →
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<
    (typeof projects)[number] | null
  >(null);

  // Horizontal scroll setup
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let st: ScrollTrigger | undefined;

    const setupHorizontal = () => {
      const scrollWidth = track.scrollWidth - window.innerWidth + 128;

      st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        start: "top top",
        end: () => "+=" + scrollWidth,
        onUpdate: (self) => {
          gsap.set(track, {
            x: -scrollWidth * self.progress,
          });
        },
      });
    };

    setupHorizontal();

    // Card entry animation
    const cards = track.querySelectorAll(".project-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      st?.kill();
    };
  }, []);

  const handleOpenProject = (slug: string, cardRect: DOMRect) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project || !overlayRef.current) return;

    setActiveProject(project);
    overlayRef.current.style.pointerEvents = "all";

    const top = cardRect.top;
    const right = window.innerWidth - cardRect.right;
    const bottom = window.innerHeight - cardRect.bottom;
    const left = cardRect.left;

    gsap.fromTo(
      overlayRef.current,
      {
        clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 4px)`,
      },
      {
        clipPath: "inset(0px 0px 0px 0px round 0px)",
        duration: 0.85,
        ease: "expo.inOut",
        onComplete: () => {
          if (overlayContentRef.current) {
            gsap.fromTo(
              overlayContentRef.current.children,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "expo.out" }
            );
          }
        },
      }
    );
  };

  const handleCloseProject = () => {
    if (!overlayRef.current) return;

    gsap.to(overlayRef.current, {
      clipPath: "inset(50% 50% 50% 50% round 0px)",
      duration: 0.65,
      ease: "expo.inOut",
      onComplete: () => {
        setActiveProject(null);
        if (overlayRef.current) {
          overlayRef.current.style.pointerEvents = "none";
        }
      },
    });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="work-section"
        style={{
          background: "var(--bg)",
          padding: "80px 0",
          borderTop: "1px solid var(--border-dim)",
        }}
      >
        {/* Section header */}
        <div
          style={{
            padding: "0 64px",
            marginBottom: "52px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="section-eyebrow">Case Studies</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              Real clients.{" "}
              <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                Real results.
              </span>
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              textAlign: "right",
              maxWidth: "260px",
              lineHeight: 1.6,
            }}
          >
            Hover any project to reveal details. Click to open the full case study.
          </div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="work-track"
          style={{
            paddingBottom: "20px",
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onOpen={handleOpenProject}
            />
          ))}

          {/* End spacer */}
          <div
            style={{
              width: "200px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                textAlign: "center",
              }}
            >
              More projects
              <br />
              coming soon
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div
          style={{
            padding: "24px 64px 0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "7px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
            }}
          >
            {projects.length} Projects
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: "120px",
              height: "1px",
              background: "var(--border-dim)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "var(--accent)",
                borderRadius: "1px",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "7px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
            }}
          >
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Full-screen project overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 8000,
          clipPath: "inset(50% 50% 50% 50%)",
          pointerEvents: "none",
          background: "var(--surface-2)",
          overflowY: "auto",
        }}
      >
        {activeProject && (
          <div
            style={{
              minHeight: "100vh",
              padding: "clamp(24px, 5vw, 80px)",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {/* Back button */}
            <button
              onClick={handleCloseProject}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                marginBottom: "60px",
                marginTop: "80px",
                transition: "color 0.3s ease",
              }}
            >
              <ArrowLeft size={14} />
              Back to work
            </button>

            {/* Content */}
            <div ref={overlayContentRef}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: activeProject.palette.accent,
                  marginBottom: "20px",
                }}
              >
                {activeProject.category} · {activeProject.location}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(44px, 7vw, 96px)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 0.95,
                  marginBottom: "24px",
                }}
              >
                {activeProject.name}
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "18px",
                  fontWeight: 300,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: "560px",
                  marginBottom: "60px",
                }}
              >
                {activeProject.description}
              </p>

              <div
                className="hr-accent"
                style={{ marginBottom: "60px" }}
              />

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "32px",
                  marginBottom: "80px",
                }}
              >
                {activeProject.stats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "var(--surface-3)",
                      border: "1px solid var(--border-dim)",
                      borderRadius: "4px",
                      padding: "32px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "36px",
                        fontWeight: 700,
                        color: activeProject.palette.accent,
                        marginBottom: "8px",
                        lineHeight: 1,
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

              {/* Result callout */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${activeProject.palette.primary} 0%, ${activeProject.palette.secondary} 100%)`,
                  border: `1px solid ${activeProject.palette.accent}33`,
                  borderRadius: "4px",
                  padding: "clamp(32px, 5vw, 60px)",
                  marginBottom: "60px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3vw, 40px)",
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  &ldquo;{activeProject.result}&rdquo;
                </div>
              </div>

              <a
                href="#contact"
                onClick={handleCloseProject}
                className="btn-primary"
                style={{ display: "inline-flex" }}
              >
                <span>Start a Similar Project</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
