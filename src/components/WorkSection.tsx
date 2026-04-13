"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, bookUrl } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const thumbGradients = [
  "linear-gradient(145deg, #0D1119 0%, #102340 45%, #06080F 100%)",
  "linear-gradient(155deg, #06080F 0%, #14203a 50%, #0D1119 100%)",
  "linear-gradient(135deg, #111826 0%, #06080F 42%, #1b2840 100%)",
  "linear-gradient(160deg, #0D1119 18%, #06080F 58%, #1c2d4e 100%)",
];

const statusConfig: Record<string, { border: string; text: string }> = {
  Active: { border: "border-[var(--warm)]/50", text: "text-[var(--warm)]" },
  Complete: { border: "border-[var(--electric)]/40", text: "text-[var(--electric)]" },
  "In build": { border: "border-[var(--border)]", text: "text-[var(--text-dim)]" },
  Waitlist: { border: "border-[var(--border)]", text: "text-[var(--text-dim)]" },
};

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Eyebrow
      const eyebrow = el.querySelector(".work-eyebrow");
      if (eyebrow) {
        gsap.from(eyebrow, {
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          x: -36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      // Headline clip reveal
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.0,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 76%", once: true },
          }
        );
      }

      // Rows — staggered scale in
      const rows = el.querySelectorAll(".work-row");
      gsap.from(rows, {
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
        y: 20,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[var(--void)] py-24 md:py-32"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Section header */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="work-eyebrow font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
              Act 4 · Proof
            </p>
            <h2
              ref={headlineRef}
              id="work-heading"
              className="mt-5 font-display leading-[0.92] tracking-[-0.03em] text-[var(--text)]"
              style={{
                fontSize: "clamp(2.5rem,6vw,4.75rem)",
                overflow: "hidden",
                maxWidth: "14ch",
              }}
            >
              Work
              <br />
              <span className="text-[var(--text-dim)]">in motion.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] font-body text-[14px] leading-[1.7] text-[var(--text-dim)] md:text-right">
            No logo wall. No invented firm names. Niches and outcomes only — the
            same honesty we apply before a contract is signed.
          </p>
        </div>

        {/* Editorial rows */}
        <ul className="border-t border-[var(--border)]" role="list">
          {brand.work.map((item, i) => {
            const sc = statusConfig[item.status] ?? statusConfig["Waitlist"];
            return (
              <li key={item.id} className="work-row border-b border-[var(--border)]">
                <div
                  className="group relative grid cursor-none grid-cols-1 gap-6 py-10 transition-colors duration-300 hover:bg-[var(--surface)]/40 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.4fr)] md:items-center md:gap-10 md:py-12"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Number */}
                  <span
                    className="font-display tabular-nums text-[var(--text-dim)] opacity-30"
                    style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 400, width: "4.5rem" }}
                  >
                    {item.id}
                  </span>

                  {/* Niche + outcome */}
                  <div>
                    <h3
                      className="font-display tracking-[-0.02em] text-[var(--text)]"
                      style={{ fontSize: "clamp(1.2rem,2.2vw,1.75rem)", fontWeight: 400 }}
                    >
                      {item.niche}
                    </h3>
                    <p className="mt-2 max-w-[42ch] font-body text-[13px] leading-[1.65] text-[var(--text-dim)]">
                      {item.outcome}
                    </p>
                  </div>

                  {/* Meta + status */}
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span className="font-body text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
                      {item.meta}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 font-body text-[10px] uppercase tracking-[0.12em] ${sc.border} ${sc.text}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Hover thumbnail — clip-path reveal from right */}
                  <div
                    className="pointer-events-none absolute right-0 top-1/2 z-[2] hidden h-[148px] w-[230px] -translate-y-1/2 overflow-hidden rounded-sm md:block"
                    style={{
                      clipPath: hovered === i ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                      transition: "clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    aria-hidden="true"
                  >
                    <div
                      className="relative h-full w-full border border-[var(--border)]"
                      style={{ background: thumbGradients[i % thumbGradients.length] }}
                    >
                      {/* Moving sheen */}
                      <div
                        className="absolute -right-1/4 top-0 h-full w-3/4 opacity-40"
                        style={{
                          background:
                            "linear-gradient(100deg, transparent, rgba(36,97,232,0.28), transparent)",
                          animation: `thumbSheen 4.5s ease-in-out infinite`,
                          animationDelay: `${i * 0.45}s`,
                        }}
                      />
                      {/* Right fade */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,8,15,0.88))]" />
                      <span className="absolute bottom-3 right-3 font-body text-[9px] uppercase tracking-[0.22em] text-[var(--text-dim)] opacity-50">
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Gallery coming soon */}
        <div className="mt-12 flex items-center justify-between gap-6 rounded-sm border border-[var(--border)] bg-[var(--surface)]/50 px-7 py-5 md:px-9">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-[var(--text-dim)] opacity-50">
              Portfolio Gallery
            </p>
            <p className="mt-1 font-display text-[1.1rem] tracking-[-0.01em] text-[var(--text-dim)] opacity-40">
              Opening Q2 2026
            </p>
          </div>
          {/* Blurred placeholder tiles */}
          <div className="flex gap-2 overflow-hidden" aria-hidden="true">
            {[
              "linear-gradient(135deg,#0a1628,#1e3a6e)",
              "linear-gradient(135deg,#160a1a,#3d1554)",
              "linear-gradient(135deg,#1a1200,#4a3000)",
            ].map((g, idx) => (
              <div
                key={idx}
                style={{
                  width: "72px",
                  height: "48px",
                  borderRadius: "4px",
                  background: g,
                  filter: "blur(5px)",
                  opacity: 0.4 - idx * 0.1,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA under work */}
        <div className="mt-14 flex flex-wrap items-center gap-6">
          <MagneticButton href={bookUrl} variant="primary">
            See if you qualify
          </MagneticButton>
          <a
            href="/work"
            className="font-body text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
          >
            Full index →
          </a>
        </div>
      </div>
    </section>
  );
}
