"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current; const ringEl = ringRef.current;
    if (!dot || !ringEl) return;
    if (window.matchMedia("(pointer:coarse)").matches) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      ringEl.style.left = ring.current.x + "px";
      ringEl.style.top = ring.current.y + "px";
      if (labelRef.current) {
        labelRef.current.style.left = ring.current.x + "px";
        labelRef.current.style.top = ring.current.y + "px";
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const onEnter = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      document.body.classList.add("c-hover");
      if (labelRef.current) labelRef.current.textContent = t.dataset.cursor || "";
    };
    const onLeave = () => {
      document.body.classList.remove("c-hover");
      if (labelRef.current) labelRef.current.textContent = "";
    };
    const onDown = () => document.body.classList.add("c-active");
    const onUp = () => document.body.classList.remove("c-active");

    const watch = () => {
      document.querySelectorAll("[data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", onEnter as EventListener);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    watch();
    const obs = new MutationObserver(watch);
    obs.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />
      <div id="cur-label" ref={labelRef} />
    </>
  );
}
