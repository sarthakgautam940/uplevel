"use client";

import { useEffect, useRef } from "react";
import type { MouseEventHandler } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bookUrl } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";
import TransitionLink from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

type Props = { ready: boolean };

const HERO_ANIM_INIT = "opacity-0 motion-reduce:opacity-100";

const LUXURY_SEGMENTS = [
  "Luxury pools",
  "Custom builders",
  "Wine cellars",
  "Premium outdoor living",
];

const PIPELINE_STAGES = [
  { name: "Qualified", value: "8" },
  { name: "Routed", value: "7" },
  { name: "Booked", value: "5" },
];

function capPx(n: number, scale: number, max: number) {
  const value = n * scale;
  if (value > max) return max;
  if (value < -max) return -max;
  return value;
}

export default function HeroSection({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

  const targetPtrRef = useRef({ x: 0, y: 0 });
  const smoothPtrRef = useRef({ x: 0, y: 0 });
  const rafPtrRef = useRef<number | null>(null);
  const pointerNeedsFrameRef = useRef(true);

  useEffect(() => {
    if (!ready) return;
    const root = sectionRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      [bgRef.current, eyebrowRef.current, headlineRef.current, copyRef.current, ctaRowRef.current, proofRef.current].forEach(
        (element) => {
          if (!element) return;
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.filter = "none";
        },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.08 });

      timeline.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0);
      timeline.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        0.08,
      );
      timeline.fromTo(
        headlineRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
        0.14,
      );
      timeline.fromTo(
        copyRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.58, ease: "power3.out" },
        0.28,
      );
      timeline.fromTo(
        ctaRowRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        0.36,
      );
      timeline.fromTo(
        proofRef.current,
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.88, ease: "power3.out" },
        0.18,
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (proofRef.current) {
        gsap.to(proofRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const schedulePointerFrame = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = sectionRef.current;
    if (!root) return;

    pointerNeedsFrameRef.current = true;
    if (rafPtrRef.current != null) return;

    const applyPointer = () => {
      rafPtrRef.current = null;
      const target = targetPtrRef.current;
      const smooth = smoothPtrRef.current;
      smooth.x += (target.x - smooth.x) * 0.08;
      smooth.y += (target.y - smooth.y) * 0.08;

      const glowX = capPx(smooth.x, 24, 12);
      const glowY = capPx(smooth.y, 16, 10);
      const proofX = capPx(smooth.x, 14, 8);
      const proofY = capPx(smooth.y, 12, 8);

      root.style.setProperty("--hero-glow-x", `${glowX}px`);
      root.style.setProperty("--hero-glow-y", `${glowY}px`);
      root.style.setProperty("--hero-proof-x", `${proofX}px`);
      root.style.setProperty("--hero-proof-y", `${proofY}px`);

      const stillMoving =
        Math.abs(target.x - smooth.x) > 0.0008 ||
        Math.abs(target.y - smooth.y) > 0.0008 ||
        pointerNeedsFrameRef.current;

      pointerNeedsFrameRef.current = false;
      if (stillMoving) {
        rafPtrRef.current = requestAnimationFrame(applyPointer);
      }
    };

    rafPtrRef.current = requestAnimationFrame(applyPointer);
  };

  const onHeroPointerMove: MouseEventHandler<HTMLElement> = (event) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = sectionRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    targetPtrRef.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    schedulePointerFrame();
  };

  const onHeroPointerLeave = () => {
    targetPtrRef.current = { x: 0, y: 0 };
    schedulePointerFrame();
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero"
      onMouseMove={onHeroPointerMove}
      onMouseLeave={onHeroPointerLeave}
      className="relative isolate overflow-hidden bg-[#04070d]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, #04070d 0%, #050a12 52%, #04070d 100%)",
        }}
      />

      <div
        ref={bgRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
      >
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(1200px_520px_at_24%_18%,rgba(13,53,117,0.35),transparent_66%)]" />
        <div
          className="absolute inset-0 opacity-70 [background:radial-gradient(900px_540px_at_75%_30%,rgba(201,168,76,0.12),transparent_68%)]"
          style={{ transform: "translate3d(var(--hero-glow-x, 0px), var(--hero-glow-y, 0px), 0)" }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.14]" viewBox="0 0 1600 900" fill="none">
          <path d="M0 650H1600" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 10" />
          <path d="M0 710H1600" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 10" />
          <path d="M980 0V900" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 8" />
          <path d="M900 0V900" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 8" />
        </svg>
      </div>

      <div className="relative z-[5] mx-auto max-w-[1560px] px-6 pb-[max(3.25rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.36rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:pb-[max(4.25rem,calc(env(safe-area-inset-bottom)+2rem))] xl:px-16">
        <div className="grid min-h-[100dvh] items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(520px,0.9fr)] lg:gap-16">
          <div ref={contentRef} className="relative z-[6] mx-auto flex w-full max-w-[760px] flex-col lg:mx-0">
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(167,180,201,0.76)] ${HERO_ANIM_INIT}`}
            >
              UpLevel Services / Premium web positioning / Applied AI intake
            </p>

            <h1
              ref={headlineRef}
              className={`mt-4 font-display text-[rgba(246,247,251,0.98)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(3rem, 6.05vw, 6.2rem)", lineHeight: 0.93, letterSpacing: "-0.052em" }}
            >
              Digital authority for premium builders and service brands.
            </h1>

            <p
              ref={copyRef}
              className={`mt-7 max-w-[39ch] font-body text-[rgba(177,190,211,0.84)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(1.02rem,1.25vw,1.23rem)", lineHeight: 1.72, letterSpacing: "-0.01em" }}
            >
              We design high-end websites, conversion systems, and AI-powered intake workflows so every qualified inquiry is captured,
              routed, and turned into owner-ready opportunity.
            </p>

            <div ref={ctaRowRef} className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 ${HERO_ANIM_INIT}`}>
              <MagneticButton href={bookUrl} variant="primary" luxe aria-label="Book a strategy call">
                Book a strategy call
              </MagneticButton>

              <TransitionLink
                href="/work"
                className="group inline-flex min-h-12 items-center gap-2 font-body text-[12px] font-medium uppercase tracking-[0.21em] text-white/72 transition-colors duration-500 hover:text-white focus-visible:text-white"
              >
                <span className="border-b border-white/35 pb-1 transition-colors duration-500 group-hover:border-white/72 group-focus-visible:border-white/72">
                  View selected work
                </span>
                <svg
                  className="h-3 w-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <path d="M1 6h10M7 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </TransitionLink>
            </div>
          </div>

          <div className="relative lg:min-h-[620px]">
            <div
              ref={proofRef}
              className={`relative mx-auto flex h-full w-full max-w-[700px] flex-col justify-center ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-proof-x,0px), var(--hero-proof-y,0px), 0)" }}
            >
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(7,13,22,0.95),rgba(9,17,30,0.9))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.08)_50%,transparent_70%)] opacity-50 motion-safe:animate-[heroSignalSweep_7s_linear_infinite]" />

                <div className="relative z-[2] grid gap-6 sm:gap-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.32em] text-white/56">Precision signal field</p>
                      <p className="mt-2 font-display text-[2rem] leading-none tracking-[-0.04em] text-white">Owner-ready pipeline</p>
                    </div>
                    <span className="inline-flex min-h-10 items-center rounded-full border border-[rgba(201,168,76,0.38)] bg-[rgba(201,168,76,0.14)] px-4 font-body text-[11px] uppercase tracking-[0.2em] text-[rgba(255,241,203,0.94)]">
                      97% qualified-fit score
                    </span>
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-[rgba(8,14,24,0.8)] p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-5">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.26em] text-white/50">Lead qualification summary</p>
                      <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/86">
                        “$420k estate pool + outdoor kitchen in Scottsdale. Budget approved. Decision maker on first call.”
                      </p>
                      <div className="mt-4 inline-flex min-h-9 items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 font-body text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                        Routed to design + estimator within 2m 14s
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/48">Priority markets</p>
                      <ul className="mt-3 grid gap-2">
                        {LUXURY_SEGMENTS.map((segment) => (
                          <li key={segment} className="inline-flex min-h-8 items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 text-[0.78rem] text-white/85">
                            <span>{segment}</span>
                            <span className="text-[0.67rem] uppercase tracking-[0.18em] text-white/48">Active</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {PIPELINE_STAGES.map((stage) => (
                      <div key={stage.name} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/46">{stage.name}</p>
                        <p className="mt-2 font-display text-[1.55rem] leading-none tracking-[-0.04em] text-white/95">{stage.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 px-2 font-body text-[11px] uppercase tracking-[0.2em] text-white/46 sm:text-[10px]">
                Designed for luxury contractors, custom builders, and premium home-service brands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
