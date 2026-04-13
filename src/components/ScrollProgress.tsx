"use client";

import { useEffect, useState, useCallback } from "react";
import { useLenis } from "./LenisProvider";

export default function ScrollProgress() {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(60);

  const updateFromLenis = useCallback(() => {
    if (lenis) {
      const scrollTop = lenis.scroll;
      const limit = lenis.limit;
      const percent = limit > 0 ? scrollTop / limit : 0;
      setScrollPercent(percent);
      const ratio = window.innerHeight / (limit + window.innerHeight);
      setThumbHeight(Math.max(40, Math.min(200, ratio * window.innerHeight)));
      return;
    }
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? scrollTop / docHeight : 0;
    setScrollPercent(percent);
    const ratio =
      window.innerHeight / document.documentElement.scrollHeight;
    setThumbHeight(Math.max(40, Math.min(200, ratio * window.innerHeight)));
  }, [lenis]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    updateFromLenis();
    if (lenis) {
      lenis.on("scroll", updateFromLenis);
    } else {
      window.addEventListener("scroll", updateFromLenis, { passive: true });
    }
    window.addEventListener("resize", updateFromLenis, { passive: true });
    return () => {
      if (lenis) lenis.off("scroll", updateFromLenis);
      else window.removeEventListener("scroll", updateFromLenis);
      window.removeEventListener("resize", updateFromLenis);
    };
  }, [lenis, isMobile, updateFromLenis]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPercent = (e.clientY - rect.top) / rect.height;
    if (lenis) {
      lenis.scrollTo(clickPercent * lenis.limit, { lerp: 0.12 });
      return;
    }
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: clickPercent * maxScroll, behavior: "smooth" });
  };

  if (!mounted || isMobile) return null;
  const thumbTop = scrollPercent * (window.innerHeight - thumbHeight);

  return (
    <div
      onClick={handleTrackClick}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "6px",
        height: "100vh",
        zIndex: 9999,
        cursor: "pointer",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          background: "rgba(237,240,247,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
          background: "rgba(237,240,247,0.45)",
          borderRadius: "0 0 3px 3px",
          transition: "top 50ms linear",
        }}
      />
    </div>
  );
}
