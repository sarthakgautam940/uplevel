"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/config/brand.config";

function StatItem({
  stat,
  delay,
}: {
  stat: (typeof stats)[number];
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          setTimeout(() => {
            const duration = 1800;
            const startTime = performance.now();
            const target = stat.value;

            const animate = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased =
                progress < 0.5
                  ? 4 * progress * progress * progress
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;
              setCount(Math.round(eased * target));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value, delay, started]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "clamp(32px, 5vw, 60px) clamp(20px, 3vw, 40px)",
        position: "relative",
      }}
    >
      {/* Separator line */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "20%",
          bottom: "20%",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent, var(--border-mid), transparent)",
        }}
      />

      <div className="stat-number" style={{ marginBottom: "12px" }}>
        {count}
        {stat.suffix}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}
      >
        {stat.label}
      </div>

      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "12px",
          fontWeight: 300,
          color: "var(--text-dim)",
          lineHeight: 1.5,
          maxWidth: "180px",
          margin: "0 auto",
        }}
      >
        {stat.description}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      id="stats"
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border-dim)",
        borderBottom: "1px solid var(--border-dim)",
        overflow: "hidden",
      }}
    >
      {/* Top label strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          borderBottom: "1px solid var(--border-dim)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "7px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          Results · Year One · Client-Reported
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {stats.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} delay={i * 120} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #stats > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
