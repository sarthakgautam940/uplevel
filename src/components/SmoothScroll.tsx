"use client";
import { useEffect } from "react";
export default function SmoothScroll() {
  useEffect(() => {
    const sp = document.getElementById("sp");
    let lenis: any;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (time: number) => {
        lenis.raf(time);
        if (sp) {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          sp.style.height = total > 0 ? (window.scrollY / total * 100) + "%" : "0%";
        }
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    });
    return () => lenis?.destroy();
  }, []);
  return null;
}
