"use client";

import { useCallback, useRef, type CSSProperties } from "react";

/**
 * Subtle grid behind the work lead copy; cursor creates a soft "divot" (faded hole)
 * and a slight perspective tilt — no extra global CSS.
 */
export default function WorkStandardsGrid() {
  const regionRef = useRef<HTMLElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = regionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    el.style.setProperty("--wg-x", `${x}%`);
    el.style.setProperty("--wg-y", `${y}%`);
    el.style.setProperty("--wg-tx", `${((x / 100) - 0.5) * -1.4}deg`);
    el.style.setProperty("--wg-ty", `${((y / 100) - 0.5) * 1.1}deg`);
  }, []);

  const onLeave = useCallback(() => {
    const el = regionRef.current;
    if (!el) return;
    el.style.setProperty("--wg-x", "50%");
    el.style.setProperty("--wg-y", "42%");
    el.style.setProperty("--wg-tx", "0deg");
    el.style.setProperty("--wg-ty", "0deg");
  }, []);

  return (
    <section
      ref={regionRef}
      className="relative overflow-hidden bg-[var(--void)] pb-20 pt-40 md:pb-28 md:pt-52"
      aria-labelledby="work-heading"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        {
          "--wg-x": "50%",
          "--wg-y": "42%",
          "--wg-tx": "0deg",
          "--wg-ty": "0deg",
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 origin-center will-change-transform motion-reduce:transform-none"
        style={{
          transform: "perspective(900px) rotateX(var(--wg-ty)) rotateY(var(--wg-tx))",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-[-12%] opacity-[0.55] motion-reduce:opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(237,240,247,0.034) 1px, transparent 1px),
              linear-gradient(90deg, rgba(237,240,247,0.034) 1px, transparent 1px)
            `,
            backgroundSize: "52px 52px",
            maskImage:
              "radial-gradient(ellipse 28% 24% at var(--wg-x) var(--wg-y), transparent 0%, rgba(0,0,0,0.15) 42%, black 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 28% 24% at var(--wg-x) var(--wg-y), transparent 0%, rgba(0,0,0,0.15) 42%, black 78%)",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[color-mix(in_srgb,var(--void)_40%,#0a1428)] via-transparent to-[var(--void)] opacity-80"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
        <h1
          id="work-heading"
          className="mx-auto font-display font-medium leading-[0.92] tracking-[-0.038em] text-[var(--text)]"
          style={{ fontSize: "clamp(2.75rem,7.5vw,6rem)", maxWidth: "18ch" }}
        >
          Where standards
          <br />
          <span className="text-[var(--text-dim)]">are proven.</span>
        </h1>
        <p className="relative z-[1] mx-auto mt-10 max-w-[50ch] font-body text-[16px] leading-[1.72] text-[var(--text-dim)]">
          Verified competition results and real client outcomes. No stock photos, no mockups, no invented firm names.
        </p>
      </div>
    </section>
  );
}
