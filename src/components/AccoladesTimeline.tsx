"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, type Accolade } from "../../lib/brand.config";
import AccoladeBlockParticles from "./AccoladeBlockParticles";
import AccoladeAuraParticles from "./AccoladeAuraParticles";

gsap.registerPlugin(ScrollTrigger);

/** Returns true when the aspect container is taller than wide (portrait). */
function isPortraitAspect(aspect: string): boolean {
  const m = aspect.match(/aspect-\[(\d+)\/(\d+)\]/);
  if (!m) return true;
  return Number(m[2]) > Number(m[1]); // height > width
}

const placementColor: Record<number, string> = {
  1: "var(--warm)",
  2: "var(--teal)",
  3: "var(--text-dim)",
};

const accoladeDisplayOrder = new Map<string, number>([
  ["/awards/first-place-dvp-2026-regionals.jpg", 0],
  ["/awards/second-place-dvp-regionals-2025.jpg", 1],
  ["/awards/third-place-dvp-states-2025.jpg", 2],
  ["/awards/third-place-promotional-regionals-2025.jpg", 3],
  ["/awards/third-place-promotional-states-2025.jpg", 4],
]);

const accoladeNarratives: Record<string, string> = {
  "/awards/first-place-dvp-2026-regionals.jpg":
    "First place came from tight pacing, cleaner story sequencing, and precision edit rhythm under pressure.",
  "/awards/second-place-dvp-regionals-2025.jpg":
    "Second place validated our production fundamentals: structure first, atmosphere second, polish last.",
  "/awards/third-place-dvp-states-2025.jpg":
    "State-level placement reinforced our repeatable process across concept framing, filming, and final cut.",
  "/awards/third-place-promotional-regionals-2025.jpg":
    "Regional placement proved the same conversion logic works inside visual campaigns, not just websites.",
  "/awards/third-place-promotional-states-2025.jpg":
    "States placement confirms strategic design choices outperform ornamental direction when judged side by side.",
};

type YearGroup = {
  label: string;
  items: Accolade[];
};

function groupByYear(): YearGroup[] {
  const groups: YearGroup[] = [];
  const map = new Map<string, Accolade[]>();

  for (const a of brand.accolades) {
    const key = a.event.includes("States")
      ? `${a.year} - States`
      : a.event.includes("Regional")
        ? `${a.year} - Regionals`
        : `${a.year}`;
    if (!map.has(key)) {
      map.set(key, []);
      groups.push({ label: key, items: map.get(key)! });
    }
    map.get(key)!.push(a);
  }
  return groups;
}

function withAlpha(color: string, alpha: string): string {
  return color.replace(/[\d.]+\)$/, `${alpha})`);
}

function getImageTuning(a: Accolade, isFirst: boolean) {
  if (isFirst) {
    return {
      slotAspect: "aspect-[7/5]",
      slotObjectClass: "object-contain",
      takeoverObjectClass: "object-contain",
      slotTransform: "translate(-2%, 1%) scale(1.12)",
      takeoverTransform: "translate(-2%, 0%) scale(1.16)",
    };
  }

  if (a.imageSrc === "/awards/third-place-dvp-states-2025.jpg") {
    return {
      slotAspect: a.imageAspect,
      slotObjectClass: "object-contain",
      takeoverObjectClass: "object-contain",
      slotTransform: "translate(-2.25%, 0%) scale(1.08)",
      takeoverTransform: "translate(-2.8%, 0%) scale(1.13)",
    };
  }

  if (a.imageSrc === "/awards/third-place-promotional-regionals-2025.jpg") {
    return {
      slotAspect: a.imageAspect,
      slotObjectClass: "object-contain",
      takeoverObjectClass: "object-contain",
      slotTransform: "translate(0%, 0%) scale(1.01)",
      takeoverTransform: "translate(0%, 0%) scale(1.05)",
    };
  }

  return {
    slotAspect: a.imageAspect,
    slotObjectClass: "object-contain",
    takeoverObjectClass: "object-contain",
    slotTransform: "translate(0%, 0%) scale(1)",
    takeoverTransform: "translate(0%, 0%) scale(1.08)",
  };
}

type EditorialVariant = "classic" | "split" | "offset";

function getEditorialVariant(a: Accolade): EditorialVariant {
  if (a.imageSrc === "/awards/third-place-dvp-states-2025.jpg") return "split";
  if (a.imageSrc === "/awards/third-place-promotional-regionals-2025.jpg") return "offset";
  return "classic";
}

type MonolithMotif = "ring" | "slant" | "rails" | "brackets" | "arc" | "minimal" | "columns";

function resolveMonolithMotif(rowIndex: number, a: Accolade): MonolithMotif {
  const isFirstDvpFirst =
    rowIndex === 0 &&
    a.category === "Digital Video Production" &&
    a.placementNum === 1 &&
    a.year === 2026 &&
    /regional/i.test(a.event);
  if (isFirstDvpFirst) return "ring";

  // Slanted frame: only the row directly after 1st (typically 2nd row in the timeline).
  if (a.placementNum === 3 && rowIndex === 1) return "slant";

  if (a.placementNum === 2) return "rails";

  // Other 3rd places: distinct motifs (never repeat slant).
  if (a.placementNum === 3) {
    const forThird: MonolithMotif[] = ["arc", "brackets", "columns", "minimal"];
    return forThird[rowIndex % forThird.length];
  }

  const extras: MonolithMotif[] = ["brackets", "arc", "minimal", "columns"];
  return extras[rowIndex % extras.length];
}

