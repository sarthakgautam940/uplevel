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

const SIGNAL_STEPS = [
  { title: "Lead captured", meta: "00:14" },
  { title: "Qualified", meta: "Budget + scope" },
  { title: "Routed", meta: "Estimator + design" },
  { title: "Opportunity brief", meta: "Owner-ready" },
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
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(atmosphereRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.12);
      tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.94, ease: "power3.out" }, 0.18);
      tl.fromTo(copyRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.58, ease: "power3.out" }, 0.34);
      tl.fromTo(ctaRowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.42);
      tl.fromTo(signalRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.88, ease: "power3.out" }, 0.24);
      tl.fromTo(
        briefRef.current,
        { opacity: 0, y: 18, rotateZ: -3 },
        { opacity: 1, y: 0, rotateZ: -1.5, duration: 0.84, ease: "power3.out" },
        0.3,
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -3,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(signalRef.current, {
        yPercent: -5,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(briefRef.current, {
        yPercent: -7,
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

      const glowX = capPx(smooth.x, 28, 14);
      const glowY = capPx(smooth.y, 20, 10);
      const signalX = capPx(smooth.x, 16, 10);
      const signalY = capPx(smooth.y, 14, 8);
      const briefX = capPx(smooth.x, 12, 8);
      const briefY = capPx(smooth.y, 10, 7);

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
      className="relative isolate overflow-hidden bg-[#03060c]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(180deg,#03060c_0%,#040913_42%,#03060c_100%)]" />

      <div ref={atmosphereRef} className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`} aria-hidden="true">
        <div className="absolute inset-0 opacity-95 [background:radial-gradient(1200px_560px_at_66%_18%,rgba(31,67,125,0.24),transparent_62%)]" style={{ transform: "translate3d(var(--hero-glow-x,0px),var(--hero-glow-y,0px),0)" }} />
        <div className="absolute inset-0 opacity-70 [background:linear-gradient(125deg,transparent_30%,rgba(201,168,76,0.09)_52%,transparent_72%)]" />
        <div className="absolute inset-0 opacity-80 [background:radial-gradient(760px_540px_at_22%_56%,rgba(8,23,47,0.52),transparent_68%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 1600 900" fill="none">
          <path d="M266 870L780 322L1342 870" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <path d="M210 870L780 250L1400 870" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M0 650H1600" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 10" />
          <path d="M0 720H1600" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 10" />
          <path d="M1020 0V900" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 9" />
        </svg>
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.5rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative grid min-h-[calc(100dvh-5.2rem)] items-center lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
          <div ref={contentRef} className="relative z-[8] max-w-[760px] pb-20 pt-8 lg:pb-0 lg:pt-0">
            <p ref={eyebrowRef} className={`font-body text-[11px] font-medium uppercase tracking-[0.35em] text-[rgba(170,183,203,0.72)] ${HERO_ANIM_INIT}`}>
              UpLevel Services / Architected authority / Applied AI intake
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[7.2ch] font-display text-[rgba(250,252,255,0.98)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(3.25rem,7vw,7.3rem)", lineHeight: 0.88, letterSpacing: "-0.06em" }}
            >
              The market feels your value before you speak.
            </h1>

            <p
              ref={copyRef}
              className={`mt-8 max-w-[37ch] font-body text-[rgba(184,197,217,0.84)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(1.03rem,1.26vw,1.26rem)", lineHeight: 1.72, letterSpacing: "-0.01em" }}
            >
              Signature websites, conversion architecture, and AI-powered intake systems for premium builders and luxury service brands where every first impression carries revenue weight.
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
                <svg className="h-3 w-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <path d="M1 6h10M7 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </TransitionLink>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-[6] hidden lg:block" aria-hidden="true">
            <div
              ref={signalRef}
              className={`absolute right-[2%] top-[18%] h-[56%] w-[52%] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-signal-x,0px),var(--hero-signal-y,0px),0)" }}
            >
              <svg className="h-full w-full" viewBox="0 0 760 460" fill="none">
                <path d="M58 392C180 334 178 218 292 182C388 150 464 224 548 190C634 154 666 92 712 58" stroke="rgba(217,228,245,0.35)" strokeWidth="1.5" />
                <path d="M58 392C180 334 178 218 292 182C388 150 464 224 548 190C634 154 666 92 712 58" stroke="rgba(91,179,255,0.34)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 12" className="motion-safe:animate-[heroSignalSweep_5.4s_linear_infinite]" />
                <circle cx="58" cy="392" r="8" fill="rgba(255,255,255,0.18)" />
                <circle cx="292" cy="182" r="8" fill="rgba(201,168,76,0.7)" />
                <circle cx="548" cy="190" r="8" fill="rgba(91,179,255,0.75)" />
                <circle cx="712" cy="58" r="9" fill="rgba(238,246,255,0.85)" />
              </svg>

              <div className="absolute left-[3%] top-[79%] rounded-md border border-white/20 bg-[rgba(6,10,17,0.78)] px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/52">Lead captured</p>
                <p className="mt-1 text-sm text-white/88">Scottsdale estate inquiry</p>
              </div>
              <div className="absolute left-[27%] top-[39%] rounded-md border border-white/20 bg-[rgba(6,10,17,0.78)] px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/52">Qualified</p>
                <p className="mt-1 text-sm text-white/88">Budget + timeline verified</p>
              </div>
              <div className="absolute left-[58%] top-[34%] rounded-md border border-white/20 bg-[rgba(6,10,17,0.78)] px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/52">Routed</p>
                <p className="mt-1 text-sm text-white/88">Estimator + design lead</p>
              </div>
              <div className="absolute left-[66%] top-[2%] rounded-md border border-[rgba(201,168,76,0.36)] bg-[rgba(201,168,76,0.11)] px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[rgba(255,240,204,0.78)]">Opportunity brief</p>
                <p className="mt-1 text-sm text-[rgba(255,247,227,0.96)]">Owner review at 9:30 AM</p>
              </div>
            </div>

            <div
              ref={briefRef}
              className={`absolute bottom-[8%] right-[6%] w-[390px] border border-white/15 bg-[linear-gradient(160deg,rgba(10,16,28,0.96),rgba(9,14,24,0.86))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.44)] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-brief-x,0px),var(--hero-brief-y,0px),0) rotate(-1.5deg)" }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/52">Owner-ready brief</p>
              <p className="mt-3 font-display text-[2.25rem] leading-[0.94] tracking-[-0.045em] text-white">High-fit inquiry secured.</p>
              <p className="mt-4 font-body text-[0.98rem] leading-relaxed text-white/78">
                Luxury pool + outdoor environment, $420k scope, verified financing, decision-maker engaged, consultation booked in 24h.
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-body text-[10px] uppercase tracking-[0.22em] text-white/48">Market</span>
                <span className="font-body text-[10px] uppercase tracking-[0.22em] text-white/82">Scottsdale / Paradise Valley</span>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-12 grid gap-3 lg:hidden">
            {SIGNAL_STEPS.map((step, idx) => (
              <div key={step.title} className="rounded-xl border border-white/12 bg-[rgba(8,13,22,0.86)] p-4">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/50">Step {idx + 1}</p>
                <p className="mt-2 text-[1.05rem] text-white/90">{step.title}</p>
                <p className="mt-1 text-sm text-white/62">{step.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
