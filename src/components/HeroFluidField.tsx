"use client";

/**
 * HeroFluidField — Huly-style vertical energy rift: razor core → electric cyan → violet/magenta bloom,
 * narrow at top / wide at bottom, pulled toward the signal card, cursor-reactive, additive bloom.
 */

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

const STRIP_HEIGHT = 2;
const GLOW_BASE = 520;
const VIS = 2.15;
const ANIMATION_SPEED = 0.72;
const UNDULATION = 110;
const UNDULATION_FINE = 48;
const FLOW_SWIRL = 52;
const LERP_SPRING = 0.09;
const ANCHOR_ATTRACTION = 0.78;
const CURSOR_BEND_X = 0.22;
const CURSOR_BEND_Y = 0.09;
const DRIP_COUNT = 18;
const MOBILE_INTENSITY = 0.82;

/* Huly-adjacent palette — outer → inner */
const MAGENTA = { r: 168, g: 72, b: 255 };
const VIOLET = { r: 110, g: 62, b: 220 };
const CYAN = { r: 0, g: 210, b: 255 };
const ELECTRIC = { r: 80, g: 170, b: 255 };
const CORE = { r: 255, g: 255, b: 255 };
const POOL = { r: 120, g: 60, b: 255 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Narrow cone at top (Huly), wide flare toward bottom */
function funnelScale(cy: number, h: number) {
  const t = Math.max(0, Math.min(1, cy / h));
  return 0.035 + 0.965 * Math.pow(t, 1.14);
}

export type HeroFluidFieldProps = {
  sectionRef: RefObject<HTMLElement | null>;
  desktopAnchorRef: RefObject<HTMLElement | null>;
  mobileAnchorRef: RefObject<HTMLElement | null>;
  className?: string;
};

function resolveAnchor(
  sectionRect: DOMRect,
  desktopRef: RefObject<HTMLElement | null>,
  mobileRef: RefObject<HTMLElement | null>,
): { x: number; y: number } {
  const w = sectionRect.width;
  const h = sectionRect.height;
  const preferDesktop =
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

  const anchorFromEl = (el: HTMLElement | null) => {
    if (!el) return null;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return null;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return {
      x: r.left + r.width * 0.5 - sectionRect.left,
      y: r.top + r.height * 0.42 - sectionRect.top,
    };
  };

  if (preferDesktop) {
    const d = anchorFromEl(desktopRef.current);
    if (d) return d;
  }
  const m = anchorFromEl(mobileRef.current);
  if (m) return m;
  const d2 = anchorFromEl(desktopRef.current);
  if (d2) return d2;

  return { x: w * 0.72, y: h * 0.48 };
}

export default function HeroFluidField({
  sectionRef,
  desktopAnchorRef,
  mobileAnchorRef,
  className = "",
}: HeroFluidFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const pullRef = useRef({ x: 0, y: 0 });
  const pullTargetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const reducedRef = useRef(false);
  const dripPhaseRef = useRef(0);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    } as CanvasRenderingContext2DSettings);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    setPrefersReduced(mq.matches);

    let cancelled = false;
    let bootRaf = 0;
    let frameRaf = 0;
    let ro: ResizeObserver | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let wrapWithListeners: HTMLDivElement | null = null;
    let ctxGetRetries = 0;
    let listenersAttached = false;

    const onMove = (e: MouseEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const onWinResize = () => resize();

    const frame = () => {
      if (cancelled) return;
      if (reducedRef.current) {
        return;
      }
      const wrap = wrapRef.current;
      const section = sectionRef.current;
      if (!wrap || !section || !ctx) {
        frameRaf = requestAnimationFrame(frame);
        return;
      }
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) {
        frameRaf = requestAnimationFrame(frame);
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const anchor = resolveAnchor(sectionRect, desktopAnchorRef, mobileAnchorRef);
      const anchorX = anchor.x;
      const anchorY = anchor.y;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const pointerActive = mx > -900;

      const t = timeRef.current;
      if (!reducedRef.current) {
        timeRef.current += 0.016 * ANIMATION_SPEED;
        dripPhaseRef.current += 0.028 * ANIMATION_SPEED;
      }

      const breathe = 0.5 + 0.5 * Math.sin(t * 0.38);
      const attractMix = ANCHOR_ATTRACTION * (0.62 + 0.38 * breathe);

      if (pointerActive) {
        pullTargetRef.current.x = (mx - w * 0.5) * CURSOR_BEND_X;
        pullTargetRef.current.y = (my - h * 0.5) * CURSOR_BEND_Y;
      } else {
        pullTargetRef.current.x = lerp(0, anchorX - w * 0.5, 0.06) * 0.4;
        pullTargetRef.current.y = 0;
      }

      pullRef.current.x = lerp(pullRef.current.x, pullTargetRef.current.x, LERP_SPRING);
      pullRef.current.y = lerp(pullRef.current.y, pullTargetRef.current.y, LERP_SPRING);

      const pullX = pullRef.current.x;
      const pullY = pullRef.current.y;

      const mobile = w < 1024;
      const intensity = mobile ? MOBILE_INTENSITY : 1;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const anchorPull = Math.min(1.2, Math.hypot(anchorX - w * 0.5, anchorY - h * 0.5) / (w * 0.28));

      const beamCenterX = (cy: number) => {
        const ny = cy / h;
        const yy = cy * 0.007 + pullY * 0.018;
        const tt = reducedRef.current ? 0 : t;
        /* Top: centered rift (Huly); bottom: bends toward signal */
        const flowDown = Math.pow(Math.max(0.02, ny), 1.05);
        const baseX = lerp(w * 0.5, anchorX, flowDown * attractMix) + pullX * (0.65 + 0.35 * ny);
        const towardSignal =
          (anchorX - baseX) * 0.022 * Math.sin(cy * 0.0028 + tt * 0.55);
        const flow =
          noise3D(0.28, yy * 0.9, tt * 0.42) * UNDULATION +
          noise3D(1.08, yy * 2.1, tt * 0.58) * UNDULATION_FINE +
          noise3D(1.88, yy * 0.35 + tt * 0.2, tt * 0.36) * FLOW_SWIRL;
        return baseX + flow + towardSignal * anchorPull;
      };

      const { r: mr, g: mg, b: mb } = MAGENTA;
      const { r: vr, g: vg, b: vb } = VIOLET;
      const { r: cr, g: cg, b: cb } = CYAN;
      const { r: er, g: eg, b: eb } = ELECTRIC;
      const { r: wr, g: wg, b: wb } = CORE;
      const { r: pr, g: pg, b: pb } = POOL;

      for (let y = 0; y < h; y += STRIP_HEIGHT) {
        const cy = y + STRIP_HEIGHT * 0.5;
        const cx = beamCenterX(cy);
        const fn = funnelScale(cy, h);
        const halfWide = GLOW_BASE * fn * 1.95;
        const halfBloom = GLOW_BASE * fn * 1.38;
        const halfMid = GLOW_BASE * fn * 0.95;
        const halfCore = GLOW_BASE * fn * 0.38;

        const d = Math.hypot(mx - cx, my - cy);
        const flare = 1 + 0.58 * intensity * (1 - smoothstep(0, 380, d));

        const pulse = 0.86 + 0.14 * Math.sin(t * 2.2 + cy * 0.012);
        const bottomMix = Math.max(0, Math.min(1, (cy / h - 0.55) / 0.45));

        /* Pass 1 — wide magenta / violet atmosphere (no “dark hole” in center) */
        const aMag = 0.14 * flare * intensity * pulse * VIS;
        const g0 = ctx.createLinearGradient(cx - halfWide * 1.25, 0, cx + halfWide * 1.25, 0);
        g0.addColorStop(0, "rgba(0,0,0,0)");
        g0.addColorStop(0.35, `rgba(${mr},${mg},${mb},${aMag * 0.45})`);
        g0.addColorStop(0.48, `rgba(${vr},${vg},${vb},${aMag * 0.85})`);
        g0.addColorStop(0.5, `rgba(${vr},${vg},${vb},${aMag * 0.95})`);
        g0.addColorStop(0.52, `rgba(${vr},${vg},${vb},${aMag * 0.85})`);
        g0.addColorStop(0.65, `rgba(${mr},${mg},${mb},${aMag * 0.45})`);
        g0.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g0;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 2 — electric cyan / blue body */
        const aCyan = 0.42 * flare * intensity * pulse * VIS;
        const g1 = ctx.createLinearGradient(cx - halfBloom, 0, cx + halfBloom, 0);
        g1.addColorStop(0, "rgba(0,0,0,0)");
        g1.addColorStop(0.38, `rgba(${cr},${cg},${cb},${aCyan * 0.35})`);
        g1.addColorStop(0.46, `rgba(${er},${eg},${eb},${aCyan * 0.88})`);
        g1.addColorStop(0.5, `rgba(${cr},${cg},${cb},${aCyan * 0.95})`);
        g1.addColorStop(0.54, `rgba(${er},${eg},${eb},${aCyan * 0.88})`);
        g1.addColorStop(0.62, `rgba(${cr},${cg},${cb},${aCyan * 0.35})`);
        g1.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 3 — inner electric ring */
        const aMid = 0.52 * flare * intensity * pulse * VIS;
        const g2 = ctx.createLinearGradient(cx - halfMid, 0, cx + halfMid, 0);
        g2.addColorStop(0, "rgba(0,0,0,0)");
        g2.addColorStop(0.42, `rgba(${er},${eg},${eb},${aMid * 0.5})`);
        g2.addColorStop(0.48, `rgba(${wr},${wg},${wb},${aMid * 0.42})`);
        g2.addColorStop(0.5, `rgba(${cr},${cg},${cb},${aMid * 0.95})`);
        g2.addColorStop(0.52, `rgba(${wr},${wg},${wb},${aMid * 0.42})`);
        g2.addColorStop(0.58, `rgba(${er},${eg},${eb},${aMid * 0.5})`);
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 4 — white-hot core (sharp, Huly) */
        const aCore = Math.min(1, 0.72 * flare * intensity * pulse * VIS);
        const aWhite = Math.min(1, 0.95 * flare * intensity * pulse * VIS);
        const coreEdge = Math.max(0.04, 0.16 / (halfCore * 0.008));
        const g3 = ctx.createLinearGradient(cx - halfCore, 0, cx + halfCore, 0);
        g3.addColorStop(0, "rgba(0,0,0,0)");
        g3.addColorStop(0.5 - coreEdge * 0.75, `rgba(${cr},${cg},${cb},${aCore * 0.65})`);
        g3.addColorStop(0.5 - coreEdge * 0.2, `rgba(${wr},${wg},${wb},${aWhite * 0.92})`);
        g3.addColorStop(0.5, `rgba(${wr},${wg},${wb},${aWhite})`);
        g3.addColorStop(0.5 + coreEdge * 0.2, `rgba(${wr},${wg},${wb},${aWhite * 0.92})`);
        g3.addColorStop(0.5 + coreEdge * 0.75, `rgba(${cr},${cg},${cb},${aCore * 0.65})`);
        g3.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g3;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Bottom third: subtle purple pool in the beam (Huly bottom glow) */
        if (bottomMix > 0.08) {
          const aw = 0.1 * flare * intensity * bottomMix * pulse * VIS;
          const g4 = ctx.createLinearGradient(cx - halfWide * 1.1, 0, cx + halfWide * 1.1, 0);
          g4.addColorStop(0, "rgba(0,0,0,0)");
          g4.addColorStop(0.4, `rgba(${pr},${pg},${pb},${aw * 0.5})`);
          g4.addColorStop(0.5, `rgba(${mr},${mg},${mb},${aw * 0.85})`);
          g4.addColorStop(0.6, `rgba(${pr},${pg},${pb},${aw * 0.5})`);
          g4.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g4;
          ctx.fillRect(0, y, w, STRIP_HEIGHT);
        }
      }

      /* Liquid drips — cyan / violet streaks down the outer edges */
      const dp = dripPhaseRef.current;
      for (let i = 0; i < DRIP_COUNT; i++) {
        const cy = ((i / DRIP_COUNT + dp * 0.14) % 1) * h;
        const cx2 = beamCenterX(cy);
        const fn2 = funnelScale(cy, h);
        const halfWide2 = GLOW_BASE * fn2 * 1.95;
        const side = i % 2 === 0 ? -1 : 1;
        const wobble = noise3D(i * 0.65, cy * 0.018, t * 0.28) * 28;
        const dx = cx2 + side * halfWide2 * (1.05 + (i % 6) * 0.035) + wobble;
        const stripH = 22 + (i % 5) * 8;
        const gy0 = cy - stripH * 0.5;
        const grad = ctx.createLinearGradient(dx, gy0, dx, gy0 + stripH);
        const da = 0.065 * intensity * (0.6 + 0.4 * Math.sin(t * 2.4 + i + cy * 0.008));
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.32, `rgba(${cr},${cg},${cb},${da * 0.55})`);
        grad.addColorStop(0.52, `rgba(${vr},${vg},${vb},${da})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(dx - 2.5, gy0, 5, stripH);
      }

      /* Pool / catch at signal card — soft radial bloom (energy “landing”) */
      const poolY = Math.min(h * 0.92, anchorY + h * 0.06);
      const poolRx = Math.min(w * 0.36, Math.max(140, w * 0.22));
      const poolRy = Math.min(h * 0.22, 160);
      const pg0 = ctx.createRadialGradient(anchorX, poolY, 0, anchorX, poolY, poolRx);
      const pa = 0.22 * intensity * VIS * (0.85 + 0.15 * Math.sin(t * 1.8));
      pg0.addColorStop(0, `rgba(${wr},${wg},${wb},${pa * 0.35})`);
      pg0.addColorStop(0.15, `rgba(${cr},${cg},${cb},${pa * 0.55})`);
      pg0.addColorStop(0.45, `rgba(${vr},${vg},${vb},${pa * 0.4})`);
      pg0.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = pg0;
      ctx.beginPath();
      ctx.ellipse(anchorX, poolY, poolRx, poolRy, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      frameRaf = requestAnimationFrame(frame);
    };

    const tryBoot = () => {
      if (cancelled || mq.matches) return;
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) {
        bootRaf = requestAnimationFrame(tryBoot);
        return;
      }
      if (wrap.clientWidth < 2 || wrap.clientHeight < 2) {
        bootRaf = requestAnimationFrame(tryBoot);
        return;
      }

      if (ctx && listenersAttached) {
        resize();
        cancelAnimationFrame(frameRaf);
        frameRaf = requestAnimationFrame(frame);
        return;
      }

      const nextCtx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
      } as CanvasRenderingContext2DSettings);
      if (!nextCtx) {
        ctxGetRetries += 1;
        if (ctxGetRetries < 40) {
          bootRaf = requestAnimationFrame(tryBoot);
        }
        return;
      }
      ctx = nextCtx;

      if (!listenersAttached) {
        window.addEventListener("resize", onWinResize, { passive: true });
        window.addEventListener("mousemove", onMove, { passive: true });
        wrap.addEventListener("mouseleave", onLeave);
        wrapWithListeners = wrap;
        ro = new ResizeObserver(() => resize());
        ro.observe(wrap);
        listenersAttached = true;
      }
      resize();

      frameRaf = requestAnimationFrame(frame);
    };

    const scheduleBoot = () => {
      if (cancelled || mq.matches) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled && !mq.matches) tryBoot();
        });
      });
    };

    const onChange = () => {
      reducedRef.current = mq.matches;
      setPrefersReduced(mq.matches);
      cancelAnimationFrame(frameRaf);
      if (!mq.matches) {
        scheduleBoot();
      }
    };
    mq.addEventListener("change", onChange);

    scheduleBoot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(bootRaf);
      cancelAnimationFrame(frameRaf);
      ro?.disconnect();
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onWinResize);
      window.removeEventListener("mousemove", onMove);
      wrapWithListeners?.removeEventListener("mouseleave", onLeave);
    };
  }, [resize, sectionRef, desktopAnchorRef, mobileAnchorRef]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 z-[4] min-h-[100dvh] w-full overflow-hidden [transform:translateZ(0)] ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 72% 58%, rgba(90, 40, 160, 0.07) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 200, 255, 0.05) 0%, transparent 45%),
            radial-gradient(ellipse 100% 45% at 50% 100%, rgba(100, 50, 200, 0.06) 0%, transparent 50%)
          `,
          opacity: prefersReduced ? 0.9 : 0.42,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] block h-full w-full"
        aria-hidden="true"
        style={{ visibility: prefersReduced ? "hidden" : "visible", opacity: 1 }}
      />
    </div>
  );
}