function PlacementMonolith({
  placement,
  placementNum,
  color,
  motif,
  side,
  peerDimmed,
}: {
  placement: string;
  placementNum: number;
  color: string;
  motif: MonolithMotif;
  side: "left" | "right";
  peerDimmed: boolean;
}) {
  const arcGradId = `acc-arc-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const align =
    side === "left"
      ? "items-center text-center md:items-end md:text-right"
      : "items-center text-center md:items-start md:text-left";
  const label = (
    <span
      className="acc-placement-glow-static font-display relative z-[1] leading-none tracking-[-0.05em]"
      style={{
        fontSize: "clamp(2.75rem,6vw,5rem)",
        fontWeight: 400,
        color,
      }}
    >
      {placement}
    </span>
  );

  const slantDeg = side === "left" ? -2.25 : 2.25;

  return (
    <div
      className={`acc-placement-monolith flex min-h-[160px] w-full max-w-[400px] flex-col justify-center opacity-90 transition-opacity duration-700 md:min-h-[200px] md:opacity-100 ${align} ${
        peerDimmed ? "opacity-35 motion-reduce:opacity-100" : ""
      }`}
      aria-hidden="true"
    >
      {motif === "ring" && (
        <div className="relative flex w-full items-center justify-center py-2">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full border border-white/[0.06] opacity-55"
              style={{
                width: "min(200px, 42vw)",
                height: "min(200px, 42vw)",
              }}
            />
            <div
              className="absolute rounded-full border border-dashed border-white/[0.07] opacity-65 motion-safe:animate-[spin_56s_linear_infinite]"
              style={{
                width: "min(160px, 34vw)",
                height: "min(160px, 34vw)",
              }}
            />
          </div>
          {label}
        </div>
      )}

      {motif === "slant" && (
        <div className="relative flex w-full flex-col py-3">
          <div
            className="pointer-events-none absolute -inset-3 rounded-[2px] border border-white/[0.06] opacity-55"
            style={{ transform: `rotate(${slantDeg}deg)` }}
          />
          <div
            className={`relative z-[1] flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${
              side === "left" ? "md:justify-end" : "md:justify-start"
            }`}
          >
            <span
              className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-none tabular-nums opacity-[0.22]"
              style={{ color }}
            >
              {placementNum}
            </span>
            {label}
          </div>
        </div>
      )}

      {motif === "rails" && (
        <div className="relative flex w-full items-center justify-center gap-3 py-2 md:gap-4">
          <div
            className="pointer-events-none h-[min(200px,38vw)] w-px opacity-50"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(77,130,255,0.22) 40%, rgba(77,130,255,0.22) 60%, transparent 100%)",
            }}
          />
          <div className="relative z-[1]">{label}</div>
          <div
            className="pointer-events-none h-[min(200px,38vw)] w-px opacity-50"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(77,130,255,0.15) 40%, rgba(77,130,255,0.15) 60%, transparent 100%)",
            }}
          />
        </div>
      )}

      {motif === "brackets" && (
        <div className="relative w-full py-2">
          <div
            className="pointer-events-none absolute inset-x-2 top-2 h-5 border border-white/[0.06] border-b-0 opacity-50"
            style={{ borderRadius: "2px 2px 0 0" }}
          />
          <div
            className="pointer-events-none absolute inset-x-2 bottom-2 h-5 border border-white/[0.06] border-t-0 opacity-50"
            style={{ borderRadius: "0 0 2px 2px" }}
          />
          <div className="relative z-[1] px-2 pt-6 pb-6">{label}</div>
        </div>
      )}

      {motif === "arc" && (
        <div className="relative flex w-full justify-center py-3">
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] opacity-[0.35]"
            width={200}
            height={100}
            viewBox="0 0 200 100"
            fill="none"
            aria-hidden
          >
            <path
              d="M 20 88 A 80 80 0 0 1 180 88"
              stroke={`url(#${arcGradId})`}
              strokeWidth="0.75"
            />
            <defs>
              <linearGradient id={arcGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(77,130,255,0)" />
                <stop offset="50%" stopColor="rgba(201,168,76,0.2)" />
                <stop offset="100%" stopColor="rgba(77,130,255,0)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative z-[1] pt-4">{label}</div>
        </div>
      )}

      {motif === "minimal" && (
        <div
          className={`flex w-full flex-col gap-3 py-2 ${
            side === "left" ? "items-center md:items-end" : "items-center md:items-start"
          }`}
        >
          <div className="flex gap-1.5 opacity-40">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-[var(--text-dim)]/35" />
            ))}
          </div>
          {label}
        </div>
      )}

      {motif === "columns" && (
        <div className="flex w-full flex-col items-center gap-5 py-2">
          {label}
          <div className="flex items-end justify-center gap-2.5 md:gap-4">
            <div className="h-[72px] w-px rounded-full bg-gradient-to-t from-transparent via-white/[0.1] to-white/[0.05] opacity-70 md:h-[88px]" />
            <div className="h-[96px] w-px rounded-full bg-gradient-to-t from-transparent via-white/[0.14] to-white/[0.07] opacity-80 md:h-[112px]" />
            <div className="h-[68px] w-px rounded-full bg-gradient-to-t from-transparent via-white/[0.1] to-white/[0.05] opacity-70 md:h-[80px]" />
          </div>
        </div>
      )}
    </div>
  );
}

