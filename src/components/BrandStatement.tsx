"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    label: "Architecture first.",
    body: "Structure before aesthetics, always. A site that looks remarkable but fails to guide attention is a liability.",
  },
  {
    label: "Conversion is the standard.",
    body: "Revenue attribution is built in from day one — not added after launch when someone asks if the site is working.",
  },
  {
    label: "One operator. Full accountability.",
    body: "The person on the call is the person building the work. No middlemen. No dilution. No excuses.",
  },
];

export default function BrandStatement() {
  const sectionRef  = useRef<HTMLElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const missionRef  = useRef<HTMLParagraphElement>(null);
  const pillarsRef  = useRef<HTMLDivElement>(null);
  const stRefs      = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Teal rule — scales in from left
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
        stRefs.current.push(
          ScrollTrigger.create({
            trigger: lineRef.current,
            start: "top 82%",
            onEnter: () =>
              gsap.to(lineRef.current, { scaleX: 1, duration: 1.1, ease: "power3.out" }),
          })
        );
      }

      // Main headline — clip from bottom, word by word
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { clipPath: "inset(0 0 100% 0)" });
        stRefs.current.push(
          ScrollTrigger.create({
            trigger: headlineRef.current,
            start: "top 78%",
            onEnter: () =>
              gsap.to(headlineRef.current, {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.25,
                ease: "power4.out",
              }),
          })
        );
      }

      // Mission paragraph
      if (missionRef.current) {
        gsap.set(missionRef.current, { opacity: 0, y: 18 });
        stRefs.current.push(
          ScrollTrigger.create({
            trigger: missionRef.current,
            start: "top 80%",
            onEnter: () =>
              gsap.to(missionRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              }),
          })
        );
      }

      // Pillars — staggered
      if (pillarsRef.current) {
        const items = pillarsRef.current.querySelectorAll(".pillar-item");
        gsap.set(items, { opacity: 0, y: 22 });
        stRefs.current.push(
          ScrollTrigger.create({
            trigger: pillarsRef.current,
            start: "top 78%",
            onEnter: () =>
              gsap.to(items, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.12,
              }),
          })
        );
      }
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
      className="relative overflow-hidden bg-[var(--void)] py-28 md:py-40"
      aria-labelledby="brand-statement-heading"
    >
      {/* Teal atmospheric gradient */}
      <div
        className="pointer-events-none absolute -right-[15%] top-[10%] h-[70%] w-[55%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,212,192,0.05) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-[10%] bottom-[0%] h-[50%] w-[45%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(77,130,255,0.06) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">

        {/* Teal rule */}
        <div
          ref={lineRef}
          style={{
            height: "1px",
            marginBottom: "clamp(3rem,6vw,5rem)",
            background:
              "linear-gradient(90deg, rgba(0,212,192,0.6) 0%, rgba(0,212,192,0.25) 40%, transparent 100%)",
          }}
        />

        {/* Primary brand statement */}
        <div className="mb-16 md:mb-24">
          <h2
            ref={headlineRef}
            id="brand-statement-heading"
            className="font-display font-medium text-[var(--text)]"
            style={{
              fontSize: "clamp(3.5rem,9vw,8rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            Built to be{" "}
            <span style={{ color: "var(--teal)" }}>chosen.</span>
          </h2>
        </div>

        {/* Mission + Pillars — two-column on large screens */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-24">

          {/* Mission */}
          <p
            ref={missionRef}
            className="font-body leading-[1.76] text-[var(--text-dim)]"
            style={{ fontSize: "clamp(1rem,1.5vw,1.18rem)", maxWidth: "52ch" }}
          >
            We build the digital infrastructure that converts premium intent
            into client relationships — before the first call, without the
            middlemen, at the standard the work deserves. Not a template.
            Not an agency. A machine that runs while you sleep.
          </p>

          {/* Three pillars */}
          <div ref={pillarsRef} className="flex flex-col gap-8">
            {pillars.map((p) => (
              <div
                key={p.label}
                className="pillar-item border-l-2 pl-5"
                style={{ borderColor: "rgba(0,212,192,0.3)" }}
              >
                <p
                  className="font-display tracking-[-0.015em] text-[var(--text)]"
                  style={{ fontSize: "clamp(0.9rem,1.3vw,1.05rem)", fontWeight: 400 }}
                >
                  {p.label}
                </p>
                <p className="mt-2 font-body text-[13px] leading-[1.68] text-[var(--text-dim)]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
