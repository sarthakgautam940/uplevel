"use client";

import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let seed = 0;
    const interval = setInterval(() => {
      seed = (seed + 1) % 999;
      if (turbRef.current) {
        turbRef.current.setAttribute("seed", String(seed));
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <filter id="film-grain">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="3"
            stitchTiles="stitch"
            seed="0"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" opacity="0.035" />
      </svg>
    </div>
  );
}