type AccoladeCardBlockProps = {
  a: Accolade;
  isFirst: boolean;
  color: string;
  isFocused: boolean;
  peerDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  reducedMotion: boolean;
};

function AccoladeCardBlock({
  a,
  isFirst,
  color,
  isFocused,
  peerDimmed,
  onMouseEnter,
  onMouseLeave,
  reducedMotion,
}: AccoladeCardBlockProps) {
  const mouseLocalRef = useRef({ x: -1e9, y: -1e9 });
  const [expanded, setExpanded] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const narrative =
    accoladeNarratives[a.imageSrc] ??
    "This accolade reflects measurable craft discipline, not speculative presentation.";
  const imageTuning = getImageTuning(a, isFirst);
  const editorialVariant = getEditorialVariant(a);
  const supportCopy =
    a.note ||
    (a.event.includes("States")
      ? "State-level placement across concept, craft, and final finish."
      : "Regional placement with clean execution and judging clarity.");
  const portrait = isPortraitAspect(a.imageAspect);
  const isHeroFirstCard = isFirst && a.imageSrc === "/awards/first-place-dvp-2026-regionals.jpg";
  const isSofterGlowCard =
    a.imageSrc === "/awards/third-place-dvp-states-2025.jpg" ||
    a.imageSrc === "/awards/third-place-promotional-regionals-2025.jpg" ||
    a.imageSrc === "/awards/third-place-promotional-states-2025.jpg";
  const glowEdge = withAlpha(a.imageGlow, isSofterGlowCard ? "0.1" : "0.16");
  const glowCore = withAlpha(a.imageGlow, isSofterGlowCard ? "0.03" : "0.06");
  const edgeGlow = portrait
    ? `linear-gradient(to right, ${glowEdge} 0%, ${glowCore} 15%, transparent 34%, transparent 66%, ${glowCore} 85%, ${glowEdge} 100%)`
    : `linear-gradient(to bottom, ${glowEdge} 0%, ${glowCore} 15%, transparent 34%, transparent 66%, ${glowCore} 85%, ${glowEdge} 100%)`;
  const revealFullImage = isFocused || expanded;
  const typedNarrative = narrative.slice(0, typedCount);
  const slotAspect = imageTuning.slotAspect;

  useEffect(() => {
    if (!expanded) {
      setTypedCount(0);
      return;
    }
    if (reducedMotion) {
      setTypedCount(narrative.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedCount(i);
      if (i >= narrative.length) window.clearInterval(id);
    }, 12);
    return () => window.clearInterval(id);
  }, [expanded, narrative, reducedMotion]);

  return (
    <article
      aria-label={`${a.category}, ${a.placement}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onMouseEnter={onMouseEnter}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseLocalRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onMouseLeave={() => {
        mouseLocalRef.current = { x: -1e9, y: -1e9 };
        setExpanded(false);
        onMouseLeave();
      }}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
      className={`acc-card ${isHeroFirstCard ? "acc-hero" : ""} group relative overflow-visible transition-[transform,box-shadow,border-color,opacity,filter] duration-700 ease-out motion-reduce:transform-none ${
        isHeroFirstCard
          ? "rounded-none border-transparent bg-transparent p-0"
          : `rounded-[2px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0.18)_100%)] p-9 ${isFirst ? "tl-first border-l-[3px]" : "border-l-2"} md:p-11`
      } ${
        isFocused
          ? isHeroFirstCard
            ? "z-10 scale-[1.018]"
            : "z-10 scale-[1.032] border-white/[0.24] shadow-[0_0_60px_-20px_rgba(201,168,76,0.16),0_38px_92px_-28px_rgba(0,0,0,0.74)]"
          : peerDimmed
            ? "z-0 opacity-[0.42] blur-[3px] motion-reduce:opacity-100 motion-reduce:blur-none"
            : isHeroFirstCard
              ? "motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01]"
              : "shadow-[0_0_34px_-20px_rgba(0,0,0,0.55)] motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.018] motion-safe:hover:border-white/[0.18] motion-safe:hover:shadow-[0_0_52px_-18px_rgba(77,130,255,0.12),0_38px_78px_-30px_rgba(0,0,0,0.62)]"
      }`}
      style={{
        borderLeftColor: isHeroFirstCard ? "transparent" : color,
        boxShadow: isHeroFirstCard
          ? undefined
          : isFirst
          ? "-36px 0 72px -24px rgba(201,168,76,0.32), 0 28px 56px -32px rgba(0,0,0,0.5)"
          : undefined,
      }}
    >
      {!isHeroFirstCard && (
        <AccoladeAuraParticles mouseRef={mouseLocalRef} reducedMotion={reducedMotion} active={isFocused} />
      )}
      <div
        className={`pointer-events-none absolute inset-y-3 left-7 right-3 z-[2] ${isHeroFirstCard ? "hidden" : ""}`}
        aria-hidden="true"
      >
        <div
          className={`absolute left-0 right-10 top-0 h-px transition-opacity duration-500 ${
            isFocused ? "opacity-100" : "opacity-55 motion-safe:group-hover:opacity-80"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(120,190,255,0.02) 16%, rgba(120,190,255,0.18) 62%, transparent 100%)",
          }}
        />
        <div
          className={`absolute bottom-10 right-0 top-0 w-px transition-opacity duration-500 ${
            isFocused ? "opacity-100" : "opacity-45 motion-safe:group-hover:opacity-75"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgba(120,190,255,0.3) 0%, rgba(120,190,255,0.1) 34%, rgba(120,190,255,0.04) 72%, transparent 100%)",
          }}
        />
        <div
          className={`absolute right-0 top-0 h-14 w-14 rounded-tr-[20px] border-r border-t transition-colors duration-500 ${
            isFocused
              ? "border-[rgba(120,190,255,0.24)]"
              : "border-[rgba(120,190,255,0.12)] motion-safe:group-hover:border-[rgba(120,190,255,0.18)]"
          }`}
        />
      </div>
      <AccoladeBlockParticles mouseRef={mouseLocalRef} reducedMotion={reducedMotion} active={isFocused} />
      {/* Connected shine - position driven by CSS vars set by AccoladesTimeline RAF */}
      <div
        className={`acc-shine-overlay pointer-events-none absolute inset-0 z-[4] ${isHeroFirstCard ? "hidden" : ""}`}
        aria-hidden="true"
      />
      {!isHeroFirstCard && (
        <div
          className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden transition-opacity duration-700 ${
            revealFullImage ? "opacity-100" : "opacity-0 motion-safe:group-hover:opacity-100"
          }`}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: revealFullImage ? imageTuning.takeoverTransform : imageTuning.slotTransform,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps SSR and client markup identical */}
            <img
              src={a.imageSrc}
              alt=""
              className={`absolute inset-0 h-full w-full ${imageTuning.takeoverObjectClass} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isFocused ? "scale-[1.02]" : "motion-safe:group-hover:scale-[1.03]"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,15,0.06)_0%,rgba(6,8,15,0.18)_36%,rgba(6,8,15,0.84)_100%)] transition-opacity duration-700 motion-safe:group-hover:opacity-65"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-75 transition-opacity duration-700 motion-safe:group-hover:opacity-100"
            aria-hidden="true"
            style={{ background: edgeGlow }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-700"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 50% 14%, rgba(237,240,247,0.12) 0%, transparent 42%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.22) 0%, transparent 54%)",
            }}
          />
        </div>
      )}

      {isHeroFirstCard ? (
        <div className="relative z-[3] min-h-[420px] py-6 md:min-h-[540px] md:py-10">
          <div className="relative mx-auto flex w-full max-w-[1220px] flex-col items-center justify-center gap-7 md:flex-row md:items-center md:gap-12 lg:gap-16">
            <div className="acc-image-slot relative h-[320px] w-[250px] shrink-0 md:h-[398px] md:w-[294px]">
              <div
                className={`absolute inset-0 rounded-[28px] border border-white/[0.08] bg-[linear-gradient(155deg,rgba(255,255,255,0.045)_0%,rgba(7,10,18,0.54)_100%)] shadow-[0_28px_80px_-36px_rgba(0,0,0,0.72)] transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isFocused
                    ? "rotate-0 translate-y-0 border-white/[0.18] shadow-[0_34px_88px_-32px_rgba(0,0,0,0.78)]"
                    : "motion-safe:rotate-[4deg] motion-safe:-translate-y-2 motion-safe:group-hover:rotate-0 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:border-white/[0.16]"
                }`}
              >
                <div className="acc-hero-shine-host absolute inset-0 overflow-hidden rounded-[28px]">
                  <div className="acc-hero-shine acc-shine-overlay absolute inset-0" aria-hidden="true" />
                </div>
                <div
                  className="absolute inset-[10px] rounded-[22px] border border-white/[0.08] bg-black/[0.14]"
                  aria-hidden="true"
                />
                <div className="absolute inset-[10px] overflow-hidden rounded-[22px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps SSR and client markup identical */}
                  <img
                    src={a.imageSrc}
                    alt={`${a.category}, ${a.placement} - ${a.event} ${a.year}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      objectPosition: "49% 50%",
                      transform: isFocused
                        ? "translate(-3.6%, 0%) scale(1.17)"
                        : "translate(-2.8%, 0%) scale(1.13)",
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,8,15,0.04) 0%, rgba(6,8,15,0.08) 48%, rgba(6,8,15,0.28) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className={`relative z-[2] flex w-full max-w-[520px] flex-col gap-4 rounded-[32px] border border-white/[0.1] bg-[linear-gradient(145deg,rgba(255,255,255,0.045)_0%,rgba(11,16,29,0.88)_100%)] px-7 py-7 shadow-[0_28px_90px_-48px_rgba(77,130,255,0.2)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:-ml-5 md:w-[430px] md:px-8 md:py-8 ${
                isFocused
                  ? "translate-x-1 border-white/[0.16] shadow-[0_34px_96px_-42px_rgba(77,130,255,0.24)]"
                  : "motion-safe:group-hover:translate-x-2 motion-safe:group-hover:border-white/[0.14] motion-safe:group-hover:shadow-[0_34px_96px_-42px_rgba(77,130,255,0.18)]"
              }`}
            >
              <div className="acc-hero-shine-host absolute inset-0 overflow-hidden rounded-[32px]">
                <div className="acc-hero-shine acc-shine-overlay absolute inset-0" aria-hidden="true" />
              </div>
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)]/60">
                {a.event} • {a.year}
              </p>
              <h3
                className="font-display tracking-[-0.03em] text-[var(--text)]"
                style={{ fontSize: "clamp(2.25rem,4vw,3.6rem)", fontWeight: 400, lineHeight: 0.94 }}
              >
                <span className="block">Digital Video</span>
                <span className="block">Production</span>
              </h3>
              <p className="max-w-[30ch] font-body text-[15px] leading-relaxed text-[var(--text-dim)]/66 md:text-[16px]">
                {a.note || "Most recent. Current standard."}
              </p>
              <div className="flex items-end justify-between gap-4 pt-2">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]/35">
                  Competition proof
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]/35">
                  Hover + click
                </span>
              </div>
            </div>

            <div className="relative flex shrink-0 justify-center">
              <div
                className={`relative flex h-[140px] w-[140px] items-center justify-center rounded-full border border-white/[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,rgba(12,17,28,0.86)_68%)] shadow-[0_20px_54px_-32px_rgba(0,0,0,0.7)] transition-[transform,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[164px] md:w-[164px] ${
                  isFocused
                    ? "scale-[1.04] border-[rgba(201,168,76,0.16)] -translate-y-1 shadow-[0_26px_60px_-28px_rgba(201,168,76,0.18)]"
                    : "motion-safe:-translate-y-1 motion-safe:group-hover:scale-[1.05] motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:border-[rgba(201,168,76,0.16)]"
                }`}
              >
                <div className="acc-hero-shine-host absolute inset-0 overflow-hidden rounded-full">
                  <div className="acc-hero-shine acc-shine-overlay absolute inset-0" aria-hidden="true" />
                </div>
                <div className="absolute inset-[10px] rounded-full border border-white/[0.06]" aria-hidden="true" />
                <div className="absolute inset-[-16px] rounded-full border border-dashed border-white/[0.05]" aria-hidden="true" />
                <span
                  className="font-display leading-none tracking-[-0.05em] text-[var(--warm)]"
                  style={{ fontSize: "clamp(3.75rem,6vw,5.25rem)", fontWeight: 400 }}
                >
                  {a.placement}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative z-[3] flex ${isFirst ? "min-h-[332px]" : "min-h-[344px]"} flex-col justify-between gap-8 transition-[opacity,transform] duration-500 ${
            revealFullImage
              ? "opacity-0 translate-y-2"
              : "opacity-100 motion-safe:group-hover:opacity-0 motion-safe:group-hover:translate-y-2"
          }`}
        >
          <div className="space-y-2.5 md:space-y-3">
            <div
              className={`acc-image-slot relative mb-5 ${slotAspect} w-full overflow-hidden rounded-sm border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0.28)_100%)] shadow-[inset_0_0_40px_-12px_rgba(77,130,255,0.06)]`}
            >
              <div
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden="true"
                style={{ background: edgeGlow }}
              />
              <div
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: imageTuning.slotTransform }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- plain img keeps SSR and client markup identical */}
                <img
                  src={a.imageSrc}
                  alt={`${a.category}, ${a.placement} - ${a.event} ${a.year}`}
                  className={`absolute inset-0 h-full w-full ${imageTuning.slotObjectClass} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isFocused ? "scale-[1.02]" : "motion-safe:group-hover:scale-[1.04]"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            {editorialVariant === "classic" && (
              <>
                <h3
                  className="font-display tracking-[-0.02em] text-[var(--text)]"
                  style={{ fontSize: "clamp(1.35rem,2vw,1.8rem)", fontWeight: 400 }}
                >
                  {a.category}
                </h3>
                <p className="font-body text-[10px] uppercase tracking-[0.26em] text-[var(--text-dim)]/55 md:text-[11px]">
                  {a.event} • {a.year}
                </p>
                {a.note && (
                  <p className="pt-0.5 font-body text-[14px] leading-relaxed text-[var(--text-dim)]/52 md:text-[15px]">
                    {a.note}
                  </p>
                )}
              </>
            )}

            {editorialVariant === "split" && (
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_170px] md:items-end">
                <div>
                  <p className="mb-2 font-body text-[9px] uppercase tracking-[0.28em] text-[var(--text-dim)]/48">
                    Archive edition
                  </p>
                  <h3
                    className="font-display tracking-[-0.025em] text-[var(--text)]"
                    style={{ fontSize: "clamp(1.45rem,2.15vw,1.95rem)", fontWeight: 400, lineHeight: 1 }}
                  >
                    <span className="block">Digital Video</span>
                    <span className="block">Production</span>
                  </h3>
                </div>
                <div className="border-l border-white/[0.08] pl-4">
                  <p className="font-body text-[10px] uppercase tracking-[0.26em] text-[var(--text-dim)]/58 md:text-[11px]">
                    {a.event} • {a.year}
                  </p>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[var(--text-dim)]/54">
                    {supportCopy}
                  </p>
                </div>
              </div>
            )}

            {editorialVariant === "offset" && (
              <div className="relative">
                <div className="absolute -top-3 right-0 rounded-full border border-white/[0.08] bg-[rgba(11,16,29,0.72)] px-3 py-1 backdrop-blur-sm">
                  <span className="font-body text-[9px] uppercase tracking-[0.24em] text-[var(--warm)]/72">
                    {a.placement}
                  </span>
                </div>
                <h3
                  className="font-display max-w-[14ch] tracking-[-0.022em] text-[var(--text)]"
                  style={{ fontSize: "clamp(1.4rem,2.05vw,1.88rem)", fontWeight: 400, lineHeight: 1.02 }}
                >
                  {a.category}
                </h3>
                <div className="mt-3 h-px w-20 bg-gradient-to-r from-[rgba(201,168,76,0.42)] to-transparent" />
                <div className="mt-3 flex items-start justify-between gap-5">
                  <p className="font-body text-[10px] uppercase tracking-[0.26em] text-[var(--text-dim)]/55 md:text-[11px]">
                    {a.event} • {a.year}
                  </p>
                  <p className="max-w-[18ch] text-right font-body text-[13px] leading-relaxed text-[var(--text-dim)]/52">
                    {supportCopy}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 pt-2">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]/35">
              Competition proof
            </span>
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]/35">
              Hover + click
            </span>
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none absolute z-[5] rounded-xl border border-white/[0.14] bg-[rgba(7,11,20,0.88)] px-4 py-3 backdrop-blur-md transition-all duration-500 ${
          isHeroFirstCard ? "bottom-0 left-1/2 w-[min(92%,420px)] -translate-x-1/2" : "bottom-5 left-5 right-5"
        } ${
          expanded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <p className="font-body text-[9px] uppercase tracking-[0.2em] text-[var(--warm)]/80">
          Expanded Note
        </p>
        <p className="mt-2 min-h-[2.4em] font-body text-[12px] leading-[1.55] text-[var(--text-dim)]/86">
          {typedNarrative}
          {expanded && typedCount < narrative.length && (
            <span className="ml-[1px] inline-block h-[1em] w-[1px] animate-pulse bg-[var(--text-dim)]/55 align-[-2px]" />
          )}
        </p>
      </div>
    </article>
  );
}

