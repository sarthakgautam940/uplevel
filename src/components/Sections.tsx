"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus, Star, ChevronRight } from "lucide-react";
import { B } from "../../lib/brand";

// ── useInView ─────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

const EV: [number,number,number,number] = [0.16,1,0.3,1];
const tr = (d: number, t = 0.85) => ({ delay:d, duration:t, ease:EV });

// ══════════════════════════════════════════════════════════════════
// MARQUEE STRIP
// ══════════════════════════════════════════════════════════════════
export function MarqueeStrip() {
  const items = ["WEBSITES","AI CONCIERGE","LOCAL SEO","BRAND IDENTITY","LEAD AUTOMATION","48-HR DELIVERY","VOICE AI","CONVERSION SYSTEMS","RICHMOND VA"];
  const all   = [...items,...items];
  return (
    <div style={{ borderTop:"1px solid var(--bd)", borderBottom:"1px solid var(--bd)", background:"rgba(47,126,255,0.018)", padding:"13px 0", overflow:"hidden" }}>
      <div className="mq-track">
        {all.map((t,i) => (
          <span key={i} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"var(--f-mono)", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--t2)", whiteSpace:"nowrap" }}>{t}</span>
            <span style={{ margin:"0 22px", color:"var(--el)", opacity:0.25, fontSize:7 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MANIFESTO — word-by-word inside-out reveal
// ══════════════════════════════════════════════════════════════════
export function Manifesto() {
  const { ref, vis } = useInView(0.15);
  const words = B.manifesto.statement.split(" ");
  const mid   = Math.floor(words.length / 2);
  // Inside-out: center words stagger FIRST (smallest delay), edges last
  const delay = (i: number) => 0.06 + Math.abs(i - mid) * 0.065;

  return (
    <section ref={ref as any} id="manifesto" className="sect" style={{ background:"var(--void)" }}>
      <div className="pad cap">
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"clamp(28px,6vw,80px)", alignItems:"start" }} className="mf-grid">
          {/* Vertical label */}
          <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={tr(.1)}
            style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,paddingTop:8 }} className="desk">
            <div style={{ width:1, height:48, background:"var(--bd-hi)" }} />
            <span style={{
              fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.24em",
              textTransform:"uppercase", color:"var(--t2)",
              writingMode:"vertical-rl", transform:"rotate(180deg)",
            }}>PHILOSOPHY</span>
          </motion.div>

          <div>
            <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{ marginBottom:24 }}>
              <span className="eyebrow">Our Belief</span>
            </motion.div>

            {/* Statement — word by word, inside-out wave */}
            <h2 style={{
              fontFamily:"var(--f-disp)", fontWeight:700,
              fontSize:"clamp(22px,3.2vw,48px)", lineHeight:1.15,
              letterSpacing:"-0.024em", marginBottom:32, maxWidth:780,
            }}>
              {words.map((word, i) => {
                const isExtraordinary = word.toLowerCase().includes("extraordinary");
                const isDigital       = word.toLowerCase() === "digital";
                const isFinal         = i === words.length - 1;
                return (
                  <span key={i} style={{ display:"inline-block", overflow:"hidden", verticalAlign:"bottom" }}>
                    <motion.span
                      initial={{ y:"108%", opacity:0 }}
                      animate={vis ? { y:"0%", opacity:1 } : {}}
                      transition={{ delay:delay(i), duration:.8, ease:EV }}
                      style={{ display:"inline-block", position:"relative", fontStyle:isFinal?"italic":"normal" }}>
                      {isExtraordinary && (
                        <motion.span initial={{scaleX:0}} animate={vis?{scaleX:1}:{}}
                          transition={{ delay:delay(i)+.4, duration:.3, ease:EV }}
                          style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"var(--el)", transformOrigin:"left" }} />
                      )}
                      {isDigital && (
                        <motion.span initial={{opacity:0}} animate={vis?{opacity:1}:{}}
                          transition={{ delay:delay(i)+.1, duration:.2 }}
                          style={{ position:"absolute", inset:0, background:"var(--el-lo)", borderRadius:2 }} />
                      )}
                      <span style={{ position:"relative", zIndex:1 }}>{word}</span>
                    </motion.span>
                    {i < words.length - 1 && <span style={{ display:"inline-block", width:"0.22em" }} />}
                  </span>
                );
              })}
            </h2>

            <motion.p initial={{opacity:0,y:18}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.5)}
              className="t-body" style={{
                maxWidth:540, marginBottom:48,
                paddingLeft:20, borderLeft:"1px solid var(--bd-el)",
                fontSize:"clamp(13px,1.05vw,15px)",
              }}>
              {B.manifesto.body}
            </motion.p>

            <motion.div initial={{opacity:0,y:14}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.65)}
              style={{ display:"flex", flexWrap:"wrap", gap:40, paddingTop:28, borderTop:"1px solid var(--bd)" }}>
              {[
                { v:`${B.stats.clients}+`, l:"Clients Served" },
                { v:`${B.stats.satisfaction}%`, l:"Satisfaction" },
                { v:"48hr", l:"Avg Launch" },
              ].map((s,i) => (
                <div key={i}>
                  <div style={{ fontFamily:"var(--f-disp)", fontWeight:900, fontSize:"clamp(26px,3.5vw,44px)", lineHeight:1, letterSpacing:"-.030em", color:"var(--t1)", marginBottom:5 }}>{s.v}</div>
                  <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--t2)" }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.mf-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// KINETIC BAND — parallax text rows
// ══════════════════════════════════════════════════════════════════
export function KineticBand() {
  const ref  = useRef<HTMLDivElement>(null);
  const [offX, setOffX] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const { top, height } = ref.current.getBoundingClientRect();
      setOffX(((top + height/2) / window.innerHeight - .5) * -14);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const rows = [
    { text:"THE WEBSITE YOUR WORK DESERVES ·", solid:true,  dir:1 },
    { text:"AI  ·  AUTOMATION  ·  SEO  ·  DESIGN  ·  GROWTH ·", solid:false, dir:-1 },
    { text:"BUILD FAST. LAUNCH SMART. DOMINATE. ·", solid:true,  dir:1 },
  ];
  return (
    <div ref={ref} style={{
      overflow:"hidden", padding:"clamp(44px,6.5vw,82px) 0",
      borderTop:"1px solid var(--bd)", borderBottom:"1px solid var(--bd)",
      background:"var(--srf)", position:"relative",
    }}>
      {(["left","right"] as const).map(side => (
        <div key={side} style={{
          position:"absolute", top:0, bottom:0, [side]:0, width:"8%",
          background:`linear-gradient(to ${side==="left"?"right":"left"},var(--srf),transparent)`,
          zIndex:2, pointerEvents:"none",
        }} />
      ))}
      {rows.map((row,i) => (
        <div key={i} style={{ transform:`translateX(${offX*row.dir}%)`, transition:"transform .1s linear", marginBottom:i<2?3:0 }}>
          <span style={{
            fontFamily:"var(--f-disp)", fontWeight:900, whiteSpace:"nowrap",
            fontSize:"clamp(38px,6.5vw,96px)", lineHeight:.9, letterSpacing:"-.030em", display:"block",
            color: row.solid ? "var(--t1)" : "transparent",
            WebkitTextStroke: row.solid ? undefined : "1px rgba(241,242,255,0.10)",
          }}>{row.text}{row.text}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SERVICES — 4 cards, elastic entry, 3D tilt + spotlight
// ══════════════════════════════════════════════════════════════════
export function Services() {
  const { ref, vis } = useInView(0.06);
  const entries = [
    { y:-80,  rot:-1.5, delay:0    },
    { y:-110, rot:0.8,  delay:.08  },
    { y:-65,  rot:-0.5, delay:.16  },
    { y:-95,  rot:1.2,  delay:.24  },
  ];
  return (
    <section ref={ref as any} id="services" className="sect" style={{ background:"var(--void)" }}>
      <div className="pad cap">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:52 }}>
          <div>
            <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}>
              <span className="eyebrow">What We Build</span>
            </motion.div>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.12)} className="t-h1">
              Four systems.<br/>One machine.
            </motion.h2>
          </div>
          <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.22)}
            className="t-body" style={{ maxWidth:280 }}>
            Each component amplifies the others.
          </motion.p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))", gap:2 }}>
          {B.services.map((svc, i) => <ServiceCard key={svc.n} svc={svc} vis={vis} entry={entries[i]} />)}
        </div>
        <motion.div initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.45)}
          style={{ marginTop:40, textAlign:"center", paddingTop:32, borderTop:"1px solid var(--bd)" }}>
          <a href="/services" data-cursor="" className="btn btn-ghost" style={{ fontSize:9 }}>View Full Services →</a>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ svc, vis, entry }: {
  svc: typeof B.services[0];
  vis: boolean;
  entry: { y:number; rot:number; delay:number };
}) {
  const cRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx:0, ry:0, mx:50, my:50 });
  const [hov,  setHov]  = useState(false);
  const [open, setOpen] = useState(false);

  const onMv = (e: React.MouseEvent) => {
    if (!cRef.current) return;
    const r  = cRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top)  / r.height;
    setTilt({ rx:(cy-.5)*-10, ry:(cx-.5)*10, mx:cx*100, my:cy*100 });
  };

  return (
    <motion.div
      initial={{ opacity:0, y:entry.y, rotate:entry.rot }}
      animate={vis ? { opacity:1, y:0, rotate:0 } : {}}
      transition={{ delay:entry.delay, duration:.9, ease:[0.34,1.56,0.64,1] }}>
      {/* Top line draws in as card lands */}
      <motion.div
        initial={{ scaleX:0 }} animate={vis ? { scaleX:1 } : {}}
        transition={{ delay:entry.delay + .75, duration:.38, ease:EV }}
        style={{ height:1, background:"var(--el)", transformOrigin:"left",
          opacity: hov ? .7 : .28, transition:"opacity .3s" }} />
      <div
        ref={cRef} onMouseMove={onMv} onMouseLeave={()=>{ setTilt({rx:0,ry:0,mx:50,my:50}); setHov(false); }}
        onMouseEnter={()=>setHov(true)} data-cursor=""
        style={{
          background:"var(--srf)", border:"1px solid var(--bd)", borderTop:"none",
          padding:"clamp(24px,2.6vw,36px)", position:"relative", overflow:"hidden",
          cursor:"none",
          transform:`perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle:"preserve-3d",
          borderColor: hov ? "var(--bd-el)" : "var(--bd)", transition:"border-color .28s",
        }}>
        {/* Radial spotlight follows cursor */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:`radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(47,126,255,0.06) 0%, transparent 55%)`,
          transition: hov ? "none" : "background .4s",
        }} />
        {/* Ghost number — shifts slightly toward cursor for inner depth feel */}
        <div style={{
          position:"absolute", top:12, right:18,
          fontFamily:"var(--f-disp)", fontWeight:900, fontSize:68, lineHeight:1,
          color:"rgba(47,126,255,0.05)", letterSpacing:"-.04em", pointerEvents:"none",
          transform:`translate(${(tilt.ry/10)*3}px,${(tilt.rx/10)*2}px)`,
          transition: hov ? "transform .08s" : "transform .3s",
        }}>{svc.n}</div>

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:16, marginBottom:16 }}>{svc.icon}</div>
          <h3 className="t-h2" style={{ color:"var(--t1)", marginBottom:10, fontSize:"clamp(16px,1.7vw,21px)" }}>{svc.title}</h3>
          <p className="t-body" style={{ marginBottom:16, fontSize:12.5, lineHeight:1.72 }}>{svc.sub}</p>
          <div style={{ fontFamily:"var(--f-mono)", fontSize:8.5, letterSpacing:"0.1em", color:"var(--el)", marginBottom:18 }}>{svc.price}</div>
          <button onClick={()=>setOpen(!open)} data-cursor=""
            style={{
              background:"none", border:"none", cursor:"none",
              display:"flex", alignItems:"center", gap:7,
              fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase",
              color:"var(--t2)", padding:0, transition:"color .2s",
            }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--el)"}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--t2)"}>
            {open?"Hide":"Deliverables"}
            <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:.24 }} style={{ display:"inline-flex",alignItems:"center" }}>▾</motion.span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                transition={{ duration:.28, ease:EV }}
                style={{ overflow:"hidden", paddingTop:14, marginTop:12, borderTop:"1px solid var(--bd)", listStyle:"none", display:"flex", flexDirection:"column", gap:7 }}>
                {svc.deliverables.map((d,j) => (
                  <li key={j} style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"var(--f-body)", fontSize:12, color:"var(--t2)", fontWeight:300 }}>
                    <Check size={9} style={{ color:"var(--el)", flexShrink:0 }} />{d}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// WORK PREVIEW
// ══════════════════════════════════════════════════════════════════
export function WorkPreview() {
  const { ref, vis } = useInView(0.06);
  return (
    <section ref={ref as any} className="sect" style={{ background:"var(--srf)" }}>
      <div className="pad cap">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:44 }}>
          <div>
            <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{ marginBottom:18 }}>
              <span className="eyebrow">Selected Work</span>
            </motion.div>
            <motion.h2 initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.1)} className="t-h1">
              Real clients.<br/><em>Real results.</em>
            </motion.h2>
          </div>
          <motion.a initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={tr(.25)}
            href="/work" data-cursor="VIEW" className="btn btn-ghost" style={{ fontSize:9 }}>
            See All Work →
          </motion.a>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {B.work.slice(0,3).map((w,i) => <WorkCard key={w.slug} w={w} i={i} vis={vis} />)}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ w, i, vis }: { w:typeof B.work[0]; i:number; vis:boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      initial={{ opacity:0, x:-22 }} animate={vis?{opacity:1,x:0}:{}} transition={tr(i*.07,.75)}
      href={`/work/${w.slug}`} data-cursor="VIEW"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"center",
        padding:"clamp(20px,2.5vw,28px)", border:"1px solid var(--bd)",
        borderColor: hov?"var(--bd-el)":"var(--bd)",
        background: hov?"rgba(47,126,255,0.025)":"transparent",
        textDecoration:"none", cursor:"none",
        transition:"border-color .28s, background .28s",
        position:"relative", overflow:"hidden",
      }}>
      {/* Left accent bar */}
      <div style={{
        position:"absolute", left:0, top:0, bottom:0, width:2, background:"var(--el)",
        transform: hov?"scaleY(1)":"scaleY(0)", transformOrigin:"top",
        transition:"transform .32s var(--expo)",
      }} />
      <div style={{ paddingLeft: hov?12:0, transition:"padding .28s var(--expo)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--el)" }}>{w.tier}</span>
          <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--t3)", display:"inline-block" }} />
          <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--t2)" }}>{w.cat}</span>
        </div>
        <h3 style={{ fontFamily:"var(--f-disp)", fontWeight:700, fontSize:"clamp(18px,2.2vw,28px)", letterSpacing:"-.022em", color:"var(--t1)", marginBottom:8 }}>{w.title}</h3>
        <p className="t-body" style={{ fontSize:12.5, maxWidth:560 }}>{w.story}</p>
      </div>
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <div style={{ fontFamily:"var(--f-disp)", fontWeight:900, fontSize:"clamp(16px,2vw,24px)", letterSpacing:"-.025em", color:hov?"var(--t1)":"var(--t2)", transition:"color .28s", marginBottom:4 }}>{w.metric}</div>
        <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--t2)" }}>{w.year}</div>
        <ChevronRight size={14} style={{ marginTop:8, color:hov?"var(--el)":"var(--t3)", transition:"color .28s, transform .28s", transform:hov?"translateX(4px)":"translateX(0)" }} />
      </div>
    </motion.a>
  );
}

// ══════════════════════════════════════════════════════════════════
// STATS — count-up with blur-to-crisp landing
// ══════════════════════════════════════════════════════════════════
export function Stats() {
  const { ref, vis } = useInView(0.2);
  const stats = [
    { target:B.stats.clients,      suf:"+",  lbl:"Clients Served",  sub:"Growing monthly"    },
    { target:B.stats.satisfaction, suf:"%",  lbl:"Satisfaction",     sub:"Client-reported"   },
    { target:B.stats.avgLaunch,    suf:"hr", lbl:"Avg Launch",       sub:"Deposit to live"   },
    { target:B.stats.roi,          suf:"%",  lbl:"Avg ROI Yr1",      sub:"Client-attributed" },
  ];
  return (
    <div ref={ref} style={{ background:"var(--srf2)", borderTop:"1px solid var(--bd)", borderBottom:"1px solid var(--bd)" }}>
      <div className="pad cap">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))" }}>
          {stats.map((s,i) => <StatCell key={i} {...s} vis={vis} delay={i*.1} />)}
        </div>
      </div>
    </div>
  );
}

function StatCell({ target, suf, lbl, sub, vis, delay }: { target:number;suf:string;lbl:string;sub:string;vis:boolean;delay:number }) {
  const [n,       setN]       = useState(0);
  const [blurred, setBlurred] = useState(true);
  useEffect(() => {
    if (!vis) return;
    const id = setTimeout(() => {
      const t0 = performance.now(), dur = 2400;
      let raf: number;
      const tick = () => {
        const prog = Math.min((performance.now()-t0)/dur,1);
        const e    = 1 - Math.pow(1-prog,4);
        setN(Math.round(e*target));
        if (prog >= .98) setBlurred(false);
        if (prog < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay*1000);
    return () => clearTimeout(id);
  }, [vis, target, delay]);

  return (
    <motion.div
      initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={{delay,duration:.7,ease:EV}}
      style={{ padding:"44px 0", borderRight:"1px solid var(--bd)", textAlign:"center", position:"relative", overflow:"hidden" }}>
      {/* Ripple on land */}
      {vis && <motion.div initial={{scale:0,opacity:.06}} animate={{scale:4,opacity:0}} transition={{delay:delay+.8,duration:.8}}
        style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:40,height:40,borderRadius:"50%",background:"var(--el)",pointerEvents:"none" }} />}
      <div style={{
        fontFamily:"var(--f-disp)", fontWeight:900,
        fontSize:"clamp(36px,5.2vw,68px)", lineHeight:.9, letterSpacing:"-.035em",
        color:"var(--t1)", marginBottom:10,
        filter: blurred&&vis ? "blur(0.7px)" : "none",
        transition:"filter .08s",
      }}>{n}{suf}</div>
      <div style={{ fontFamily:"var(--f-mono)", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--t2)", marginBottom:4 }}>{lbl}</div>
      <div style={{ fontFamily:"var(--f-body)", fontSize:11, color:"var(--t3)", fontWeight:300 }}>{sub}</div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PROCESS — step selector + detail panel
// ══════════════════════════════════════════════════════════════════
export function Process() {
  const { ref, vis } = useInView(0.06);
  const [active, setActive] = useState(0);
  return (
    <section ref={ref as any} id="process" className="sect" style={{ background:"var(--void)" }}>
      <div className="pad cap">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:44 }}>
          <div>
            <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{ marginBottom:18 }}>
              <span className="eyebrow">How We Work</span>
            </motion.div>
            <motion.h2 initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.1)} className="t-h1">
              Zero to live.<br/>Five steps.
            </motion.h2>
          </div>
        </div>

        {/* Step tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:28, overflowX:"auto", scrollbarWidth:"none" }}>
          {B.process.map((p,i) => (
            <button key={p.n} onClick={()=>setActive(i)} data-cursor=""
              style={{
                flexShrink:0, border:"none", cursor:"none", padding:"12px 18px",
                background: active===i ? "var(--srf2)" : "transparent",
                borderBottom: active===i ? "2px solid var(--el)" : "2px solid transparent",
                textAlign:"left", transition:"background .25s, border-color .25s",
              }}>
              <div style={{ fontFamily:"var(--f-mono)", fontSize:7.5, letterSpacing:"0.14em", textTransform:"uppercase",
                color: active===i?"var(--el)":"var(--t2)", marginBottom:3, transition:"color .25s" }}>{p.label}</div>
              <div style={{ fontFamily:"var(--f-disp)", fontWeight:700, fontSize:"clamp(12px,1.4vw,16px)",
                color: active===i?"var(--t1)":"var(--t2)", transition:"color .25s" }}>{p.title}</div>
            </button>
          ))}
        </div>

        {/* Step detail — AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            transition={{duration:.3,ease:EV}}
            style={{
              display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(28px,5vw,64px)",
              background:"var(--srf)", border:"1px solid var(--bd)",
              padding:"clamp(24px,3vw,40px)",
            }} className="proc-detail">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <span style={{
                  fontFamily:"var(--f-disp)", fontWeight:900, fontSize:48, lineHeight:1,
                  letterSpacing:"-.04em", color:"rgba(47,126,255,0.18)",
                }}>{B.process[active].n}</span>
                <div>
                  <span className="eyebrow" style={{ display:"flex", marginBottom:5 }}>{B.process[active].label}</span>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"3px 10px",
                    background:"var(--el-lo)", border:"1px solid var(--bd-el)" }}>
                    <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.12em", color:"var(--el)" }}>{B.process[active].time}</span>
                  </div>
                </div>
              </div>
              <h3 className="t-h2" style={{ fontSize:"clamp(18px,2.2vw,26px)", marginBottom:14 }}>{B.process[active].title}</h3>
              <p className="t-body" style={{ marginBottom:20, fontSize:13 }}>{B.process[active].body}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[{ l:"Your role", t:B.process[active].you }, { l:"Our role", t:B.process[active].us }].map((r,i) => (
                  <div key={i} style={{ padding:"12px 14px", background:"rgba(241,242,255,0.02)", border:"1px solid var(--bd)" }}>
                    <div style={{ fontFamily:"var(--f-mono)", fontSize:7.5, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--t2)", marginBottom:6 }}>{r.l}</div>
                    <p style={{ fontFamily:"var(--f-body)", fontSize:11, lineHeight:1.65, color:"var(--t2)", fontWeight:300 }}>{r.t}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--t2)", marginBottom:12 }}>What happens</div>
              {B.process[active].what.map((item,i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"10px 0",
                  borderBottom:"1px solid var(--bd)",
                  fontFamily:"var(--f-body)", fontSize:12.5, color:"var(--t2)", fontWeight:300,
                }}>
                  <span style={{ width:18, height:18, borderRadius:"50%",
                    background:"var(--el-lo)", border:"1px solid var(--bd-el)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    fontFamily:"var(--f-mono)", fontSize:7, color:"var(--el)" }}>{i+1}</span>
                  {item}
                </div>
              ))}
              {/* Step progress dots */}
              <div style={{ display:"flex", gap:5, marginTop:24 }}>
                {B.process.map((_,i) => (
                  <button key={i} onClick={()=>setActive(i)} data-cursor=""
                    style={{ width:active===i?20:4, height:2, background:active===i?"var(--el)":"var(--bd-hi)",
                      border:"none", cursor:"none", borderRadius:1, transition:"all .28s var(--expo)" }} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <style>{`@media(max-width:860px){.proc-detail{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ══════════════════════════════════════════════════════════════════
export function Testimonials() {
  const { ref, vis } = useInView(0.06);
  const [hov, setHov] = useState<number|null>(null);
  const rots = [-2.5, 2.0, -1.8];
  return (
    <section ref={ref as any} className="sect" style={{ background:"var(--void)" }}>
      <div className="pad cap">
        <div style={{ marginBottom:52 }}>
          <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{ marginBottom:18 }}>
            <span className="eyebrow">Social Proof</span>
          </motion.div>
          <motion.h2 initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.1)} className="t-h1" style={{ maxWidth:520 }}>
            Don&apos;t take<br/>our word for it.
          </motion.h2>
        </div>

        {/* Three rotated cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:20 }} className="test-grid">
          {B.testimonials.map((t,i) => (
            <motion.div key={t.name}
              initial={{ opacity:0, y:48, rotate:rots[i]*2 }}
              animate={vis ? { opacity:1, y:0, rotate:hov===i?0:rots[i] } : {}}
              transition={{ delay:i*.11, duration:.9, ease:EV }}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
              style={{
                background:"var(--srf)", border:"1px solid var(--bd)",
                borderColor: hov===i?"var(--bd-el)":"var(--bd)",
                padding:"clamp(18px,2.2vw,28px)",
                position:"relative", overflow:"hidden", cursor:"none",
                transform: hov===i?"translateY(-6px)":"none",
                transition:"border-color .3s",
              }} data-cursor="">
              <div style={{ position:"absolute",top:16,right:18,fontFamily:"var(--f-disp)",fontSize:56,lineHeight:1,color:"rgba(47,126,255,0.06)" }}>&#34;</div>
              <div style={{ display:"flex", gap:3, marginBottom:14 }}>
                {Array.from({length:5}).map((_,j)=><Star key={j} size={10} fill="var(--el)" style={{color:"var(--el)"}} />)}
              </div>
              <blockquote style={{ fontFamily:"var(--f-body)", fontWeight:300, fontSize:13, lineHeight:1.82, color:"var(--t2)", marginBottom:18, fontStyle:"italic" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:"var(--el-lo)",border:"1px solid var(--bd-el)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--f-disp)",fontWeight:700,fontSize:10,color:"var(--el)" }}>{t.init}</div>
                <div>
                  <div style={{ fontFamily:"var(--f-disp)", fontWeight:600, fontSize:13, color:"var(--t1)" }}>{t.name}</div>
                  <div style={{ fontFamily:"var(--f-mono)", fontSize:7.5, letterSpacing:"0.1em", color:"var(--t2)" }}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured pull-quote */}
        <motion.div initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.42,.9)}
          style={{ background:"var(--srf)", border:"1px solid var(--bd)", padding:"clamp(28px,4vw,52px)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute",left:"clamp(28px,4vw,52px)",top:24,fontFamily:"var(--f-disp)",fontWeight:900,fontSize:120,lineHeight:1,color:"rgba(47,126,255,0.035)" }}>&#34;</div>
          <div style={{ display:"flex", gap:3, marginBottom:20 }}>
            {Array.from({length:5}).map((_,j)=><Star key={j} size={13} fill="var(--el)" style={{color:"var(--el)"}} />)}
          </div>
          <blockquote style={{ fontFamily:"var(--f-disp)", fontWeight:500, fontSize:"clamp(16px,2vw,24px)", lineHeight:1.45, letterSpacing:"-.015em", color:"var(--t1)", maxWidth:820, marginBottom:26 }}>
            &ldquo;{B.featured.quote}&rdquo;
          </blockquote>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"var(--el-lo)",border:"1px solid var(--bd-el)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--f-disp)",fontWeight:700,fontSize:12,color:"var(--el)" }}>{B.featured.init}</div>
            <div>
              <div style={{ fontFamily:"var(--f-disp)", fontWeight:700, fontSize:14, color:"var(--t1)" }}>{B.featured.name}</div>
              <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.1em", color:"var(--t2)" }}>{B.featured.project}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:900px){.test-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// PRICING — bottom-to-top fill + weight drop + Authority pulse
