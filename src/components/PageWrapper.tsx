"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Thin client wrapper for inner-page content.
 * Plays a subtle entrance animation on mount — coordinates with
 * the page transition overlay lifting off the new page.
 *
 * Initial hide uses CSS class `.page-wrapper-enter` (same SSR + client markup).
 * GSAP runs after mount in `useEffect`; on complete we remove that class so
 * `clearProps` does not leave the element stuck on the hidden CSS rules.
 */
export default function PageWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.classList.remove("page-wrapper-enter");
      gsap.set(el, { opacity: 1, y: 0, clearProps: "opacity,transform" });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.remove("page-wrapper-enter");
      return;
    }

    try {
      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          ease: "power3.out",
          delay: 0.16,
          clearProps: "opacity,transform",
          onComplete: () => {
            el.classList.remove("page-wrapper-enter");
          },
        },
      );
    } catch {
      reveal();
    }

    fallbackTimerRef.current = setTimeout(() => {
      if (!el.isConnected) return;
      const o = window.getComputedStyle(el).opacity;
      if (o === "0" || o === "") reveal();
      ScrollTrigger.refresh();
    }, 1800);

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  return (
    <div ref={ref} className="page-wrapper-enter">
      {children}
    </div>
  );
}
