"use client";

import { useEffect, useState, useCallback } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const update = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    setPct(maxScroll > 0 ? window.scrollY / maxScroll : 0);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isMobile, update]);

  if (isMobile) return null;

  return (
    <div style={{
      position: "fixed", right: 0, top: 0, width: 3, height: "100vh",
      zIndex: 9998, pointerEvents: "none",
    }}>
      {/* Track */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(36,97,232,0.06)",
      }} />
      {/* Fill */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: `${pct * 100}%`,
        background: "linear-gradient(180deg, var(--electric) 0%, var(--glow) 100%)",
        transition: "height 60ms linear",
        boxShadow: "0 0 8px rgba(36,97,232,0.5)",
      }} />
    </div>
  );
}
