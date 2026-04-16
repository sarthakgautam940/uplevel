"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Center always above sides — never raise sides above center (prevents “phasing through”). */
const Z_CENTER = 30;
const Z_SIDE = 12;

export default function PortfolioWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const splitDone = useRef(false);
  const hoverTween = useRef<gsap.core.Timeline | null>(null);

  const resetHover = useCallback(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    if (!left || !right || !center || !splitDone.current) return;

    hoverTween.current?.kill();
    hoverTween.current = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });
    hoverTween.current.to([left, right, center], {
      scale: 1,
      y: 0,
      opacity: 1,
      boxShadow:
        "0 24px 70px -16px rgba(15,23,42,0.14), 0 0 0 1px rgba(255,255,255,0.45) inset",
    });
  }, []);

  const hoverSide = useCallback(
    (side: "left" | "center" | "right") => {
      const left = leftRef.current;
      const right = rightRef.current;
      const center = centerRef.current;
      if (!left || !right || !center || !splitDone.current) return;

      hoverTween.current?.kill();
      hoverTween.current = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });

      const lift =
        "0 28px 80px -12px rgba(15,23,42,0.18), 0 0 0 1px rgba(255,255,255,0.5) inset";

      if (side === "left") {
        hoverTween.current.to(left, { scale: 1.025, y: -6, boxShadow: lift }, 0);
        hoverTween.current.to(center, { scale: 1.01, y: 0, boxShadow: lift }, 0);
        hoverTween.current.to(right, { scale: 0.99, y: 4, opacity: 0.92 }, 0);
      } else if (side === "right") {
        hoverTween.current.to(right, { scale: 1.025, y: -6, boxShadow: lift }, 0);
        hoverTween.current.to(center, { scale: 1.01, y: 0, boxShadow: lift }, 0);
        hoverTween.current.to(left, { scale: 0.99, y: 4, opacity: 0.92 }, 0);
      } else {
        hoverTween.current.to(center, { scale: 1.02, y: -4, boxShadow: lift }, 0);
        hoverTween.current.to([left, right], { scale: 0.985, y: 6, opacity: 0.9 }, 0);
      }
    },
    []
  );

  const runEnter = useCallback(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    if (!left || !right || !center) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      [left, right],
      { y: 36, opacity: 0.55, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.05, stagger: 0.08 },
      0
    );
    tl.fromTo(center, { y: 14, opacity: 0.92 }, { y: 0, opacity: 1, duration: 0.85 }, 0);
    splitDone.current = true;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    if (!section || !left || !right || !center) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(center, { zIndex: Z_CENTER });
    gsap.set([left, right], { zIndex: Z_SIDE });

    if (reduced) {
      gsap.set([left, right], { y: 0, opacity: 1, filter: "none" });
      gsap.set(center, { y: 0, opacity: 1 });
      splitDone.current = true;
      return;
    }

    gsap.set([left, right], { y: 36, opacity: 0.55, filter: "blur(8px)" });
    gsap.set(center, { y: 14, opacity: 0.92 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => runEnter(),
    });

    return () => {
      st.kill();
    };
  }, [runEnter]);

  const glass =
    "rounded-[1.25rem] border border-white/65 bg-white/[0.34] p-6 shadow-[0_24px_70px_-16px_rgba(15,23,42,0.14),0_0_0_1px_rgba(255,255,255,0.45)_inset] backdrop-blur-2xl md:rounded-[1.75rem] md:p-8";
  const glassHeavy = `${glass} md:backdrop-blur-[32px]`;

  return (
    <section
      ref={sectionRef}
      data-cursor-light
      className="relative isolate z-[5] overflow-hidden bg-[#f4f2ed] py-16 text-[var(--void)] md:py-24"
      aria-label="Portfolio gallery"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-[15%] top-0 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full opacity-[0.55]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(237,240,247,0.4) 45%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        <div
          className="absolute -right-[10%] bottom-[-10%] h-[min(65vw,480px)] w-[min(65vw,480px)] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle at center, rgba(201,168,76,0.12) 0%, rgba(237,240,247,0.35) 50%, transparent 68%)",
            filter: "blur(56px)",
          }}
        />
        <div
          className="absolute left-[25%] top-[35%] h-[40%] w-[50%] rounded-[100%] opacity-40"
          style={{
            background: "radial-gradient(ellipse at center, rgba(77,130,255,0.06) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-8">
        <p className="sr-only">
          Portfolio gallery releasing with first client launches. Every entry is a real engagement — real site, real results, real business impact.
        </p>

        {/* Desktop: three distinct columns — gap prevents “wings” peeking from behind */}
        <div className="relative mx-auto hidden w-full flex-row flex-nowrap items-end justify-center gap-4 lg:flex lg:gap-5 xl:gap-8">
          <div
            ref={leftRef}
            className={`portfolio-card portfolio-card--left mt-0 w-full max-w-[300px] shrink-0 basis-[min(280px,24vw)] lg:mt-9 ${glassHeavy}`}
            style={{ zIndex: Z_SIDE, willChange: "transform" }}
            onMouseEnter={() => hoverSide("left")}
            onMouseLeave={resetHover}
          >
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--void)]/45">
              Curation
            </p>
            <p className="mt-4 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-[var(--void)]/85 md:text-[19px]">
              Curated releases
            </p>
            <p className="mt-3 font-body text-[12px] leading-relaxed text-[var(--void)]/50 md:text-[13px]">
              Nothing lands in the gallery until it earns its place. No filler.
              No padding. Work that holds up.
            </p>
          </div>

          <div
            ref={centerRef}
            className={`portfolio-card portfolio-card--center w-full max-w-[640px] shrink-0 basis-[min(520px,46vw)] ${glassHeavy}`}
            style={{ zIndex: Z_CENTER, willChange: "transform", WebkitBackdropFilter: "blur(32px)" }}
            onMouseEnter={() => hoverSide("center")}
            onMouseLeave={resetHover}
          >
            <p className="font-display text-[15px] font-medium tracking-[-0.02em] text-[var(--void)]/88 md:text-[16px]">
              Our Portfolio
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 md:mt-8">
              <span className="h-px w-10 bg-[var(--warm)]/35 md:w-14" aria-hidden="true" />
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--warm)]">
                Gallery
              </span>
              <span className="h-px w-10 bg-[var(--warm)]/35 md:w-14" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center justify-center py-10 md:py-8">
              <h2
                className="text-center font-display font-medium leading-[1.05] tracking-[-0.04em] text-[var(--void)]"
                style={{ fontSize: "clamp(2.5rem, 8vw, 3.75rem)" }}
              >
                Releasing
                <br />
                soon
              </h2>
            </div>
            <p className="font-body text-[12px] tracking-[0.02em] text-[var(--void)]/45 md:text-[13px]">
              <span className="text-[var(--void)]/65">Request a spot for your site</span>
              <span aria-hidden="true" className="ml-1 text-[var(--void)]/35">
                →
              </span>
            </p>
          </div>

          <div
            ref={rightRef}
            className={`portfolio-card portfolio-card--right mt-0 w-full max-w-[300px] shrink-0 basis-[min(280px,24vw)] lg:mt-9 ${glassHeavy}`}
            style={{ zIndex: Z_SIDE, willChange: "transform" }}
            onMouseEnter={() => hoverSide("right")}
            onMouseLeave={resetHover}
          >
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--void)]/45">
              Evidence
            </p>
            <p className="mt-4 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-[var(--void)]/85 md:text-[19px]">
              Proof, not pitch
            </p>
            <p className="mt-3 font-body text-[12px] leading-relaxed text-[var(--void)]/50 md:text-[13px]">
              When projects ship, the story and the results live here — authored by
              real work, not templated case studies.
            </p>
          </div>
        </div>

        <div className={`mx-auto max-w-[520px] lg:hidden ${glassHeavy} p-8`}>
          <p className="font-display text-[15px] font-medium tracking-[-0.02em] text-[var(--void)]/88">
            Our Portfolio
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[var(--warm)]/35" aria-hidden="true" />
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--warm)]">
              Gallery
            </span>
            <span className="h-px w-10 bg-[var(--warm)]/35" aria-hidden="true" />
          </div>
          <div className="py-10">
            <h2
              className="text-center font-display font-medium leading-[1.05] tracking-[-0.04em] text-[var(--void)]"
              style={{ fontSize: "clamp(2.5rem, 9vw, 3.75rem)" }}
            >
              Releasing
              <br />
              soon
            </h2>
          </div>
          <p className="font-body text-[12px] tracking-[0.02em] text-[var(--void)]/45">
            <span className="text-[var(--void)]/65">Request a spot for your site</span>
            <span aria-hidden="true" className="ml-1 text-[var(--void)]/35">
              →
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
