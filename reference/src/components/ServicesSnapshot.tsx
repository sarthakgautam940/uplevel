"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "../../lib/brand.config";
import TransitionLink from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

const tierPrimary = brand.services[1];
const tierAlt = brand.services[0];

function useCardGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  }, []);
  const onLeave = useCallback(() => setPos((p) => ({ ...p, active: false })), []);
  return { pos, onMove, onLeave };
}

export default function ServicesSnapshot() {
  const sectionRef = useRef<HTMLElement>(null);
  const primary = useCardGlow();
  const secondary = useCardGlow();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll(".svc-card");
      gsap.set(cards, { opacity: 0, y: 32 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        once: true,
        onEnter: () =>
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.14,
          }),
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "+=135%",
        pin: true,
        anticipatePin: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] overflow-hidden bg-[var(--void)] py-24 md:py-36"
      aria-labelledby="services-snapshot-heading"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-12 grid grid-cols-1 gap-8 border-b border-[var(--border)] pb-12 md:mb-14 md:grid-cols-12 md:items-start md:gap-10 md:pb-14">
          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-body text-[13px] font-normal leading-[1.6] tracking-[-0.01em] text-[var(--text-dim)]">
              Depth on the{" "}
              <TransitionLink href="/services" className="text-[var(--teal)] underline-offset-4 hover:underline">
                Services
              </TransitionLink>{" "}
              page — verbatim here. Two entry points, one build standard.
            </p>
          </div>
          <div className="md:col-span-7 lg:col-span-8 md:sticky md:top-[min(26vh,9rem)] md:z-[1]">
            <h2
              id="services-snapshot-heading"
              className="font-display font-medium leading-[0.96] tracking-[-0.034em] text-[var(--text)]"
              style={{ fontSize: "clamp(2.35rem,5.5vw,4.25rem)" }}
            >
              Same standard.
              <br />
              <span className="text-[var(--text-dim)]">Different depth.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div
            className="svc-card relative flex flex-col gap-5 overflow-hidden rounded-xl border border-white/[0.07] p-7 md:gap-6 md:p-9"
            style={{
              background:
                "linear-gradient(165deg, color-mix(in srgb, var(--surface) 88%, transparent) 0%, color-mix(in srgb, var(--void) 40%, transparent) 100%)",
            }}
            onMouseMove={primary.onMove}
            onMouseLeave={primary.onLeave}
          >
            {primary.pos.active && (
              <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(280px circle at ${primary.pos.x}px ${primary.pos.y}px, rgba(201,168,76,0.07), transparent 65%)`,
                }}
                aria-hidden="true"
              />
            )}
            <div className="relative z-[1]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-dim)]/70">
                {tierPrimary.tier} · {tierPrimary.layer}
              </p>
              <h3
                className="mt-3 font-display font-normal tracking-[-0.02em] text-[var(--text)]"
                style={{ fontSize: "clamp(1.35rem,2.6vw,1.85rem)" }}
              >
                {tierPrimary.name}
              </h3>
              <p className="mt-2 max-w-[48ch] font-body text-[14px] leading-[1.65] text-[var(--text-dim)]">
                {tierPrimary.headline}
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-body text-[13px] leading-[1.5] text-[var(--text-dim)]">
                {tierPrimary.items.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-[var(--electric)]/50" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-[1] mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border)] pt-6">
              <div>
                <p className="font-display tabular-nums tracking-[-0.02em] text-[var(--text)]" style={{ fontSize: "clamp(1.4rem,2.4vw,1.85rem)" }}>
                  {tierPrimary.price}
                  <span className="ml-2 font-body text-[13px] font-normal text-[var(--text-dim)]">{tierPrimary.monthly}</span>
                </p>
              </div>
              <TransitionLink
                href="/services"
                className="group font-body text-[12px] text-[var(--warm)] transition-opacity hover:opacity-80"
              >
                Full tier detail <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </TransitionLink>
            </div>
          </div>

          <div
            className="svc-card relative flex flex-col gap-5 overflow-hidden rounded-xl border border-white/[0.06] p-7 md:gap-6 md:p-9"
            style={{
              background:
                "linear-gradient(195deg, color-mix(in srgb, var(--surface) 75%, transparent) 0%, color-mix(in srgb, var(--void) 55%, transparent) 100%)",
            }}
            onMouseMove={secondary.onMove}
            onMouseLeave={secondary.onLeave}
          >
            {secondary.pos.active && (
              <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(260px circle at ${secondary.pos.x}px ${secondary.pos.y}px, rgba(77,130,255,0.06), transparent 65%)`,
                }}
                aria-hidden="true"
              />
            )}
            <div className="relative z-[1]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-dim)]/70">
                {tierAlt.tier} · {tierAlt.layer}
              </p>
              <h3
                className="mt-3 font-display font-normal tracking-[-0.02em] text-[var(--text)]"
                style={{ fontSize: "clamp(1.25rem,2.2vw,1.65rem)" }}
              >
                {tierAlt.name}
              </h3>
              <p className="mt-2 max-w-[48ch] font-body text-[14px] leading-[1.65] text-[var(--text-dim)]">
                {tierAlt.headline}
              </p>
            </div>
            <ul className="relative z-[1] flex flex-col gap-2 border-t border-[var(--border)] pt-5 font-body text-[13px] leading-[1.5] text-[var(--text-dim)]">
              {tierAlt.items.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-[var(--warm)]/70" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="relative z-[1] mt-auto flex flex-wrap items-end justify-between gap-4 pt-2">
              <p className="font-display tabular-nums tracking-[-0.02em] text-[var(--text)]" style={{ fontSize: "clamp(1.25rem,2vw,1.55rem)" }}>
                {tierAlt.price}
                <span className="ml-2 font-body text-[13px] font-normal text-[var(--text-dim)]">{tierAlt.monthly}</span>
              </p>
              <TransitionLink
                href="/services"
                className="group font-body text-[12px] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
              >
                Compare tiers <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
