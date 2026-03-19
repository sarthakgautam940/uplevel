"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Monitor, Phone, Search, Palette, ChevronDown } from "lucide-react";
import { services } from "@/config/brand.config";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Monitor, Phone, Search, Palette };

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICONS[service.icon as keyof typeof ICONS] || Monitor;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;

      gsap.to(card, {
        rotateX: -dy * 8,
        rotateY: dx * 8,
        duration: 0.3,
        ease: "expo.out",
      });

      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "expo.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="service-card"
      style={{ perspective: "800px" }}
      data-cursor="VIEW"
    >
      {/* Ghost number */}
      <span className="service-ghost-number">{service.number}</span>

      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(201,168,124,0.08)",
          border: "1px solid rgba(201,168,124,0.15)",
          borderRadius: "4px",
          marginBottom: "24px",
        }}
      >
        <Icon size={18} color="var(--accent)" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "12px",
          lineHeight: 1.2,
        }}
      >
        {service.name}
      </div>

      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: 300,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: "24px",
        }}
      >
        {service.description}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--accent)",
          letterSpacing: "0.06em",
          marginBottom: "24px",
        }}
      >
        {service.price}
      </div>

      {/* Expand button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "color 0.3s ease",
        }}
      >
        See deliverables
        <ChevronDown
          size={12}
          style={{
            transform: isExpanded ? "rotate(180deg)" : "none",
            transition: "transform 0.3s ease",
            color: "var(--accent)",
          }}
        />
      </button>

      {/* Deliverables */}
      <div
        style={{
          maxHeight: isExpanded ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <ul
          className="check-list"
          style={{
            marginTop: "20px",
            paddingLeft: 0,
            listStyle: "none",
          }}
        >
          {service.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".service-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { yPercent: 60, rotateX: -15, opacity: 0 },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.9,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === cardsRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border-dim)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "clamp(48px, 6vw, 80px)",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <div className="section-eyebrow">What We Build</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                maxWidth: "400px",
              }}
            >
              Four systems.
              <br />
              <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                One machine.
              </span>
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "320px",
              textAlign: "right",
            }}
          >
            We don&apos;t sell services separately. Each component amplifies the others.
          </div>
        </div>

        {/* Card grid */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            perspective: "1200px",
          }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #services > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          .service-card { padding: 32px !important; }
        }
      `}</style>
    </section>
  );
}
