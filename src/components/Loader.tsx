"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props { onDone: () => void; }

export default function Loader({ onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Step 1: Stagger letter reveal
  useEffect(() => {
    const chars = document.querySelectorAll<HTMLElement>(".loader-char");
    chars.forEach((ch, i) => {
      setTimeout(() => {
        ch.style.transform = "translateY(0)";
      }, 180 + i * 80);
    });
    const sub = document.getElementById("loader-sub-row");
    setTimeout(() => { if (sub) sub.style.opacity = "1"; }, 180 + chars.length * 80 + 100);
  }, []);

  // Step 2: Canvas construction drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CX = () => canvas.width / 2;
    const CY = () => canvas.height / 2;

    let raf: number;
    const start = performance.now();
    const TOTAL = 2400;
    const fill = document.getElementById("loader-prog-fill");

    const drawPhase = (ctx: CanvasRenderingContext2D, p: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = CX(), cy = CY();

      // Background very faint crosshatch grid
      if (p > 0.05) {
        const gAlpha = Math.min((p - 0.05) / 0.15, 1) * 0.04;
        ctx.strokeStyle = `rgba(200,169,81,${gAlpha})`;
        ctx.lineWidth = 0.5;
        const spacing = 60;
        for (let x = 0; x < canvas.width; x += spacing) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += spacing) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
      }

      // Phase 1 (0–0.25): Outer circle draws in
      if (p > 0.05) {
        const cp = Math.min((p - 0.05) / 0.2, 1);
        const ease = 1 - Math.pow(1 - cp, 3);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(canvas.width, canvas.height) * 0.32, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ease);
        ctx.strokeStyle = `rgba(200,169,81,${0.18 * ease})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Phase 2 (0.15–0.4): Inner dashed circle
      if (p > 0.15) {
        const cp = Math.min((p - 0.15) / 0.25, 1);
        const ease = 1 - Math.pow(1 - cp, 3);
        const r2 = Math.min(canvas.width, canvas.height) * 0.19;
        ctx.save();
        ctx.setLineDash([4, 10]);
        ctx.beginPath();
        ctx.arc(cx, cy, r2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ease);
        ctx.strokeStyle = `rgba(200,169,81,${0.12 * ease})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // Phase 3 (0.25–0.55): 6 radiating lines from center
      if (p > 0.25) {
        const lp = Math.min((p - 0.25) / 0.3, 1);
        const angles = [0, 60, 120, 180, 240, 300].map(a => a * Math.PI / 180);
        const maxR = Math.min(canvas.width, canvas.height) * 0.42;
        angles.forEach((a, i) => {
          const ip = Math.min(Math.max((lp - i * 0.12) / 0.18, 0), 1);
          if (ip <= 0) return;
          const ease = 1 - Math.pow(1 - ip, 2);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * maxR * ease, cy + Math.sin(a) * maxR * ease);
          ctx.strokeStyle = `rgba(248,244,238,${0.05 * ease})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      }

      // Phase 4 (0.4–0.65): Compass tick marks (N/E/S/W)
      if (p > 0.4) {
        const tp = Math.min((p - 0.4) / 0.25, 1);
        const R = Math.min(canvas.width, canvas.height) * 0.32;
        const tickAngles = [0, 90, 180, 270];
        tickAngles.forEach((a, i) => {
          const ip = Math.min(Math.max((tp - i * 0.15) / 0.2, 0), 1);
          if (ip <= 0) return;
          const rad = (a - 90) * Math.PI / 180;
          const x1 = cx + Math.cos(rad) * R;
          const y1 = cy + Math.sin(rad) * R;
          const x2 = cx + Math.cos(rad) * (R + 14 * ip);
          const y2 = cy + Math.sin(rad) * (R + 14 * ip);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(200,169,81,${0.5 * ip})`;
          ctx.lineWidth = 1; ctx.stroke();
        });
      }

      // Phase 5 (0.55–0.8): Diamond/cross overlay
      if (p > 0.55) {
        const dp = Math.min((p - 0.55) / 0.25, 1);
        const ease = 1 - Math.pow(1 - dp, 2);
        const size = Math.min(canvas.width, canvas.height) * 0.08;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 4);
        // Horizontal and vertical lines through center crosshair
        ctx.strokeStyle = `rgba(200,169,81,${0.25 * ease})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(-size * ease, 0); ctx.lineTo(size * ease, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -size * ease); ctx.lineTo(0, size * ease); ctx.stroke();
        ctx.restore();
      }

      // Phase 6 (0.7–1.0): Center dot materializes with glow
      if (p > 0.7) {
        const gp = Math.min((p - 0.7) / 0.3, 1);
        const ease = 1 - Math.pow(1 - gp, 3);
        // Glow halo
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 * ease);
        gradient.addColorStop(0, `rgba(200,169,81,${0.3 * ease})`);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(cx, cy, 40 * ease, 0, Math.PI * 2);
        ctx.fillStyle = gradient; ctx.fill();
        // Solid center dot
        ctx.beginPath(); ctx.arc(cx, cy, 3 * ease, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,81,${ease})`; ctx.fill();
      }
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / TOTAL, 1);
      const p = 1 - Math.pow(1 - raw, 2.5); // easeOutQuint

      drawPhase(ctx, p);
      setPct(Math.round(p * 100));
      if (fill) fill.style.width = (p * 100) + "%";

      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Hold briefly then do the ZOOM PUNCH exit
        setTimeout(() => exitAnimation(), 280);
      }
    };
    raf = requestAnimationFrame(tick);

    const exitAnimation = () => {
      // Quadrant panels slam to corners simultaneously
      const panels = [
        { el: document.querySelector<HTMLElement>(".lp-tl"), tx: "-100%", ty: "-100%" },
        { el: document.querySelector<HTMLElement>(".lp-tr"), tx: "100%",  ty: "-100%" },
        { el: document.querySelector<HTMLElement>(".lp-bl"), tx: "-100%", ty: "100%"  },
        { el: document.querySelector<HTMLElement>(".lp-br"), tx: "100%",  ty: "100%"  },
      ];

      panels.forEach(({ el, tx, ty }) => {
        if (!el) return;
        el.style.transition = "transform 0.9s cubic-bezier(0.87,0,0.13,1)";
        el.style.transform = `translate(${tx},${ty})`;
      });

      // Also fade canvas out
      canvas.style.transition = "opacity 0.4s ease 0.2s";
      canvas.style.opacity = "0";

      // Also scale wordmark to fade
      const wm = document.getElementById("loader-wordmark");
      if (wm) {
        wm.style.transition = "transform 0.7s cubic-bezier(0.87,0,0.13,1), opacity 0.4s ease";
        wm.style.transform = "scale(1.04)";
        wm.style.opacity = "0";
      }

      setTimeout(() => {
        setGone(true);
        onDoneRef.current();
      }, 960);
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      {/* Quadrant exit panels */}
      <div className="lp lp-tl" />
      <div className="lp lp-tr" />
      <div className="lp lp-bl" />
      <div className="lp lp-br" />

      {/* Main loader */}
      <div id="loader">
        <canvas ref={canvasRef} id="loader-canvas" />

        {/* Wordmark */}
        <div id="loader-wordmark">
          <div className="loader-word-row">
            {"UP".split("").map((c, i) => (
              <span key={`u${i}`} className="loader-char">{c}</span>
            ))}
            {"LEVEL".split("").map((c, i) => (
              <span key={`l${i}`} className="loader-char gold">{c}</span>
            ))}
          </div>

          <div id="loader-sub-row">
            <span>DIGITAL GROWTH AGENCY</span>
            <div id="loader-line" />
            <span id="loader-pct">{String(pct).padStart(3, "0")} %</span>
          </div>
        </div>

        <div id="loader-prog">
          <div id="loader-prog-fill" />
        </div>
      </div>
    </>
  );
}
