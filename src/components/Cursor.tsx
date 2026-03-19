"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring_pos = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!dot.current || !ring.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.current!.style.left = e.clientX + "px";
      dot.current!.style.top = e.clientY + "px";
    };

    const loop = () => {
      ring_pos.current.x += (pos.current.x - ring_pos.current.x) * 0.1;
      ring_pos.current.y += (pos.current.y - ring_pos.current.y) * 0.1;
      ring.current!.style.left = ring_pos.current.x + "px";
      ring.current!.style.top = ring_pos.current.y + "px";
      if (label.current) {
        label.current.style.left = ring_pos.current.x + "px";
        label.current.style.top = ring_pos.current.y + "px";
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const onEnter = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      document.body.classList.add("c-hov");
      if (label.current) label.current.textContent = t.dataset.cursor || "";
    };
    const onLeave = () => {
      document.body.classList.remove("c-hov");
      if (label.current) label.current.textContent = "";
    };
    const onDown = () => document.body.classList.add("c-press");
    const onUp = () => document.body.classList.remove("c-press");

    const attach = () => {
      document.querySelectorAll("[data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", onEnter as EventListener);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="c-dot" ref={dot} />
      <div id="c-ring" ref={ring} />
      <div id="c-label" ref={label} />
    </>
  );
}
