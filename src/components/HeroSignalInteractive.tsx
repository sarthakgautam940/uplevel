"use client";

import { startTransition, useEffect, useRef, useState } from "react";

type ModeId = "voice" | "routing" | "followup";

type Mode = {
  id: ModeId;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
};

type Lead = {
  client: string;
  inquiry: string;
  fit: string;
};

const MODES: Mode[] = [
  {
    id: "voice",
    label: "Voice",
    eyebrow: "Live voice intake",
    title: "Ready in 12 seconds",
    body: "Answer fast. Qualify tone. Hand off clean.",
    metricLabel: "After-hours coverage",
    metricValue: "24/7",
  },
  {
    id: "routing",
    label: "Routing",
    eyebrow: "Priority lead routing",
    title: "High-fit leads go first",
    body: "Value, urgency, and intent decide the path.",
    metricLabel: "Current fit score",
    metricValue: "97%",
  },
  {
    id: "followup",
    label: "Follow-up",
    eyebrow: "Booked next-step system",
    title: "Nothing valuable goes cold",
    body: "Every qualified inquiry leaves with a clear next action.",
    metricLabel: "Owner-ready brief",
    metricValue: "Loaded",
  },
];

const LEADS: Lead[] = [
  {
    client: "Private Aviation",
    inquiry: "Charter inquiry",
    fit: "97%",
  },
  {
    client: "Executive Legal",
    inquiry: "Urgent consult",
    fit: "94%",
  },
  {
    client: "Aesthetic Clinic",
    inquiry: "Premium booking",
    fit: "96%",
  },
];

const STAGES = ["Capture", "Route", "Follow through"];

function rotateMode(current: ModeId): ModeId {
  const currentIndex = MODES.findIndex((mode) => mode.id === current);
  return MODES[(currentIndex + 1) % MODES.length].id;
}

function getStageIndex(mode: ModeId) {
  if (mode === "voice") return 0;
  if (mode === "routing") return 1;
  return 2;
}

