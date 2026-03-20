"use client";
import { useEffect, useRef, useState } from "react";
import { B } from "../../lib/brand";

function useInView(t = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: t }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [t]);
  return { ref, vis };
}

// Each letter arrives from a unique vector — physical, not mechanical
const LETTERS = [
  { ch:"U", dx: 40, dy:  50, rot:-4 },
  { ch:"P", dx:  0, dy: -60, rot: 0 },
  { ch:"L", dx: 40, dy:   0, rot: 2 },
  { ch:"E", dx:  0, dy:  50, rot:-2 },
  { ch:"V", dx: 10, dy: -40, rot: 1 },
  { ch:"E", dx:-30, dy:   0, rot:-1 },
  { ch:"L", dx:  0, dy:  60, rot: 3 },
];

export default function Footer() {
  const { ref, vis } = useInView(0.05);
  const particleRef  = useRef<HTMLCanvasElement>(null);
  const scanRef      = useRef<HTMLDivElement>(null);
  const yr           = new Date().getFullYear();

  // Particle canvas — 2×2 blue squares drifting upward
  useEffect(() => {
    const canvas = particleRef.current; if (!canvas) return;
    const ctx    = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;

    type P = { x:number; y:number; vy:number; vx:number; alpha:number };
    const particles: P[] = [];
    let raf: number, spawnTimer = 0;

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -(0.4 + Math.random() * .6),
        vx: (Math.random() - .5) * .28,
        alpha: 0.03 + Math.random() * .018,
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.alpha -= 0.00009;
        if (p.y < canvas.height * .4 || p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(47,126,255,${p.alpha})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      spawnTimer++;
      if (spawnTimer > 20 && particles.length < 26) { spawn(); spawnTimer = 0; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scan line — fires once when footer enters view
  useEffect(() => {
    if (!vis || !scanRef.current) return;
    const el     = scanRef.current;
    const height = el.parentElement?.offsetHeight || 300;
    let start: number, raf: number;
    const anim = (now: number) => {
      if (!start) start = now;
      const prog = Math.min((now - start) / 1400, 1);
      el.style.top    = `${prog * 100}%`;
      el.style.opacity = prog < 1 ? "0.3" : "0";
      if (prog < 1) raf = requestAnimationFrame(anim);
    };
    const id = setTimeout(() => { raf = requestAnimationFrame(anim); }, 350);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [vis]);

  const cols: Record<string, string[]> = {
    "Services": ["Website System","AI Concierge","SEO & Growth","Brand Identity"],
    "Company":  ["Work","Process","Pricing","Contact"],
    "Legal":    ["Privacy Policy","Terms of Service","Refund Policy"],
  };

  return (
    <footer ref={ref} style={{ background:"var(--void)", borderTop:"1px solid var(--bd)", position:"relative", overflow:"hidden" }}>
      {/* Particle canvas */}
      <canvas ref={particleRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />

      {/* Scan line */}
      {vis && <div ref={scanRef} style={{ position:"absolute", left:0, right:0, top:0, height:1, background:"var(--el)", zIndex:2, pointerEvents:"none", transition:"top .01s linear" }} />}

      <div style={{ padding:"clamp(52px,8vw,88px) clamp(20px,4vw,64px) 0", position:"relative", zIndex:1 }}>

        {/* Wordmark assembly — letters arrive from different vectors */}
        <div style={{
          display:"flex", justifyContent:"center", gap:"clamp(0px,.3vw,4px)",
          userSelect:"none", marginBottom:"clamp(44px,7vw,72px)",
        }}>
          {LETTERS.map((lv, i) => (
            <div key={i} style={{
              fontFamily:"var(--f-disp)", fontWeight:900,
              fontSize:"clamp(52px,11vw,172px)", lineHeight:.88,
              letterSpacing:"-.036em",
              color:"transparent",
              WebkitTextStroke:"1px rgba(241,242,255,0.12)",
              opacity: vis ? 1 : 0,
              transform: vis
                ? "translateX(0) translateY(0) rotate(0deg)"
                : `translateX(${lv.dx}px) translateY(${lv.dy}px) rotate(${lv.rot}deg)`,
              transition:`opacity .7s ${.08+i*.06}s cubic-bezier(0.34,1.56,0.64,1), transform .85s ${.08+i*.06}s cubic-bezier(0.34,1.56,0.64,1)`,
            }}>{lv.ch}</div>
          ))}
        </div>

        {/* Links grid */}
        <div style={{
          display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
          gap:"clamp(24px,4vw,56px)",
          paddingBottom:40, borderBottom:"1px solid var(--bd)",
          position:"relative", zIndex:1,
        }} className="ft-grid">
          <div>
            <div style={{ fontFamily:"var(--f-disp)", fontWeight:900, fontSize:15, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--t1)", marginBottom:3 }}>
              UP<span style={{ color:"var(--el)" }}>LEVEL</span>
            </div>
            <div style={{ fontFamily:"var(--f-mono)", fontSize:7, letterSpacing:"0.32em", textTransform:"uppercase", color:"var(--t3)", marginBottom:14 }}>SERVICES</div>
            <p style={{ fontFamily:"var(--f-body)", fontWeight:300, fontSize:12.5, lineHeight:1.75, color:"var(--t2)", maxWidth:240, marginBottom:16 }}>
              Premium website systems, AI automation, and growth infrastructure for elite contractors.
            </p>
            <a href={`mailto:${B.email}`} style={{
              fontFamily:"var(--f-mono)", fontSize:8.5, letterSpacing:"0.1em",
              color:"var(--t2)", textDecoration:"none", transition:"color .2s", cursor:"none",
            }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--el)"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--t2)"}>
              {B.email}
            </a>
          </div>
          {Object.entries(cols).map(([heading, links]) => (
            <div key={heading}>
              <div style={{ fontFamily:"var(--f-mono)", fontSize:7.5, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--t2)", marginBottom:16 }}>{heading}</div>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:11 }}>
                {links.map(l => (
                  <li key={l}>
                    <a href="#" data-cursor="" style={{
                      fontFamily:"var(--f-body)", fontSize:12.5,
                      color:"var(--t2)", textDecoration:"none", fontWeight:300,
                      transition:"color .2s", cursor:"none",
                    }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--t1)"}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--t2)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:12, padding:"20px 0", position:"relative", zIndex:1,
        }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", color:"rgba(241,242,255,0.2)" }}>
            © {yr} UPLEVEL SERVICES LLC · RICHMOND, VIRGINIA
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:4,height:4,borderRadius:"50%",background:"var(--alert)",animation:"alertPulse 2.5s ease-in-out infinite" }} />
            <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(241,242,255,0.22)" }}>{B.slots} SLOT AVAILABLE</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:600px){.ft-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </footer>
  );
}