export default function AccoladesTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const groups = useMemo(() => groupByYear(), []);

  const indexedGroups = useMemo(() => {
    let row = 0;
    return groups.map((g) => ({
      label: g.label,
      items: [...g.items]
        .sort((a, b) => {
          const ai = accoladeDisplayOrder.get(a.imageSrc) ?? 999;
          const bi = accoladeDisplayOrder.get(b.imageSrc) ?? 999;
          return ai - bi;
        })
        .map((a) => {
          const idx = row++;
          return { a, isLeftSide: idx % 2 === 0, rowIndex: idx };
        }),
    }));
  }, [groups]);

  const onCardEnter = useCallback((id: string) => {
    if (focusClearRef.current) {
      clearTimeout(focusClearRef.current);
      focusClearRef.current = null;
    }
    setFocusedId(id);
  }, []);

  const onCardLeave = useCallback(() => {
    focusClearRef.current = setTimeout(() => setFocusedId(null), 100);
  }, []);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const spine = section.querySelector(".acc-spine-line");
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 1.2,
            },
          }
        );
      }

      section.querySelectorAll(".acc-year-pill").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 12,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      section.querySelectorAll(".acc-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
          delay: (i % 4) * 0.05,
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      // Stronger depth travel with alternating row direction for richer parallax.
      const travel = 58;
      section.querySelectorAll<HTMLElement>(".acc-parallax-row").forEach((row) => {
        const track = row.querySelector(".acc-parallax-depth-front");
        if (!track) return;
        const idx = Number(row.dataset.rowIndex || 0);
        const xTravel = idx % 2 === 0 ? -30 : 30;
        gsap.fromTo(
          track,
          { y: travel, x: xTravel, rotate: idx % 2 === 0 ? -0.6 : 0.6 },
          {
            y: -travel,
            x: -xTravel,
            rotate: idx % 2 === 0 ? 0.6 : -0.6,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      const bgDepth = section.querySelector(".acc-bg-depth");
      if (bgDepth) {
        gsap.fromTo(
          bgDepth,
          { y: -34 },
          {
            y: 34,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      }

      section.querySelectorAll(".acc-image-slot").forEach((slot) => {
        gsap.from(slot, {
          opacity: 0,
          scale: 0.98,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: slot, start: "top 90%", once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Connected shine sweep.
  // A single diagonal band moves top-left to bottom-right across the
  // entire section. Each card's --card-offset positions the band in
  // its own local coordinate space so the sweep feels continuous.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let animRafId: number;

    // One frame delay so layout is fully resolved before we read positions
    const initId = requestAnimationFrame(() => {
      const sRect = section.getBoundingClientRect();

      section.querySelectorAll<HTMLElement>(".acc-card").forEach((card) => {
        const cRect = card.getBoundingClientRect();
        // Manhattan diagonal offset of this card's top-left relative to section
        card.style.setProperty(
          "--card-offset",
          `${(cRect.left - sRect.left) + (cRect.top - sRect.top)}px`,
        );

        card.querySelectorAll<HTMLElement>(".acc-hero-shine").forEach((node) => {
          const nRect = node.getBoundingClientRect();
          node.style.setProperty(
            "--hero-offset",
            `${(nRect.left - cRect.left) + (nRect.top - cRect.top)}px`,
          );
        });
      });

      // Total diagonal range of the section (manhattan distance TL â†’ BR)
      const totalRange = sRect.width + sRect.height;
      const SHINE_LEAD = 220;  // px before first card the band starts
      const SWEEP_MS   = 3800; // ms for one full sweep (slower)
      const PAUSE_MS   = 3200; // ms between sweeps (more frequent)

      let phase: "sweeping" | "paused" = "paused";
      // Start 60% through the initial pause so the first sweep comes quickly
      let elapsed = PAUSE_MS * 0.6;
      let prevTs   = 0;

      const tick = (ts: number) => {
        const dt = Math.min(prevTs ? ts - prevTs : 16, 50);
        prevTs = ts;
        elapsed += dt;

        if (phase === "sweeping") {
          const p = -SHINE_LEAD + (elapsed / SWEEP_MS) * (totalRange + SHINE_LEAD);
          section.style.setProperty("--shine-p", `${p}px`);
          if (elapsed >= SWEEP_MS) {
            phase   = "paused";
            elapsed = 0;
            section.style.setProperty("--shine-p", "-9999px");
          }
        } else if (elapsed >= PAUSE_MS) {
          phase   = "sweeping";
          elapsed = 0;
        }

        animRafId = requestAnimationFrame(tick);
      };

      animRafId = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(initId);
      cancelAnimationFrame(animRafId);
      section.style.removeProperty("--shine-p");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseLeave={() => {
        setFocusedId(null);
        if (focusClearRef.current) clearTimeout(focusClearRef.current);
      }}
      className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[var(--void)] py-24 md:py-32"
      aria-label="Competition accolades timeline"
    >
      {/* Section-wide ambient only â€” no per-row decoration, no radial orbs */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.95] motion-reduce:opacity-100"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(118deg, rgba(77,130,255,0.065) 0%, transparent 46%),
            linear-gradient(302deg, rgba(201,168,76,0.045) 0%, transparent 48%)
          `,
        }}
      />
      <div
        className="acc-bg-depth pointer-events-none absolute inset-y-0 left-[-14%] right-[-14%] opacity-[0.38]"
        aria-hidden="true"
        style={{
          background:
            "repeating-linear-gradient(112deg, transparent 0 46px, rgba(237,240,247,0.015) 46px 47px, transparent 47px 104px)",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-5 md:px-10">
        <p
          className={`mb-16 max-w-[42ch] font-body text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--text-dim)]/70 transition-all duration-500 md:mb-20 ${
            focusedId ? "opacity-35 blur-[0.5px] motion-reduce:blur-none" : ""
          }`}
        >
          Competition record
        </p>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-[8] hidden h-full w-px -translate-x-1/2 md:block"
            aria-hidden="true"
          >
            <div
              className="acc-spine-line h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(237,240,247,0.12) 15%, rgba(237,240,247,0.12) 85%, transparent 100%)",
                transformOrigin: "top center",
              }}
            />
          </div>

          <div className="relative z-[12] flex flex-col gap-16 md:gap-24">
            {indexedGroups.map((group) => (
              <div key={group.label} className="relative">
                <div
                  className={`acc-year-pill mb-10 flex justify-center transition-all duration-500 md:mb-14 ${
                    focusedId ? "opacity-40 motion-reduce:opacity-100" : ""
                  }`}
                >
                  <div
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-sm"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset" }}
                  >
                    <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--text-dim)]/80">
                      {group.label}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-10 md:gap-14">
                  {group.items.map(({ a, isLeftSide, rowIndex }, ai) => {
                    const isFirst = a.placementNum === 1;
                    const isHeroFirstCard =
                      isFirst && a.imageSrc === "/awards/first-place-dvp-2026-regionals.jpg";
                    const color = placementColor[a.placementNum] ?? "var(--text-dim)";
                    const cardId = `${a.category}-${a.year}-${a.event}-${ai}-${group.label}`;
                    const isFocused = focusedId === cardId;
                    const peerDimmed = focusedId !== null && !isFocused;
                    const motif = resolveMonolithMotif(rowIndex, a);

                    const monolith = (
                      <PlacementMonolith
                        placement={a.placement}
                        placementNum={a.placementNum}
                        color={color}
                        motif={motif}
                        side={isLeftSide ? "right" : "left"}
                        peerDimmed={peerDimmed}
                      />
                    );

                    const card = (
                      <AccoladeCardBlock
                        a={a}
                        isFirst={isFirst}
                        color={color}
                        isFocused={isFocused}
                        peerDimmed={peerDimmed}
                        onMouseEnter={() => onCardEnter(cardId)}
                        onMouseLeave={onCardLeave}
                        reducedMotion={reducedMotion}
                      />
                    );

                    if (isHeroFirstCard) {
                      return (
                        <div key={cardId} className="acc-parallax-row relative" data-row-index={rowIndex}>
                          <div className="acc-parallax-depth-front will-change-transform relative mx-auto flex max-w-[1280px] justify-center">
                            {card}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={cardId} className="acc-parallax-row relative" data-row-index={rowIndex}>
                        <div
                          className={`acc-parallax-depth-front will-change-transform relative grid grid-cols-1 items-start gap-8 ${
                            isHeroFirstCard
                              ? "md:grid-cols-[minmax(0,1.12fr)_auto_minmax(0,0.88fr)] md:grid-rows-1 md:gap-x-10 lg:gap-x-16"
                              : "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-x-12 lg:gap-x-20"
                          }`}
                        >
                          <div
                            className={`flex w-full ${isHeroFirstCard ? "max-w-[min(100%,920px)]" : isFirst ? "max-w-[min(100%,780px)]" : "max-w-[min(100%,700px)]"} justify-self-center md:w-auto md:max-w-none md:justify-self-stretch ${
                              isLeftSide
                                ? isHeroFirstCard
                                  ? "order-1 md:order-none md:col-start-1 md:row-start-1 md:justify-start md:pr-2"
                                  : "order-1 md:order-none md:col-start-1 md:row-start-1 md:justify-end md:pr-6"
                                : "order-2 md:order-none md:col-start-1 md:row-start-1 md:justify-end md:pr-6"
                            }`}
                          >
                            {isLeftSide ? card : (
                              <div
                                className={`flex w-full justify-center md:max-w-[420px] md:justify-end ${
                                  peerDimmed ? "opacity-40 motion-reduce:opacity-100" : ""
                                }`}
                              >
                                {monolith}
                              </div>
                            )}
                          </div>

                          <div className="order-3 hidden min-h-[1px] md:order-none md:col-start-2 md:row-start-1 md:flex md:flex-col md:items-center md:justify-start md:pt-8">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/25 bg-[var(--void)] transition-transform duration-300 motion-reduce:transition-none"
                              style={{
                                boxShadow: "0 0 0 5px rgba(237,240,247,0.04)",
                                transform: isFocused ? "scale(1.35)" : "scale(1)",
                              }}
                              aria-hidden="true"
                            />
                          </div>

                          <div
                            className={`flex w-full ${isHeroFirstCard ? "max-w-[min(100%,520px)]" : isFirst ? "max-w-[min(100%,780px)]" : "max-w-[min(100%,700px)]"} justify-self-center md:w-auto md:max-w-none md:justify-self-stretch ${
                              !isLeftSide
                                ? "order-1 md:order-none md:col-start-3 md:row-start-1 md:justify-start md:pl-6"
                                : isHeroFirstCard
                                  ? "order-2 md:order-none md:col-start-3 md:row-start-1 md:justify-end md:pr-8"
                                  : "order-2 md:order-none md:col-start-3 md:row-start-1 md:justify-start md:pl-6"
                            }`}
                          >
                            {!isLeftSide ? card : isHeroFirstCard ? (
                              <div
                                className={`pointer-events-none relative hidden min-h-[240px] w-full md:flex md:items-center md:justify-end ${
                                  peerDimmed ? "opacity-40 motion-reduce:opacity-100" : ""
                                }`}
                                aria-hidden="true"
                              >
                                <div className="relative h-[210px] w-[210px] rounded-full border border-white/[0.05]">
                                  <div className="absolute inset-[18px] rounded-full border border-dashed border-white/[0.06]" />
                                  <div className="absolute inset-[52px] rounded-full border border-white/[0.05]" />
                                  <div
                                    className="absolute left-1/2 top-1/2 h-px w-[168px] -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                      background:
                                        "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.16) 44%, rgba(120,190,255,0.14) 100%)",
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex w-full justify-center md:max-w-[420px] md:justify-start ${
                                  peerDimmed ? "opacity-40 motion-reduce:opacity-100" : ""
                                }`}
                              >
                                {monolith}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p
            className={`acc-year-pill mx-auto mt-20 max-w-[48ch] border-t border-white/[0.08] pt-12 text-center font-display leading-[1.45] tracking-[-0.015em] text-[var(--text-dim)]/85 transition-all duration-500 md:mt-28 md:pt-16 ${
              focusedId ? "opacity-35 blur-[0.5px] motion-reduce:blur-none" : ""
            }`}
            style={{ fontSize: "clamp(1.05rem,1.9vw,1.4rem)", fontWeight: 400 }}
          >
            What earned placements in competition is the same precision we bring
            to every client build - nothing ornamental, everything repeatable.
          </p>
        </div>
      </div>
    </section>
  );
}