function ModeVisual({ mode, compact }: { mode: ModeId; compact: boolean }) {
  if (mode === "voice") {
    const barCount = compact ? 20 : 24;

    return (
      <div className="flex h-[44px] items-end gap-[5px]">
        {Array.from({ length: barCount }).map((_, index) => (
          <span
            key={index}
            className="block w-[4px] rounded-full bg-[rgba(238,241,247,0.54)] motion-safe:animate-[heroWaveBar_1.65s_ease-in-out_infinite]"
            style={{
              height: `${14 + ((index * 9) % 24)}px`,
              opacity: index % 5 === 0 ? 0.92 : 0.42,
              animationDelay: `${index * 0.05}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (mode === "routing") {
    return (
      <div className="flex items-center gap-3">
        {STAGES.map((stage, index) => {
          const active = index <= 1;
          return (
            <div key={stage} className="flex flex-1 items-center gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    active
                      ? "bg-[var(--warm)] shadow-[0_0_14px_rgba(201,168,76,0.34)] motion-safe:animate-[heroSignalPulse_2.4s_ease-in-out_infinite]"
                      : "bg-white/18"
                  }`}
                />
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/46">
                  {stage}
                </span>
              </div>
              {index < STAGES.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    active ? "bg-[rgba(201,168,76,0.26)]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {STAGES.map((stage, index) => {
        const active = index === 2;
        return (
          <div
            key={stage}
            className={`rounded-[16px] border px-3 py-3 ${
              active
                ? "border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.07)]"
                : "border-white/8 bg-white/[0.03]"
            }`}
          >
            <p className="font-body text-[9px] uppercase tracking-[0.22em] text-white/40">
              Stage
            </p>
            <p className="mt-2 font-body text-[12px] leading-relaxed text-white/72">{stage}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSignalInteractive({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mode, setMode] = useState<ModeId>("voice");
  const [leadIndex, setLeadIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const resumeRef = useRef<number | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || reducedMotion || !autoplay) return;
    let tick = 0;
    const intervalId = window.setInterval(() => {
      tick += 1;
      startTransition(() => {
        setMode((current) => rotateMode(current));
        if (tick % 2 === 0) {
          setLeadIndex((current) => (current + 1) % LEADS.length);
        }
      });
    }, 4600);

    return () => window.clearInterval(intervalId);
  }, [autoplay, hydrated, reducedMotion]);

  useEffect(
    () => () => {
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
    },
    [],
  );

  const pauseAutoplay = () => {
    setAutoplay(false);
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setAutoplay(true), 10000);
  };

  const activeMode = MODES.find((item) => item.id === mode) ?? MODES[0];
  const activeLead = LEADS[leadIndex];
  const activeStage = getStageIndex(mode);

  if (compact) {
    return (
      <div className={`grid gap-3 ${className}`}>
        <section className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.045)_0%,rgba(10,14,23,0.88)_100%)] px-5 py-5 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.7)] backdrop-blur-[18px]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/38">
                UpLevel signal
              </p>
              <p className="mt-1 font-body text-[12px] tracking-[0.01em] text-white/62">
                {activeMode.eyebrow}
              </p>
            </div>
            <div className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.06)] px-3 py-1.5">
              <span className="font-body text-[9px] uppercase tracking-[0.24em] text-[rgba(255,245,218,0.78)]">
                Live
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {MODES.map((item) => {
              const active = item.id === mode;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    pauseAutoplay();
                    setMode(item.id);
                  }}
                  className={`rounded-full border px-3 py-2 font-body text-[10px] uppercase tracking-[0.22em] transition-all duration-500 ${
                    active
                      ? "border-[rgba(201,168,76,0.24)] bg-[rgba(201,168,76,0.08)] text-[rgba(255,245,218,0.84)]"
                      : "border-white/10 bg-white/[0.02] text-white/44 hover:border-white/18 hover:text-white/72"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[22px] border border-white/[0.08] bg-[rgba(7,11,18,0.52)] px-4 py-4">
            <p className="font-body text-[10px] uppercase tracking-[0.26em] text-white/36">
              {activeLead.client}
            </p>
            <h3 className="mt-3 font-display text-[2rem] leading-[0.96] tracking-[-0.05em] text-white/94">
              {activeMode.title}
            </h3>
            <p className="mt-3 max-w-[26ch] font-body text-[14px] leading-relaxed text-white/60">
              {activeMode.body}
            </p>
            <div className="mt-5">
              <ModeVisual mode={mode} compact />
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.04)_0%,rgba(8,11,18,0.86)_100%)] px-4 py-4 backdrop-blur-[16px]">
          <div className="flex items-center justify-between gap-3">
            <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/40">
              Lead queue
            </p>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/32">
              {LEADS.length} active
            </p>
          </div>
          <div className="mt-3 grid gap-2">
            {LEADS.map((lead, index) => {
              const active = index === leadIndex;
              return (
                <button
                  key={lead.client}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    pauseAutoplay();
                    setLeadIndex(index);
                  }}
                  className={`rounded-[18px] border px-4 py-3 text-left transition-all duration-500 ${
                    active
                      ? "border-white/[0.18] bg-white/[0.04]"
                      : "border-white/8 bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-body text-[9px] uppercase tracking-[0.22em] text-white/36">
                        {lead.client}
                      </p>
                      <p className="mt-1 font-body text-[14px] leading-relaxed text-white/80">
                        {lead.inquiry}
                      </p>
                    </div>
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {lead.fit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[500px] ${className}`}>
      <div className="pointer-events-none absolute inset-[4%_4%_2%_2%] rounded-[999px] bg-[radial-gradient(circle_at_42%_46%,rgba(255,255,255,0.026)_0%,transparent_52%),radial-gradient(circle_at_78%_22%,rgba(201,168,76,0.042)_0%,transparent_28%)]" />

      <section className="group absolute left-[0%] top-[6%] z-[2] w-[67%] rounded-[32px] border border-white/[0.1] bg-[linear-gradient(160deg,rgba(255,255,255,0.052)_0%,rgba(9,13,22,0.92)_100%)] px-6 py-6 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.84)] backdrop-blur-[18px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/38">
              UpLevel signal
            </p>
            <p className="mt-1 font-body text-[12px] tracking-[0.01em] text-white/62">
              {activeMode.eyebrow}
            </p>
          </div>
          <div className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.06)] px-3 py-1.5">
            <span className="font-body text-[9px] uppercase tracking-[0.24em] text-[rgba(255,245,218,0.78)]">
              Live intake
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {MODES.map((item) => {
            const active = item.id === mode;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  pauseAutoplay();
                  setMode(item.id);
                }}
                className={`rounded-full border px-3 py-2 font-body text-[10px] uppercase tracking-[0.22em] transition-all duration-500 ${
                  active
                    ? "border-[rgba(201,168,76,0.24)] bg-[rgba(201,168,76,0.08)] text-[rgba(255,245,218,0.84)]"
                    : "border-white/10 bg-white/[0.02] text-white/44 hover:border-white/18 hover:text-white/72"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/34">
            {activeLead.client}
          </p>
          <h3 className="mt-3 max-w-[14ch] font-display text-[clamp(2.1rem,3.5vw,2.95rem)] leading-[0.95] tracking-[-0.05em] text-white/95">
            {activeMode.title}
          </h3>
          <p className="mt-4 max-w-[24ch] font-body text-[15px] leading-relaxed text-white/58">
            {activeMode.body}
          </p>
        </div>

        <div className="mt-7 rounded-[22px] border border-white/[0.08] bg-[rgba(6,9,15,0.44)] px-4 py-4">
          <ModeVisual mode={mode} compact={false} />
        </div>
      </section>

      <section className="absolute right-[0%] top-[5%] z-[3] w-[31%] rounded-[26px] border border-white/[0.1] bg-[linear-gradient(160deg,rgba(255,255,255,0.04)_0%,rgba(8,11,18,0.9)_100%)] px-4 py-4 shadow-[0_22px_74px_-44px_rgba(0,0,0,0.84)] backdrop-blur-[16px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/40">
            Lead queue
          </p>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/32">
            {LEADS.length} active
          </p>
        </div>

        <div className="mt-3 grid gap-2">
          {LEADS.map((lead, index) => {
            const active = index === leadIndex;
            return (
              <button
                key={lead.client}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  pauseAutoplay();
                  setLeadIndex(index);
                }}
                className={`rounded-[18px] border px-4 py-3 text-left transition-all duration-500 ${
                  active
                    ? "border-white/[0.18] bg-white/[0.04]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-[0.22em] text-white/36">
                      {lead.client}
                    </p>
                    <p className="mt-1 font-body text-[13px] leading-relaxed text-white/80">
                      {lead.inquiry}
                    </p>
                  </div>
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {lead.fit}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="absolute bottom-[8%] left-[8%] z-[4] w-[66%] rounded-[24px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.028)_0%,rgba(8,11,18,0.86)_100%)] px-5 py-4 shadow-[0_18px_52px_-36px_rgba(0,0,0,0.82)] backdrop-blur-[14px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.24em] text-white/38">
              {activeMode.metricLabel}
            </p>
            <p className="mt-2 font-display text-[2rem] leading-none tracking-[-0.05em] text-white/92">
              {activeMode.metricValue}
            </p>
          </div>
          <div className="h-9 w-px bg-white/10" />
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between">
              {STAGES.map((stage, index) => {
                const active = index === activeStage;
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active
                          ? "bg-[var(--warm)] shadow-[0_0_14px_rgba(201,168,76,0.34)] motion-safe:animate-[heroSignalPulse_2.4s_ease-in-out_infinite]"
                          : "bg-white/16"
                      }`}
                    />
                    <span className="font-body text-[9px] uppercase tracking-[0.2em] text-white/40">
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="relative h-px overflow-hidden bg-white/10">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[rgba(201,168,76,0.6)] via-white/55 to-[rgba(201,168,76,0.18)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${((activeStage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
