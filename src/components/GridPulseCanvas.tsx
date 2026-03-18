"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseAlpha: number;
  alpha: number;
  wave: number; // 0–1, ripple phase
}

export default function GridPulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const dotsRef = useRef<Dot[]>([]);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPACING = 40;
    const DOT_RADIUS = 1.0;
    const RIPPLE_RADIUS = 160;
    const RIPPLE_SPEED = 0.025;
    const BASE_ALPHA = 0.10;
    const PEAK_ALPHA = 0.60;

    function build() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;

      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      const dots: Dot[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * SPACING,
            y: r * SPACING,
            baseAlpha: BASE_ALPHA,
            alpha: BASE_ALPHA,
            wave: 0,
          });
        }
      }
      dotsRef.current = dots;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y + scrollRef.current;

      for (const dot of dotsRef.current) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Activate ripple wave when cursor is near
        if (dist < RIPPLE_RADIUS && dot.wave === 0) {
          const proximity = 1 - dist / RIPPLE_RADIUS;
          if (Math.random() < proximity * 0.06) {
            dot.wave = 0.001;
          }
        }

        // Advance wave
        if (dot.wave > 0) {
          dot.wave += RIPPLE_SPEED;
          // Gaussian bell on wave phase — peaks at 0.35, fades out by 1.0
          const t = dot.wave;
          const bell = Math.exp(-Math.pow((t - 0.35) * 4, 2));
          dot.alpha = dot.baseAlpha + (PEAK_ALPHA - dot.baseAlpha) * bell;
          if (dot.wave >= 1) {
            dot.wave = 0;
            dot.alpha = dot.baseAlpha;
          }
        } else {
          // Passive fade by distance — subtle brightness near cursor
          const nearFactor = Math.max(0, 1 - dist / (RIPPLE_RADIUS * 1.5));
          dot.alpha = dot.baseAlpha + nearFactor * 0.08;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(36, 97, 232, ${dot.alpha})`;
        ctx.fill();
      }
    }

    function loop() {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onResize = () => { build(); };

    build();
    loop();

    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
