"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarqueeStrip from "./MarqueeStrip";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    n: "01",
    title: "The referral ceiling",
    body: "Referrals send people to check your site. What they find decides whether they call.",
    pull: "Referrals are a gift.\nGifts run out.",
  },
  {
    n: "02",
    title: "The 9pm decision",
    body: "High-value decisions happen after hours — when your competitor has a site that loads fast, answers their question, and has a clear next step.",
    pull: "Prospects decide\nbefore you're\nin the room.",
  },
  {
    n: "03",
    title: "The gap no one talks about",
    body: "The work is excellent. The photography is good. The site still reads like 2019. That gap between quality of delivery and quality of appearance is a revenue problem.",
    pull: "UpLevel closes\nthis gap.",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const patternWord = el.querySelector(".prob-pattern-word");
      if (patternWord) {
        gsap.fromTo(
          patternWord,
          {
            opacity: 0,
            y: 48,
            filter: "blur(10px)",
            letterSpacing: "0.5em",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            letterSpacing: "0.28em",
            duration: 1.45,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          },
        );
      }

      gsap.from(el.querySelector(".prob-eyebrow"), {
        x: -40,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });

      gsap.fromTo(
        el.querySelector(".prob-headline"),
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.05,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );

      gsap.from(el.querySelector(".prob-subhead"), {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
        delay: 0.15,
      });

      const rows = el.querySelectorAll(".prob-row");
      rows.forEach((row) => {
        const num = row.querySelector(".prob-num");
        const title = row.querySelector(".prob-title");
        const body = row.querySelector(".prob-body");
        const pull = row.querySelector(".prob-pull");
        const st = { trigger: row, start: "top 85%", once: true };

        if (num) {
          gsap.fromTo(
            num,
            { opacity: 0 },
            { opacity: 0.12, duration: 0.4, ease: "power2.out", scrollTrigger: st },
          );
        }
        if (title) {
          gsap.fromTo(
            title,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power4.out", scrollTrigger: st, delay: 0.05 },
          );
        }
        if (body) {
          gsap.from(body, {
            y: 16,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: st,
            delay: 0.18,
          });
        }
        if (pull) {
          gsap.from(pull, {
            x: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: st,
            delay: 0.28,
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="relative z-[4]">
        <MarqueeStrip />
      </div>

      <section
        id="problem"
        ref={sectionRef}
        className="relative overflow-hidden bg-[var(--void)] py-28 md:py-40"
        aria-labelledby="problem-heading"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(92%,760px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--teal)_40%,transparent)] to-transparent opacity-80"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="relative border-l border-[color-mix(in_srgb,var(--teal)_28%,transparent)] pl-5 md:pl-8">
            <div className="relative mb-12 overflow-hidden md:mb-16" aria-hidden="true">
              <p
                className="prob-pattern-word select-none text-center font-display font-medium uppercase tracking-[0.28em] text-[var(--text)]/[0.04]"
                style={{ fontSize: "clamp(3.25rem, 14vw, 11rem)", lineHeight: 0.85 }}
              >
                Pattern
              </p>
            </div>

            <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] lg:gap-20 md:mb-24">
              <div>
                <p className="prob-eyebrow font-body text-[11px] font-normal tracking-[-0.01em] text-[var(--text-dim)]">
                  <span className="text-[var(--teal)]">Why</span> it feels unfair
                </p>
                <h2
                  id="problem-heading"
                  className="prob-headline mt-5 font-display leading-[0.95] tracking-[-0.03em] text-[var(--text)]"
                  style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", overflow: "hidden", maxWidth: "20ch" }}
                >
                  They&apos;re not comparing you to competitors.
                </h2>
              </div>

              <div className="lg:pt-8">
                <p className="prob-subhead max-w-[42ch] font-body text-[16px] leading-[1.72] text-[var(--text-dim)]">
                  They&apos;re comparing you to the last premium experience their money bought — Apple Store,
                  architecture firm, luxury hotel. That&apos;s the benchmark. Not your competitor down the street.
                </p>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-[var(--border)]">
              {problems.map((p, i) => (
                <div
                  key={p.n}
                  className="prob-row group relative grid grid-cols-1 gap-8 border-l-2 border-transparent py-12 pl-0 transition-all duration-500 hover:border-l-[color-mix(in_srgb,var(--teal)_55%,transparent)] hover:bg-[linear-gradient(90deg,rgba(0,212,192,0.05)_0%,rgba(77,130,255,0.035)_48%,transparent_100%)] hover:pl-3 hover:shadow-[inset_0_0_0_1px_rgba(237,240,247,0.035)] md:grid-cols-[120px_minmax(0,1fr)_minmax(0,0.45fr)] md:gap-12 md:py-16 md:hover:pl-4 lg:gap-16"
                >
                  <span
                    className="prob-num select-none self-start font-display tabular-nums leading-none text-[var(--text)]"
                    style={{
                      fontSize: "clamp(4rem,10vw,8rem)",
                      fontWeight: 400,
                      opacity: 0.12,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                    }}
                    aria-hidden="true"
                  >
                    {p.n}
                  </span>

                  <div>
                    <h3
                      className="prob-title font-display tracking-[-0.025em] text-[var(--text)]"
                      style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 400, overflow: "hidden" }}
                    >
                      {p.title}
                    </h3>
                    <p className="prob-body mt-4 max-w-[44ch] font-body text-[15px] leading-[1.72] text-[var(--text-dim)]">
                      {p.body}
                    </p>
                  </div>

                  <div className="prob-pull flex items-start">
                    <p
                      className="font-display italic tracking-[-0.015em] text-[var(--text-dim)] opacity-35 transition-opacity duration-400 group-hover:opacity-55"
                      style={{
                        fontSize: "clamp(1rem,1.6vw,1.3rem)",
                        fontWeight: 400,
                        lineHeight: 1.3,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {p.pull}
                    </p>
                  </div>

                  {i === 2 && (
                    <div
                      className="absolute bottom-0 left-0 h-px"
                      style={{
                        width: "0%",
                        background: "linear-gradient(90deg, var(--electric), transparent)",
                        transition: "width 600ms ease",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
