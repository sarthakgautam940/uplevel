"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type VapiType from "@vapi-ai/web";
import Link from "next/link";
import { bookUrl } from "../../lib/brand.config";

type WidgetState = "idle" | "connecting" | "listening" | "speaking" | "error";

const WAVE_VB = 14;
const WAVE_MAX = 12;
const EASE_POWER3_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function computeWaveHeights(
  state: WidgetState,
  micLevel: number,
  wavePhase: number,
  hoverExtra: number,
): number[] {
  const stagger = (i: number) => Math.sin(wavePhase * 0.28 + i * 0.65);

  if (state === "error") {
    return [3, 3, 3, 3, 3];
  }

  if (state === "connecting") {
    const breathe = 0.5 + 0.5 * Math.sin(wavePhase * 0.18);
    return [2 + breathe, 3 + breathe * 1.15, 4 + breathe * 1.35, 3 + breathe * 1.15, 2 + breathe].map((h) =>
      clamp(h, 2, 5),
    );
  }

  if (state === "listening") {
    const v = micLevel;
    const ghost = v < 0.07 ? 0.2 * Math.sin(wavePhase * 0.3) : 0;
    const bump = ghost + v * 0.92;
    return [3, 5, 7, 5, 3].map((base, i) =>
      clamp(base + bump * (4.5 + i * 0.35) + stagger(i) * (v < 0.07 ? 1.25 : 0.45), 3, WAVE_MAX),
    );
  }

  if (state === "speaking") {
    const rush = 0.42 * Math.sin(wavePhase * 0.72);
    return [4, 7, 10, 7, 4].map((base, i) =>
      clamp(base + rush * (2.2 + i * 0.45) + stagger(i) * 1.6, 3, WAVE_MAX),
    );
  }

  const slow = Math.sin(wavePhase * 0.21);
  const hover = [0.35, 0.55, 1, 0.55, 0.35].map((m) => hoverExtra * m);
  return [4 + hover[0], 6 + hover[1], clamp(8 + slow * 2.2 + hover[2], 6, 11), 6 + hover[3], 4 + hover[4]].map((h) =>
    clamp(h, 3, WAVE_MAX),
  );
}

const DEMO_SCRIPT: { delay: number; state: WidgetState; line: string }[] = [
  { delay: 900, state: "speaking", line: "AI: You’ve reached UpLevel. In one sentence, what are you trying to fix on your site?" },
  { delay: 3200, state: "listening", line: "You: We need a sharper first impression and a way to capture leads after hours." },
  { delay: 2800, state: "speaking", line: "AI: Got it — premium positioning plus 24/7 intake. I can route you to a strategy call when you’re ready." },
  { delay: 3400, state: "listening", line: "You: Yes — book something this week if you have capacity." },
  { delay: 2600, state: "speaking", line: "AI: Opening the calendar. You’ll get a confirmation by email." },
];

