"use client";

import { useEffect, RefObject } from "react";

export function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  strength = 0.35
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = Math.max(rect.width, rect.height) * 1.2;

      if (dist < threshold) {
        const factor = (1 - dist / threshold) * strength;
        el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
        el.style.transition = "transform 120ms linear";
      }
    };

    const onMouseLeave = () => {
      el.style.transform = "translate(0px, 0px)";
      el.style.transition = "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    };

    const parent = el.parentElement ?? document.body;
    parent.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [ref, strength]);
}
