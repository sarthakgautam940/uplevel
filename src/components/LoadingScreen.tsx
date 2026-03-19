"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelTLRef = useRef<HTMLDivElement>(null);
  const panelTRRef = useRef<HTMLDivElement>(null);
  const panelBLRef = useRef<HTMLDivElement>(null);
  const panelBRRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;
    const canv = canvas;

    let animFrame: number;
    let startTime: number;
    const DURATION = 2800; // ms total for loading
    let currentProgress = 0;
    let phase = 0; // 0=drawing, 1=developing, 2=holding, 3=exiting

    // Canvas sizing
    const resize = () => {
      canv.width = window.innerWidth;
      canv.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = () => canv.width / 2;
    const cy = () => canv.height / 2;

    // Colors
    const ACCENT = "#C9A87C";
    const GRID_COLOR = "rgba(201,168,124,0.04)";
    const LINE_COLOR = "rgba(255,235,200,0.12)";
    const TEXT_COLOR = "rgba(245,240,232,0.9)";
    const DIM_TEXT = "rgba(107,99,90,0.8)";

    // Drawing helpers
    function drawLine(
      x1: number, y1: number, x2: number, y2: number,
      color: string, width: number, progress: number
    ) {
      if (progress <= 0) return;
      const px = x1 + (x2 - x1) * Math.min(progress, 1);
      const py = y1 + (y2 - y1) * Math.min(progress, 1);
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(px, py);
      c.strokeStyle = color;
      c.lineWidth = width;
      c.stroke();
    }

    function drawCircleArc(
      x: number, y: number, r: number,
      startAngle: number, endAngle: number,
      color: string, width: number, progress: number
    ) {
      if (progress <= 0) return;
      const totalArc = endAngle - startAngle;
      const drawArc = totalArc * Math.min(progress, 1);
      c.beginPath();
      c.arc(x, y, r, startAngle, startAngle + drawArc);
      c.strokeStyle = color;
      c.lineWidth = width;
      c.stroke();
    }

    function drawGrid(alpha: number) {
      if (alpha <= 0) return;
      c.save();
      c.globalAlpha = alpha;
      const spacing = 60;
      c.strokeStyle = GRID_COLOR;
      c.lineWidth = 0.5;
      // Vertical lines
      for (let x = 0; x <= canv.width; x += spacing) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, canv.height);
        c.stroke();
      }
      // Horizontal lines
      for (let y = 0; y <= canv.height; y += spacing) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(canv.width, y);
        c.stroke();
      }
      c.restore();
    }

    function drawLogo(x: number, y: number, alpha: number) {
      if (alpha <= 0) return;
      c.save();
      c.globalAlpha = alpha;

      // Logo mark — stylized angular form (from the uploaded image)
      const size = 28;
      c.strokeStyle = ACCENT;
      c.lineWidth = 1.5;
      c.fillStyle = "transparent";

      // Draw the geometric logo shape
      c.beginPath();
      // Outer shape
      c.moveTo(x - size * 0.5, y - size * 0.8);
      c.lineTo(x + size * 0.3, y - size * 0.8);
      c.lineTo(x + size * 0.7, y - size * 0.3);
      c.lineTo(x + size * 0.7, y + size * 0.8);
      c.lineTo(x - size * 0.5, y + size * 0.8);
      c.closePath();
      c.stroke();

      // Inner notch
      c.beginPath();
      c.moveTo(x - size * 0.1, y);
      c.lineTo(x + size * 0.4, y);
      c.lineTo(x + size * 0.4, y + size * 0.3);
      c.stroke();

      c.restore();
    }

    function drawWordmark(
      letters: string[], x: number, y: number,
      revealProgress: number, alpha: number
    ) {
      if (alpha <= 0) return;
      c.save();

      const fullWord = "UPLEVEL";
      const letterCount = Math.min(
        Math.ceil(revealProgress * fullWord.length),
        fullWord.length
      );

      // Display font setup
      c.font = "bold 42px 'Playfair Display', serif";
      c.textBaseline = "middle";
      c.letterSpacing = "8px";

      // Measure total width for centering
      const totalWidth = c.measureText("UPLEVEL").width;
      let startX = x - totalWidth / 2;

      for (let i = 0; i < letterCount; i++) {
        const char = fullWord[i];
        const charWidth = c.measureText(char).width;
        const letterAlpha = Math.min((revealProgress * fullWord.length - i), 1);

        c.save();
        c.globalAlpha = alpha * letterAlpha;

        if (i === 0) {
          // U in italic/lighter
          c.font = "600 italic 42px 'Playfair Display', serif";
          c.fillStyle = ACCENT;
        } else if (char === "L" && i === 2) {
          // LEVEL accent
          c.fillStyle = ACCENT;
          c.font = "bold 42px 'Playfair Display', serif";
        } else {
          c.fillStyle = TEXT_COLOR;
          c.font = "bold 42px 'Playfair Display', serif";
        }

        // Clip reveal — letter slides up from below
        const clipY = y - 30 + (1 - letterAlpha) * 50;
        c.save();
        c.rect(startX - 2, y - 35, charWidth + 12, 70);
        c.clip();
        c.fillText(char, startX, clipY);
        c.restore();

        startX += charWidth + 8;
        c.restore();
      }

      // SERVICES subtext
      if (revealProgress > 0.7) {
        const serviceAlpha = (revealProgress - 0.7) / 0.3;
        c.save();
        c.globalAlpha = alpha * serviceAlpha * 0.5;
        c.font = "400 10px 'DM Mono', monospace";
        c.fillStyle = DIM_TEXT;
        c.letterSpacing = "5px";
        c.textAlign = "center";
        c.fillText("SERVICES", x, y + 36);
        c.restore();
      }

      c.restore();
    }

    function drawTickMarks(
      cx: number, cy: number, radius: number, alpha: number
    ) {
      if (alpha <= 0) return;
      c.save();
      c.globalAlpha = alpha;
      c.strokeStyle = "rgba(201,168,124,0.5)";
      c.lineWidth = 1;

      const ticks = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      ticks.forEach((angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const r1 = radius + 4;
        const r2 = radius + 14;
        c.beginPath();
        c.moveTo(cx + cos * r1, cy + sin * r1);
        c.lineTo(cx + cos * r2, cy + sin * r2);
        c.stroke();
      });
      c.restore();
    }

    function render(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      currentProgress = Math.min(elapsed / DURATION, 1);

      c.clearRect(0, 0, canv.width, canv.height);

      const cxPos = cx();
      const cyPos = cy();

      // Background
      c.fillStyle = "#0C0B0B";
      c.fillRect(0, 0, canv.width, canv.height);

      // Warm gradient overlay in phase 2+
      if (currentProgress > 0.4) {
        const warmAlpha = Math.min((currentProgress - 0.4) / 0.3, 1) * 0.15;
        const gradient = c.createRadialGradient(
          cxPos, cyPos, 0, cxPos, cyPos, Math.max(canv.width, canv.height) * 0.6
        );
        gradient.addColorStop(0, `rgba(20,16,12,${warmAlpha})`);
        gradient.addColorStop(1, "transparent");
        c.fillStyle = gradient;
        c.fillRect(0, 0, canv.width, canv.height);
      }

      // Phase 1: 0–40% — Drawing construction lines
      const p1 = Math.min(currentProgress / 0.4, 1);

      // Grid (fades in slowly)
      drawGrid(Math.min(p1 * 0.8, 0.8));

      // Horizontal rule
      const hrWidth = canv.width * 0.6;
      const hrX = cxPos - hrWidth / 2;
      drawLine(hrX, cyPos, hrX + hrWidth, cyPos, LINE_COLOR, 0.5, p1);

      // Logo mark
      if (p1 > 0.2) {
        const logoAlpha = Math.min((p1 - 0.2) / 0.3, 1) * 0.6;
        drawLogo(cxPos - 140, cyPos + 2, logoAlpha);
      }

      // Wordmark
      if (p1 > 0.3) {
        const wordProgress = (p1 - 0.3) / 0.7;
        drawWordmark([], cxPos + 20, cyPos, wordProgress, 1);
      }

      // Circle arc
      const circleRadius = Math.min(canv.width, canv.height) * 0.2;
      if (p1 > 0.5) {
        const arcProgress = (p1 - 0.5) / 0.5;
        drawCircleArc(
          cxPos, cyPos, circleRadius,
          -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI,
          "rgba(201,168,124,0.15)", 0.5, arcProgress
        );
      }

      // Tick marks
      if (p1 > 0.7) {
        drawTickMarks(cxPos, cyPos, circleRadius, (p1 - 0.7) / 0.3);
      }

      // Progress bar fill (bottom center)
      const barAlpha = p1;
      if (barAlpha > 0 && progressBarRef.current) {
        progressBarRef.current.style.width = `${currentProgress * 100}%`;
      }

      // Counter
      if (counterRef.current) {
        const count = Math.floor(currentProgress * 100);
        counterRef.current.textContent = String(count).padStart(3, "0");
      }

      setProgress(currentProgress * 100);

      // Phase 3: hold at 100% for 300ms then trigger exit
      if (currentProgress >= 1) {
        if (phase < 3) {
          phase = 3;
          setTimeout(() => triggerExit(), 300);
        }
        return;
      }

      animFrame = requestAnimationFrame(render);
    }

    function triggerExit() {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // Circle contracts to center point
      tl.to(canvas, {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: "expo.in",
      });

      // Quadrant panels slide to corners
      tl.to(
        [panelTLRef.current, panelTRRef.current, panelBLRef.current, panelBRRef.current],
        { opacity: 1, duration: 0 }, "<"
      );

      tl.fromTo(
        panelTLRef.current,
        { x: "0%", y: "0%" },
        { x: "-100%", y: "-100%", duration: 0.7, ease: "expo.inOut" },
        "<0.1"
      );
      tl.fromTo(
        panelTRRef.current,
        { x: "0%", y: "0%" },
        { x: "100%", y: "-100%", duration: 0.7, ease: "expo.inOut" },
        "<"
      );
      tl.fromTo(
        panelBLRef.current,
        { x: "0%", y: "0%" },
        { x: "-100%", y: "100%", duration: 0.7, ease: "expo.inOut" },
        "<"
      );
      tl.fromTo(
        panelBRRef.current,
        { x: "0%", y: "0%" },
        { x: "100%", y: "100%", duration: 0.7, ease: "expo.inOut" },
        "<"
      );
    }

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="loading-screen"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />

      {/* Quadrant exit panels */}
      <div
        ref={panelTLRef}
        className="loading-panel loading-panel-tl"
        style={{ opacity: 0 }}
      />
      <div
        ref={panelTRRef}
        className="loading-panel loading-panel-tr"
        style={{ opacity: 0 }}
      />
      <div
        ref={panelBLRef}
        className="loading-panel loading-panel-bl"
        style={{ opacity: 0 }}
      />
      <div
        ref={panelBRRef}
        className="loading-panel loading-panel-br"
        style={{ opacity: 0 }}
      />

      {/* Progress bar — bottom center */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "1px",
          background: "rgba(255,235,200,0.08)",
          borderRadius: "1px",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "0%",
            background: "var(--accent)",
            borderRadius: "1px",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* Counter — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "rgba(107,99,90,0.6)",
        }}
      >
        <span ref={counterRef}>000</span>
      </div>

      {/* Location label — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(107,99,90,0.4)",
        }}
      >
        Richmond, VA · Est. 2024
      </div>
    </div>
  );
}
