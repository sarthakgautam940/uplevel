"use client";

/**
 * FluidLightRift — Huly-style vertical energy rift (canvas-only).
 * White core → electric blue → violet bloom; funnel widens toward bottom; simplex flow.
 */

import { useCallback, useLayoutEffect, useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

const BEAM_ANCHOR_X = 0.54;
/** Base half-width scale; multiplied by vertical funnel */
const GLOW_BASE = 460;
/** Boost — layer order used to crush the beam; values tuned for visibility on void */
const VIS = 1.48;
const ANIMATION_SPEED = 0.52;
const UNDULATION = 92;
const UNDULATION_FINE = 38;
const FLOW_SWIRL = 44;
const BEND_STRENGTH = 0.12;
const BEND_Y_STRENGTH = 0.055;
const LERP_SPRING = 0.048;
const FLARE_PROXIMITY = 0.35;
const PROXIMITY_RADIUS = 300;
const STRIP_HEIGHT = 4;
const MOBILE_INTENSITY = 0.92;

/* Palette — cool energy (not gold) */
const VIOLET = { r: 118, g: 62, b: 242 };
const ELECTRIC = { r: 64, g: 188, b: 255 };
const CORE = { r: 255, g: 255, b: 255 };
/** Bottom “impact” warm rim (subtle) */
const WARM = { r: 255, g: 140, b: 72 };

const noise3D = createNoise3D();

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** 0 = top of hero (narrow beam), 1 = bottom (wide flare) */
function funnelScale(cy: number, h: number) {
  const t = Math.max(0, Math.min(1, cy / h));
  return 0.11 + 0.89 * Math.pow(t, 1.28);
}

export type FluidLightRiftProps = {
  className?: string;
};

export default function FluidLightRift({ className = "" }: FluidLightRiftProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const pullRef = useRef({ x: 0, y: 0 });
  const pullTargetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const reducedRef = useRef(false);

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

  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;
    let bootRaf = 0;
    let frameRaf = 0;
    let ro: ResizeObserver | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let wrapWithListeners: HTMLDivElement | null = null;
    let ctxGetRetries = 0;

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
      const wrap = wrapRef.current;
      if (!wrap || !ctx) {
        frameRaf = requestAnimationFrame(frame);
        rafRef.current = frameRaf;
        return;
      }
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) {
        frameRaf = requestAnimationFrame(frame);
        rafRef.current = frameRaf;
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const baseX = w * BEAM_ANCHOR_X;
      const pointerActive = mx > -900;

      if (pointerActive) {
        pullTargetRef.current.x = (mx - baseX) * BEND_STRENGTH;
        pullTargetRef.current.y = (my - h * 0.5) * BEND_Y_STRENGTH;
      } else {
        pullTargetRef.current.x = 0;
        pullTargetRef.current.y = 0;
      }

      pullRef.current.x = lerp(
        pullRef.current.x,
        pullTargetRef.current.x,
        LERP_SPRING,
      );
      pullRef.current.y = lerp(
        pullRef.current.y,
        pullTargetRef.current.y,
        LERP_SPRING,
      );

      const pullX = pullRef.current.x;
      const pullY = pullRef.current.y;

      const mobile = w < 1024;
      const intensity = mobile ? MOBILE_INTENSITY : 1;

      const t = timeRef.current;
      if (!reducedRef.current) {
        timeRef.current += 0.016 * ANIMATION_SPEED;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const beamCenterX = (cy: number) => {
        const yy = cy * 0.008 + pullY * 0.015;
        const tt = reducedRef.current ? 0 : t;
        const flow =
          noise3D(0.35, yy * 0.9, tt * 0.42) * UNDULATION +
          noise3D(1.15, yy * 2.05, tt * 0.62) * UNDULATION_FINE +
          noise3D(2.0, yy * 0.4 + tt * 0.2, tt * 0.35) * FLOW_SWIRL;
        return baseX + flow + pullX;
      };

      const { r: vr, g: vg, b: vb } = VIOLET;
      const { r: er, g: eg, b: eb } = ELECTRIC;
      const { r: wr, g: wg, b: wb } = CORE;
      const { r: tr, g: tg, b: tb } = WARM;

      for (let y = 0; y < h; y += STRIP_HEIGHT) {
        const cy = y + STRIP_HEIGHT * 0.5;
        const cx = beamCenterX(cy);
        const fn = funnelScale(cy, h);
        const halfWide = GLOW_BASE * fn * 1.75;
        const halfMid = GLOW_BASE * fn * 1.05;
        const halfCore = GLOW_BASE * fn * 0.55;

        const bx = cx;
        const by = cy;
        const d = Math.hypot(mx - bx, my - by);
        const flare =
          1 +
          FLARE_PROXIMITY * intensity * (1 - smoothstep(0, PROXIMITY_RADIUS, d));

        const pulse = 0.88 + 0.12 * Math.sin(t * 2.1 + cy * 0.014);
        const bottomMix = Math.max(0, Math.min(1, (cy / h - 0.62) / 0.38));
        const rimR = lerp(vr, tr, bottomMix * 0.22);
        const rimG = lerp(vg, tg, bottomMix * 0.18);
        const rimB = lerp(vb, tb, bottomMix * 0.12);

        const aV = 0.1 * flare * intensity * pulse * VIS;
        const aMid = 0.38 * flare * intensity * pulse * VIS;
        const aCore = Math.min(0.98, 0.62 * flare * intensity * pulse * VIS);
        const aWhite = Math.min(0.92, 0.72 * flare * intensity * pulse * VIS);

        /* Pass 1 — wide violet / cool rim */
        const g1 = ctx.createLinearGradient(cx - halfWide, 0, cx + halfWide, 0);
        g1.addColorStop(0, "rgba(0,0,0,0)");
        g1.addColorStop(0.38, `rgba(${rimR},${rimG},${rimB},${aV * 0.85})`);
        g1.addColorStop(0.48, `rgba(${vr},${vg},${vb},${aV * 1.1})`);
        g1.addColorStop(0.5, `rgba(${er},${eg},${eb},${aMid * 0.35})`);
        g1.addColorStop(0.52, `rgba(${vr},${vg},${vb},${aV * 1.1})`);
        g1.addColorStop(0.62, `rgba(${rimR},${rimG},${rimB},${aV * 0.85})`);
        g1.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 2 — electric blue body */
        const g2 = ctx.createLinearGradient(cx - halfMid, 0, cx + halfMid, 0);
        g2.addColorStop(0, "rgba(0,0,0,0)");
        g2.addColorStop(0.4, `rgba(${er},${eg},${eb},${aMid * 0.45})`);
        g2.addColorStop(0.47, `rgba(${er},${eg},${eb},${aMid * 0.95})`);
        g2.addColorStop(0.5, `rgba(${wr},${wg},${wb},${aCore * 0.55})`);
        g2.addColorStop(0.53, `rgba(${er},${eg},${eb},${aMid * 0.95})`);
        g2.addColorStop(0.6, `rgba(${er},${eg},${eb},${aMid * 0.45})`);
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 3 — sharp white-hot core */
        const coreEdge = Math.max(0.06, 0.22 / (halfCore * 0.01));
        const g3 = ctx.createLinearGradient(cx - halfCore, 0, cx + halfCore, 0);
        g3.addColorStop(0, "rgba(0,0,0,0)");
        g3.addColorStop(0.5 - coreEdge * 0.6, `rgba(${er},${eg},${eb},${aCore * 0.55})`);
        g3.addColorStop(0.5 - coreEdge * 0.15, `rgba(${wr},${wg},${wb},${aWhite * 0.9})`);
        g3.addColorStop(0.5, `rgba(${wr},${wg},${wb},${aWhite})`);
        g3.addColorStop(0.5 + coreEdge * 0.15, `rgba(${wr},${wg},${wb},${aWhite * 0.9})`);
        g3.addColorStop(0.5 + coreEdge * 0.6, `rgba(${er},${eg},${eb},${aCore * 0.55})`);
        g3.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g3;
        ctx.fillRect(0, y, w, STRIP_HEIGHT);

        /* Pass 4 — bottom splash: horizontal warm bias (very low alpha) */
        if (bottomMix > 0.06) {
          const g4 = ctx.createLinearGradient(cx - halfWide * 1.15, 0, cx + halfWide * 1.15, 0);
          const aw = 0.08 * flare * intensity * bottomMix * pulse * VIS;
          g4.addColorStop(0, "rgba(0,0,0,0)");
          g4.addColorStop(0.42, `rgba(${tr},${tg},${tb},${aw * 0.5})`);
          g4.addColorStop(0.5, `rgba(${tr},${tg},${tb},${aw})`);
          g4.addColorStop(0.58, `rgba(${tr},${tg},${tb},${aw * 0.5})`);
          g4.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g4;
          ctx.fillRect(0, y, w, STRIP_HEIGHT);
        }
      }

      ctx.globalCompositeOperation = "source-over";
      frameRaf = requestAnimationFrame(frame);
      rafRef.current = frameRaf;
    };

    const tryBoot = () => {
      if (cancelled) return;
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

      ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
      } as CanvasRenderingContext2DSettings);
      if (!ctx) {
        ctxGetRetries += 1;
        if (ctxGetRetries < 40) {
          bootRaf = requestAnimationFrame(tryBoot);
        }
        return;
      }

      window.addEventListener("resize", onWinResize, { passive: true });

      window.addEventListener("mousemove", onMove, { passive: true });
      wrap.addEventListener("mouseleave", onLeave);
      wrapWithListeners = wrap;
      ro = new ResizeObserver(() => resize());
      ro.observe(wrap);
      resize();

      frameRaf = requestAnimationFrame(frame);
      rafRef.current = frameRaf;
    };

    tryBoot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(bootRaf);
      cancelAnimationFrame(frameRaf);
      ro?.disconnect();
      window.removeEventListener("resize", onWinResize);
      window.removeEventListener("mousemove", onMove);
      wrapWithListeners?.removeEventListener("mouseleave", onLeave);
    };
  }, [resize]);

  return (
    <div
      ref={wrapRef}
      className={`hero-rift-root pointer-events-none absolute inset-0 z-[4] min-h-[100dvh] w-full overflow-hidden [transform:translateZ(0)] ${className}`}
      aria-hidden="true"
    >
      {/* CSS backbone: visible even when canvas/WebGL fails (screen blend on void) */}
      <div className="hero-rift-css-backbone absolute left-1/2 top-0 z-0 h-full min-h-[100dvh] w-[min(94vw,980px)] -translate-x-1/2" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] block h-full w-full opacity-[0.85]"
      />
    </div>
  );
}
