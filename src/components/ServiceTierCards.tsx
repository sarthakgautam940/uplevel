"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, bookUrl, type ServiceTier } from "../../lib/brand.config";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const TIER_ORDER = ["T1", "T2", "T3"] as const;

function parseUsdAmount(price: string): number {
  const n = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US");
}

function TierPrice({
  priceLabel,
  animate,
  paper,
}: {
  priceLabel: string;
  animate: boolean;
  paper: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const target = parseUsdAmount(priceLabel);
  const [ready, setReady] = useState(!animate || target === 0);

  useEffect(() => {
    if (!animate || target === 0) return;
    const el = numRef.current;
    const root = wrapRef.current;
    if (!el || !root) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatUsd(target);
      setReady(true);
      return;
    }

    if (ready) return;

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = formatUsd(Math.round(obj.v));
          },
          onComplete: () => setReady(true),
        });
      },
    });

    return () => st.kill();
  }, [animate, ready, target]);

  const numCls = paper ? "text-neutral-900" : "text-[var(--text)]";

  return (
    <div ref={wrapRef}>
      <p
        className={`font-display font-medium tabular-nums tracking-[-0.04em] ${numCls}`}
        style={{ fontSize: "clamp(2rem,3.2vw,2.65rem)", lineHeight: 1.05 }}
      >
        <span>$</span>
        <span ref={numRef}>{animate && !ready ? "0" : formatUsd(target)}</span>
      </p>
    </div>
  );
}

type Variant = "void" | "paper";

