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

function capPx(n: number, scale: number, max: number) {
  const value = n * scale;
  if (value > max) return max;
  if (value < -max) return -max;
  return value;
}

export default function HeroSection({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const artifactRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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
      [atmosphereRef.current, eyebrowRef.current, headlineRef.current, copyRef.current, ctaRowRef.current, stageRef.current, artifactRef.current].forEach(
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
      tl.fromTo(atmosphereRef.current, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0);
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.44, ease: "power3.out" }, 0.12);
      tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.18);
      tl.fromTo(copyRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.32);
      tl.fromTo(ctaRowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" }, 0.4);
      tl.fromTo(stageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.82, ease: "power2.out" }, 0.28);
      tl.fromTo(
        artifactRef.current,
        { opacity: 0, y: 20, rotateZ: -3 },
        { opacity: 1, y: 0, rotateZ: -1.5, duration: 0.9, ease: "power3.out" },
        0.34,
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
        yPercent: -2.5,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(stageRef.current, {
        yPercent: -5,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(artifactRef.current, {
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

      const atmosphereX = capPx(smooth.x, 14, 8);
      const atmosphereY = capPx(smooth.y, 12, 7);
      const stageX = capPx(smooth.x, 9, 6);
      const stageY = capPx(smooth.y, 9, 6);
      const artifactX = capPx(smooth.x, 11, 7);
      const artifactY = capPx(smooth.y, 8, 5);

      root.style.setProperty("--hero-atmo-x", `${atmosphereX}px`);
      root.style.setProperty("--hero-atmo-y", `${atmosphereY}px`);
      root.style.setProperty("--hero-stage-x", `${stageX}px`);
      root.style.setProperty("--hero-stage-y", `${stageY}px`);
      root.style.setProperty("--hero-artifact-x", `${artifactX}px`);
      root.style.setProperty("--hero-artifact-y", `${artifactY}px`);

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
      <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(180deg,#02050b_0%,#040912_54%,#02050b_100%)]" />

      <div
        ref={atmosphereRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-80 [background:radial-gradient(960px_540px_at_76%_16%,rgba(59,97,161,0.22),transparent_68%)]"
          style={{ transform: "translate3d(var(--hero-atmo-x,0px),var(--hero-atmo-y,0px),0)" }}
        />
        <div className="absolute inset-0 opacity-60 [background:linear-gradient(142deg,rgba(214,230,255,0.08)_0%,transparent_42%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(700px_460px_at_36%_70%,rgba(5,17,36,0.7),transparent_70%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 1600 900" fill="none">
          <path d="M216 830L948 208L1600 830" stroke="rgba(255,255,255,0.12)" />
          <path d="M152 830L948 138L1600 830" stroke="rgba(255,255,255,0.07)" />
          <path d="M0 634H1600" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 11" />
          <path d="M0 708H1600" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 11" />
          <path d="M1110 0V900" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 10" />
        </svg>
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.5rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative min-h-[calc(100dvh-5.3rem)]">
          <div
            ref={contentRef}
            className="relative z-[8] max-w-[690px] pb-16 pt-8 lg:pb-0 lg:pt-12"
          >
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.35em] text-[rgba(171,184,205,0.72)] ${HERO_ANIM_INIT}`}
            >
              UpLevel Services / Signature positioning / Applied AI intake
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[6.6ch] font-display text-[rgba(251,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3.25rem,6.7vw,7.2rem)",
                lineHeight: 0.855,
                letterSpacing: "-0.067em",
              }}
            >
              The first impression that sells the premium bid.
            </h1>

            <p
              ref={copyRef}
              className={`mt-8 max-w-[34ch] font-body text-[rgba(186,199,220,0.83)] ${HERO_ANIM_INIT}`}
              style={{ fontSize: "clamp(1.02rem,1.2vw,1.2rem)", lineHeight: 1.64, letterSpacing: "-0.012em" }}
            >
              We craft high-end websites, conversion architecture, and lead-intake systems for luxury contractors that need trust before the first call.
            </p>

            <div
              ref={ctaRowRef}
              className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 ${HERO_ANIM_INIT}`}
            >
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
              ref={stageRef}
              className={`absolute bottom-[8%] right-[2%] top-[6%] w-[61%] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-stage-x,0px),var(--hero-stage-y,0px),0)" }}
            >
              <div className="absolute inset-[4%_5%_16%_8%] border border-white/10 bg-[linear-gradient(160deg,rgba(10,18,31,0.44),rgba(8,12,22,0.2))] shadow-[inset_0_0_90px_rgba(204,221,255,0.04)]" />
              <div className="absolute inset-[9%_11%_27%_14%] border border-white/8" />
              <div className="absolute right-[10%] top-[14%] h-[42%] w-[32%] bg-[radial-gradient(circle_at_50%_10%,rgba(222,234,255,0.18),transparent_72%)]" />
              <div className="absolute bottom-[20%] left-[13%] h-[1px] w-[68%] bg-gradient-to-r from-transparent via-white/22 to-transparent" />
            </div>

            <div
              ref={artifactRef}
              className={`absolute bottom-[10%] right-[6%] w-[540px] border border-white/18 bg-[linear-gradient(165deg,rgba(10,16,30,0.97),rgba(8,13,24,0.93))] p-9 shadow-[0_38px_110px_rgba(0,0,0,0.52)] ${HERO_ANIM_INIT}`}
              style={{ transform: "translate3d(var(--hero-artifact-x,0px),var(--hero-artifact-y,0px),0) rotate(-1.5deg)" }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/52">Owner dossier</p>
              <p className="mt-4 font-display text-[3rem] leading-[0.88] tracking-[-0.055em] text-white">
                Premium lead secured.
              </p>
              <p className="mt-5 font-body text-[1.03rem] leading-relaxed text-white/78">
                Custom wine cellar + climate system for a $350k scope. Budget verified, architectural drawings attached, owner consultation confirmed.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-6 border-t border-white/10 pt-5">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/45">Market</p>
                  <p className="mt-1 text-[0.94rem] text-white/84">Austin + West Lake Hills</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/45">Status</p>
                  <p className="mt-1 text-[0.94rem] text-white/84">Decision call at 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-12 rounded-2xl border border-white/12 bg-[linear-gradient(165deg,rgba(10,16,30,0.96),rgba(8,13,24,0.9))] p-5 lg:hidden">
            <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/48">Owner dossier</p>
            <p className="mt-2 text-[1.25rem] leading-tight text-white/92">Premium lead secured.</p>
            <p className="mt-2 text-sm leading-relaxed text-white/72">
              $350k scope, verified budget, drawings attached, consultation confirmed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
