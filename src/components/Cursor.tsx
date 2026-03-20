"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lbl  = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x: -200, y: -200 });
  const rPos = useRef({ x: -200, y: -200 });
  const raf  = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches) return;
    const d = dot.current, r = ring.current, l = lbl.current;
    if (!d || !r) return;

    const mv = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      d.style.left = e.clientX + "px";
      d.style.top  = e.clientY + "px";
    };

    const loop = () => {
      rPos.current.x += (pos.current.x - rPos.current.x) * 0.09;
      rPos.current.y += (pos.current.y - rPos.current.y) * 0.09;
      r.style.left = rPos.current.x + "px";
      r.style.top  = rPos.current.y + "px";
      if (l) { l.style.left = rPos.current.x + "px"; l.style.top = rPos.current.y + "px"; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const attach = () => {
      document.querySelectorAll<HTMLElement>("[data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", () => { document.body.classList.add("c-hover"); if (l) l.textContent = el.dataset.cursor || ""; });
        el.addEventListener("mouseleave", () => { document.body.classList.remove("c-hover"); if (l) l.textContent = ""; });
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    const dn = () => document.body.classList.add("c-press");
    const up = () => document.body.classList.remove("c-press");
    window.addEventListener("mousemove", mv, { passive: true });
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup",   up);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup",   up);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur-dot"   ref={dot}  />
      <div id="cur-ring"  ref={ring} />
      <div id="cur-label" ref={lbl}  />
    </>
  );
}
