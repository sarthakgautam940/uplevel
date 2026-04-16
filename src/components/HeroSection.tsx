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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroSection({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const artifactRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const frameNeededRef = useRef(false);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
        artifactRef.current,
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
        { opacity: 1, duration: 1.05, ease: "power2.out" },
        0,
      )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" },
          0.08,
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.92, ease: "power3.out" },
          0.16,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.56, ease: "power3.out" },
          0.32,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" },
          0.42,
        )
        .fromTo(
          stageRef.current,
          { opacity: 0, scale: 0.985, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
          0.18,
        )
        .fromTo(
          artifactRef.current,
          { opacity: 0, y: 28, rotate: -2.2 },
          { opacity: 1, y: 0, rotate: -1.15, duration: 0.92, ease: "power3.out" },
          0.32,
        );

      gsap.to(contentRef.current, {
        yPercent: -2.2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(stageRef.current, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(artifactRef.current, {
        yPercent: -5.5,
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

  const schedulePointerFrame = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = sectionRef.current;
    if (!root) return;

    frameNeededRef.current = true;
    if (rafRef.current != null) return;

    const update = () => {
      rafRef.current = null;

      const target = targetRef.current;
      const smooth = smoothRef.current;

      smooth.x += (target.x - smooth.x) * 0.075;
      smooth.y += (target.y - smooth.y) * 0.075;

      root.style.setProperty("--hero-atmo-x", `${clamp(smooth.x * 18, -10, 10)}px`);
      root.style.setProperty("--hero-atmo-y", `${clamp(smooth.y * 16, -8, 8)}px`);
      root.style.setProperty("--hero-stage-x", `${clamp(smooth.x * 10, -6, 6)}px`);
      root.style.setProperty("--hero-stage-y", `${clamp(smooth.y * 10, -6, 6)}px`);
      root.style.setProperty("--hero-artifact-x", `${clamp(smooth.x * 14, -8, 8)}px`);
      root.style.setProperty("--hero-artifact-y", `${clamp(smooth.y * 10, -6, 6)}px`);

      const moving =
        Math.abs(target.x - smooth.x) > 0.001 ||
        Math.abs(target.y - smooth.y) > 0.001 ||
        frameNeededRef.current;

      frameNeededRef.current = false;

      if (moving) rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
  };

  const onPointerMove: MouseEventHandler<HTMLElement> = (event) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = sectionRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();

    targetRef.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };

    schedulePointerFrame();
  };

  const onPointerLeave = () => {
    targetRef.current = { x: 0, y: 0 };
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
      <style jsx>{`
        @keyframes heroSweep {
          0% {
            transform: translateX(-20%);
            opacity: 0;
          }
          18% {
            opacity: 0.14;
          }
          55% {
            opacity: 0.1;
          }
          100% {
            transform: translateX(20%);
            opacity: 0;
          }
        }

        @keyframes heroPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.68;
          }
          50% {
            transform: scale(1.16);
            opacity: 1;
          }
        }

        .hero-sweep {
          animation: heroSweep 6.4s ease-in-out infinite;
        }

        .hero-pulse {
          animation: heroPulse 2.8s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#03060d_0%,#040912_47%,#02050b_100%)]" />

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
              "radial-gradient(920px 560px at 76% 18%, rgba(61,103,172,0.22), transparent 68%)",
          }}
        />
        <div className="absolute inset-0 opacity-45 [background:radial-gradient(760px_560px_at_26%_78%,rgba(8,16,32,0.82),transparent_72%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,11,0.98)_0%,rgba(2,5,11,0.9)_30%,rgba(2,5,11,0.32)_58%,rgba(2,5,11,0.18)_100%)]" />
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.25rem,calc(env(safe-area-inset-bottom)+1.5rem))] pt-[calc(3.2rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="grid min-h-[calc(100dvh-4.75rem)] items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,0.95fr)] lg:gap-8 xl:gap-12">
          <div
            ref={contentRef}
            className="relative z-[8] max-w-[760px] pb-8 pt-8 lg:pb-0 lg:pt-10"
          >
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(171,184,205,0.72)] ${HERO_ANIM_INIT}`}
            >
              Precision-built for luxury service businesses.
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[7ch] font-display text-[rgba(250,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3.2rem,6.9vw,7.15rem)",
                lineHeight: 0.84,
                letterSpacing: "-0.074em",
              }}
            >
              <span className="block">The first</span>
              <span className="block">impression</span>
              <span className="block">that wins the</span>
              <span className="block">premium bid.</span>
            </h1>

            <p
              ref={copyRef}
              className={`mt-8 max-w-[33ch] font-body text-[rgba(186,199,220,0.84)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(1rem,1.16vw,1.16rem)",
                lineHeight: 1.68,
                letterSpacing: "-0.012em",
              }}
            >
              UpLevel designs authority-driven websites and automation systems for
              builders, designers, and specialty contractors that need to command trust
              before the first call.
            </p>

            <div
              ref={ctaRef}
              className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 ${HERO_ANIM_INIT}`}
            >
              <MagneticButton
                href={bookUrl}
                variant="primary"
                luxe
                aria-label="Book a strategy call"
              >
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

          <div
            ref={stageRef}
            className={`relative hidden h-[min(72vh,760px)] min-h-[560px] ${HERO_ANIM_INIT} lg:block`}
            style={{
              transform: "translate3d(var(--hero-stage-x,0px),var(--hero-stage-y,0px),0)",
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-[8%_6%_10%_8%] rounded-[2.9rem] border border-white/10" />
            <div className="absolute inset-[18%_16%_20%_18%] rounded-[2.3rem] border border-white/8" />
            <div className="absolute inset-[0%_8%_28%_26%] bg-[radial-gradient(circle_at_50%_0%,rgba(226,236,255,0.16),transparent_74%)] blur-2xl" />

            <div className="absolute inset-[22%_16%_18%_18%] rounded-[2.25rem] bg-[linear-gradient(160deg,rgba(8,14,25,0.34),rgba(7,11,20,0.1))] shadow-[inset_0_0_90px_rgba(120,162,234,0.04)]" />

            <div className="absolute left-[22%] top-[28%] h-[1px] w-[42%] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            <div className="absolute right-[18%] top-[58%] h-[1px] w-[28%] bg-gradient-to-r from-transparent via-white/12 to-transparent" />

            <div
              ref={artifactRef}
              className={`absolute left-[21%] top-[34%] w-[min(480px,76%)] rounded-[1.9rem] border border-white/14 bg-[linear-gradient(165deg,rgba(9,15,28,0.965),rgba(7,12,23,0.94))] p-8 shadow-[0_42px_120px_rgba(0,0,0,0.54)] ${HERO_ANIM_INIT}`}
              style={{
                transform:
                  "translate3d(var(--hero-artifact-x,0px),var(--hero-artifact-y,0px),0) rotate(-1.15deg)",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
                <div className="hero-sweep absolute inset-y-0 left-[-22%] w-[34%] bg-[linear-gradient(90deg,transparent,rgba(126,166,235,0.08),transparent)] blur-xl" />
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_92%_10%,rgba(80,121,193,0.14),transparent_42%)]" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/46">
                      Project brief
                    </p>
                    <p className="mt-3 font-display text-[2.3rem] leading-[0.9] tracking-[-0.058em] text-white">
                      Premium lead secured.
                    </p>
                  </div>

                  <div className="relative h-3.5 w-3.5 shrink-0">
                    <span className="hero-pulse absolute inset-0 rounded-full bg-[rgba(165,200,255,0.92)] shadow-[0_0_18px_rgba(90,150,255,0.6)]" />
                  </div>
                </div>

                <p className="mt-5 max-w-[32ch] font-body text-[1rem] leading-relaxed text-white/78">
                  West Lake Hills residence. Full interior renovation. $420K estimated
                  project value. Strategy call booked in 14 minutes.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/10 pt-5">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                      Market
                    </p>
                    <p className="mt-2 text-[0.98rem] text-white/84">
                      Austin + West Lake Hills
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                      Outcome
                    </p>
                    <p className="mt-2 text-[0.98rem] text-white/84">
                      Strategy call booked
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-10 lg:hidden">
            <div className="overflow-hidden rounded-[1.65rem] border border-white/12 bg-[linear-gradient(165deg,rgba(10,16,30,0.96),rgba(8,13,24,0.92))] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <div className="relative px-5 pb-5 pt-6">
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_82%_14%,rgba(87,126,200,0.15),transparent_46%)]" />
                <div className="relative">
                  <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/46">
                    Project brief
                  </p>
                  <p className="mt-3 font-display text-[1.8rem] leading-[0.92] tracking-[-0.05em] text-white">
                    Premium lead secured.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/74">
                    West Lake Hills residence. Full interior renovation. $420K estimated
                    project value.
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
                        Outcome
                      </p>
                      <p className="mt-1 text-sm text-white/82">Call booked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-[#02050b] to-transparent" />
        </div>
      </div>
    </section>
  );
}