// ══════════════════════════════════════════════════════════════════
export function Pricing() {
  const { ref, vis } = useInView(0.04);
  return (
    <section ref={ref as any} id="pricing" className="sect" style={{ background:"var(--srf)" }}>
      <div className="pad cap">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{display:"flex",justifyContent:"center",marginBottom:18}}>
            <span className="eyebrow">Pricing</span>
          </motion.div>
          <motion.h2 initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.1)} className="t-h1">
            Transparent.<br/>No surprises.
          </motion.h2>
          <motion.p initial={{opacity:0,y:14}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.2)}
            className="t-body" style={{ maxWidth:400, margin:"14px auto 0" }}>
            All tiers include 48-hour delivery and month-to-month contracts after month 3.
          </motion.p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(225px,1fr))", gap:2, alignItems:"stretch" }}>
          {B.pricing.map((tier,i) => <PricingCard key={tier.name} tier={tier} i={i} vis={vis} />)}
        </div>
        <motion.p initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={tr(.55)}
          className="t-body" style={{ textAlign:"center", marginTop:20, fontSize:11 }}>
          50% deposit to begin · 50% at launch ·{" "}
          <a href="/contact" data-cursor="" style={{ color:"var(--el)", textDecoration:"underline", cursor:"none" }}>Custom pricing?</a>
        </motion.p>
      </div>
    </section>
  );
}

