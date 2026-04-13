"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Dot follows immediately
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

      // Check if over a light section
      const el = document.elementFromPoint(mx, my);
      const isLight = !!el?.closest("[data-cursor-light]");
      const color = isLight ? "#0a0a0a" : "var(--electric, #2461e8)";
      dot.style.background = color;
      ring.style.borderColor = isLight ? "rgba(10,10,10,0.35)" : "rgba(36,97,232,0.35)";
    };

    const tick = () => {
      // Ring lags behind with lerp
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => {
      ring.style.transform = ring.style.transform.replace("scale(1)", "") + " scale(0.82)";
      dot.style.transform = dot.style.transform + " scale(1.5)";
    };

    const onUp = () => {
      // reset handled by next tick
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--electric, #2461e8)",
          pointerEvents: "none",
          zIndex: 999999,
          opacity: 0,
          transition: "background 200ms ease, opacity 200ms ease",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(36,97,232,0.35)",
          pointerEvents: "none",
          zIndex: 999998,
          opacity: 0,
          transition: "border-color 200ms ease, opacity 200ms ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
