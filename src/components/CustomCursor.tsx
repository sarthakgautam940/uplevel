"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface State {
  x: number; y: number;
  rx: number; ry: number;
  hovering: boolean;
  isCTA: boolean;
  label: string;
  isLink: boolean;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<State>({
    x: -200, y: -200, rx: -200, ry: -200,
    hovering: false, isCTA: false, label: "", isLink: false,
  });
  const rafRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = stateRef.current;
    s.rx = lerp(s.rx, s.x, 0.10);
    s.ry = lerp(s.ry, s.y, 0.10);

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-50%)`;
      dotRef.current.style.opacity = s.hovering ? "0" : "1";
    }
    if (ringRef.current) {
      const scale = s.isCTA ? 1.6 : s.hovering ? 1.4 : 1;
      ringRef.current.style.transform = `translate(${s.rx}px,${s.ry}px) translate(-50%,-50%) scale(${scale})`;
      ringRef.current.style.borderColor = s.isCTA
        ? "rgba(232,160,32,0.7)"
        : s.hovering
        ? "rgba(36,97,232,0.7)"
        : "rgba(36,97,232,0.4)";
      ringRef.current.style.background = s.hovering
        ? "rgba(36,97,232,0.04)"
        : "transparent";
    }
    if (labelRef.current) {
      labelRef.current.style.transform = `translate(${s.rx + 22}px,${s.ry + 22}px)`;
      labelRef.current.style.opacity = s.label ? "1" : "0";
      labelRef.current.textContent = s.label;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) { setIsTouch(true); return; }
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const s = stateRef.current;
      const isCTA = !!(t.closest(".btn-primary") || t.closest("[data-cursor='warm']"));
      const isLink = !!(t.closest("a") || t.closest("button") || t.closest("[role='button']"));
      const labelEl = t.closest("[data-cursor-label]") as HTMLElement | null;

      s.isCTA = isCTA;
      s.hovering = isLink;
      s.isLink = isLink;
      s.label = labelEl?.dataset.cursorLabel ?? "";
    };

    const onLeave = () => {
      const s = stateRef.current;
      s.hovering = false;
      s.isCTA = false;
      s.label = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  if (!mounted || isTouch) return null;

  return (
    <>
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 5, height: 5,
        borderRadius: "50%", background: "var(--electric)",
        zIndex: 99999, pointerEvents: "none",
        transition: "opacity 150ms",
        boxShadow: "0 0 6px rgba(36,97,232,0.8)",
      }} />
      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: 36, height: 36,
        borderRadius: "50%",
        border: "1px solid rgba(36,97,232,0.4)",
        zIndex: 99998, pointerEvents: "none",
        transition: "transform 0ms, border-color 200ms, background 200ms",
      }} />
      {/* Label */}
      <div ref={labelRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99997, pointerEvents: "none",
        fontFamily: "var(--font-mono)",
        fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
        color: "var(--text-secondary)",
        transition: "opacity 150ms",
        whiteSpace: "nowrap",
      }} />
    </>
  );
}
