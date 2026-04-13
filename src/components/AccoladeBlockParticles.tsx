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
};

type Props = {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  active: boolean;
};

const BASE_SPAWN = 0.018;
const ACTIVE_SPAWN = 0.03;
const MAX_PARTICLES = 34;
const MOVE_SCALE = 0.78;
const DAMP = 0.992;
const REPULSE = 420;
const UPWARD_DRIFT = 5.2;
const ALPHA = 0.18;

export default function AccoladeBlockParticles({ mouseRef, reducedMotion, active }: Props) {
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
      const pad = Math.max(10, Math.min(w, h) * 0.04);
      const x = pad + Math.random() * Math.max(10, w - 2 * pad);
      const y = pad + Math.random() * Math.max(10, h - 2 * pad);
      const life = 0.55 + Math.random() * 0.85;
      list.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life,
        maxLife: life,
        r: 0.35 + Math.random() * 0.8,
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
      if (Math.random() < BASE_SPAWN + (active ? ACTIVE_SPAWN : 0)) spawn(width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const repelR = 78;
      const repelR2 = repelR * repelR;

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
        const d2 = dx * dx + dy * dy;
        if (d2 > 4 && d2 < repelR2) {
          const dist = Math.sqrt(d2);
          const push = ((repelR - dist) / repelR) * REPULSE;
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt;
        }

        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx * dt * MOVE_SCALE;
        p.y += p.vy * dt * MOVE_SCALE;
        p.vy -= UPWARD_DRIFT * dt;

        const lifeT = Math.max(0, Math.min(1, p.life / p.maxLife));
        const opacity = lifeT * (active ? ALPHA * 1.2 : ALPHA);

        ctx.fillStyle = `rgba(240,242,248,${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

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
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-[inherit]"
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
