"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props { onDone: () => void; }

export default function LoadingScreen({ onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"build"|"hold"|"exit"|"gone">("build");
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Draw the geometric construction on canvas (Alche-style)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = 480;
    const H = canvas.height = 480;
    const CX = W / 2, CY = H / 2;

    let progress = 0; // 0 → 1 over ~2000ms
    let raf: number;
    const start = performance.now();
    const DURATION = 2200;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const drawArc = (r: number, startA: number, endA: number, alpha: number, dashed = false) => {
      ctx.beginPath();
      ctx.arc(CX, CY, r, startA, endA);
      ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
      ctx.lineWidth = 0.6;
      if (dashed) ctx.setLineDash([4, 8]);
      else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const drawPartialLine = (x1: number, y1: number, x2: number, y2: number, t: number, alpha: number) => {
      const px = lerp(x1, x2, t);
      const py = lerp(y1, y2, t);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(px, py);
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      progress = Math.min(elapsed / DURATION, 1);
      const p = easeOut(progress);

      // Update pct state
      setPct(Math.round(p * 100));

      ctx.clearRect(0, 0, W, H);

      // Phase 1 (0-0.2): Grid lines appear
      if (p > 0) {
        const gp = Math.min(p / 0.2, 1);
        const alpha = gp * 0.07;
        const spacing = 40;
        for (let x = 0; x <= W; x += spacing) drawLine(x, 0, x, H, alpha);
        for (let y = 0; y <= H; y += spacing) drawLine(0, y, W, y, alpha);
      }

      // Phase 2 (0.1-0.4): Outer circle draws
      if (p > 0.1) {
        const cp = Math.min((p - 0.1) / 0.3, 1);
        drawArc(180, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cp, 0.25 * cp);
      }

      // Phase 3 (0.2-0.5): Inner circle
      if (p > 0.2) {
        const cp = Math.min((p - 0.2) / 0.3, 1);
        drawArc(110, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cp, 0.18 * cp, true);
      }

      // Phase 4 (0.3-0.6): Cross-hair lines
      if (p > 0.3) {
        const lp = Math.min((p - 0.3) / 0.3, 1);
        drawPartialLine(CX, CY - 220, CX, CY + 220, lp, 0.1 * lp);
        drawPartialLine(CX - 220, CY, CX + 220, CY, lp, 0.1 * lp);
      }

      // Phase 5 (0.4-0.7): Triangle vertices appear
      if (p > 0.4) {
        const tp = Math.min((p - 0.4) / 0.3, 1);
        const r = 140;
        const pts = [
          [CX + r * Math.cos(-Math.PI / 2), CY + r * Math.sin(-Math.PI / 2)],
          [CX + r * Math.cos(-Math.PI / 2 + (2 * Math.PI) / 3), CY + r * Math.sin(-Math.PI / 2 + (2 * Math.PI) / 3)],
          [CX + r * Math.cos(-Math.PI / 2 + (4 * Math.PI) / 3), CY + r * Math.sin(-Math.PI / 2 + (4 * Math.PI) / 3)],
        ];
        // Draw triangle sides progressively
        const totalSides = 3;
        for (let s = 0; s < totalSides; s++) {
          const sideStart = s / totalSides;
          const sideEnd = (s + 1) / totalSides;
          if (tp > sideStart) {
            const sideProg = Math.min((tp - sideStart) / (1 / totalSides), 1);
            const p0 = pts[s];
            const p1 = pts[(s + 1) % 3];
            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            ctx.lineTo(lerp(p0[0], p1[0], sideProg), lerp(p0[1], p1[1], sideProg));
            ctx.strokeStyle = `rgba(0,229,255,${0.5 * tp})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        // Dot at each vertex
        pts.forEach((pt, i) => {
          const dotAlpha = Math.min((tp - i * 0.15) / 0.2, 1);
          if (dotAlpha > 0) {
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,229,255,${dotAlpha * 0.9})`;
            ctx.fill();
          }
        });
      }

      // Phase 6 (0.6-0.8): Diagonal lines (like Alche's construction lines)
      if (p > 0.6) {
        const dp = Math.min((p - 0.6) / 0.2, 1);
        const r = 180;
        const angles = [30, 90, 150, 210, 270, 330].map(a => a * Math.PI / 180);
        angles.forEach((a, i) => {
          if (dp > i / angles.length) {
            const ap = Math.min((dp - i / angles.length) / (1 / angles.length), 1);
            drawPartialLine(
              CX, CY,
              CX + r * Math.cos(a), CY + r * Math.sin(a),
              ap, 0.06 * dp
            );
          }
        });
      }

      // Phase 7 (0.75-1): Multiple concentric rings
      if (p > 0.75) {
        const rp = Math.min((p - 0.75) / 0.25, 1);
        [50, 80].forEach((r, i) => {
          drawArc(r, 0, Math.PI * 2 * rp, 0.1 * rp, i === 1);
        });
      }

      // Center dot (appears at 0.5)
      if (p > 0.5) {
        const dp = Math.min((p - 0.5) / 0.2, 1);
        ctx.beginPath();
        ctx.arc(CX, CY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${dp})`;
        ctx.fill();
      }

      // Bright "UPLEVEL" text appears at 0.8 as scramble
      if (p >= 1) {
        setPhase("hold");
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // After hold, do the curtain exit
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => {
      setPhase("exit");
      const top = topRef.current;
      const bot = botRef.current;
      if (top && bot) {
        top.style.transition = "transform 0.85s cubic-bezier(0.76,0,0.24,1)";
        bot.style.transition = "transform 0.85s cubic-bezier(0.76,0,0.24,1)";
        top.style.transform = "translateY(-100%)";
        bot.style.transform = "translateY(100%)";
        setTimeout(() => { setPhase("gone"); onDoneRef.current(); }, 900);
      } else {
        setPhase("gone");
        onDoneRef.current();
      }
    }, 320);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: phase === "exit" ? "none" : "all" }}>
      {/* Top curtain */}
      <div ref={topRef} style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "#000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
      }}>
        <div style={{ paddingBottom: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {/* Canvas geometric construction */}
          <canvas ref={canvasRef}
            style={{ width: 240, height: 240, display: "block" }}
            width={480} height={480}
          />
        </div>
      </div>

      {/* Center line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%", height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.3) 30%, rgba(0,229,255,0.3) 70%, transparent 100%)",
        transform: "translateY(-50%)",
      }} />

      {/* Bottom curtain */}
      <div ref={botRef} style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: "#000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      }}>
        <div style={{ paddingTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {/* Brand name */}
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1,
            fontSize: "clamp(40px,7vw,80px)", letterSpacing: "-0.02em", color: "#fff",
            opacity: pct > 20 ? 1 : 0, transition: "opacity 0.4s ease",
          }}>
            UP<span style={{ color: "#00E5FF" }}>LEVEL</span>
          </div>
          {/* Subline */}
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 9,
            letterSpacing: "0.3em", color: "#222",
            opacity: pct > 40 ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
          }}>
            SERVICES — DIGITAL GROWTH AGENCY
          </div>
          {/* Progress */}
          <div style={{ width: 180, height: 1, background: "rgba(255,255,255,0.06)", position: "relative", marginTop: 8 }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: `${pct}%`, background: "#00E5FF", transition: "width 0.04s linear",
            }} />
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10,
            letterSpacing: "0.2em", color: "#333",
          }}>
            {String(pct).padStart(3, "0")} %
          </div>
        </div>
      </div>
    </div>
  );
}
