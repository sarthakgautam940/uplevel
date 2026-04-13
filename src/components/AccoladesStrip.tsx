"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "../../lib/brand.config";

gsap.registerPlugin(ScrollTrigger);

const placementColor: Record<number, string> = {
  1: "var(--warm)",
  2: "var(--teal)",
  3: "var(--text-dim)",
};

export default function AccoladesStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const stRef      = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll<HTMLElement>(".accolade-item");
      gsap.set(items, { opacity: 0, y: 14 });

      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () =>
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.09,
          }),
      });
    }, sectionRef);

    return () => {
      stRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--void)] py-16 md:py-20"
      aria-label="Competition accolades"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        {/* Header row */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
              TSA · Technology Student Association
            </p>
            <p
              className="mt-2 font-display tracking-[-0.02em] text-[var(--text)]"
              style={{ fontSize: "clamp(1.1rem,2.2vw,1.6rem)", fontWeight: 400 }}
            >
              Creative discipline, documented.
            </p>
          </div>
          <p className="max-w-[36ch] font-body text-[12px] leading-[1.65] text-[var(--text-dim)] opacity-60 md:text-right">
            Competitive results in design and digital media — not participation
            ribbons. Placement speaks for itself.
          </p>
        </div>

        {/* Accolades grid */}
        <div className="grid grid-cols-1 gap-[1px] border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-5"
          style={{ background: "var(--border)" }}>
          {brand.accolades.map((a) => {
            const itemKey = `${a.year}-${a.event}-${a.category}-${a.placement}`;
            return (
            <div
              key={itemKey}
              className="accolade-item flex flex-col gap-3 bg-[var(--void)] px-6 py-7"
            >
              <div className="relative mb-1 aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.02]">
                {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps SSR and client markup identical */}
                <img
                  src={a.imageSrc}
                  alt={`${a.category}, ${a.placement} — ${a.event} ${a.year}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Placement badge */}
              <span
                className="font-display text-[2rem] leading-none tabular-nums tracking-[-0.04em]"
                style={{ color: placementColor[a.placementNum] ?? "var(--text-dim)" }}
              >
                {a.placement}
              </span>

              {/* Category */}
              <p
                className="font-display tracking-[-0.01em] text-[var(--text)]"
                style={{ fontSize: "clamp(0.82rem,1.1vw,0.95rem)", fontWeight: 400, lineHeight: 1.3 }}
              >
                {a.category}
              </p>

              {/* Event + Year */}
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)] opacity-45">
                {a.event} · {a.year}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
