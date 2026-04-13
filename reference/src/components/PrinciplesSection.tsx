"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    n: "01",
    title: "Conversion over decoration.",
    body: "If it doesn't sharpen trust or move the right visitor forward — it doesn't stay. Beautiful is a byproduct of clear.",
  },
  {
    n: "02",
    title: "Clarity as a premium signal.",
    body: "Confusion reads cheap faster than bad taste does. Every element on every page has a reason to be there. AI is not the product—the buyer's experience is. The best integration is the one they never notice.",
  },
  {
    n: "03",
    title: "One operator. Zero dilution.",
    body: "No account managers between strategy and execution. Every decision made by the person building it.",
  },
  {
    n: "04",
    title: "Proof before promise.",
    body: "Standards are shown through the work, the response time, and the decisions — not through what we claim to be.",
  },
];

export default function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stRefs     = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const intro = section.querySelector(".principles-intro");
      if (intro) {
        gsap.fromTo(
          intro,
          { opacity: 0, y: 36, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: intro, start: "top 86%", once: true },
          },
        );
      }

      const rows = section.querySelectorAll<HTMLElement>(".principle-row");

      rows.forEach((row, i) => {
        gsap.set(row, { opacity: 0, y: 24 });
        stRefs.current.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 86%",
            onEnter: () =>
              gsap.to(row, {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: "power3.out",
                delay: i * 0.06,
              }),
          })
        );
      });
    }, sectionRef);

    return () => {
      stRefs.current.forEach((st) => st.kill());
      stRefs.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[3] bg-[var(--surface)] py-24 md:py-36"
      aria-labelledby="principles-heading"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="principles-intro mb-12 max-w-[56ch] md:mb-14">
          <p className="font-body text-[13px] font-normal leading-snug tracking-[-0.01em] text-[var(--text-dim)]">
            <span className="text-[var(--text)]">Build criteria</span> — what wins when two directions are both
            defensible.
          </p>
          <h2
            id="principles-heading"
            className="mt-4 font-display font-medium leading-[1.02] tracking-[-0.025em] text-[var(--text)]"
            style={{ fontSize: "clamp(1.75rem,4vw,3rem)" }}
          >
            Not a values slide.
            <br />
            <span className="text-[var(--text-dim)]">Operational standards.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-10 sm:grid-cols-2 sm:gap-5 md:pt-12">
          {principles.map((p) => (
            <article
              key={p.n}
              className="principle-row group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--void)_32%,var(--surface))] p-6 transition-[border-color,box-shadow] duration-500 hover:border-[color-mix(in_srgb,var(--warm)_32%,var(--border))] hover:shadow-[0_20px_60px_-36px_rgba(0,0,0,0.45)] md:p-8"
            >
              <span
                className="pointer-events-none absolute left-0 top-0 font-display font-medium tabular-nums leading-none text-[var(--text)]"
                style={{
                  fontSize: "clamp(3.5rem,12vw,5.5rem)",
                  opacity: 0.05,
                  letterSpacing: "-0.05em",
                  transform: "translate(-4%, -8%)",
                }}
                aria-hidden="true"
              >
                {p.n}
              </span>
              <div className="relative">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]/65">
                  {p.n}
                </span>
                <h3
                  className="mt-3 max-w-[34ch] font-display font-normal tracking-[-0.018em] text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--warm)]"
                  style={{ fontSize: "clamp(1.05rem,1.7vw,1.28rem)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-3 max-w-[50ch] font-body leading-[1.72] text-[var(--text-dim)]"
                  style={{ fontSize: "clamp(0.85rem,1.05vw,0.95rem)" }}
                >
                  {p.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
