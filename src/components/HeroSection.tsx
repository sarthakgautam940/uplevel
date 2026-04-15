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

function clampOffset(value: number, scale: number, max: number) {
  const shifted = value * scale;
  if (shifted > max) return max;
  if (shifted < -max) return -max;
  return shifted;
}

export default function HeroSection({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microProofRef = useRef<HTMLDivElement>(null);

  const targetPtrRef = useRef({ x: 0, y: 0 });
  const smoothPtrRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const needsFrameRef = useRef(false);

  useEffect(() => {
    if (!ready) return;
    const root = sectionRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      [
        atmosphereRef.current,
        eyebrowRef.current,
        headlineRef.current,
        copyRef.current,
        ctaRef.current,
        stageRef.current,
        dossierRef.current,
        microProofRef.current,
      ].forEach((el) => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.08 });

      tl.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out" },
        0,
      )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" },
          0.1,
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.16,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          0.3,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" },
          0.38,
        )
        .fromTo(
          microProofRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          0.44,
        )
        .fromTo(
          stageRef.current,
          { opacity: 0, scale: 0.985, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
          0.2,
        )
        .fromTo(
          dossierRef.current,
          { opacity: 0, y: 22, rotate: -2.2 },
          { opacity: 1, y: 0, rotate: -1.15, duration: 0.92, ease: "power3.out" },
          0.34,
        );

      gsap.to(contentRef.current, {
        yPercent: -2.5,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(stageRef.current, {
        yPercent: -4.5,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(dossierRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const schedulePointerFrame = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = sectionRef.current;
    if (!root) return;

    needsFrameRef.current = true;
    if (rafRef.current != null) return;

    const update = () => {
      rafRef.current = null;

      const target = targetPtrRef.current;
      const smooth = smoothPtrRef.current;

      smooth.x += (target.x - smooth.x) * 0.075;
      smooth.y += (target.y - smooth.y) * 0.075;

      root.style.setProperty("--hero-atmo-x", `${clampOffset(smooth.x, 18, 10)}px`);
      root.style.setProperty("--hero-atmo-y", `${clampOffset(smooth.y, 16, 9)}px`);
      root.style.setProperty("--hero-stage-x", `${clampOffset(smooth.x, 10, 6)}px`);
      root.style.setProperty("--hero-stage-y", `${clampOffset(smooth.y, 10, 6)}px`);
      root.style.setProperty("--hero-dossier-x", `${clampOffset(smooth.x, 13, 8)}px`);
      root.style.setProperty("--hero-dossier-y", `${clampOffset(smooth.y, 9, 6)}px`);

      const moving =
        Math.abs(target.x - smooth.x) > 0.001 ||
        Math.abs(target.y - smooth.y) > 0.001 ||
        needsFrameRef.current;

      needsFrameRef.current = false;

      if (moving) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    rafRef.current = requestAnimationFrame(update);
  };

  const onPointerMove: MouseEventHandler<HTMLElement> = (event) => {
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

  const onPointerLeave = () => {
    targetPtrRef.current = { x: 0, y: 0 };
    schedulePointerFrame();
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero"
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-[#03060d]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#03060d_0%,#040913_45%,#02050b_100%)]" />

      <div
        ref={atmosphereRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-90"
          style={{
            transform: "translate3d(var(--hero-atmo-x,0px),var(--hero-atmo-y,0px),0)",
            background:
              "radial-gradient(900px 560px at 76% 14%, rgba(61,102,173,0.22), transparent 68%)",
          }}
        />
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(700px_500px_at_28%_74%,rgba(9,17,33,0.78),transparent_72%)]" />
        <div className="absolute inset-0 opacity-40 [background:linear-gradient(140deg,rgba(197,214,255,0.06)_0%,transparent_28%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background:linear-gradient(90deg,transparent_0%,rgba(218,231,255,0.1)_38%,transparent_52%,rgba(200,219,255,0.08)_72%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.2] [background:linear-gradient(180deg,transparent_0%,rgba(176,201,255,0.06)_48%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,11,0.98)_0%,rgba(2,5,11,0.72)_36%,rgba(2,5,11,0.24)_58%,rgba(2,5,11,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_44%,transparent_0%,rgba(2,5,11,0.36)_62%,rgba(2,5,11,0.88)_100%)]" />
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.3rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative min-h-[calc(100dvh-5rem)]">
          <div
            ref={contentRef}
            className="relative z-[8] max-w-[680px] pb-20 pt-14 lg:ml-8 lg:pb-0 lg:pt-24"
          >
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(171,184,205,0.72)] ${HERO_ANIM_INIT}`}
            >
              UpLevel Services / Signature positioning / Applied AI intake
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[5.9ch] font-display text-[rgba(252,254,255,0.995)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3.95rem,8.1vw,8.7rem)",
                lineHeight: 0.79,
                letterSpacing: "-0.076em",
              }}
            >
              <span className="block">The first</span>
              <span className="block">impression</span>
              <span className="block">that wins the</span>
              <span className="block">premium bid.</span>
            </h1>

            <p
              ref={copyRef}
              className={`mt-12 max-w-[32ch] font-body text-[rgba(170,186,212,0.74)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(0.98rem,1.1vw,1.1rem)",
                lineHeight: 1.74,
                letterSpacing: "-0.012em",
              }}
            >
              We design high-end websites, conversion architecture, and AI-powered intake
              systems for luxury contractors that need trust, clarity, and perceived value
              before the first call ever happens.
            </p>

            <div
              ref={ctaRef}
              className={`mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 ${HERO_ANIM_INIT}`}
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

            <div ref={microProofRef} className={`mt-14 flex flex-wrap items-center gap-2 ${HERO_ANIM_INIT}`}>
              {[
                "Luxury pools",
                "Custom builders",
                "Wine cellars",
                "Premium outdoor living",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-body text-[9px] uppercase tracking-[0.18em] text-white/34 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-[6] hidden lg:block"
            aria-hidden="true"
          >
            <div
              ref={stageRef}
              className={`absolute bottom-[8%] right-[1%] top-[8%] w-[58%] ${HERO_ANIM_INIT}`}
              style={{
                transform: "translate3d(var(--hero-stage-x,0px),var(--hero-stage-y,0px),0)",
              }}
            >
              <div className="absolute inset-[8%_9%_24%_13%] bg-[radial-gradient(circle_at_74%_26%,rgba(154,196,255,0.18),transparent_66%)]" />
              <div className="absolute inset-[14%_8%_22%_10%] rounded-[34px] border border-white/7 bg-[linear-gradient(152deg,rgba(10,16,28,0.3),rgba(8,12,22,0.14))]" />
              <div className="absolute inset-[19%_13%_28%_15%] rounded-[28px] border border-white/8" />
              <div className="absolute inset-[31%_18%_53%_20%] h-[1px] bg-gradient-to-r from-transparent via-white/16 to-transparent" />
              <div className="absolute inset-[54%_24%_36%_28%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="absolute left-[19%] top-[20%] h-[58%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              <svg
                className="absolute inset-[26%_16%_34%_24%] h-auto w-auto opacity-[0.16]"
                viewBox="0 0 820 520"
                fill="none"
              >
                <path
                  d="M64 424C190 360 250 296 352 232C472 158 560 126 780 88"
                  stroke="rgba(199,225,255,0.16)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M64 424C190 360 250 296 352 232C472 158 560 126 780 88"
                  stroke="rgba(122,198,255,0.24)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="5 18"
                  className="motion-safe:animate-[heroSignalSweep_6.6s_linear_infinite]"
                />
                <circle cx="352" cy="232" r="4.8" fill="rgba(255,255,255,0.2)" />
                <circle cx="520" cy="150" r="4.8" fill="rgba(255,255,255,0.2)" />
                <circle cx="680" cy="110" r="4.8" fill="rgba(255,255,255,0.24)" />
              </svg>
            </div>

            <div
              ref={dossierRef}
              className={`absolute bottom-[6%] right-[4%] w-[clamp(420px,31vw,500px)] border border-white/14 bg-[linear-gradient(165deg,rgba(9,15,28,0.97),rgba(7,12,23,0.94))] p-10 shadow-[0_70px_140px_rgba(0,0,0,0.48)] ${HERO_ANIM_INIT}`}
              style={{
                transform:
                  "translate3d(var(--hero-dossier-x,0px),var(--hero-dossier-y,0px),0) rotate(-1.45deg)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_90%_8%,rgba(82,122,194,0.14),transparent_42%)]" />
              <div className="relative">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/48">
                  Owner dossier
                </p>

                <h2 className="mt-4 max-w-[11ch] font-display text-[3rem] leading-[0.9] tracking-[-0.055em] text-white/95">
                  Premium lead secured.
                </h2>

                <p className="mt-5 max-w-[34ch] font-body text-[0.98rem] leading-relaxed text-white/74">
                  Custom wine cellar and climate system for a $350k scope. Budget verified,
                  architectural drawings attached, decision-maker engaged, consultation
                  confirmed.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/10 pt-5">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                      Market
                    </p>
                    <p className="mt-1 text-[0.95rem] text-white/84">Austin + West Lake Hills</p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                      Status
                    </p>
                    <p className="mt-1 text-[0.95rem] text-white/84">Owner review at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-14 lg:hidden">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-[linear-gradient(165deg,rgba(10,16,30,0.96),rgba(8,13,24,0.92))] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <div className="relative px-5 pb-5 pt-6">
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_82%_14%,rgba(87,126,200,0.16),transparent_46%)]" />
                <div className="relative">
                  <p className="font-body text-[10px] uppercase tracking-[0.26em] text-white/46">
                    Owner dossier
                  </p>
                  <p className="mt-3 max-w-[12ch] font-display text-[2rem] leading-[0.92] tracking-[-0.055em] text-white">
                    Premium lead secured.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/74">
                    $350k scope, budget verified, drawings attached, consultation confirmed.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/42">
                        Market
                      </p>
                      <p className="mt-1 text-sm text-white/82">Austin</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/42">
                        Status
                      </p>
                      <p className="mt-1 text-sm text-white/82">Owner review</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#02050b] to-transparent" />
        </div>
      </div>
    </section>
  );
}
