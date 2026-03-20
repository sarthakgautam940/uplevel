"use client";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any;
    const init = async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.22,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      const bar = document.getElementById("scroll-progress");
      lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
        if (bar && limit > 0) bar.style.height = (scroll / limit * 100) + "%";
      });
    };
    init();
    return () => lenis?.destroy();
  }, []);
  return null;
}
