"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, bookUrl } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 94%",
            end: "top 8%",
            scrub: 0.85,
          },
        },
      );

      const horizonLine = el.querySelector(".cta-horizon");
      if (horizonLine) {
        gsap.fromTo(
          horizonLine,
          { scaleX: 0, transformOrigin: "center center" },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          },
        );
      }

      const animatedLine = el.querySelector(".cta-line");
      if (animatedLine) {
        gsap.fromTo(
          animatedLine,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          },
        );
      }

      const shimmer = el.querySelector(".cta-shimmer");
      if (shimmer) {
        gsap.fromTo(
          shimmer,
          { x: "-100%", opacity: 0 },
          {
            x: "200%",
            opacity: 0.6,
            duration: 3,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 70%", once: true },
            delay: 1.2,
          },
        );
      }

      const eyebrow = el.querySelector(".cta-eyebrow");
      if (eyebrow) {
        gsap.from(eyebrow, {
          scrollTrigger: { trigger: el, start: "top 74%", once: true },
          x: -36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      const headline = el.querySelector(".cta-headline");
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 70%", once: true },
            delay: 0.12,
          },
        );
      }

      const ctaCol = el.querySelector(".cta-col-right");
      if (ctaCol) {
        gsap.from(ctaCol, {
          scrollTrigger: { trigger: el, start: "top 68%", once: true },
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.35,
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="book"
      ref={sectionRef}
      className="relative z-[1] overflow-hidden bg-[var(--void)] py-24 md:py-36"
      aria-labelledby="cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        aria-hidden="true"
      >
        <span
          className="font-display font-medium leading-none tracking-[-0.05em] text-[var(--text)]"
          style={{
            fontSize: "clamp(7rem,30vw,26rem)",
            opacity: 0.028,
            userSelect: "none",
          }}
        >
          NOW.
        </span>
      </div>

      <div className="cta-horizon absolute left-0 right-0 top-0 overflow-hidden" style={{ height: "1px" }}>
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.22) 22%, rgba(0,212,192,0.2) 50%, rgba(201,168,76,0.22) 78%, transparent 100%)",
          }}
        />
        <div
          className="cta-shimmer absolute inset-y-0 left-0 w-[60px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
            opacity: 0,
          }}
          aria-hidden="true"
        />
      </div>

      <div
        className="cta-line mx-auto mt-0 h-px max-w-[1600px]"
        style={{ background: "var(--border)", transform: "scaleX(0)", transformOrigin: "left center" }}
      />

      <div className="relative z-[1] mx-auto max-w-[1600px] px-5 pt-20 md:px-10 md:pt-32">
        <p className="cta-eyebrow font-body text-[13px] font-normal tracking-[-0.01em] text-[var(--text-dim)]">
          <span className="text-[var(--warm)]">Next</span> — book time or write cold. Same bar either way.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.55fr)] lg:items-end lg:gap-16">
          <div>
            <h2
              id="cta-heading"
              className="cta-headline font-display font-medium leading-[0.92] tracking-[-0.038em] text-[var(--text)]"
              style={{
                fontSize: "clamp(3rem,8.5vw,7rem)",
                overflow: "visible",
                paddingBottom: "0.08em",
              }}
            >
              Close
              <br />
              <span style={{ color: "var(--warm)" }}>the gap.</span>
            </h2>

            <p className="mt-8 max-w-[40ch] font-body text-[16px] leading-[1.72] text-[var(--text-dim)]">
              You will leave with a clear read on what is broken, what to address first, and whether UpLevel is the
              right fit. No pitch deck. No retainer pitched on mute.
            </p>
          </div>

          <div className="cta-col-right flex flex-col gap-7 lg:items-end lg:text-right">
            <MagneticButton href={bookUrl} variant="primary" luxe aria-label="See what I would change →">
              See what I would change →
            </MagneticButton>
            <a
              href={`mailto:${brand.email}?subject=UpLevel%20%E2%80%94%20project%20fit`}
              className="font-body text-[13px] text-[var(--text-dim)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--text)]"
            >
              {brand.email}
            </a>
            <p className="max-w-[34ch] font-body text-[11px] leading-relaxed text-[var(--text-dim)] lg:ml-auto">
              30 minutes. If we are not the right fit, you will know in the first five — and leave with a clear
              picture of what needs to change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
