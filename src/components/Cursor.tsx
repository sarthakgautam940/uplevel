"use client";
import { useEffect, useRef } from "react";
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const rp = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  useEffect(() => {
    const d = dot.current, r = ring.current, l = label.current;
    if (!d || !r) return;
    if (window.matchMedia("(pointer:coarse)").matches) return;
    const mv = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px";
    };
    const loop = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.1;
      rp.current.y += (pos.current.y - rp.current.y) * 0.1;
      r.style.left = rp.current.x + "px"; r.style.top = rp.current.y + "px";
      if (l) { l.style.left = rp.current.x + "px"; l.style.top = rp.current.y + "px"; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    const enter = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      document.body.classList.add("c-hov");
      if (l) l.textContent = t.dataset.cursor || "";
    };
    const leave = () => { document.body.classList.remove("c-hov"); if (l) l.textContent = ""; };
    const dn = () => document.body.classList.add("c-press");
    const up = () => document.body.classList.remove("c-press");
    const attach = () => {
      document.querySelectorAll("[data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", enter as EventListener);
        el.addEventListener("mouseleave", leave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("mousemove", mv, { passive: true });
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      obs.disconnect();
    };
  }, []);
  return (<><div id="cur-dot" ref={dot}/><div id="cur-ring" ref={ring}/><div id="cur-label" ref={label}/></>);
}