export default function VapiWidget() {
  const [state, setState] = useState<WidgetState>("idle");
  const [expanded, setExpanded] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [entered, setEntered] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [vapiReady, setVapiReady] = useState(false);

  const vapiRef = useRef<InstanceType<typeof VapiType> | null>(null);
  const hoverExtraRef = useRef(0);
  const demoTimeoutsRef = useRef<number[]>([]);
  const demoMicIntervalRef = useRef<number | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const liveConfigured = Boolean(publicKey && assistantId);

  const onVolume = useCallback((v: number) => {
    setMicLevel(typeof v === "number" && !Number.isNaN(v) ? v : 0);
  }, []);

  const clearDemoTimers = useCallback(() => {
    demoTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    demoTimeoutsRef.current = [];
    if (demoMicIntervalRef.current != null) {
      window.clearInterval(demoMicIntervalRef.current);
      demoMicIntervalRef.current = null;
    }
  }, []);

  const endSession = useCallback(() => {
    clearDemoTimers();
    const v = vapiRef.current;
    if (v) {
      try {
        v.stop();
      } catch {
        /* ignore */
      }
    }
    setState("idle");
    setMicLevel(0);
    setExpanded(false);
    setTranscript([]);
  }, [clearDemoTimers]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setEntered(true), 450);
    const tickMs = 100;
    const tick = window.setInterval(() => {
      setWavePhase((p) => p + 1);
      hoverExtraRef.current *= 0.86;
    }, tickMs);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    if (!liveConfigured) {
      setVapiReady(true);
      return;
    }

    const onCallStart = () => {
      setState("listening");
      setMicLevel(0);
    };
    const onSpeechStart = () => setState("speaking");
    const onSpeechEnd = () => setState("listening");
    const onCallEnd = () => {
      setState("idle");
      setMicLevel(0);
      setTranscript([]);
      setExpanded(false);
    };
    const onError = () => setState("error");
    const onMessage = (msg: { type: string; transcript?: string; role?: string }) => {
      if (msg.type === "transcript" && msg.transcript) {
        setTranscript((prev) => [
          ...prev.slice(-6),
          `${msg.role === "assistant" ? "AI" : "You"}: ${msg.transcript}`,
        ]);
      }
    };

    let cancelled = false;
    import("@vapi-ai/web")
      .then(({ default: Vapi }) => {
        if (cancelled || !publicKey) return;
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;
        vapi.on("call-start", onCallStart);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("call-end", onCallEnd);
        vapi.on("error", onError);
        vapi.on("message", onMessage);
        vapi.on("volume-level", onVolume);
        setVapiReady(true);
      })
      .catch(() => {
        setVapiReady(true);
      });

    return () => {
      cancelled = true;
      const v = vapiRef.current;
      if (v) {
        v.removeListener("call-start", onCallStart);
        v.removeListener("speech-start", onSpeechStart);
        v.removeListener("speech-end", onSpeechEnd);
        v.removeListener("call-end", onCallEnd);
        v.removeListener("error", onError);
        v.removeListener("message", onMessage);
        v.removeListener("volume-level", onVolume);
        try {
          v.stop();
        } catch {
          /* ignore */
        }
        vapiRef.current = null;
      }
    };
  }, [liveConfigured, publicKey, onVolume]);

  const startDemoSession = useCallback(() => {
    clearDemoTimers();
    setTranscript([]);
    setState("connecting");
    setMicLevel(0);

    const tConnect = window.setTimeout(() => {
      setState("listening");
      demoMicIntervalRef.current = window.setInterval(() => {
        setMicLevel(0.1 + Math.random() * 0.38);
      }, 140);
    }, 1100);
    demoTimeoutsRef.current.push(tConnect);

    let acc = 1100;
    for (const step of DEMO_SCRIPT) {
      acc += step.delay;
      const id = window.setTimeout(() => {
        setState(step.state);
        setTranscript((prev) => [...prev.slice(-8), step.line]);
      }, acc);
      demoTimeoutsRef.current.push(id);
    }

    const tDone = window.setTimeout(() => {
      if (demoMicIntervalRef.current != null) {
        window.clearInterval(demoMicIntervalRef.current);
        demoMicIntervalRef.current = null;
      }
      setMicLevel(0);
      setState("idle");
    }, acc + 2200);
    demoTimeoutsRef.current.push(tDone);
  }, [clearDemoTimers]);

  const handleToggle = async () => {
    if (!vapiReady) return;

    if (state !== "idle") {
      endSession();
      return;
    }

    setExpanded(true);

    if (liveConfigured && vapiRef.current && assistantId) {
      setState("connecting");
      try {
        await vapiRef.current.start(assistantId);
      } catch {
        setState("error");
      }
      return;
    }

    startDemoSession();
  };

  const closePanel = () => {
    endSession();
  };

  const heights = computeWaveHeights(state, micLevel, wavePhase, hoverExtraRef.current);

  const stateLabel: Record<WidgetState, string> = {
    idle: "Ready",
    connecting: "Connecting…",
    listening: "Listening…",
    speaking: "Speaking…",
    error: "Connection issue",
  };

  const stateColor: Record<WidgetState, string> = {
    idle: "var(--electric)",
    connecting: "var(--text-dim)",
    listening: "var(--teal)",
    speaking: "var(--warm)",
    error: "#ef4444",
  };

  const barFill = stateColor[state];
  const sessionActive = state === "connecting" || state === "listening" || state === "speaking";
  const triggerLabel = sessionActive ? "End session" : "Voice intake";

  return (
    <div
      className="fixed bottom-6 right-6 z-[100002] flex flex-col items-end gap-3"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateX(0)" : "translateX(12px)",
        transition: `opacity 500ms ${EASE_POWER3_OUT}, transform 500ms ${EASE_POWER3_OUT}`,
        pointerEvents: "auto",
      }}
      aria-live="polite"
    >
      {expanded && (
        <div
          className="vapi-panel-enter mb-1 flex w-[min(calc(100vw-3rem),340px)] flex-col gap-4 rounded-[12px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-5 shadow-[0_24px_64px_-28px_rgba(0,0,0,0.65)]"
          style={{ backdropFilter: "blur(14px)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                Voice intake
              </p>
              <p className="mt-1 font-display text-[17px] font-normal tracking-[-0.02em] text-[var(--text)]">
                UpLevel signal
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full border border-[var(--border)] bg-white/[0.03] px-2.5 py-1 font-body text-[11px] text-[var(--text-dim)] transition-colors duration-300 hover:border-white/20 hover:text-[var(--text)]"
              style={{ cursor: "none" }}
              aria-label="Close voice panel"
            >
              Close
            </button>
          </div>

          <div className="h-px w-full bg-[var(--border)]" aria-hidden="true" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="h-[7px] w-[7px] shrink-0 rounded-full"
                style={{
                  background: stateColor[state],
                  animation:
                    state === "listening" || state === "speaking"
                      ? "pulseDot 1.2s ease-in-out infinite"
                      : state === "connecting"
                        ? "pulseDot 2s ease-in-out infinite"
                        : "none",
                }}
                aria-hidden="true"
              />
              <span className="font-body text-[13px] text-[var(--text-dim)]">{stateLabel[state]}</span>
            </div>
            <div className="flex items-end gap-1 rounded-lg bg-[color-mix(in_srgb,var(--void)_40%,transparent)] px-2 py-2 ring-1 ring-white/[0.06]">
              {[0, 1, 2, 3, 4].map((i) => {
                const h = heights[i] ?? 4;
                const y = (WAVE_VB - h) / 2;
                return (
                  <svg key={i} width={4} height={WAVE_VB} viewBox={`0 0 4 ${WAVE_VB}`} className="shrink-0" aria-hidden>
                    <rect x={1} y={y} width={2} height={h} rx={1} fill={barFill} opacity={0.5 + i * 0.1} />
                  </svg>
                );
              })}
            </div>
          </div>

          <div className="rounded-[10px] border border-white/[0.06] bg-[color-mix(in_srgb,var(--void)_55%,transparent)] px-3.5 py-3">
            <p className="font-body text-[9px] uppercase tracking-[0.2em] text-[var(--text-dim)]/70">Session</p>
            <p className="mt-1 font-body text-[12px] leading-snug text-[var(--text-dim)]">
              {liveConfigured
                ? "When a call is active, audio runs in your browser like a normal voice session."
                : "Sample conversation you can walk through anytime. Use Book a call for a real strategy session."}
            </p>
          </div>

          <div className="h-px w-full bg-[var(--border)]" aria-hidden="true" />

          <div className="flex max-h-[200px] min-h-[72px] flex-col gap-2 overflow-y-auto pr-1">
            {transcript.length === 0 ? (
              <p className="font-body text-[12px] leading-relaxed text-[var(--text-dim)]/55">
                Start a session to see the intake transcript here. Nothing is stored in this preview.
              </p>
            ) : (
              transcript.map((line, i) => (
                <p
                  key={`${i}-${line.slice(0, 12)}`}
                  className={`font-body text-[12px] leading-snug ${
                    line.startsWith("AI:") ? "text-[var(--text)]/90" : "text-[var(--text-dim)]/85"
                  }`}
                >
                  {line}
                </p>
              ))
            )}
          </div>

          <div className="h-px w-full bg-[var(--border)]" aria-hidden="true" />

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[10px] leading-snug text-[var(--text-dim)]/50">
              Prefer human scheduling? Use the calendar instead.
            </p>
            <Link
              href={bookUrl}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--warm)_55%,var(--border))] bg-[color-mix(in_srgb,var(--warm)_12%,transparent)] px-4 py-2 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--warm)] transition-colors hover:bg-[color-mix(in_srgb,var(--warm)_18%,transparent)]"
              target="_blank"
              rel="noreferrer"
            >
              Book a call
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={!vapiReady}
        onMouseEnter={() => {
          hoverExtraRef.current = 3.2;
        }}
        className="vapi-trigger group flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-3 transition-[border-color,box-shadow,opacity] duration-300 hover:border-[color-mix(in_srgb,var(--electric)_40%,var(--border))] disabled:cursor-wait disabled:opacity-60"
        style={{
          cursor: vapiReady ? "none" : "wait",
          backdropFilter: "blur(12px)",
        }}
        aria-expanded={expanded}
        aria-label={triggerLabel}
      >
        <svg width="18" height={WAVE_VB} viewBox={`0 0 18 ${WAVE_VB}`} fill="none" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => {
            const x = i * 4;
            const h = heights[i] ?? 4;
            const y = (WAVE_VB - h) / 2;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="2"
                height={h}
                rx="1"
                fill={barFill}
                opacity={0.55 + i * 0.09}
                style={{
                  transition:
                    state === "error" ? "none" : "height 120ms ease-out, y 120ms ease-out, fill 280ms ease",
                }}
              />
            );
          })}
        </svg>
        <span className="font-body text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]">{triggerLabel}</span>
      </button>
    </div>
  );
}
