"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  side: "left" | "right";
};

type Props = {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  active: boolean;
};

const MAX_PARTICLES = 10;
const BASE_SPAWN_CHANCE = 0.006;
const ACTIVE_SPAWN_BONUS = 0.02;
const MAX_LIFE = 0.9;
const MIN_LIFE = 0.5;
const OUTWARD_SPEED = 28;
const DRIFT_SPEED = 4;
const DAMPING = 0.988;

function weightedCenterY(height: number) {
  const spread = 0.14 + Math.random() * 0.12;
  const centered = Math.random() - Math.random();
  return height * (0.5 + centered * spread);
}

export default function AccoladeAuraParticles({ mouseRef, reducedMotion, active }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (width < 8 || height < 8) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const spawn = (w: number, h: number) => {
      const list = particlesRef.current;
      if (list.length >= MAX_PARTICLES) return;

      const side: "left" | "right" = Math.random() < 0.5 ? "left" : "right";
      const dir = side === "left" ? -1 : 1;
      const edgeInset = Math.max(4, Math.min(w, h) * 0.028);
      const x = side === "left" ? edgeInset : w - edgeInset;
      const y = weightedCenterY(h);
      const life = MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE);

      list.push({
        x,
        y,
        vx: dir * (OUTWARD_SPEED + Math.random() * 8),
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        life,
        maxLife: life,
        r: 0.3 + Math.random() * 0.55,
        side,
      });
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const { width, height } = wrap.getBoundingClientRect();
      if (width < 8) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const pulse = 0.5 + 0.25 * Math.sin(t * 0.0022);
      if (Math.random() < BASE_SPAWN_CHANCE + (active ? ACTIVE_SPAWN_BONUS : 0) * pulse) {
        spawn(width, height);
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i -= 1) {
        const p = list[i];
        p.life -= dt;
        if (p.life <= 0) {
          list.splice(i, 1);
          continue;
        }

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < 72) {
          const push = ((72 - dist) / 72) * 120;
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const lifeT = Math.max(0, Math.min(1, p.life / p.maxLife));
        const alpha = lifeT * lifeT * (active ? 0.12 : 0.07);

        ctx.shadowBlur = 10;
        ctx.shadowColor =
          p.side === "left" ? "rgba(77,130,255,0.12)" : "rgba(201,168,76,0.12)";
        ctx.fillStyle = `rgba(237,240,247,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      particlesRef.current = [];
    };
  }, [active, mouseRef, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute -inset-x-10 -inset-y-8 z-[1] overflow-visible"
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