function PricingCard({ tier, i, vis }: { tier:typeof B.pricing[0]; i:number; vis:boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:38 }} animate={vis?{opacity:1,y:0}:{}}
      transition={{ delay:i*.09, duration:.82, ease:[0.34,1.56,0.64,1] }}
      style={{ position:"relative", display:"flex", flexDirection:"column" }}>
      {tier.badge && (
        <div style={{
          position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)",
          padding:"3px 12px",
          background: tier.hi ? "var(--el)" : "rgba(47,126,255,0.55)",
          fontFamily:"var(--f-mono)", fontSize:7.5, letterSpacing:"0.16em", textTransform:"uppercase",
          color: tier.hi ? "#fff" : "var(--t1)", whiteSpace:"nowrap", zIndex:2,
        }}>{tier.badge}</div>
      )}
      {/* Authority pulse border — fires once after all cards land */}
      {tier.hi && vis && (
        <motion.div
          initial={{opacity:.25}} animate={{opacity:[.25,.75,.25]}}
          transition={{delay:.8,duration:.5,times:[0,.5,1]}}
          style={{ position:"absolute", inset:-1, border:"1px solid var(--el)", pointerEvents:"none", zIndex:1 }} />
      )}
      <div
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{
          flex:1, display:"flex", flexDirection:"column",
          background: tier.hi ? "var(--srf2)" : "var(--srf)",
          border:`1px solid ${tier.hi?"var(--bd-el)":hov?"var(--bd-el)":"var(--bd)"}`,
          boxShadow: tier.hi ? "0 0 60px rgba(47,126,255,0.07)" : "none",
          padding:"clamp(24px,2.6vw,36px) clamp(18px,2.2vw,26px)",
          transition:"border-color .28s",
          // Bottom-to-top fill entry via clip-path
          clipPath: vis ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)",
          transitionDuration:".85s",
          transitionTimingFunction:"cubic-bezier(0.34,1.56,0.64,1)",
          transitionDelay:`${i*.09}s`,
        }}>
        <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:tier.hi?"var(--el)":"var(--t2)", marginBottom:10 }}>{tier.name}</div>
        <div style={{ marginBottom:5 }}>
          <span style={{ fontFamily:"var(--f-disp)", fontWeight:900, fontSize:"clamp(22px,3vw,36px)", color:"var(--t1)", letterSpacing:"-.030em" }}>{tier.setup}</span>
          <span style={{ fontFamily:"var(--f-body)", fontSize:10, color:"var(--t2)", marginLeft:5, fontWeight:300 }}>setup</span>
        </div>
        <div style={{ fontFamily:"var(--f-mono)", fontSize:9.5, color:"var(--el)", marginBottom:14, opacity:.85 }}>+ {tier.mo}</div>
        <p className="t-body" style={{ fontSize:12, marginBottom:20, paddingBottom:20, borderBottom:"1px solid var(--bd)" }}>{tier.desc}</p>
        <ul style={{ flex:1, listStyle:"none", display:"flex", flexDirection:"column", gap:9, marginBottom:20 }}>
          {tier.features.map((f,j) => (
            <li key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, fontFamily:"var(--f-body)", fontSize:12, lineHeight:1.55, color:f.startsWith("Everything")?"var(--t2)":"var(--t1)", fontWeight:300, fontStyle:f.startsWith("Everything")?"italic":"normal" }}>
              <Check size={9} style={{ color:tier.hi?"var(--el)":"var(--t2)", flexShrink:0, marginTop:3 }} />{f}
            </li>
          ))}
        </ul>
        <a href="/contact" data-cursor="" className={`btn ${tier.hi?"btn-el":"btn-ghost"}`}
          style={{ width:"100%", justifyContent:"center", fontSize:8.5 }}>
          {tier.name==="BESPOKE" ? "Let's Talk" : "Start a Project"}
        </a>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FAQ — sticky left col, category filter, accordion
