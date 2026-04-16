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
      className="relative isolate overflow-hidden bg-[#f3f2ef]"
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

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(165deg,#f7f6f3_0%,#f2f1ee_52%,#ecebe8_100%)]" />

      <div
        ref={atmosphereRef}
        className={`pointer-events-none absolute inset-0 z-[1] ${HERO_ANIM_INIT}`}
        aria-hidden="true"
      >
        <div className="atmosphere-drift absolute inset-0 opacity-95 [background:radial-gradient(980px_620px_at_78%_22%,rgba(162,173,196,0.34),transparent_67%)]" />
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(820px_460px_at_72%_72%,rgba(206,212,222,0.44),transparent_72%)]" />
        <div className="absolute inset-0 opacity-45 [background:linear-gradient(96deg,rgba(247,246,243,0.98)_0%,rgba(244,243,239,0.9)_42%,rgba(240,239,235,0.42)_74%,rgba(236,235,232,0.66)_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(83,90,103,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(83,90,103,0.6)_1px,transparent_1px)] [background-size:160px_160px]" />
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
              className={`max-w-[10.8ch] font-display text-[rgba(26,30,38,0.98)] ${HERO_ANIM_INIT}`}
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
              className={`mt-6 font-body text-[11px] font-medium uppercase tracking-[0.32em] text-[rgba(73,80,91,0.7)] ${HERO_ANIM_INIT}`}
            >
              UpLevel Services • Positioning systems for premium contractors
            </p>

            <p
              ref={copyRef}
              className={`mt-6 max-w-[41ch] font-body text-[rgba(56,62,73,0.86)] ${HERO_ANIM_INIT}`}
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
                className="group inline-flex min-h-12 items-center gap-2 font-body text-[12px] font-medium uppercase tracking-[0.2em] text-[rgba(41,49,62,0.72)] transition-colors duration-500 hover:text-[rgba(26,30,38,0.98)] focus-visible:text-[rgba(26,30,38,0.98)]"
              >
                <span className="border-b border-[rgba(49,58,73,0.4)] pb-1 transition-colors duration-500 group-hover:border-[rgba(26,30,38,0.75)] group-focus-visible:border-[rgba(26,30,38,0.75)]">
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
            <div className="absolute -left-[20%] top-[57%] h-px w-[36%] -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(117,129,147,0.3)] to-[rgba(117,129,147,0.05)]" />
            <div className="absolute right-[8%] top-[9%] h-[72%] w-px bg-gradient-to-b from-[rgba(122,133,150,0.03)] via-[rgba(122,133,150,0.2)] to-transparent" />

            <div
              ref={artifactRef}
              className={`relative ml-auto w-[84%] rounded-[1.9rem] border border-[rgba(114,125,143,0.24)] bg-[linear-gradient(160deg,rgba(250,249,246,0.96),rgba(241,240,236,0.96))] p-7 shadow-[0_32px_86px_rgba(80,86,98,0.24)] ${HERO_ANIM_INIT}`}
              style={{
                transform:
                  "translate3d(var(--hero-artifact-x,0px),var(--hero-artifact-y,0px),0) rotate(-3.75deg)",
                transformOrigin: "17% 10%",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
                <div className="dossier-sweep absolute -left-[38%] top-0 h-full w-[35%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.44),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(115%_125%_at_94%_4%,rgba(174,188,214,0.22),transparent_42%)]" />
              </div>

              <div className="relative">
                <p className="font-body text-[10px] uppercase tracking-[0.28em] text-[rgba(59,68,82,0.62)]">
                  Positioning dossier • Signature outcome
                </p>

                <h2 className="mt-4 max-w-[16ch] font-display text-[2.02rem] leading-[0.92] tracking-[-0.05em] text-[rgba(28,33,42,0.98)]">
                  Premium buyer trusted your brand before the first call.
                </h2>

                <p className="mt-5 max-w-[33ch] font-body text-[0.98rem] leading-relaxed text-[rgba(53,60,72,0.86)]">
                  Modern Hillside Pools • Austin, Texas. New inbound lead from a
                  $460K outdoor project. Inquiry qualified, routed, and confirmed in 11
                  minutes.
                </p>

                <div className="mt-8 border-t border-[rgba(102,113,129,0.24)] pt-5">
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[rgba(59,68,82,0.62)]">
                        Perceived value
                      </p>
                      <p className="mt-2 text-[0.93rem] text-[rgba(28,33,42,0.9)]">Elevated</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[rgba(59,68,82,0.62)]">
                        Lead response
                      </p>
                      <p className="mt-2 text-[0.93rem] text-[rgba(28,33,42,0.9)]">Automated</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[rgba(59,68,82,0.62)]">
                        Sales posture
                      </p>
                      <p className="mt-2 text-[0.93rem] text-[rgba(28,33,42,0.9)]">Stronger</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[7] mt-2 lg:hidden">
            <div className="rounded-[1.35rem] border border-[rgba(112,124,142,0.24)] bg-[linear-gradient(160deg,rgba(250,249,246,0.97),rgba(240,239,235,0.95))] p-5 shadow-[0_20px_56px_rgba(71,77,88,0.2)]">
              <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[rgba(59,68,82,0.62)]">
                Positioning dossier
              </p>
              <p className="mt-3 font-display text-[1.62rem] leading-[0.96] tracking-[-0.045em] text-[rgba(28,33,42,0.96)]">
                Premium buyer trusted your brand before the first call.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(53,60,72,0.84)]">
                Luxury website, authority messaging, and lead routing aligned to secure
                higher-value project conversations.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-[#ecebe8] to-transparent" />
        </div>
      </div>
    </section>
  );
}
