"use client";
import { useEffect, useRef, useState } from "react";

interface Props { onDone: () => void; }

export default function Loader({ onDone }: Props) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"anim"|"exit"|"gone">("anim");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Animate letters in
  useEffect(() => {
    const letters = document.querySelectorAll("#loader-wm .ch span");
    const sub = document.getElementById("loader-sub");
    const num = document.getElementById("loader-num");
    const bar = document.getElementById("loader-bar");

    let i = 0;
    const stagger = 80;
    // Stagger each letter up
    letters.forEach((el, idx) => {
      setTimeout(() => {
        (el as HTMLElement).style.transition = `transform 0.75s cubic-bezier(0.16,1,0.3,1)`;
        (el as HTMLElement).style.transform = "translateY(0)";
      }, 200 + idx * stagger);
    });

    // Fade in sub items
    setTimeout(() => {
      if (sub) { sub.style.transition = "opacity 0.5s ease"; sub.style.opacity = "1"; }
      if (num) { num.style.transition = "opacity 0.5s ease"; num.style.opacity = "1"; }
    }, 200 + letters.length * stagger + 100);

    // Progress bar
    const duration = 2000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      const n = Math.round(eased * 100);
      setPct(n);
      if (bar) bar.style.width = n + "%";
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPct(100);
        setTimeout(() => setPhase("exit"), 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Quadrant exit
  useEffect(() => {
    if (phase !== "exit") return;
    const panels = ["lp-tl","lp-tr","lp-bl","lp-br"];
    const transforms = [
      "translate(-100%,-100%)",
      "translate(100%,-100%)",
      "translate(-100%,100%)",
      "translate(100%,100%)",
    ];
    panels.forEach((cls, i) => {
      const el = document.querySelector(`.${cls}`) as HTMLElement;
      if (!el) return;
      el.style.transition = "transform 0.85s cubic-bezier(0.76,0,0.24,1)";
      el.style.transform = transforms[i];
    });
    const mid = document.getElementById("loader-mid-line") as HTMLElement;
    if (mid) { mid.style.transition = "opacity 0.3s ease"; mid.style.opacity = "0"; }
    setTimeout(() => { setPhase("gone"); onDoneRef.current(); }, 920);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <>
      {/* Mid line */}
      <div id="loader-mid-line" />

      {/* Quadrant panels for exit */}
      <div className="loader-panel lp-tl" />
      <div className="loader-panel lp-tr" />
      <div className="loader-panel lp-bl" />
      <div className="loader-panel lp-br" />

      {/* Content */}
      <div id="loader">
        <div className="loader-top">
          <div id="loader-wm">
            {/* Split "UPLEVEL" into individual letter spans */}
            {"UP".split("").map((c, i) => (
              <span className="ch" key={`u${i}`}><span>{c}</span></span>
            ))}
            <span className="ch gld"><span>L</span></span>
            {"EVEL".split("").map((c, i) => (
              <span className="ch gld" key={`e${i}`}><span>{c}</span></span>
            ))}
          </div>
        </div>
        <div className="loader-bot">
          <div id="loader-info">
            <div id="loader-sub">DIGITAL GROWTH AGENCY</div>
            <div id="loader-bar-wrap">
              <div id="loader-bar" />
            </div>
            <div id="loader-num">{String(pct).padStart(3, "0")} %</div>
          </div>
        </div>
      </div>
    </>
  );
}
