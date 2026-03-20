"use client";
import { useEffect, useRef, useState } from "react";

// ── Easing library ──────────────────────────────────────────────────
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutExpo  = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeOutBack  = (t: number) => { const c = 1.70158 + 1; return 1 + c * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2); };
const clamp        = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
// progress(elapsed, startMs, durationMs) → 0..1 clamped
const p = (el: number, s: number, d: number) => clamp((el - s) / d);

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);
  const wordRef   = useRef<HTMLDivElement>(null);
  const doneRef   = useRef(false);
  const cbRef     = useRef(onComplete);
  cbRef.current   = onComplete;

  const [pct,       setPct]       = useState(0);
  const [chars,     setChars]     = useState({ u:false, pl:false, ev:false, el:false });
  const [accentLine,setAccentLine]= useState(false);
  const [services,  setServices]  = useState(false);
  const [readouts,  setReadouts]  = useState(["","",""]);
  const [gone,      setGone]      = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const t0        = performance.now();
    let exiting     = false;
    let exitT       = 0;
    let exitKilled  = false;

    const draw = (now: number) => {
      if (exitKilled) return;
      const el = now - t0;
      const W  = canvas.width, H = canvas.height;
      const cx = W * 0.5, cy = H * 0.5;
      const RO = Math.min(W, H) * 0.38;  // outer circle radius
      const RI = RO * 0.48;              // inner circle radius

      // Exit: contract geometry to center
      let eScale = 1, eAlpha = 1;
      if (exiting) {
        const ep = clamp((now - exitT) / 680);
        eScale   = 1 - easeOutExpo(ep);
        eAlpha   = 1 - ep;
        if (ep >= 1) { exitKilled = true; return; }
      }

      ctx.clearRect(0, 0, W, H);

      if (eScale < 1) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(eScale, eScale);
        ctx.translate(-cx, -cy);
      }

      // ── 1. GRID ────────────────────────────────────────────────
      const gA = p(el, 0, 600) * 0.035 * eAlpha;
      if (gA > 0.0005) {
        ctx.strokeStyle = `rgba(255,255,255,${gA})`;
        ctx.lineWidth = 0.5; ctx.setLineDash([]);
        const sp = W < 768 ? 44 : 64;
        ctx.beginPath();
        for (let x = 0; x <= W; x += sp) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        for (let y = 0; y <= H; y += sp) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
      }

      // ── 2. OUTER CIRCLE — CW from 12 o'clock ──────────────────
      const oP = p(el, 200, 900);
      if (oP > 0) {
        const oE  = easeOutCubic(oP);
        const end = -Math.PI / 2 + Math.PI * 2 * oE;
        const oa  = Math.min(oP * 5, 1) * 0.07 * eAlpha;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, RO, -Math.PI / 2, end);
        ctx.strokeStyle = `rgba(255,255,255,${oa})`; ctx.lineWidth = 0.8; ctx.stroke();
        // Ghost nib — pen-tip effect at drawing point
        if (oP > 0.02 && oP < 0.99) {
          ctx.beginPath(); ctx.arc(cx, cy, RO, end - Math.PI / 9, end);
          ctx.strokeStyle = `rgba(255,255,255,${0.22 * eAlpha})`; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }

      // ── 3. INNER DASHED CIRCLE — CCW from 3 o'clock ───────────
      const iP = p(el, 400, 800);
      if (iP > 0) {
        const iE = easeOutCubic(iP);
        const ia = Math.min(iP * 5, 1) * 0.14 * eAlpha;
        ctx.save(); ctx.setLineDash([6, 14]);
        ctx.beginPath();
        ctx.arc(cx, cy, RI, Math.PI / 2, Math.PI / 2 - Math.PI * 2 * iE, true);
        ctx.strokeStyle = `rgba(47,126,255,${ia})`; ctx.lineWidth = 0.7; ctx.stroke();
        ctx.restore();
      }

      // ── 4. COMPASS LINES — E/W/N/S snap ───────────────────────
      ctx.setLineDash([]);
      const compass = [
        { t: 850,  a: 0            }, // East
        { t: 920,  a: Math.PI      }, // West
        { t: 990,  a: -Math.PI / 2 }, // North
        { t: 1060, a:  Math.PI / 2 }, // South
      ];
      const cLen = RI * 0.55;
      compass.forEach(({ t, a }) => {
        const cp = p(el, t, 30);
        if (cp <= 0) return;
        const len = cLen * cp;
        const ex  = cx + Math.cos(a) * len;
        const ey  = cy + Math.sin(a) * len;
        // Line from center
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(47,126,255,${0.55 * eAlpha})`; ctx.lineWidth = 0.65; ctx.stroke();
        // Perpendicular tick at endpoint
        const px = -Math.sin(a) * 5, py = Math.cos(a) * 5;
        ctx.beginPath(); ctx.moveTo(ex + px, ey + py); ctx.lineTo(ex - px, ey - py);
        ctx.strokeStyle = `rgba(47,126,255,${0.55 * eAlpha})`; ctx.lineWidth = 1.0; ctx.stroke();
      });

      // ── 5. ARC TICK MARKS — 8 cross marks at 45° intervals ────
      for (let i = 0; i < 8; i++) {
        const tp = p(el, 1000 + i * 70, 80);
        if (tp <= 0) continue;
        const te  = easeOutBack(Math.min(tp, 1));
        const ang = (i * 45 - 90) * Math.PI / 180;
        const tx  = cx + RI * Math.cos(ang);
        const ty  = cy + RI * Math.sin(ang);
        const sz  = 4.5 * te;
        ctx.strokeStyle = `rgba(47,126,255,${0.5 * eAlpha})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(tx - sz, ty); ctx.lineTo(tx + sz, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx, ty - sz); ctx.lineTo(tx, ty + sz); ctx.stroke();
      }

      // ── 6. FULL-VIEWPORT CROSSHAIR ─────────────────────────────
      const hxP = p(el, 1150, 380);
      if (hxP > 0) {
        const hE = easeOutCubic(hxP);
        const ha = Math.min(hxP * 4, 1) * 0.06 * eAlpha;
        ctx.beginPath(); ctx.moveTo(cx - cx * hE, cy); ctx.lineTo(cx + (W - cx) * hE, cy);
        ctx.strokeStyle = `rgba(255,255,255,${ha})`; ctx.lineWidth = 0.4; ctx.setLineDash([]); ctx.stroke();
      }
      const vxP = p(el, 1250, 380);
      if (vxP > 0) {
        const vE = easeOutCubic(vxP);
        const va = Math.min(vxP * 4, 1) * 0.06 * eAlpha;
        ctx.beginPath(); ctx.moveTo(cx, cy - cy * vE); ctx.lineTo(cx, cy + (H - cy) * vE);
        ctx.strokeStyle = `rgba(255,255,255,${va})`; ctx.lineWidth = 0.4; ctx.stroke();
      }

      // ── 7. CENTER LOCK — diamond + outer square ────────────────
      const clP = p(el, 1350, 250);
      if (clP > 0) {
        const clE = easeOutBack(Math.min(clP, 1));
        const dsz = 8 * clE, sqsz = 13 * clE;
        ctx.setLineDash([]);
        // Outer square
        ctx.strokeStyle = `rgba(47,126,255,${0.22 * clE * eAlpha})`; ctx.lineWidth = 0.8;
        ctx.strokeRect(cx - sqsz, cy - sqsz, sqsz * 2, sqsz * 2);
        // Diamond
        ctx.fillStyle   = `rgba(47,126,255,${0.08 * clE * eAlpha})`;
        ctx.strokeStyle = `rgba(47,126,255,${clE * eAlpha})`; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - dsz); ctx.lineTo(cx + dsz, cy);
        ctx.lineTo(cx, cy + dsz); ctx.lineTo(cx - dsz, cy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }

      // ── 8. PROGRESS ARC — bottom center ───────────────────────
      const ov = clamp(el / 2200);
      setPct(Math.round(ov * 100));
      if (!exiting) {
        const aR = 15, aX = cx, aY = H - 50;
        ctx.beginPath(); ctx.arc(aX, aY, aR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1.5; ctx.stroke();
        const aEnd = -Math.PI / 2 + Math.PI * 2 * ov * 0.96;
        ctx.beginPath(); ctx.arc(aX, aY, aR, -Math.PI / 2, aEnd);
        ctx.strokeStyle = `rgba(47,126,255,${0.65 * eAlpha})`; ctx.lineWidth = 1.5; ctx.stroke();
      }

      if (eScale < 1) ctx.restore();
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    // ── DOM timing ────────────────────────────────────────────────
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    at(1450, () => setChars(c => ({ ...c, u:  true })));
    at(1520, () => setChars(c => ({ ...c, pl: true })));
    at(1740, () => setChars(c => ({ ...c, ev: true })));
    at(1810, () => setChars(c => ({ ...c, el: true })));
    at(1900, () => setAccentLine(true));
    at(1960, () => setServices(true));

    // Typewriter data readouts
    const lines  = ["SYS.ONLINE", "CLIENTS ▸ 047", "UPTIME ▸ 99.9%"];
    const starts = [1500, 1650, 1800];
    lines.forEach((line, li) => {
      line.split("").forEach((_, ci) => {
        at(starts[li] + ci * 30, () => {
          setReadouts(prev => { const n = [...prev]; n[li] = line.slice(0, ci + 1); return n; });
        });
      });
    });

    // ── EXIT at 2420ms ────────────────────────────────────────────
    at(2420, async () => {
      if (doneRef.current) return;
      doneRef.current = true;

      // Fade wordmark
      if (wordRef.current) {
        wordRef.current.style.transition = "opacity .34s ease, transform .34s ease";
        wordRef.current.style.opacity    = "0";
        wordRef.current.style.transform  = "translate(-50%,-50%) translateY(-8px)";
      }

      // Start canvas exit contraction
      exiting = true; exitT = performance.now();

      // Aperture panels slide outward
      const { default: gsap } = await import("gsap");
      gsap.to(leftRef.current,  { x: "-100%", duration: .88, ease: "power2.inOut", delay: .06 });
      gsap.to(rightRef.current, {
        x: "100%", duration: .88, ease: "power2.inOut", delay: .06,
        onComplete: () => { setGone(true); cbRef.current(); }
      });
      gsap.to(canvas, { opacity: 0, duration: .48, delay: .28 });
    });

    return () => {
      exitKilled = true;
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  const Char = ({ ch, show }: { ch: string; show: boolean }) => (
    <span style={{ display: "inline-block", overflow: "hidden" }}>
      <span style={{
        display: "inline-block",
        transform: show ? "translateY(0%)" : "translateY(110%)",
        transition: "transform .72s cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "var(--f-disp)", fontWeight: 900,
        fontSize: "clamp(48px,7.5vw,106px)", lineHeight: 1,
        letterSpacing: "-0.036em", color: "var(--t1)",
      }}>{ch}</span>
    </span>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:10000, background:"var(--void)", overflow:"hidden" }}>

      {/* LEFT aperture panel — chromatic: red fringe inner edge */}
      <div ref={leftRef} style={{
        position:"absolute", top:0, left:0, width:"50%", height:"100%",
        background:"var(--void)", zIndex:3,
        boxShadow: "inset -2px 0 10px rgba(255,61,46,0.18)",
      }} />

      {/* RIGHT aperture panel — chromatic: blue fringe inner edge */}
      <div ref={rightRef} style={{
        position:"absolute", top:0, right:0, width:"50%", height:"100%",
        background:"var(--void)", zIndex:3,
        boxShadow: "inset 2px 0 10px rgba(47,126,255,0.18)",
      }} />

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:1, display:"block" }} />

      {/* Wordmark DOM */}
      <div ref={wordRef} style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)", zIndex:2,
        display:"flex", flexDirection:"column", alignItems:"center",
        gap:8, pointerEvents:"none", userSelect:"none",
      }}>
        <div style={{ display:"flex" }}>
          <Char ch="U" show={chars.u}  />
          <Char ch="P" show={chars.pl} />
          <Char ch="L" show={chars.pl} />
          <Char ch="E" show={chars.ev} />
          <Char ch="V" show={chars.ev} />
          <Char ch="E" show={chars.el} />
          <Char ch="L" show={chars.el} />
        </div>
        {/* Accent underline */}
        <div style={{
          alignSelf:"flex-start", marginLeft:4, height:1,
          width: accentLine ? 44 : 0, background:"var(--el)",
          transition:"width .32s cubic-bezier(0.16,1,0.3,1)",
        }} />
        {/* SERVICES sub */}
        <div style={{
          opacity: services ? 1 : 0, transition:"opacity .5s ease .1s",
          fontFamily:"var(--f-mono)", fontSize:9,
          letterSpacing:"0.36em", textTransform:"uppercase", color:"var(--t2)", marginTop:2,
        }}>SERVICES</div>
      </div>

      {/* Data readouts — top right (desktop) */}
      <div className="desk" style={{
        position:"absolute", top:"clamp(18px,3vw,36px)", right:"clamp(18px,3vw,36px)",
        zIndex:2, display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end",
        pointerEvents:"none",
      }}>
        {readouts.map((line, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:6,
            fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase",
            color: i===0 ? "var(--el)" : "rgba(241,242,255,0.28)",
            opacity: line.length > 0 ? 1 : 0, transition:"opacity .3s",
          }}>
            {i===0 && line.length>0 && (
              <div style={{ width:4, height:4, borderRadius:"50%", background:"var(--el)", animation:"elPulse 2.5s ease-in-out infinite" }} />
            )}
            {line}
          </div>
        ))}
      </div>

      {/* Progress counter — bottom center */}
      <div style={{
        position:"absolute", bottom:48, left:"50%", transform:"translateX(-50%)",
        zIndex:2, pointerEvents:"none",
        fontFamily:"var(--f-mono)", fontSize:10, letterSpacing:"0.22em",
        color:"rgba(241,242,255,0.22)", minWidth:52, textAlign:"center",
      }}>
        {String(pct).padStart(3, "0")}
      </div>
    </div>
  );
}