// ══════════════════════════════════════════════════════════════════
export function FAQ() {
  const { ref, vis } = useInView(0.04);
  const [open, setOpen] = useState<number|null>(0);
  const [cat,  setCat]  = useState("All");
  const cats    = ["All", ...Array.from(new Set(B.faq.map(f=>f.cat)))];
  const filtered = cat==="All" ? B.faq : B.faq.filter(f=>f.cat===cat);
  return (
    <section ref={ref as any} id="faq" className="sect" style={{ background:"var(--srf2)" }}>
      <div className="pad cap">
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:"clamp(36px,6vw,80px)", alignItems:"start" }} className="fq-grid">
          {/* Sticky left */}
          <div style={{ position:"sticky", top:88 }}>
            <motion.div initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}>
              <span className="eyebrow">FAQ</span>
            </motion.div>
            <motion.h2 initial={{opacity:0,y:22}} animate={vis?{opacity:1,y:0}:{}} transition={tr(.1)} className="t-h1"
              style={{ fontSize:"clamp(28px,4vw,54px)", marginBottom:16 }}>
              Questions<br/>we get<br/>a lot.
            </motion.h2>
            <motion.a initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={tr(.25)}
              href="/contact" data-cursor="" className="btn btn-el" style={{ fontSize:9, marginBottom:28 }}>
              Book Free Call →
            </motion.a>
            <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={tr(.32)}
              style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {cats.map(c => (
                <button key={c} onClick={()=>{setCat(c);setOpen(null);}} data-cursor=""
                  style={{
                    background:"none", border:"none", cursor:"none", padding:"9px 0",
                    borderBottom:"1px solid var(--bd)",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase",
                    color: cat===c ? "var(--el)" : "var(--t2)", transition:"color .2s",
                  }}>
                  {c}
                  {cat===c && <span style={{ width:4,height:4,borderRadius:"50%",background:"var(--el)" }} />}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={cat} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.24}}>
                {filtered.map((item,i) => (
                  <motion.div key={item.q}
                    initial={{opacity:0,y:8}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:i*.04}}
                    style={{
                      borderBottom:"1px solid var(--bd)",
                      borderLeft: open===i ? "2px solid rgba(47,126,255,0.5)" : "2px solid transparent",
                      paddingLeft: open===i ? 14 : 0,
                      transition:"border-color .22s, padding .22s",
                    }}>
                    <button onClick={()=>setOpen(open===i?null:i)} data-cursor=""
                      style={{
                        width:"100%", background:"none", border:"none", cursor:"none",
                        padding:"20px 0", display:"flex", alignItems:"flex-start",
                        justifyContent:"space-between", gap:18, textAlign:"left",
                      }}>
                      <span style={{
                        fontFamily:"var(--f-disp)", fontWeight:open===i?600:400,
                        fontSize:"clamp(13px,1.3vw,16px)", lineHeight:1.45,
                        color: open===i?"var(--t1)":"var(--t2)", transition:"color .2s",
                      }}>{item.q}</span>
                      <span style={{
                        width:24, height:24, flexShrink:0,
                        border:`1px solid ${open===i?"var(--bd-el)":"var(--bd)"}`,
                        background: open===i?"var(--el-lo)":"transparent",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: open===i?"var(--el)":"var(--t2)", transition:"all .22s", marginTop:2,
                      }}>
                        {open===i ? <Minus size={10}/> : <Plus size={10}/>}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open===i && (
                        <motion.div
                          initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                          transition={{duration:.28,ease:EV}} style={{overflow:"hidden"}}>
                          <p className="t-body" style={{ paddingBottom:22, paddingRight:42, fontSize:13 }}>{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.fq-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// FINAL CTA — intro geometry returns as ambient background
// ══════════════════════════════════════════════════════════════════
export function FinalCTA() {
  const { ref, vis } = useInView(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx    = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cx=canvas.width/2, cy=canvas.height/2;
      const RO=Math.min(canvas.width,canvas.height)*.36, RI=RO*.47;
      const a = 0.04;
      // Outer circle
      ctx.beginPath(); ctx.arc(cx,cy,RO,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,255,255,${a})`; ctx.lineWidth=0.8; ctx.setLineDash([]); ctx.stroke();
      // Inner dashed circle
      ctx.beginPath(); ctx.arc(cx,cy,RI,0,Math.PI*2);
      ctx.strokeStyle=`rgba(47,126,255,${a*1.6})`; ctx.lineWidth=0.7;
      ctx.setLineDash([6,14]); ctx.stroke(); ctx.setLineDash([]);
      // Crosshair
      ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(canvas.width,cy);
      ctx.strokeStyle=`rgba(255,255,255,${a*.7})`; ctx.lineWidth=0.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,canvas.height); ctx.stroke();
      // Compass lines
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+dx*RI*.54,cy+dy*RI*.54);
        ctx.strokeStyle=`rgba(47,126,255,${a*2})`; ctx.lineWidth=0.6; ctx.stroke();
      });
      // Center diamond
      const d=8;
      ctx.beginPath(); ctx.moveTo(cx,cy-d); ctx.lineTo(cx+d,cy); ctx.lineTo(cx,cy+d); ctx.lineTo(cx-d,cy); ctx.closePath();
      ctx.strokeStyle=`rgba(47,126,255,${a*3})`; ctx.lineWidth=1; ctx.stroke();
    };
    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section ref={ref as any} className="sect" style={{
      background:"var(--void)", position:"relative",
      minHeight:"70vh", display:"flex", alignItems:"center", overflow:"hidden",
    }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,var(--void) 0%,transparent 30%,transparent 70%,var(--void) 100%)",zIndex:1,pointerEvents:"none" }} />
      <div className="pad" style={{ position:"relative", zIndex:2, width:"100%", textAlign:"center" }}>
        <div className="cap">
          <motion.div
            initial={{ opacity:0, y:-40, scale:.94 }} animate={vis?{opacity:1,y:0,scale:1}:{}}
            transition={{ duration:1.15, ease:[0.16,1,0.3,1] }}
            style={{ overflow:"hidden", marginBottom:24 }}>
            <div style={{
              fontFamily:"var(--f-disp)", fontWeight:900, fontStyle:"italic",
              fontSize:"clamp(64px,10vw,152px)", lineHeight:.9,
              letterSpacing:"-.032em", color:"var(--t1)",
            }}>Ready?</div>
          </motion.div>

          <motion.div
            initial={{ scaleX:0 }} animate={vis?{scaleX:1}:{}} transition={{ delay:.4, duration:.36, ease:EV }}
            style={{ width:220, height:2, background:"var(--el)", margin:"0 auto 24px" }} />

          <motion.p initial={{opacity:0,y:14}} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:.35, ...{ duration:.85, ease:EV } }}
            className="t-body" style={{ maxWidth:380, margin:"0 auto 32px", fontSize:"clamp(13px,1.1vw,15px)" }}>
            One slot available this quarter. Let&apos;s talk before it&apos;s gone.
          </motion.p>

          <motion.div initial={{opacity:0,y:14}} animate={vis?{opacity:1,y:0}:{}} transition={{ delay:.48, duration:.7, ease:EV }}
            style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", marginBottom:32 }}>
            <a href="/contact" data-cursor="START" className="btn btn-el">Start a Project →</a>
            <a href="/work"    data-cursor="VIEW"  className="btn btn-ghost">See Our Work</a>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{ delay:.62, duration:.6 }}
            style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"7px 14px",
              border:"1px solid rgba(255,61,46,0.28)", background:"rgba(255,61,46,0.06)",
            }}>
            <div style={{ width:5,height:5,borderRadius:"50%",background:"var(--alert)",animation:"alertPulse 2.5s ease-in-out infinite" }} />
            <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--alert)" }}>
              {B.slots} SLOT AVAILABLE · Q2 2025
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
