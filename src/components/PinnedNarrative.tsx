"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const frames = [
  {
    n: "01",
    heading: "Attention lands.",
    body: "The first question isn\u2019t \u201ccan they do it?\u201d It\u2019s \u201cdo they feel ready?\u201d That judgment forms before a single word is read.",
  },
  {
    n: "02",
    heading: "Trust is formed or lost.",
    body: "Design quality, load speed, clarity of hierarchy \u2014 these are the signals a luxury buyer reads in the first four seconds. They\u2019re not evaluating your portfolio. They\u2019re evaluating whether you take this seriously.",
  },
  {
    n: "03",
    heading: "The decision happens.",
    body: "Not on a call. Not after a quote. Before either. The visitor decides whether to lean in or navigate away in the time it takes to scroll the hero. Premium businesses don\u2019t get second chances at first impressions.",
  },
  {
    n: "04",
    heading: "Revenue routes \u2014 or doesn\u2019t.",
    body: "Silence is not neutral. A site that answers no questions, creates no next step, and feels ordinary sends the work somewhere else \u2014 quietly, at scale, every week.",
  },
];

const CHARS = "0123456789";

export default function PinnedNarrative() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const framesRef  = useRef<(HTMLDivElement | null)[]>([]);
  const numEls     = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const tweenRef   = useRef<gsap.core.Tween | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentFrame = useRef<number>(0);

  const clearTypewriter = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runTypewriter = useCallback((idx: number) => {
    clearTypewriter();
    const el = numEls.current[idx];
    if (!el) return;

    const target = frames[idx].n;
    const digits = target.split("");
    const lockedAt: boolean[] = new Array(digits.length).fill(false);
    let lockCount = 0;
    const totalDuration = 700;
    const staggerMs = 180;
    const intervalMs = 40;
    let elapsed = 0;

    /* Schedule when each digit locks */
    digits.forEach((_, di) => {
      setTimeout(() => {
        lockedAt[di] = true;
        lockCount++;
      }, staggerMs * di + (totalDuration - staggerMs * (digits.length - 1)));
    });

    intervalRef.current = setInterval(() => {
      elapsed += intervalMs;
      const display = digits.map((d, di) => {
        if (lockedAt[di]) return d;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      el.textContent = display;

      if (lockCount >= digits.length) {
        clearTypewriter();
        el.textContent = target;
      }
    }, intervalMs);
  }, [clearTypewriter]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const firstFrame = framesRef.current[0];
      if (firstFrame) firstFrame.style.opacity = "1";
      const firstNum = numEls.current[0];
      if (firstNum) firstNum.style.color = "";
      return;
    }

    const wrap = wrapRef.current;
    const pin  = pinRef.current;
    if (!wrap || !pin) return;

    const frameEls = framesRef.current.filter(Boolean) as HTMLDivElement[];

    gsap.set(frameEls, { opacity: 0, y: 40 });
    gsap.set(frameEls[0], { opacity: 1, y: 0 });

    /* Trigger the typewriter for frame 0 on first load */
    setTimeout(() => runTypewriter(0), 500);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: `+=${frames.length * 100}%`,
          scrub: 1,
          pin: pin,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * frames.length),
              frames.length - 1
            );

            /* Update counter */
            if (counterRef.current) {
              counterRef.current.textContent = `0${idx + 1} / 04`;
            }

            /* Scrub the progress line */
            if (lineRef.current) {
              lineRef.current.style.transform = `scaleX(${self.progress})`;
            }

            /* Reactive glow — grows and brightens with progress */
            if (glowRef.current) {
              const op = 0.04 + self.progress * 0.05;
              const sc = 0.6 + self.progress * 0.7;
              glowRef.current.style.opacity = String(op);
              glowRef.current.style.transform = `translate(-50%,-50%) scale(${sc})`;
            }

            /* Trigger typewriter when frame changes */
            if (idx !== currentFrame.current) {
              currentFrame.current = idx;
              runTypewriter(idx);
            }
          },
        },
      });

      frames.forEach((_, i) => {
        if (i === 0) return;
        const prev = frameEls[i - 1];
        const curr = frameEls[i];
        const headEl = curr?.querySelector(".pn-headline");

        tl.to(prev, { opacity: 0, y: -50, duration: 0.4 });

        if (headEl) {
          tl.fromTo(headEl,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power4.out" },
            "-=0.1"
          );
        }

        tl.to(curr, { opacity: 1, y: 0, duration: 0.55 }, headEl ? "-=0.55" : "-=0.1");
      });
    }, wrap);

    return () => {
      clearTypewriter();
      ctx.revert();
    };
  }, [runTypewriter, clearTypewriter]);

  return (
    <div
      ref={wrapRef}
      style={{ height: `${(frames.length * 100) + 50}vh` }}
      className="relative bg-[var(--void)]"
    >
      <div
        ref={pinRef}
        className="flex h-screen flex-col justify-center overflow-hidden px-5 md:px-10"
      >
        {/* Reactive glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(77,130,255,0.05) 0%, transparent 60%)",
            transform: "translate(-50%,-50%) scale(0.6)",
            opacity: 0.04,
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[1600px]">
          {/* Header bar */}
          <div className="mb-10 flex items-center justify-between">
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
              The sequence
            </p>
            <span
              ref={counterRef}
              className="font-display tabular-nums text-[var(--text-dim)] opacity-40"
              style={{ fontSize: "clamp(0.75rem,1vw,0.875rem)" }}
            >
              01 / 04
            </span>
          </div>

          {/* Progress scrub line */}
          <div
            className="mb-14 h-px w-full overflow-hidden"
            style={{ background: "rgba(237,240,247,0.06)" }}
            aria-hidden="true"
          >
            <div
              ref={lineRef}
              className="h-full w-full origin-left"
              style={{
                background: "linear-gradient(90deg, var(--electric) 0%, var(--teal) 100%)",
                transform: "scaleX(0)",
              }}
            />
          </div>

          {/* Frame stack */}
          <div className="relative" style={{ minHeight: "clamp(300px,42vh,440px)" }}>
            {frames.map((f, i) => (
              <div
                key={f.n}
                ref={(el) => { framesRef.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-start"
                aria-hidden={i !== 0}
              >
                {/* Large background number — typewriter effect */}
                <span
                  ref={(el) => { numEls.current[i] = el; }}
                  className="select-none font-display tabular-nums leading-none text-[var(--text-dim)]"
                  style={{
                    fontSize: "clamp(4rem,13vw,10rem)",
                    fontWeight: 400,
                    opacity: 0.07,
                    lineHeight: 1,
                    marginBottom: "-0.18em",
                    letterSpacing: "-0.04em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                  aria-hidden="true"
                >
                  {f.n}
                </span>

                <h2
                  className="pn-headline font-display tracking-[-0.03em] text-[var(--text)]"
                  style={{
                    fontSize: "clamp(2.5rem,7vw,5.5rem)",
                    lineHeight: 0.92,
                    fontWeight: 400,
                    maxWidth: "20ch",
                    overflow: "hidden",
                  }}
                >
                  {f.heading}
                </h2>

                <p
                  className="mt-7 max-w-[46ch] font-body leading-[1.72] text-[var(--text-dim)]"
                  style={{ fontSize: "clamp(0.875rem,1.25vw,1.0rem)" }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
