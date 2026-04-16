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
  const artifactShellRef = useRef<HTMLDivElement>(null);
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
        artifactShellRef.current,
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
      const tl = gsap.timeline({ delay: 0.06 });

      tl.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out" },
        0,
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.95, ease: "power3.out" },
          0.12,
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          0.3,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          0.34,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          0.4,
        )
        .fromTo(
          artifactShellRef.current,
          { opacity: 0, y: 22, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.92, ease: "power2.out" },
          0.36,
        )
        .fromTo(
          artifactRef.current,
          { opacity: 0, rotate: -5.5, y: 18 },
          { opacity: 1, rotate: -3.75, y: 0, duration: 0.9, ease: "power3.out" },
          0.46,
        );

      gsap.to(contentRef.current, {
        yPercent: -2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(artifactShellRef.current, {
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

      smooth.x += (target.x - smooth.x) * 0.08;
      smooth.y += (target.y - smooth.y) * 0.08;

      root.style.setProperty("--hero-atmo-x", `${clamp(smooth.x * 16, -9, 9)}px`);
      root.style.setProperty("--hero-atmo-y", `${clamp(smooth.y * 14, -8, 8)}px`);
      root.style.setProperty("--hero-content-x", `${clamp(smooth.x * 6, -4, 4)}px`);
      root.style.setProperty("--hero-content-y", `${clamp(smooth.y * 6, -4, 4)}px`);
      root.style.setProperty("--hero-artifact-x", `${clamp(smooth.x * 12, -7, 7)}px`);
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
      className="relative isolate overflow-hidden bg-[#02050b]"
    >
      <style jsx>{`
        @keyframes dossierSweep {
          0% {
            transform: translateX(-110%) rotate(-8deg);
            opacity: 0;
          }
          25% {
            opacity: 0.18;
          }
          80% {
            opacity: 0.06;
          }
          100% {
            transform: translateX(190%) rotate(-8deg);
            opacity: 0;
          }
        }

        @keyframes atmosphereDrift {
          0%,
          100% {
            transform: translate3d(calc(var(--hero-atmo-x, 0px) - 8px), calc(var(--hero-atmo-y, 0px) - 2px), 0);
          }
          50% {
            transform: translate3d(calc(var(--hero-atmo-x, 0px) + 8px), calc(var(--hero-atmo-y, 0px) + 2px), 0);
          }
        }

        .dossier-sweep {
          animation: dossierSweep 7s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        .atmosphere-drift {
          animation: atmosphereDrift 11s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(170deg,#02050b_0%,#030814_46%,#02050a_100%)]" />

      <div
        ref={atmosphereRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div className="atmosphere-drift absolute inset-0 opacity-95 [background:radial-gradient(960px_600px_at_78%_22%,rgba(47,76,130,0.35),transparent_67%)]" />
        <div className="absolute inset-0 opacity-80 [background:radial-gradient(780px_420px_at_70%_68%,rgba(14,30,61,0.44),transparent_72%)]" />
        <div className="absolute inset-0 opacity-35 [background:linear-gradient(94deg,rgba(2,5,11,0.98)_0%,rgba(2,5,11,0.9)_42%,rgba(2,5,11,0.3)_72%,rgba(2,5,11,0.56)_100%)]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:160px_160px]" />
      </div>

      <div className="relative z-[4] mx-auto flex min-h-[100svh] w-full max-w-[1580px] items-center px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[calc(7.75rem+env(safe-area-inset-top))] sm:px-8 lg:px-12 xl:px-16">
        <div className="relative grid w-full items-center gap-7 lg:grid-cols-[minmax(580px,1.02fr)_minmax(390px,0.78fr)] xl:gap-10">
          <div
            ref={contentRef}
            className="relative z-[8] max-w-[760px]"
            style={{
              transform: "translate3d(var(--hero-content-x,0px),var(--hero-content-y,0px),0)",
            }}
          >
            <h1
              ref={headlineRef}
              className={`max-w-[10.8ch] font-display text-[rgba(250,252,255,0.99)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(2.65rem,5.85vw,6.05rem)",
                lineHeight: 0.87,
                letterSpacing: "-0.062em",
              }}
            >
              <span className="block">The first impression</span>
              <span className="block">that wins</span>
              <span className="block">the premium bid.</span>
            </h1>

            <p
              ref={eyebrowRef}
              className={`mt-6 font-body text-[11px] font-medium uppercase tracking-[0.32em] text-[rgba(178,194,219,0.66)] ${HERO_ANIM_INIT}`}
            >
              UpLevel Services • Positioning systems for premium contractors
            </p>

            <p
              ref={copyRef}
              className={`mt-6 max-w-[41ch] font-body text-[rgba(188,203,224,0.86)] ${HERO_ANIM_INIT}`}
              style={{
                fontSize: "clamp(1rem,1.12vw,1.13rem)",
                lineHeight: 1.7,
                letterSpacing: "-0.01em",
              }}
            >
              We build authority websites, trust-first messaging, and lead automation for
              luxury builders and design firms—so high-value buyers arrive convinced,
              inquiries are handled instantly, and your close conversations start from a
              stronger position.
            </p>

            <div
              ref={ctaRef}
              className={`mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 ${HERO_ANIM_INIT}`}
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
                className="group inline-flex min-h-12 items-center gap-2 font-body text-[12px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors duration-500 hover:text-white focus-visible:text-white"
              >
                <span className="border-b border-white/35 pb-1 transition-colors duration-500 group-hover:border-white/70 group-focus-visible:border-white/70">
                  See case studies
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
            ref={artifactShellRef}
            className={`relative z-[7] mx-auto mt-3 hidden w-full max-w-[560px] lg:block ${HERO_ANIM_INIT}`}
            aria-hidden="true"
          >
            <div className="absolute -left-[20%] top-[57%] h-px w-[36%] -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(198,213,238,0.34)] to-[rgba(198,213,238,0.05)]" />
            <div className="absolute right-[8%] top-[9%] h-[72%] w-px bg-gradient-to-b from-[rgba(190,207,232,0.03)] via-[rgba(190,207,232,0.22)] to-transparent" />

            <div
              ref={artifactRef}
              className={`relative ml-auto w-[84%] rounded-[1.9rem] border border-[rgba(207,220,245,0.18)] bg-[linear-gradient(160deg,rgba(11,17,29,0.97),rgba(9,14,24,0.95))] p-7 shadow-[0_42px_108px_rgba(0,0,0,0.56)] ${HERO_ANIM_INIT}`}
              style={{
                transform:
                  "translate3d(var(--hero-artifact-x,0px),var(--hero-artifact-y,0px),0) rotate(-3.75deg)",
                transformOrigin: "17% 10%",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
                <div className="dossier-sweep absolute -left-[38%] top-0 h-full w-[35%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(115%_125%_at_94%_4%,rgba(111,149,220,0.2),transparent_42%)]" />
              </div>

              <div className="pointer-events-none absolute -left-4 -top-4 h-9 w-9 rounded-full border border-[rgba(216,189,118,0.5)] bg-[radial-gradient(circle_at_28%_30%,rgba(255,237,181,0.7),rgba(169,129,38,0.66))] shadow-[0_7px_20px_rgba(0,0,0,0.5)]" />

              <div className="relative">
                <p className="font-body text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Positioning dossier • Signature outcome
                </p>

                <h2 className="mt-4 max-w-[16ch] font-display text-[2.02rem] leading-[0.92] tracking-[-0.05em] text-white">
                  Premium buyer trusted your brand before the first call.
                </h2>

                <p className="mt-5 max-w-[33ch] font-body text-[0.98rem] leading-relaxed text-white/78">
                  Modern Hillside Pools • Austin, Texas. New inbound lead from a
                  $460K outdoor project. Inquiry qualified, routed, and confirmed in 11
                  minutes.
                </p>

                <div className="mt-8 border-t border-white/12 pt-5">
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Perceived value
                      </p>
                      <p className="mt-2 text-[0.93rem] text-white/86">Elevated</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Lead response
                      </p>
                      <p className="mt-2 text-[0.93rem] text-white/86">Automated</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Sales posture
                      </p>
                      <p className="mt-2 text-[0.93rem] text-white/86">Stronger</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-2 lg:hidden">
            <div className="rounded-[1.35rem] border border-[rgba(210,223,245,0.2)] bg-[linear-gradient(160deg,rgba(10,16,28,0.98),rgba(9,14,24,0.95))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/46">
                Positioning dossier
              </p>
              <p className="mt-3 font-display text-[1.62rem] leading-[0.96] tracking-[-0.045em] text-white">
                Premium buyer trusted your brand before the first call.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/76">
                Luxury website, authority messaging, and lead routing aligned to secure
                higher-value project conversations.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-[#02050b] to-transparent" />
        </div>
      </div>
    </section>
  );
}
