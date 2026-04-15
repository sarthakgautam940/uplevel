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

const CHECKPOINTS = [
  { title: "Lead captured", meta: "Scottsdale estate inquiry", x: "18%", y: "62%" },
  { title: "Qualified", meta: "Budget + timeline verified", x: "46%", y: "42%" },
  { title: "Routed", meta: "Estimator + design lead", x: "70%", y: "24%" },
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
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLDivElement>(null);
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
      [atmosphereRef.current, eyebrowRef.current, headlineRef.current, copyRef.current, ctaRowRef.current, signalRef.current, briefRef.current].forEach(
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
      const tl = gsap.timeline({ delay: 0.08 });
      tl.fromTo(atmosphereRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.44, ease: "power3.out" }, 0.12);
      tl.fromTo(headlineRef.current, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.86, ease: "power3.out" }, 0.18);
      tl.fromTo(copyRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" }, 0.32);
      tl.fromTo(ctaRowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" }, 0.38);
      tl.fromTo(signalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.84, ease: "power2.out" }, 0.26);
      tl.fromTo(briefRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.82, ease: "power3.out" }, 0.3);
    }, root);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -2,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(signalRef.current, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(briefRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
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

      const glowX = capPx(smooth.x, 18, 9);
      const glowY = capPx(smooth.y, 14, 8);
      const signalX = capPx(smooth.x, 12, 7);
      const signalY = capPx(smooth.y, 10, 6);
      const briefX = capPx(smooth.x, 10, 6);
      const briefY = capPx(smooth.y, 8, 6);

      root.style.setProperty("--hero-glow-x", `${glowX}px`);
      root.style.setProperty("--hero-glow-y", `${glowY}px`);
      root.style.setProperty("--hero-signal-x", `${signalX}px`);
      root.style.setProperty("--hero-signal-y", `${signalY}px`);
      root.style.setProperty("--hero-brief-x", `${briefX}px`);
      root.style.setProperty("--hero-brief-y", `${briefY}px`);

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
      className="relative isolate overflow-hidden bg-[#02050b]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(180deg,#02050b_0%,#040812_48%,#02050b_100%)]" />

      <div ref={atmosphereRef} className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`} aria-hidden="true">
        <div
          className="absolute inset-0 opacity-85 [background:radial-gradient(920px_520px_at_80%_12%,rgba(58,95,155,0.2),transparent_66%)]"
          style={{ transform: "translate3d(var(--hero-glow-x,0px),var(--hero-glow-y,0px),0)" }}
        />
        <div className="absolute inset-0 opacity-80 [background:linear-gradient(160deg,rgba(255,255,255,0.05)_0%,transparent_48%,transparent_100%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.1]" viewBox="0 0 1600 900" fill="none">
          <path d="M0 890L800 230L1600 890" stroke="rgba(255,255,255,0.12)" />
          <path d="M0 890L800 290L1600 890" stroke="rgba(255,255,255,0.07)" />
          <path d="M0 650H1600" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 10" />
          <path d="M0 718H1600" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 10" />
          <path d="M960 0V900" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 9" />
          <path d="M1060 0V900" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 9" />
        </svg>
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.5rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative min-h-[calc(100dvh-5.2rem)]">
          <div ref={contentRef} className="relative z-[8] max-w-[660px] pb-20 pt-8 lg:pt-10">
            <p ref={eyebrowRef} className={`font-body text-[11px] font-medium uppercase tracking-[0.35em] text-[rgba(170,183,203,0.72)] ${HERO_ANIM_INIT}`}>
              UpLevel Services / Architected authority / Applied AI intake
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[6.7ch] font-display text-[rgba(250,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(3.2rem,6.8vw,7rem)", lineHeight: 0.86, letterSpacing: "-0.065em" }}
            >
              Signal becomes revenue before your team speaks.
            </h1>

            <p
              ref={copyRef}
              className={`mt-7 max-w-[35ch] font-body text-[rgba(186,199,219,0.82)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(1.02rem,1.2vw,1.19rem)", lineHeight: 1.65, letterSpacing: "-0.012em" }}
            >
              Premium websites, conversion architecture, and AI intake systems that capture, qualify, and route high-value opportunities with precision.
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

          <div className="pointer-events-none absolute inset-0 z-[6] hidden lg:block" aria-hidden="true">
            <div
              ref={signalRef}
              className={`absolute left-[33%] top-[15%] h-[52%] w-[58%] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-signal-x,0px),var(--hero-signal-y,0px),0)" }}
            >
              <svg className="h-full w-full" viewBox="0 0 820 420" fill="none">
                <path
                  d="M24 348C122 332 188 296 254 248C320 200 374 164 474 130C566 98 660 70 804 34"
                  stroke="rgba(225,234,247,0.28)"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M24 348C122 332 188 296 254 248C320 200 374 164 474 130C566 98 660 70 804 34"
                  stroke="rgba(120,204,255,0.5)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="7 16"
                  className="motion-safe:animate-[heroSignalSweep_6.2s_linear_infinite]"
                />
                <circle cx="254" cy="248" r="8" fill="rgba(255,255,255,0.2)" />
                <circle cx="474" cy="130" r="8" fill="rgba(201,168,76,0.68)" />
                <circle cx="660" cy="70" r="8" fill="rgba(125,208,255,0.78)" />
                <circle cx="804" cy="34" r="10" fill="rgba(241,247,255,0.9)" />
              </svg>

              {CHECKPOINTS.map((point) => (
                <div
                  key={point.title}
                  className="absolute rounded-md border border-white/16 bg-[rgba(6,10,18,0.74)] px-3 py-2 backdrop-blur-sm"
                  style={{ left: point.x, top: point.y }}
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/52">{point.title}</p>
                  <p className="mt-1 text-[0.84rem] text-white/84">{point.meta}</p>
                </div>
              ))}
            </div>

            <div
              ref={briefRef}
              className={`absolute bottom-[7%] right-[5%] w-[520px] border border-white/18 bg-[linear-gradient(160deg,rgba(10,16,30,0.96),rgba(8,13,24,0.92))] p-8 shadow-[0_34px_90px_rgba(0,0,0,0.48)] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-brief-x,0px),var(--hero-brief-y,0px),0)" }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/52">Owner-ready brief</p>
              <p className="mt-4 font-display text-[2.9rem] leading-[0.9] tracking-[-0.05em] text-white">Qualified opportunity secured.</p>
              <p className="mt-5 font-body text-[1.02rem] leading-relaxed text-white/78">
                Scottsdale estate pool + outdoor environment, $420k scope, financing verified, decision-maker engaged, strategy call scheduled within 24 hours.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/46">Routing</p>
                  <p className="mt-1 text-[0.92rem] text-white/82">Estimator + design lead</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/46">Next action</p>
                  <p className="mt-1 text-[0.92rem] text-white/82">Owner review at 9:30 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-12 grid gap-3 lg:hidden">
            {CHECKPOINTS.map((step, idx) => (
              <div key={step.title} className="rounded-xl border border-white/12 bg-[rgba(8,13,22,0.86)] p-4">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/50">Step {idx + 1}</p>
                <p className="mt-2 text-[1.05rem] text-white/90">{step.title}</p>
                <p className="mt-1 text-sm text-white/62">{step.meta}</p>
              </div>
            ))}
            <div className="rounded-xl border border-white/14 bg-[rgba(9,14,24,0.9)] p-5">
              <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/48">Owner-ready brief</p>
              <p className="mt-2 text-[1.18rem] leading-tight text-white/92">Qualified opportunity secured.</p>
              <p className="mt-2 text-sm leading-relaxed text-white/72">
                $420k scope, financing verified, decision-maker engaged, owner review scheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
