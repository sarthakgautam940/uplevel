"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEventHandler } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bookUrl } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";
import TransitionLink from "./TransitionLink";
import HeroSignalInteractive from "./HeroSignalInteractive";

gsap.registerPlugin(ScrollTrigger);

type Props = { ready: boolean };

const METRICS = [
  { value: "14 days", label: "Launch window" },
  { value: "24/7", label: "Lead intake" },
  { value: "4 seconds", label: "First judgment" },
];

const HERO_ANIM_INIT = "opacity-0 motion-reduce:opacity-100";

function capPx(n: number, scale: number, max: number) {
  const value = n * scale;
  if (value > max) return max;
  if (value < -max) return -max;
  return value;
}

export default function HeroSection({ ready }: Props) {
  const id = useId().replace(/:/g, "");
  const grainId = `hero-grain-${id}`;

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const mobileVisualRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      [
        backdropRef.current,
        blueprintRef.current,
        visualRef.current,
        mobileVisualRef.current,
        kickerRef.current,
        headlineRef.current,
        subRef.current,
        ctaRowRef.current,
        metricsRef.current,
        scrollRef.current,
      ].forEach((element) => {
        if (!element) return;
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.06 });

      if (backdropRef.current) {
        timeline.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: "power2.out" },
          0,
        );
      }

      if (blueprintRef.current) {
        timeline.fromTo(
          blueprintRef.current,
          { opacity: 0, y: 24, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 1.05, ease: "power3.out" },
          0.04,
        );
      }

      if (visualRef.current) {
        timeline.fromTo(
          visualRef.current,
          { opacity: 0, y: 22, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
          0.12,
        );
      }

      if (mobileVisualRef.current) {
        timeline.fromTo(
          mobileVisualRef.current,
          { opacity: 0, y: 18, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
          0.16,
        );
      }

      if (kickerRef.current) {
        timeline.fromTo(
          kickerRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.46, ease: "power3.out" },
          0.08,
        );
      }

      if (headlineRef.current) {
        timeline.fromTo(
          headlineRef.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.16,
        );
      }

      if (subRef.current) {
        timeline.fromTo(
          subRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.28,
        );
      }

      if (ctaRowRef.current) {
        timeline.fromTo(
          ctaRowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" },
          0.36,
        );
      }

      if (metricsRef.current) {
        timeline.fromTo(
          metricsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" },
          0.46,
        );
      }

      if (scrollRef.current) {
        timeline.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          0.66,
        );
      }
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
          yPercent: -3.5,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (visualRef.current) {
        gsap.to(visualRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (blueprintRef.current) {
        gsap.to(blueprintRef.current, {
          yPercent: -4,
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

      const visualX = capPx(smooth.x, 20, 12);
      const visualY = capPx(smooth.y, 16, 10);
      const blueprintX = capPx(smooth.x, 10, 6);
      const blueprintY = capPx(smooth.y, 9, 6);

      root.style.setProperty("--hero-vx", `${visualX}px`);
      root.style.setProperty("--hero-vy", `${visualY}px`);
      root.style.setProperty("--hero-bx", `${blueprintX}px`);
      root.style.setProperty("--hero-by", `${blueprintY}px`);

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
            "linear-gradient(180deg, #04070d 0%, #050911 38%, #050912 100%)",
        }}
      />

      <div
        ref={backdropRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.03) 0%, transparent 28%)",
            "radial-gradient(circle at 82% 24%, rgba(201,168,76,0.045) 0%, transparent 24%)",
            "radial-gradient(circle at 72% 72%, rgba(255,255,255,0.025) 0%, transparent 32%)",
          ].join(", "),
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.018]"
        aria-hidden="true"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                numOctaves="3"
                stitchTiles="stitch"
                result="grain"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="24s"
                  repeatCount="indefinite"
                  values="0.8 0.8;1.05 0.92;0.85 0.88;0.8 0.8"
                />
              </feTurbulence>
              <feColorMatrix in="grain" type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>

      <div className="relative z-[5] mx-auto max-w-[1600px] px-6 pb-[max(3rem,calc(env(safe-area-inset-bottom)+1.25rem))] pt-[calc(5.6rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:pb-[max(4rem,calc(env(safe-area-inset-bottom)+1.5rem))] lg:pt-[calc(6.4rem+env(safe-area-inset-top))] xl:px-16">
        <div className="grid min-h-[100dvh] items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(480px,0.88fr)] lg:gap-[4.5rem]">
          <div
            ref={contentRef}
            className="relative z-[6] flex max-w-[760px] flex-col justify-center"
          >
            <p
              ref={kickerRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(154,166,186,0.72)] ${HERO_ANIM_INIT}`}
            >
              Virginia / Precision digital / Applied AI
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 font-display text-[rgba(246,247,251,0.97)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3.2rem, 6.3vw, 6.1rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.055em",
              }}
            >
              <span className="block">The authority</span>
              <span className="block">your market</span>
              <span className="block">feels on</span>
              <span className="block text-white/82">first contact.</span>
            </h1>

            <p
              ref={subRef}
              className={`mt-6 max-w-[35ch] font-body text-[rgba(174,185,204,0.78)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(1.05rem, 1.34vw, 1.28rem)",
                lineHeight: 1.72,
                letterSpacing: "-0.015em",
              }}
            >
              Signature-caliber websites, embedded voice intake, and lead handling for premium
              operators who cannot afford a generic first impression.
            </p>

            <div
              ref={ctaRowRef}
              className={`mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8 ${HERO_ANIM_INIT}`}
            >
              <MagneticButton
                href={bookUrl}
                variant="primary"
                luxe
                aria-label="Discuss your vision"
              >
                Discuss your vision
              </MagneticButton>

              <TransitionLink
                href="/work"
                className="group inline-flex items-center gap-2 font-body text-[12px] font-medium uppercase tracking-[0.22em] text-white/70 transition-colors duration-500 hover:text-white"
              >
                <span className="border-b border-white/35 pb-1 transition-colors duration-500 group-hover:border-white/70">
                  View selected work
                </span>
                <svg
                  className="h-3 w-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
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

            <div
              ref={metricsRef}
              className={`mt-10 flex flex-wrap gap-3 ${HERO_ANIM_INIT}`}
            >
              {METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset" }}
                >
                  <div className="font-display text-[1.22rem] leading-none tracking-[-0.05em] text-white/92">
                    {metric.value}
                  </div>
                  <div className="mt-1 font-body text-[9px] uppercase tracking-[0.22em] text-white/38">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <div ref={mobileVisualRef} className={`relative mt-12 lg:hidden ${HERO_ANIM_INIT}`}>
              <HeroSignalInteractive compact />
            </div>
          </div>

          <div className="relative hidden min-h-[620px] items-center lg:flex">
            <div
              ref={blueprintRef}
              className={`pointer-events-none absolute inset-[-8%_-6%_-10%_-10%] ${HERO_ANIM_INIT}`}
              style={{
                transform: "translate3d(var(--hero-bx, 0px), var(--hero-by, 0px), 0)",
              }}
              aria-hidden="true"
            >
              <div className="absolute inset-[20%_14%_16%_18%] rounded-[999px] bg-[radial-gradient(circle_at_50%_42%,rgba(201,168,76,0.06)_0%,transparent_56%)]" />
              <svg viewBox="0 0 820 700" className="h-full w-full">
                <g fill="none">
                  <line x1="460" y1="32" x2="460" y2="664" stroke="rgba(255,255,255,0.07)" />
                  <line x1="142" y1="418" x2="758" y2="418" stroke="rgba(255,255,255,0.06)" />
                  <line x1="244" y1="504" x2="758" y2="504" stroke="rgba(255,255,255,0.045)" />
                  <line x1="244" y1="524" x2="758" y2="524" stroke="rgba(255,255,255,0.045)" />
                  <line x1="244" y1="544" x2="758" y2="544" stroke="rgba(255,255,255,0.045)" />
                  <circle
                    cx="460"
                    cy="332"
                    r="194"
                    stroke="rgba(255,255,255,0.065)"
                    strokeDasharray="3 7"
                  />
                  <circle cx="460" cy="332" r="108" stroke="rgba(255,255,255,0.04)" />
                  <path
                    d="M 286 544 L 460 188 L 634 544"
                    stroke="rgba(255,255,255,0.085)"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 336 420 L 460 264 L 584 420"
                    stroke="rgba(255,255,255,0.055)"
                    strokeWidth="1"
                  />
                  <path d="M 316 502 H 604" stroke="rgba(255,255,255,0.08)" />
                  <path
                    d="M 246 126 L 342 8"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <path
                    d="M 562 8 L 658 126"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </div>

            <div
              ref={visualRef}
              className={`relative z-[2] ml-auto h-[560px] w-[min(100%,620px)] ${HERO_ANIM_INIT}`}
              style={{
                transform: "translate3d(var(--hero-vx, 0px), var(--hero-vy, 0px), 0)",
              }}
            >
              <HeroSignalInteractive className="h-full" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`pointer-events-none absolute bottom-8 left-1/2 z-[20] -translate-x-1/2 md:bottom-10 ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div className="relative h-12 w-[2px] overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-[rgba(201,168,76,0.12)] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[var(--warm)]/24 to-transparent motion-safe:animate-[heroScrollShine_2.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
