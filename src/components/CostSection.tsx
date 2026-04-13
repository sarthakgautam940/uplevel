"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, bookUrl } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

export default function CostSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [values, setValues] = useState(() => brand.stats.map(() => 0));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Trigger counter start
      ScrollTrigger.create({
        trigger: el,
        start: "top 72%",
        once: true,
        onEnter: () => setActive(true),
      });

      // Giant ghost word scrolls in from left
      const giant = el.querySelector(".cost-giant");
      if (giant) {
        gsap.fromTo(
          giant,
          { xPercent: -10, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "bottom 15%",
              scrub: 1.4,
            },
            xPercent: 0,
            opacity: 0.06,
            ease: "none",
          }
        );
      }

      // Content reveal
      const copy = el.querySelector(".cost-copy");
      if (copy) {
        gsap.from(copy, {
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // Headline clip reveal
      const headline = el.querySelector(".cost-headline");
      if (headline) {
        gsap.fromTo(
          headline,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.0,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 72%", once: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!active) return;
    const targets = brand.stats.map((s) => s.value);
    const duration = 2200;
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = easeOutQuint(t);
      setValues(targets.map((v) => Math.floor(v * e)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValues(targets);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--surface)] py-28 md:py-44"
      aria-labelledby="cost-heading"
    >
      {/* Ghost word — parallax scrub */}
      <div
        className="cost-giant pointer-events-none absolute -left-6 bottom-0 select-none font-display leading-none tracking-[-0.05em] text-[var(--text)] opacity-0 md:bottom-8"
        aria-hidden="true"
        style={{ fontSize: "clamp(5rem,24vw,20rem)", fontWeight: 400 }}
      >
        LATE
      </div>

      {/* Top edge rule */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(36,97,232,0.2) 30%, rgba(36,97,232,0.2) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="cost-copy max-w-[56ch] lg:ml-[16%]">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--text-dim)]">
            Cost of inaction · Act 3
          </p>
          <h2
            id="cost-heading"
            className="cost-headline mt-5 font-display leading-[1.06] tracking-[-0.025em] text-[var(--text)]"
            style={{ fontSize: "clamp(1.75rem,4vw,3rem)", overflow: "hidden" }}
          >
            Silence is not neutral. It routes revenue to whoever looks ready first.
          </h2>
          <p className="mt-8 max-w-[42ch] font-body text-[16px] leading-[1.7] text-[var(--text-dim)]">
            Every week without a decisive site is a week where referrals land on
            a page that does not match your fee. You do not need more traffic —
            you need fewer leaks.
          </p>
        </div>

        {/* Stats + CTA */}
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[var(--border)] pt-14 md:mt-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.5fr)] md:items-end md:gap-16">
          <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {brand.stats.map((s, i) => (
              <div key={s.label} className="relative">
                <dt className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  {s.label}
                </dt>
                <dd
                  className="mt-3 font-display tabular-nums leading-none tracking-[-0.03em] text-[var(--text)]"
                  style={{ fontSize: "clamp(2.25rem,5.5vw,4rem)" }}
                >
                  {values[i]}
                  {s.suffix}
                </dd>
                <p className="mt-2 max-w-[22ch] font-body text-[12px] leading-snug text-[var(--text-dim)]">
                  {s.note}
                </p>
              </div>
            ))}
          </dl>

          <div className="md:text-right">
            <MagneticButton href={bookUrl} variant="primary">
              Stop the leak
            </MagneticButton>
            <p className="mt-4 max-w-[34ch] font-body text-[12px] leading-relaxed text-[var(--text-dim)] md:ml-auto md:text-right">
              30-minute fit call. If we are not the right layer, you will know
              in the first five minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
