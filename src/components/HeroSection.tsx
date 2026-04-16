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
  const portalWrapRef = useRef<HTMLDivElement>(null);
  const artifactRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
        portalWrapRef.current,
        artifactRef.current,
      ].forEach((el) => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "none";
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
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
          0.16,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" },
          0.3,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" },
          0.37,
        )
        .fromTo(
          portalWrapRef.current,
          { opacity: 0, y: 16, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "power2.out" },
          0.24,
        )
        .fromTo(
          artifactRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.88, ease: "power3.out" },
          0.36,
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

      gsap.to(portalWrapRef.current, {
        yPercent: -4,
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

      root.style.setProperty("--hero-atmo-x", `${clampOffset(smooth.x, 16, 10)}px`);
      root.style.setProperty("--hero-atmo-y", `${clampOffset(smooth.y, 14, 9)}px`);
      root.style.setProperty("--hero-portal-x", `${clampOffset(smooth.x, 11, 7)}px`);
      root.style.setProperty("--hero-portal-y", `${clampOffset(smooth.y, 9, 6)}px`);
      root.style.setProperty("--hero-artifact-x", `${clampOffset(smooth.x, 8, 5)}px`);
      root.style.setProperty("--hero-artifact-y", `${clampOffset(smooth.y, 7, 4)}px`);

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
      className="relative isolate overflow-hidden bg-[#04070f]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#04070f_0%,#040810_52%,#02050b_100%)]" />

      <div
        ref={atmosphereRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: "translate3d(var(--hero-atmo-x,0px),var(--hero-atmo-y,0px),0)",
            background:
              "radial-gradient(760px 540px at 72% 40%, rgba(138,178,246,0.17), transparent 68%)",
          }}
        />
        <div className="absolute inset-0 opacity-70 [background:linear-gradient(180deg,transparent_0%,rgba(17,28,47,0.3)_48%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-40 [background:linear-gradient(90deg,rgba(2,5,11,0.97)_0%,rgba(2,5,11,0.58)_42%,rgba(2,5,11,0.14)_60%,rgba(2,5,11,0.7)_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background:linear-gradient(90deg,transparent_0%,rgba(200,221,255,0.16)_40%,transparent_52%,rgba(200,221,255,0.1)_76%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,5,11,0.5)_64%,rgba(2,5,11,0.9)_100%)]" />
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.3rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative min-h-[calc(100dvh-5rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(520px,1.08fr)] lg:items-center lg:gap-10">
          <div ref={contentRef} className="relative z-[8] max-w-[700px] pb-14 pt-10 lg:pb-0 lg:pt-0">
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(171,184,205,0.72)] ${HERO_ANIM_INIT}`}
            >
              Precision-built for luxury service businesses.
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[11ch] font-display text-[rgba(250,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3rem,5.9vw,6.3rem)",
                lineHeight: 0.86,
                letterSpacing: "-0.056em",
              }}
            >
              The first impression that wins the premium bid.
            </h1>

            <p
              ref={copyRef}
              className={`mt-9 max-w-[43ch] font-body text-[rgba(172,188,212,0.76)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(0.98rem,1.08vw,1.08rem)",
                lineHeight: 1.72,
                letterSpacing: "-0.01em",
              }}
            >
              UpLevel designs authority-driven websites and automation systems for builders, designers, and specialty contractors that need to command trust before the first call.
            </p>

            <div
              ref={ctaRef}
              className={`mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 ${HERO_ANIM_INIT}`}
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

          <div ref={portalWrapRef} className={`pointer-events-none relative hidden h-[74vh] min-h-[560px] lg:block ${HERO_ANIM_INIT}`} aria-hidden="true">
            <div
              className="absolute inset-[4%_3%_6%_6%]"
              style={{ transform: "translate3d(var(--hero-portal-x,0px),var(--hero-portal-y,0px),0)" }}
            >
              <div className="absolute inset-0 rounded-[46px] border border-white/16 bg-[linear-gradient(150deg,rgba(8,14,24,0.56),rgba(7,11,20,0.12))] shadow-[0_50px_120px_rgba(0,0,0,0.5)]" />
              <div className="absolute inset-[9%_8%_10%_9%] rounded-[34px] border border-white/14 bg-[linear-gradient(160deg,rgba(9,16,29,0.72),rgba(8,13,23,0.28))]" />
              <div className="absolute inset-[15%_13%_16%_14%] rounded-[28px] border border-white/12 bg-[radial-gradient(100%_85%_at_70%_25%,rgba(135,178,244,0.2),transparent_62%)] motion-safe:animate-[heroThresholdBreathe_8s_ease-in-out_infinite]" />
              <div className="absolute inset-[18%_16%_19%_17%] rounded-[24px] bg-[linear-gradient(100deg,transparent_0%,rgba(176,206,255,0.17)_48%,transparent_100%)] motion-safe:animate-[heroThresholdSweep_7.2s_linear_infinite]" />

              <div
                ref={artifactRef}
                className="absolute inset-x-[22%] bottom-[24%] top-[37%] rounded-[18px] border border-white/14 bg-[linear-gradient(162deg,rgba(10,17,30,0.95),rgba(8,13,23,0.88))] px-6 py-5"
                style={{ transform: "translate3d(var(--hero-artifact-x,0px),var(--hero-artifact-y,0px),0)" }}
              >
                <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/52">Premium lead brief</p>
                <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/86">
                  Westlake Hills residence
                  <br />
                  Full interior renovation
                  <br />
                  Estimated project value: $420K
                </p>
                <p className="mt-4 border-t border-white/10 pt-3 font-body text-[0.88rem] text-white/72">
                  Outcome: Strategy call booked in 14 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-12 lg:hidden">
            <div className="overflow-hidden rounded-[1.8rem] border border-white/14 bg-[linear-gradient(165deg,rgba(10,16,30,0.96),rgba(8,13,24,0.9))] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <div className="relative px-5 pb-5 pt-6">
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_78%_16%,rgba(95,141,214,0.2),transparent_48%)]" />
                <div className="relative">
                  <p className="font-body text-[10px] uppercase tracking-[0.26em] text-white/48">Premium lead brief</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/82">
                    Westlake Hills residence.
                    <br />
                    Full interior renovation.
                    <br />
                    Estimated project value: $420K.
                  </p>
                  <p className="mt-4 border-t border-white/10 pt-3 text-sm text-white/72">
                    Outcome: Strategy call booked in 14 minutes.
                  </p>
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