export default function ServiceTierCards({ variant = "void" }: { variant?: Variant }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const paper = variant === "paper";

  const tiers = useMemo((): ServiceTier[] => {
    const map = new Map(brand.services.map((s) => [s.tier, s]));
    return TIER_ORDER.map((t) => map.get(t)).filter((s): s is ServiceTier => s != null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll(".tier-card");
      gsap.set(cards, { opacity: 0, y: 36 });
      ScrollTrigger.create({
        trigger: grid,
        start: "top 78%",
        once: true,
        onEnter: () =>
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.12,
          }),
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  const btnSecondaryClass = paper
    ? "!border-neutral-300 !bg-white !text-neutral-700 hover:!border-neutral-400 hover:!bg-neutral-50 hover:!text-neutral-900"
    : "";

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-6 lg:gap-8"
    >
      {tiers.map((svc) => {
        const isRec = svc.highlight;

        const shell = paper
          ? [
              "tier-card group relative flex min-h-[480px] flex-col overflow-hidden rounded-sm border bg-white transition-[box-shadow,border-color] duration-300 md:min-h-[520px]",
              isRec
                ? "border-neutral-200 shadow-[0_0_0_1px_rgba(201,168,76,0.35),0_24px_56px_-28px_rgba(0,0,0,0.12)]"
                : "border-neutral-200/90 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.08)] hover:border-neutral-300 hover:shadow-[0_16px_40px_-22px_rgba(0,0,0,0.1)]",
            ].join(" ")
          : [
              "tier-card group relative flex min-h-[500px] flex-col overflow-hidden rounded-sm border bg-[var(--surface)] transition-[border-color,box-shadow] duration-300 md:min-h-[540px]",
              isRec
                ? "border-[color-mix(in_srgb,var(--warm)_22%,var(--border))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--text)_18%,var(--border))]",
              !isRec ? "hover:shadow-[0_20px_48px_-28px_rgba(0,0,0,0.45)]" : "",
              isRec ? "hover:border-[color-mix(in_srgb,var(--warm)_35%,var(--border))]" : "",
            ].join(" ");

        return (
          <article key={svc.tier} className={shell}>
            {isRec && paper && (
              <div
                className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-full bg-[var(--warm)]"
                aria-hidden="true"
              />
            )}
            {isRec && !paper && (
              <>
                <div
                  className="pointer-events-none absolute inset-0 rounded-sm"
                  style={{
                    background:
                      "radial-gradient(ellipse 120% 80% at 0% 0%, rgba(201,168,76,0.04) 0%, transparent 58%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-[var(--warm)] opacity-90"
                  style={{ boxShadow: "0 0 24px rgba(201,168,76,0.12)" }}
                  aria-hidden="true"
                />
              </>
            )}

            <div
              className={`relative flex flex-1 flex-col px-6 pb-8 pt-9 md:px-8 md:pb-10 md:pt-10 ${isRec && paper ? "pl-8 md:pl-10" : ""}`}
            >
              <header
                className={
                  paper
                    ? "border-b border-neutral-200 pb-6"
                    : "flex flex-col gap-1 border-b border-[var(--border)] pb-6"
                }
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p
                    className={
                      paper
                        ? "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500"
                        : "font-body text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-dim)]"
                    }
                  >
                    {svc.layer}
                  </p>
                  {isRec && (
                    <p className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--warm)]">
                      <span
                        className={
                          paper
                            ? "border-b border-[color-mix(in_srgb,var(--warm)_55%,transparent)] pb-px"
                            : "border-b border-[color-mix(in_srgb,var(--warm)_45%,transparent)] pb-px"
                        }
                      >
                        Recommended
                      </span>
                    </p>
                  )}
                </div>
                <h2
                  className={
                    paper
                      ? "mt-3 font-display font-medium tracking-[-0.03em] text-neutral-900"
                      : "mt-2 font-display font-medium tracking-[-0.025em] text-[var(--text)]"
                  }
                  style={{ fontSize: "clamp(1.35rem,2.1vw,1.75rem)" }}
                >
                  {svc.name}
                </h2>
                <p
                  className={
                    paper
                      ? "mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400"
                      : "mt-1.5 font-body text-[11px] tracking-[0.08em] text-[var(--text-dim)]/60"
                  }
                >
                  Tier {svc.tier}
                </p>
              </header>

              <div className="mt-7">
                <TierPrice
                  priceLabel={svc.price}
                  animate={parseUsdAmount(svc.price) > 0}
                  paper={paper}
                />
                <p
                  className={
                    paper
                      ? "mt-2 font-body text-[13px] leading-snug text-neutral-600"
                      : "mt-2 font-body text-[13px] leading-snug text-[var(--text-dim)]"
                  }
                >
                  then{" "}
                  <span className={paper ? "text-neutral-700" : "text-[var(--text-dim)]"}>
                    {svc.monthly}
                  </span>{" "}
                  retainer
                </p>
              </div>

              <p
                className={
                  paper
                    ? "mt-6 font-body text-[14px] leading-[1.58] text-neutral-700"
                    : "mt-6 font-body text-[14px] leading-[1.58] text-[var(--text)]/92"
                }
              >
                {svc.headline}
              </p>

              <ul className="mt-7 flex flex-col gap-3" role="list">
                {svc.items.map((item) => (
                  <li
                    key={item}
                    className={
                      paper
                        ? "flex gap-3 font-body text-[13px] leading-[1.55] text-neutral-600 transition-colors duration-300 group-hover:text-neutral-800"
                        : "flex gap-3 font-body text-[13px] leading-[1.55] text-[var(--text-dim)] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--text)_88%,var(--text-dim))]"
                    }
                  >
                    <span
                      className={
                        paper
                          ? "mt-[0.32em] shrink-0 text-neutral-300 transition-colors duration-300 group-hover:text-[var(--warm)]"
                          : "mt-[0.32em] shrink-0 font-body text-[var(--electric)]/60 transition-colors duration-300 group-hover:text-[var(--electric)]"
                      }
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p
                className={
                  paper
                    ? "mt-auto border-t border-neutral-200 pt-5 font-body text-[12px] leading-relaxed text-neutral-500"
                    : "mt-auto border-t border-[var(--border)] pt-5 font-body text-[12px] leading-relaxed text-[var(--text-dim)]/75"
                }
              >
                {svc.roiLine}
              </p>

              <div className="mt-7">
                <MagneticButton
                  href={bookUrl}
                  variant={isRec ? "primary" : "secondary"}
                  className={!isRec ? btnSecondaryClass : paper ? "shadow-md" : ""}
                >
                  {svc.cta}
                </MagneticButton>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
