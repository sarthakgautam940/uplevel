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
  const contentRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microMetaRef = useRef<HTMLDivElement>(null);

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
        microMetaRef.current,
        stageRef.current,
        railRef.current,
        dossierRef.current,
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
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.92, ease: "power3.out" },
          0.16,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 18 },
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
          microMetaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.48, ease: "power3.out" },
          0.46,
        )
        .fromTo(
          stageRef.current,
          { opacity: 0, scale: 0.985, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.05, ease: "power2.out" },
          0.2,
        )
        .fromTo(
          railRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: "power2.out" },
          0.34,
        )
        .fromTo(
          dossierRef.current,
          { opacity: 0, y: 26, rotate: -3 },
          { opacity: 1, y: 0, rotate: -1.8, duration: 0.9, ease: "power3.out" },
          0.36,
        );

      gsap.to(contentRef.current, {
        yPercent: -2.25,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(stageRef.current, {
        yPercent: -4.8,
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

      root.style.setProperty(
        "--hero-atmo-x",
        `${clamp(smooth.x * 18, -10, 10)}px`,
      );
      root.style.setProperty(
        "--hero-atmo-y",
        `${clamp(smooth.y * 18, -10, 10)}px`,
      );
      root.style.setProperty(
        "--hero-stage-x",
        `${clamp(smooth.x * 12, -8, 8)}px`,
      );
      root.style.setProperty(
        "--hero-stage-y",
        `${clamp(smooth.y * 12, -8, 8)}px`,
      );
      root.style.setProperty(
        "--hero-card-x",
        `${clamp(smooth.x * 15, -10, 10)}px`,
      );
      root.style.setProperty(
        "--hero-card-y",
        `${clamp(smooth.y * 10, -7, 7)}px`,
      );

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
            transform: translateX(-18%) translateY(0%);
            opacity: 0;
          }
          12% {
            opacity: 0.18;
          }
          55% {
            opacity: 0.12;
          }
          100% {
            transform: translateX(16%) translateY(0%);
            opacity: 0;
          }
        }

        @keyframes heroPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
        }

        @keyframes heroSignalTravel {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }

        @keyframes heroStatusLoop {
          0%,
          22% {
            opacity: 1;
            transform: translateY(0);
          }
          26% {
            opacity: 0;
            transform: translateY(-40%);
          }
          30% {
            opacity: 0;
            transform: translateY(40%);
          }
          34%,
          56% {
            opacity: 1;
            transform: translateY(0);
          }
          60% {
            opacity: 0;
            transform: translateY(-40%);
          }
          64% {
            opacity: 0;
            transform: translateY(40%);
          }
          68%,
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroBeamDrift {
          0%,
          100% {
            transform: translateX(-2%) translateY(0);
            opacity: 0.52;
          }
          50% {
            transform: translateX(2%) translateY(-1%);
            opacity: 0.82;
          }
        }

        @keyframes heroTypeIn {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0.72;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        .hero-sweep {
          animation: heroSweep 5.8s ease-in-out infinite;
        }

        .hero-pulse {
          animation: heroPulse 2.6s ease-in-out infinite;
        }

        .hero-status-a,
        .hero-status-b,
        .hero-status-c {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
        }

        .hero-status-a {
          animation: heroStatusLoop 4.8s ease-in-out infinite;
          animation-delay: 0s;
        }

        .hero-status-b {
          animation: heroStatusLoop 4.8s ease-in-out infinite;
          animation-delay: 1.6s;
        }

        .hero-status-c {
          animation: heroStatusLoop 4.8s ease-in-out infinite;
          animation-delay: 3.2s;
        }

        .hero-traveler {
          offset-path: path(
            "M 40 310 C 170 260, 300 190, 420 140 S 650 78, 820 64"
          );
          animation: heroSignalTravel 5.2s linear infinite;
        }

        .hero-beam {
          animation: heroBeamDrift 7.5s ease-in-out infinite;
        }

        .hero-type {
          animation: heroTypeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.78s;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#03060d_0%,#040913_46%,#02050b_100%)]" />

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
              "radial-gradient(900px 560px at 77% 16%, rgba(61,104,176,0.24), transparent 68%)",
          }}
        />

        <div className="absolute inset-0 opacity-50 [background:radial-gradient(700px_500px_at_26%_72%,rgba(8,17,34,0.82),transparent_72%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,11,0.98)_0%,rgba(2,5,11,0.86)_28%,rgba(2,5,11,0.28)_58%,rgba(2,5,11,0.16)_100%)]" />

        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:128px_128px]" />

        <div className="hero-beam absolute inset-y-0 right-[16%] w-[24%] bg-[radial-gradient(50%_100%_at_50%_0%,rgba(176,204,255,0.14),transparent_72%)] blur-2xl" />
      </div>

      <div className="relative z-[4] mx-auto min-h-[100dvh] w-full max-w-[1600px] px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.75rem))] pt-[calc(3.25rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative min-h-[calc(100dvh-5rem)]">
          <div
            ref={contentRef}
            className="relative z-[8] max-w-[760px] pb-20 pt-10 lg:pb-0 lg:pt-14"
          >
            <p
              ref={eyebrowRef}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.34em] text-[rgba(171,184,205,0.72)] ${HERO_ANIM_INIT}`}
            >
              Precision-built for luxury service businesses.
            </p>

            <h1
              ref={headlineRef}
              className={`mt-6 max-w-[7.15ch] font-display text-[rgba(250,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(3.5rem,7.4vw,7.85rem)",
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
              className={`mt-8 max-w-[34ch] font-body text-[rgba(186,199,220,0.84)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(1.02rem,1.22vw,1.18rem)",
                lineHeight: 1.66,
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
                  <path
                    d="M1 6h10M7 2l4 4-4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </TransitionLink>
            </div>

            <div
              ref={microMetaRef}
              className={`mt-10 flex flex-wrap items-center gap-3 ${HERO_ANIM_INIT}`}
            >
              {["Luxury pools", "Custom builders", "Wine cellars"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/8 bg-white/[0.025] px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.18em] text-white/46 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={stageRef}
            className={`pointer-events-none absolute inset-0 z-[6] hidden lg:block ${HERO_ANIM_INIT}`}
            aria-hidden="true"
            style={{
              transform: "translate3d(var(--hero-stage-x,0px),var(--hero-stage-y,0px),0)",
            }}
          >
            <div className="absolute right-[4%] top-[10%] h-[72%] w-[49%]">
              <div className="absolute inset-[2%_2%_10%_12%] rounded-[2.5rem] border border-white/11" />
              <div className="absolute inset-[12%_10%_22%_18%] rounded-[2rem] border border-white/8" />
              <div className="absolute inset-[20%_16%_30%_26%] rounded-[1.75rem] border border-white/6 bg-[linear-gradient(160deg,rgba(8,15,27,0.38),rgba(8,12,22,0.12))] shadow-[inset_0_0_120px_rgba(120,162,234,0.05)]" />

              <div className="absolute right-[10%] top-[6%] h-[42%] w-[46%] bg-[radial-gradient(circle_at_50%_0%,rgba(219,233,255,0.16),transparent_75%)] blur-2xl" />

              <div
                ref={railRef}
                className={`absolute inset-[10%_8%_16%_10%] ${HERO_ANIM_INIT}`}
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 900 520"
                  fill="none"
                >
                  <path
                    d="M40 310 C170 260 300 190 420 140 S650 78 820 64"
                    stroke="rgba(130,156,210,0.10)"
                    strokeWidth="1.4"
                  />
                  <circle cx="302" cy="191" r="3" fill="rgba(140,170,230,0.14)" />
                  <circle cx="503" cy="117" r="3" fill="rgba(140,170,230,0.14)" />
                  <circle cx="654" cy="84" r="3" fill="rgba(140,170,230,0.14)" />
                </svg>

                <div className="hero-traveler absolute h-2.5 w-2.5 rounded-full bg-[rgba(165,200,255,0.95)] shadow-[0_0_20px_rgba(90,150,255,0.8)]" />

                <div className="absolute left-[13%] top-[56%] rounded-full border border-white/8 bg-[rgba(8,14,25,0.6)] px-3 py-2 backdrop-blur-md">
                  <span className="font-body text-[9px] uppercase tracking-[0.22em] text-white/44">
                    Captured
                  </span>
                </div>

                <div className="absolute left-[44%] top-[28%] rounded-full border border-white/8 bg-[rgba(8,14,25,0.6)] px-3 py-2 backdrop-blur-md">
                  <span className="font-body text-[9px] uppercase tracking-[0.22em] text-white/44">
                    Qualified
                  </span>
                </div>

                <div className="absolute right-[8%] top-[8%] rounded-full border border-white/8 bg-[rgba(8,14,25,0.6)] px-3 py-2 backdrop-blur-md">
                  <span className="font-body text-[9px] uppercase tracking-[0.22em] text-white/44">
                    Routed
                  </span>
                </div>
              </div>
            </div>

            <div
              ref={dossierRef}
              className={`absolute right-[7%] top-[27%] w-[min(540px,36vw)] rounded-[1.75rem] border border-white/15 bg-[linear-gradient(165deg,rgba(9,15,28,0.96),rgba(7,12,23,0.93))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] ${HERO_ANIM_INIT}`}
              style={{
                transform:
                  "translate3d(var(--hero-card-x,0px),var(--hero-card-y,0px),0) rotate(-1.8deg)",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
                <div className="hero-sweep absolute inset-y-0 left-[-18%] w-[38%] bg-[linear-gradient(90deg,transparent,rgba(120,162,234,0.09),transparent)] blur-xl" />
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_88%_10%,rgba(78,118,190,0.16),transparent_42%)]" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between gap-6">
                  <div className="relative h-4 w-[230px] overflow-hidden">
                    <div className="hero-status-a font-body text-[10px] uppercase tracking-[0.28em] text-white/58">
                      Lead captured
                    </div>
                    <div className="hero-status-b font-body text-[10px] uppercase tracking-[0.28em] text-white/58">
                      Lead qualified
                    </div>
                    <div className="hero-status-c font-body text-[10px] uppercase tracking-[0.28em] text-white/58">
                      Routed to estimator
                    </div>
                  </div>

                  <div className="relative h-3.5 w-3.5">
                    <span className="hero-pulse absolute inset-0 rounded-full bg-[rgba(165,200,255,0.9)] shadow-[0_0_18px_rgba(90,150,255,0.6)]" />
                  </div>
                </div>

                <p className="mt-5 font-body text-[10px] uppercase tracking-[0.28em] text-white/46">
                  Owner dossier
                </p>

                <div className="mt-5 space-y-3 font-body text-[1.02rem] leading-[1.5] text-white/88">
                  <p className="hero-type text-[1.12rem] text-white/94">
                    Custom wine cellar — $350K scope
                  </p>
                  <p>Budget confirmed</p>
                  <p>Architectural drawings attached</p>
                  <p>Decision-maker engaged</p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                        Status
                      </p>
                      <p className="mt-2 text-[1rem] text-white/86">
                        Routing to estimator
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                        Next
                      </p>
                      <p className="mt-2 text-[1rem] text-white/86">
                        Owner review at 9:00 AM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/42">
                    Market
                  </p>
                  <p className="mt-2 text-[0.98rem] text-white/82">
                    Austin + West Lake Hills
                  </p>
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
                  <p className="mt-3 text-base uppercase tracking-[0.22em] text-white/58">
                    Lead qualified
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/86">
                    Custom wine cellar — $350K scope
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/74">
                    Budget confirmed. Drawings attached. Decision-maker engaged.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/42">
                        Status
                      </p>
                      <p className="mt-1 text-sm text-white/82">Routing to estimator</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/42">
                        Next
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
