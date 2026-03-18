"use client";

import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let seed = 0;
    const interval = setInterval(() => {
      seed = (seed + 1) % 999;
      if (turbRef.current) turbRef.current.setAttribute("seed", String(seed));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="noise-layer" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}>
        <filter id="noise-grain">
          <feTurbulence ref={turbRef} type="fractalNoise"
            baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" seed="0" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-grain)" opacity="0.028" />
      </svg>
    </div>
  );
}
