"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  onComplete: () => void;
};

const INTRO_PHRASE = "Raise the signal above the noise.";
const PRELOADER_DONE_EVENT = "uplevel:preloader-done";

type IntroWindow = Window & {
  __UPLEVEL_INITIAL_PATH__?: string;
  __UPLEVEL_HOME_INTRO_ACTIVE__?: boolean;
};

function prepStroke(node: SVGGeometryElement | null) {
  if (!node) return 0;
  const length = node.getTotalLength();
  node.style.strokeDasharray = `${length}`;
  node.style.strokeDashoffset = `${length}`;
  return length;
}

export default function CalibrationPreloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<SVGLineElement>(null);
  const horizonRef = useRef<SVGLineElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const leftRailRef = useRef<SVGPathElement>(null);
  const rightRailRef = useRef<SVGPathElement>(null);
  const markRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const phraseWrapRef = useRef<HTMLDivElement>(null);

  const [typedCount, setTypedCount] = useState(0);

  useLayoutEffect(() => {
    let finished = false;
    let timeline: ReturnType<typeof gsap.timeline> | null = null;
    let typingId: number | null = null;
    let fallbackId = 0;

    const fireDone = () => {
      if (finished) return;
      finished = true;
      const root = rootRef.current;
      if (root) {
        root.style.pointerEvents = "none";
        root.style.display = "none";
      }
      (window as IntroWindow).__UPLEVEL_HOME_INTRO_ACTIVE__ = false;
      window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
      onComplete();
    };

    const clearFallback = () => window.clearTimeout(fallbackId);

    const done = () => {
      clearFallback();
      fireDone();
    };

    const root = rootRef.current;
    const veil = veilRef.current;
    const vertical = verticalRef.current;
    const horizon = horizonRef.current;
    const circle = circleRef.current;
    const leftRail = leftRailRef.current;
    const rightRail = rightRailRef.current;
    const mark = markRef.current;
    const word = wordRef.current;
    const meta = metaRef.current;
    const phraseWrap = phraseWrapRef.current;

    if (
      !root ||
      !veil ||
      !vertical ||
      !horizon ||
      !circle ||
      !leftRail ||
      !rightRail ||
      !mark ||
      !word ||
      !meta ||
      !phraseWrap
    ) {
      done();
      return () => {
        clearFallback();
        timeline?.kill();
        if (typingId) window.clearInterval(typingId);
      };
    }

    const introWindow = window as IntroWindow;
    const initialPath = introWindow.__UPLEVEL_INITIAL_PATH__ ?? window.location.pathname;
    const shouldRun = initialPath === "/" && introWindow.__UPLEVEL_HOME_INTRO_ACTIVE__ !== false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!shouldRun || reducedMotion) {
      gsap.set(root, { autoAlpha: 0 });
      done();
      return () => {
        clearFallback();
        timeline?.kill();
        if (typingId) window.clearInterval(typingId);
      };
    }

    try {
      introWindow.__UPLEVEL_HOME_INTRO_ACTIVE__ = true;
      root.style.display = "block";
      root.style.pointerEvents = "auto";
      gsap.set(root, { autoAlpha: 1 });

      const circleLength = prepStroke(circle);
      prepStroke(leftRail);
      prepStroke(rightRail);
      const markLength = prepStroke(mark);

      gsap.set(veil, { opacity: 0 });
      gsap.set(vertical, { opacity: 0, scaleY: 0.18, transformOrigin: "center center" });
      gsap.set(horizon, { opacity: 0, scaleX: 0.18, transformOrigin: "center center" });
      gsap.set(circle, { opacity: 0.18, strokeDashoffset: circleLength });
      gsap.set([leftRail, rightRail], { opacity: 0.18 });
      gsap.set(mark, { opacity: 0, strokeDashoffset: markLength });
      gsap.set(word, { opacity: 0, y: 18, letterSpacing: "0.28em" });
      gsap.set(meta, { opacity: 0, y: 8 });
      gsap.set(phraseWrap, { opacity: 0, y: 10 });
      setTypedCount(0);

      fallbackId = window.setTimeout(fireDone, 8000);

      const startTyping = () => {
        if (typingId) window.clearInterval(typingId);
        let index = 0;
        typingId = window.setInterval(() => {
          index += 1;
          setTypedCount(index);
          if (index >= INTRO_PHRASE.length && typingId) {
            window.clearInterval(typingId);
            typingId = null;
          }
        }, 26);
      };

      timeline = gsap.timeline({ onComplete: done });

      timeline.to(
        veil,
        {
          opacity: 1,
          duration: 0.34,
          ease: "power2.out",
        },
        0,
      );

      timeline.to(
        vertical,
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.44,
          ease: "power3.out",
        },
        0.06,
      );

      timeline.to(
        horizon,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.44,
          ease: "power3.out",
        },
        0.1,
      );

      timeline.to(
        circle,
        {
          opacity: 0.52,
          strokeDashoffset: 0,
          duration: 0.72,
          ease: "power2.out",
        },
        0.12,
      );

      timeline.to(
        [leftRail, rightRail],
        {
          opacity: 0.72,
          strokeDashoffset: 0,
          duration: 0.62,
          ease: "power2.out",
          stagger: 0.04,
        },
        0.2,
      );

      timeline.call(startTyping, [], 0.34);

      timeline.to(
        phraseWrap,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        0.38,
      );

      timeline.to(
        mark,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.56,
          ease: "power3.out",
        },
        0.48,
      );

      timeline.to(
        word,
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.12em",
          duration: 0.56,
          ease: "power3.out",
        },
        0.68,
      );

      timeline.to(
        meta,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        0.82,
      );

      timeline.to({}, { duration: 0.54 });

      timeline.to(
        [word, meta, phraseWrap],
        {
          opacity: 0,
          y: -10,
          duration: 0.24,
          ease: "power2.in",
          stagger: 0.03,
        },
        "+=0.04",
      );

      timeline.to(
        [mark, leftRail, rightRail, circle, vertical, horizon],
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "<",
      );

      timeline.to(
        root,
        {
          autoAlpha: 0,
          duration: 0.42,
          ease: "power2.out",
        },
        "<+=0.08",
      );
    } catch {
      done();
    }

    return () => {
      clearFallback();
      timeline?.kill();
      if (typingId) window.clearInterval(typingId);
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        overflow: "hidden",
        background: "#03050a",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        ref={veilRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.03) 0%, rgba(8,10,16,0.18) 42%, rgba(3,5,10,0.84) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(820px, 92vw)",
            aspectRatio: "1.2 / 1",
          }}
        >
          <svg
            viewBox="0 0 820 680"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <g fill="none">
              <line
                ref={verticalRef}
                x1="410"
                y1="40"
                x2="410"
                y2="642"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <line
                ref={horizonRef}
                x1="126"
                y1="418"
                x2="694"
                y2="418"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <circle
                ref={circleRef}
                cx="410"
                cy="332"
                r="188"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="3 7"
              />
              <path
                ref={leftRailRef}
                d="M 250 552 L 410 168"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.2"
              />
              <path
                ref={rightRailRef}
                d="M 570 552 L 410 168"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.2"
              />
              <path
                ref={markRef}
                d="M 298 552 L 410 292 L 522 552"
                stroke="rgba(255,255,255,0.96)"
                strokeWidth="1.8"
              />
            </g>
          </svg>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "24%",
              transform: "translateX(-50%)",
              width: "min(520px, 78vw)",
              textAlign: "center",
            }}
          >
            <div
              ref={phraseWrapRef}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: "clamp(0.82rem, 1vw, 0.96rem)",
                color: "rgba(236,239,246,0.86)",
                letterSpacing: "-0.02em",
              }}
            >
              <span>{INTRO_PHRASE.slice(0, typedCount)}</span>
              <span
                style={{
                  width: "1px",
                  height: "1em",
                  background: "rgba(255,255,255,0.68)",
                  animation: "introCursorBlink 1s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          <div
            ref={wordRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              fontSize: "clamp(2.6rem, 6.2vw, 5.6rem)",
              fontWeight: 500,
              lineHeight: 0.96,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(245,247,251,0.95)",
            }}
          >
            UpLevel
          </div>

          <p
            ref={metaRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "20%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(180,190,208,0.5)",
            }}
          >
            Virginia / Digital authority systems
          </p>
        </div>
      </div>
    </div>
  );
}
