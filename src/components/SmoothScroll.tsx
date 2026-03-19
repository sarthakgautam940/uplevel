"use client";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Scroll progress bar
    const prog = document.getElementById("scroll-prog");

    const onScroll = () => {
      if (!prog) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      prog.style.height = pct + "%";
    };

    // Lenis smooth scroll
    let lenis: any;
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis.raf(time);
        onScroll();
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    });

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <div id="scroll-prog" aria-hidden="true" />;
}
