"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Plus, Minus } from "lucide-react";
import { B } from "../../lib/brand";

// ─── Intersection hook ────────────────────────────────────────────
function useVis(threshold = 0.12) {
  const ref = useRef<any>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ─── CountUp ─────────────────────────────────────────────────────
function CountUp({ target, vis, suffix = "" }: { target: number; vis: boolean; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!vis) return;
    const dur = 2800, t0 = performance.now();
    let raf: number;
    const tick = () => {
      const t = Math.min((performance.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - t, 4);
      setN(Math.round(e * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vis, target]);
  return <>{n}{suffix}</>;
}

// ─── MARQUEE STRIP ────────────────────────────────────────────────
export function MarqueeStrip() {
  const items = ["WEBSITES","AI SYSTEMS","LOCAL SEO","BRAND IDENTITY","LEAD AUTOMATION","48-HR DELIVERY","VOICE AI","CONVERSION"];
  const doubled = [...items, ...items];
  return (
    <div id="marquee" style={{ borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", background: "rgba(201,168,124,0.025)", padding: "14px 0", overflow: "hidden" }}>
      <div className="mq-inner">
        {doubled.map((t, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--t3)", whiteSpace: "nowrap" }}>{t}</span>
            <span style={{ margin: "0 24px", color: "var(--gold)", opacity: 0.25, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MANIFESTO ────────────────────────────────────────────────────
export function Manifesto() {
  const { ref, vis } = useVis(0.2);
  const words = B.manifesto.statement.split(" ");
  return (
    <section ref={ref} className="sect" style={{ background: "var(--bg)" }}>
      <div className="wrap cap">
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(32px,5vw,80px)", alignItems: "start" }} className="manifesto-grid">
          {/* Side label */}
          <motion.div initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }} className="mob-hide">
            <div style={{ width: 1, height: 48, background: "var(--bd-hi)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--t3)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>PHILOSOPHY</span>
          </motion.div>

          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 28 }}>
              <span className="eyebrow">Our Belief</span>
            </motion.div>

            {/* Word-by-word reveal headline */}
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3.2vw,46px)", lineHeight: 1.12, letterSpacing: "-0.02em", marginBottom: 32 }}>
              {words.map((word, i) => (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                  <motion.span
                    initial={{ y: "105%", opacity: 0 }}
                    animate={vis ? { y: "0%", opacity: 1 } : {}}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.75, ease: [0.16,1,0.3,1] }}
                    style={{ display: "inline-block", color: "var(--t1)" }}
                  >{word}</motion.span>
                  {i < words.length - 1 && <span style={{ display: "inline-block", width: "0.25em" }} />}
                </span>
              ))}
            </h2>

            <motion.p initial={{ opacity: 0, y: 18 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55, duration: 0.8 }}
              className="t-body" style={{ maxWidth: 540, borderLeft: "1px solid rgba(201,168,124,0.15)", paddingLeft: 20, marginBottom: 48, fontSize: "clamp(13px,1.05vw,15px)" }}>
              {B.manifesto.body}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 40, paddingTop: 32, borderTop: "1px solid var(--bd)" }}>
              {[{ v: `${B.stats.clients}+`, l: "Clients Served" }, { v: `${B.stats.satisfaction}%`, l: "Satisfaction" }, { v: "48hr", l: "Avg. Launch" }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1, color: "var(--t1)", marginBottom: 5 }}>{s.v}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--t3)" }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.manifesto-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ─── KINETIC BAND ─────────────────────────────────────────────────
export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const frac = (rect.top + rect.height / 2) / window.innerHeight;
      setOffsetX((frac - 0.5) * -12);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const rows = [
    { t: "THE WEBSITE YOUR WORK DESERVES ·", solid: true },
    { t: "AI  ·  AUTOMATION  ·  SEO  ·  DESIGN  ·  GROWTH ·", solid: false },
    { t: "BUILD FAST. LAUNCH SMART. DOMINATE. ·", solid: true },
  ];
  return (
    <div ref={ref} style={{ overflow: "hidden", padding: "clamp(50px,7vw,90px) 0", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", background: "var(--s1)", position: "relative" }}>
      {["left","right"].map(s => (
        <div key={s} style={{ position: "absolute", top: 0, bottom: 0, [s]: 0, width: "10%", background: `linear-gradient(to ${s==="left"?"right":"left"},var(--s1),transparent)`, zIndex: 2, pointerEvents: "none" }} />
      ))}
      {rows.map((row, i) => (
        <div key={i} style={{ transform: `translateX(${offsetX * (i === 1 ? -1 : 1)}%)`, transition: "transform 0.1s linear", display: "block", marginBottom: i < 2 ? 4 : 0 }}>
          <span style={{
            fontFamily: "var(--serif)", fontWeight: 700, whiteSpace: "nowrap",
            fontSize: "clamp(38px,6.5vw,96px)", lineHeight: 0.95, letterSpacing: "-0.02em", display: "block",
            color: row.solid ? "var(--t1)" : "transparent",
            WebkitTextStroke: row.solid ? undefined : "1px rgba(201,168,124,0.12)",
          }}>{row.t + row.t}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────
function ServiceCard({ s, i, vis }: { s: typeof B.services[0]; i: number; vis: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ x: (cy - 0.5) * -10, y: (cx - 0.5) * 10, mx: cx * 100, my: cy * 100 });
    cardRef.current.style.setProperty("--mx", `${cx * 100}%`);
    cardRef.current.style.setProperty("--my", `${cy * 100}%`);
  };
  const onLeave = () => { setTilt({ x: 0, y: 0, mx: 50, my: 50 }); };

  return (
    <motion.div initial={{ opacity: 0, y: 44, rotateX: -12 }} animate={vis ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.85, ease: [0.16,1,0.3,1] }}>
      <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} className="card"
        style={{ padding: "clamp(28px,3vw,40px)", height: "100%", transition: "border-color 0.3s ease", transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: "preserve-3d", cursor: "none" }} data-cursor="">
        {/* Ghost number */}
        <div style={{ position: "absolute", top: 18, right: 22, fontFamily: "var(--serif)", fontWeight: 700, fontSize: 72, lineHeight: 1, color: "rgba(201,168,124,0.04)", letterSpacing: "-0.04em" }}>{s.n}</div>
        {/* Spotlight */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(201,168,124,0.05), transparent 55%)`, pointerEvents: "none", transition: "opacity 0.3s" }} />
        <div style={{ fontSize: 20, marginBottom: 20 }}>{s.icon}</div>
        <h3 className="t-md" style={{ color: "var(--t1)", marginBottom: 10 }}>{s.title}</h3>
        <p className="t-body" style={{ marginBottom: 18, fontSize: 13 }}>{s.sub}</p>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 500, letterSpacing: "0.1em", color: "var(--gold)", marginBottom: 18 }}>{s.price}</div>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "none", display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t3)", padding: 0 }} data-cursor="">
          {open ? "Hide" : "Deliverables"}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.28 }}>▾</motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16,1,0.3,1] }}
              style={{ overflow: "hidden", paddingTop: 16, marginTop: 16, borderTop: "1px solid var(--bd)", display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
              {s.deliverables.map((d, j) => (
                <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 12, color: "var(--t2)", fontWeight: 300 }}>
                  <Check size={10} style={{ color: "var(--gold)", flexShrink: 0 }} />{d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(201,168,124,0.2),transparent)`, opacity: tilt.y !== 0 ? 1 : 0, transition: "opacity 0.3s" }} />
      </div>
    </motion.div>
  );
}

export function Services() {
  const { ref, vis } = useVis(0.1);
  return (
    <section ref={ref} id="services" className="sect" style={{ background: "var(--s1)" }}>
      <div className="wrap cap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 56 }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
              <span className="eyebrow">What We Build</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.75 }} className="t-lg" style={{ color: "var(--t1)" }}>
              Four systems.<br />One machine.
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="t-body" style={{ maxWidth: 300 }}>
            We don't sell services separately. Each component amplifies the others.
          </motion.p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 2 }}>
          {B.services.map((s, i) => <ServiceCard key={s.n} s={s} i={i} vis={vis} />)}
        </div>
      </div>
    </section>
  );
}

// ─── WORK / HORIZONTAL SCROLL ─────────────────────────────────────
function WorkCard({ w, i }: { w: typeof B.work[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -7, y: ((e.clientX - r.left) / r.width - 0.5) * 7 });
  };

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }} onMouseMove={onMove}
      style={{ width: "clamp(280px,26vw,360px)", height: 460, flexShrink: 0, position: "relative", overflow: "hidden", background: w.color, border: `1px solid ${hov ? w.accent + "44" : "var(--bd)"}`, transition: "border-color 0.3s", transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov ? 1.02 : 1})`, transformStyle: "preserve-3d", cursor: "none" }} data-cursor="VIEW">

      {/* Pattern overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${w.accent}08 1px,transparent 1px),linear-gradient(90deg,${w.accent}08 1px,transparent 1px)`, backgroundSize: "36px 36px", opacity: hov ? 0.7 : 0.25, transition: "opacity 0.4s" }} />

      {/* Color gradient */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${w.color} 0%, ${w.accent}18 100%)`, opacity: hov ? 0.8 : 0.4, transition: "opacity 0.4s" }} />

      {/* Static content */}
      <div style={{ position: "absolute", inset: 0, padding: "22px 20px", display: "flex", flexDirection: "column" }}>
        {/* Browser chrome sim */}
        <div style={{ height: 22, background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 8, gap: 4, flexShrink: 0, marginBottom: 16 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c,j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: c, opacity: 0.5 }} />)}
        </div>
        {/* Project title */}
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: w.accent, opacity: 0.7, marginBottom: 6 }}>{w.tier}</div>
        <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(18px,2.2vw,26px)", color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em", lineHeight: 1.1, flex: 1 }}>{w.title}</div>
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {hov && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
            style={{ position: "absolute", inset: 0, background: "rgba(12,11,11,0.9)", padding: "24px 22px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: w.accent, marginBottom: 8 }}>{w.cat} · {w.year}</div>
            <h3 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 20, color: "var(--t1)", letterSpacing: "-0.02em", marginBottom: 10 }}>{w.title}</h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, lineHeight: 1.65, color: "var(--t2)", fontWeight: 300 }}>{w.story}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom label when not hovered */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7),transparent)", padding: "18px 20px 16px", opacity: hov ? 0 : 1, transition: "opacity 0.28s" }}>
        <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,0.8)" }}>{w.title}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{w.cat}</div>
      </div>
    </div>
  );
}

export function Work() {
  const { ref, vis } = useVis(0.1);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let dragging = false, startX = 0, scrollX = 0;
    const down = (e: MouseEvent) => { dragging = true; startX = e.pageX; scrollX = track.scrollLeft; track.style.cursor = "grabbing"; };
    const move = (e: MouseEvent) => { if (!dragging) return; e.preventDefault(); track.scrollLeft = scrollX - (e.pageX - startX); };
    const up = () => { dragging = false; track.style.cursor = "grab"; };
    track.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { track.removeEventListener("mousedown", down); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  return (
    <section ref={ref} id="work" className="sect" style={{ background: "var(--bg)", overflow: "hidden" }}>
      <div className="wrap cap" style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
              <span className="eyebrow">Case Studies</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)" }}>
              Real clients.<br />Real results.
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="t-body" style={{ maxWidth: 280 }}>
            Drag to explore. Hover cards for project detail.
          </motion.p>
        </div>
      </div>
      <div ref={trackRef} style={{ overflowX: "auto", overflowY: "visible", padding: "0 clamp(20px,4vw,64px) 40px", scrollbarWidth: "none", cursor: "grab" }}>
        <div style={{ display: "flex", gap: 2, width: "max-content" }}>
          {B.work.map((w, i) => (
            <motion.div key={w.slug} initial={{ opacity: 0, x: 40 }} animate={vis ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16,1,0.3,1] }}>
              <WorkCard w={w} i={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAND ───────────────────────────────────────────────────
export function Stats() {
  const { ref, vis } = useVis(0.3);
  const stats = [
    { val: B.stats.clients, suf: "+", label: "Clients Served", sub: "Growing every month" },
    { val: B.stats.satisfaction, suf: "%", label: "Satisfaction Rate", sub: "Across all accounts" },
    { val: 48, suf: "hr", label: "Average Launch", sub: "From deposit to live" },
    { val: B.stats.roi, suf: "%", label: "Average ROI", sub: "Year one, client-reported" },
  ];
  return (
    <div ref={ref} style={{ borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", background: "var(--s1)" }}>
      <div className="wrap cap">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16,1,0.3,1] }}
              style={{ padding: "44px 0", borderRight: i < stats.length - 1 ? "1px solid var(--bd)" : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(38px,5.5vw,70px)", lineHeight: 0.95, letterSpacing: "-0.03em", background: "linear-gradient(135deg, var(--t1) 30%, rgba(201,168,124,0.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 10 }}>
                <CountUp target={s.val} vis={vis} suffix={s.suf} />
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--t2)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────
export function Process() {
  const { ref, vis } = useVis(0.1);
  const [active, setActive] = useState(0);
  const step = B.process[active];
  return (
    <section ref={ref} id="process" className="sect" style={{ background: "var(--bg)" }}>
      <div className="wrap cap">
        <div style={{ marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
            <span className="eyebrow">How We Work</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)" }}>
            Zero to live.<br />Five steps.
          </motion.h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="proc-grid">
          {/* Steps list */}
          <div>
            {B.process.map((p, i) => (
              <motion.button key={p.n} initial={{ opacity: 0, x: -24 }} animate={vis ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.07, duration: 0.6 }}
                onClick={() => setActive(i)}
                style={{ width: "100%", border: "none", cursor: "none", padding: "20px 22px", textAlign: "left", borderLeft: `2px solid ${active === i ? "var(--gold)" : "var(--bd)"}`, marginBottom: 3, background: active === i ? "rgba(201,168,124,0.03)" : "transparent", transition: "all 0.3s ease" } as any} data-cursor="">
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 34, lineHeight: 1, color: active === i ? "rgba(201,168,124,0.18)" : "rgba(255,240,215,0.04)", transition: "color 0.3s", minWidth: 48 }}>{p.n}</span>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: active === i ? "var(--gold)" : "var(--t3)", marginBottom: 3, transition: "color 0.3s" }}>{p.label}</div>
                    <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 16, color: active === i ? "var(--t1)" : "var(--t2)", transition: "color 0.3s" }}>{p.title}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: active === i ? "var(--gold)" : "var(--t3)", transition: "color 0.3s" }}>→</span>
                </div>
              </motion.button>
            ))}
            <div style={{ display: "flex", gap: 5, marginTop: 14 }}>
              {B.process.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: active === i ? 22 : 5, height: 2, background: active === i ? "var(--gold)" : "var(--bd-hi)", border: "none", cursor: "none", borderRadius: 1, transition: "all 0.28s ease" }} />
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ position: "sticky", top: 88 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 20, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.38, ease: [0.16,1,0.3,1] }}
                className="card" style={{ padding: "clamp(28px,3vw,38px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid var(--bd)" }}>
                  <div>
                    <span className="eyebrow" style={{ display: "flex", marginBottom: 8, fontSize: 8 }}>{step.label}</span>
                    <h3 className="t-md" style={{ color: "var(--t1)" }}>{step.title}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "rgba(201,168,124,0.07)", border: "1px solid rgba(201,168,124,0.18)", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em", color: "var(--gold)" }}>{step.time}</span>
                  </div>
                </div>
                <p className="t-body" style={{ marginBottom: 24, fontSize: 13 }}>{step.body}</p>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 10 }}>What happens</div>
                {step.what.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--bd)", fontFamily: "var(--sans)", fontSize: 12, color: "var(--t2)", fontWeight: 300 }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(201,168,124,0.07)", border: "1px solid rgba(201,168,124,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--mono)", fontSize: 7, color: "var(--gold)" }}>{i + 1}</span>
                    {item}
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
                  {[{ l: "Your role", t: step.you }, { l: "Our role", t: step.us }].map((r, i) => (
                    <div key={i} style={{ padding: "12px 14px", background: "rgba(255,240,215,0.018)", border: "1px solid var(--bd)" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 6 }}>{r.l}</div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: 11, lineHeight: 1.6, color: "var(--t2)", fontWeight: 300 }}>{r.t}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.proc-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────
export function Pricing() {
  const { ref, vis } = useVis(0.05);
  const go = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section ref={ref} id="pricing" className="sect" style={{ background: "var(--s1)" }}>
      <div className="wrap cap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <span className="eyebrow">Pricing</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)" }}>
            Transparent.<br />No surprises.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="t-body" style={{ maxWidth: 420, margin: "16px auto 0" }}>
            All tiers include 48-hour delivery and month-to-month contracts.
          </motion.p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(235px,1fr))", gap: 2, alignItems: "stretch" }}>
          {B.pricing.map((tier, i) => (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 44 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.09, duration: 0.75, ease: [0.16,1,0.3,1] }}
              style={{ position: "relative" }}>
              {tier.badge && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", background: tier.hi ? "var(--gold)" : "rgba(201,168,124,0.7)", fontFamily: "var(--mono)", fontSize: 8, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: tier.hi ? "var(--bg)" : "var(--bg)", whiteSpace: "nowrap", zIndex: 2 }}>{tier.badge}</div>
              )}
              <div style={{ background: tier.hi ? "var(--s2)" : "var(--s1)", border: `1px solid ${tier.hi ? "rgba(201,168,124,0.28)" : "var(--bd)"}`, boxShadow: tier.hi ? "0 0 48px rgba(201,168,124,0.05)" : "none", padding: "clamp(28px,3vw,38px) clamp(22px,2.5vw,30px)", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: tier.hi ? "var(--gold)" : "var(--t3)", marginBottom: 10 }}>{tier.name}</div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "var(--t1)", letterSpacing: "-0.03em" }}>{tier.setup}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--t3)", marginLeft: 5, fontWeight: 300 }}>setup</span>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", marginBottom: 14, opacity: 0.8 }}>+ {tier.mo}</div>
                <p className="t-body" style={{ fontSize: 12, marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid var(--bd)" }}>{tier.desc}</p>
                <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, listStyle: "none" }}>
                  {tier.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.5, color: f.startsWith("Everything") ? "var(--t3)" : "var(--t2)", fontWeight: 300, fontStyle: f.startsWith("Everything") ? "italic" : "normal" }}>
                      <Check size={10} style={{ color: tier.hi ? "var(--gold)" : "var(--t3)", flexShrink: 0, marginTop: 3 }} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={go} className={`btn ${tier.hi ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center", fontSize: 9 }} data-cursor="">
                  {tier.name === "Bespoke" ? "Let's Talk" : "Start a Project"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="t-body" style={{ textAlign: "center", marginTop: 28, fontSize: 11 }}>
          50% deposit to begin · 50% at launch · cancel anytime after 3 months · {" "}
          <button onClick={go} style={{ background: "none", border: "none", cursor: "none", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: 11, fontWeight: 300, textDecoration: "underline" }} data-cursor="">Need custom pricing? Let's talk.</button>
        </motion.p>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────
export function Testimonials() {
  const { ref, vis } = useVis(0.1);
  const rots = [-2.2, 1.8, -1.4];
  return (
    <section ref={ref} id="testimonials" className="sect" style={{ background: "var(--bg)" }}>
      <div className="wrap cap">
        <div style={{ marginBottom: 56, maxWidth: 520 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
            <span className="eyebrow">Social Proof</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)" }}>
            Don't take<br />our word for it.
          </motion.h2>
        </div>

        {/* Angled cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 24 }} className="testi-grid">
          {B.testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 55, rotate: rots[i] * 2 }} animate={vis ? { opacity: 1, y: 0, rotate: rots[i] } : {}} transition={{ delay: i * 0.12, duration: 0.9, ease: [0.16,1,0.3,1] }}
              whileHover={{ rotate: 0, y: -7, transition: { duration: 0.38 } }}
              className="card" style={{ padding: "clamp(22px,2.5vw,32px)", cursor: "none" }} data-cursor="">
              <div style={{ position: "absolute", top: 22, right: 22, fontFamily: "var(--serif)", fontSize: 56, lineHeight: 1, color: "rgba(201,168,124,0.06)" }}>"</div>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={10} fill="var(--gold)" style={{ color: "var(--gold)" }} />)}
              </div>
              <blockquote style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 13, lineHeight: 1.8, color: "var(--t2)", marginBottom: 22, fontStyle: "italic" }}>"{t.quote}"</blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(201,168,124,0.08)", border: "1px solid rgba(201,168,124,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontWeight: 700, fontSize: 10, color: "var(--gold)" }}>{t.init}</div>
                <div>
                  <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 13, color: "var(--t1)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.1em", color: "var(--t3)" }}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured quote — editorial */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45, duration: 0.85 }}
          className="card" style={{ padding: "clamp(30px,4vw,52px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "clamp(30px,4vw,52px)", top: 36, fontFamily: "var(--serif)", fontWeight: 700, fontSize: 120, lineHeight: 1, color: "rgba(201,168,124,0.035)" }}>"</div>
          <div style={{ display: "flex", gap: 3, marginBottom: 22 }}>
            {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={13} fill="var(--gold)" style={{ color: "var(--gold)" }} />)}
          </div>
          <blockquote style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: "clamp(17px,2vw,24px)", lineHeight: 1.45, letterSpacing: "-0.015em", color: "var(--t1)", maxWidth: 820, marginBottom: 28 }}>
            "{B.featured.quote}"
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,rgba(201,168,124,0.12),rgba(201,168,124,0.04))", border: "1px solid rgba(201,168,124,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontWeight: 700, fontSize: 12, color: "var(--gold)" }}>{B.featured.init}</div>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 14, color: "var(--t1)" }}>{B.featured.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.1em", color: "var(--t3)" }}>{B.featured.project}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:860px){.testi-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────
export function FAQ() {
  const { ref, vis } = useVis(0.05);
  const [open, setOpen] = useState<number | null>(0);
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(B.faq.map(f => f.cat)))];
  const filtered = cat === "All" ? B.faq : B.faq.filter(f => f.cat === cat);
  return (
    <section ref={ref} id="faq" className="sect" style={{ background: "var(--s1)" }}>
      <div className="wrap cap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(40px,6vw,80px)", alignItems: "start" }} className="faq-grid">
          <div style={{ position: "sticky", top: 88 }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
              <span className="eyebrow">FAQ</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)", fontSize: "clamp(26px,3.5vw,48px)", marginBottom: 20 }}>
              Questions<br />we get<br />a lot.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="t-body" style={{ marginBottom: 28, fontSize: 13 }}>
              Still have questions? Book a free 15-minute call.
            </motion.p>
            <motion.button initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-gold" style={{ fontSize: 9, marginBottom: 32 }} data-cursor="">
              Book Free Call →
            </motion.button>
            <motion.div initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.35 }} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cats.map(c => (
                <button key={c} onClick={() => { setCat(c); setOpen(null); }}
                  style={{ background: "none", border: "none", cursor: "none", padding: "9px 0", borderBottom: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: cat === c ? "var(--gold)" : "var(--t3)", fontWeight: cat === c ? 500 : 400, transition: "color 0.2s", textAlign: "left" }} data-cursor="">
                  {c}
                  {cat === c && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)" }} />}
                </button>
              ))}
            </motion.div>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
                {filtered.map((item, i) => (
                  <motion.div key={item.q} initial={{ opacity: 0, y: 10 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid var(--bd)" }}>
                    <button onClick={() => setOpen(open === i ? null : i)}
                      style={{ width: "100%", background: "none", border: "none", cursor: "none", padding: "20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, textAlign: "left" }} data-cursor="">
                      <span style={{ fontFamily: "var(--serif)", fontWeight: open === i ? 600 : 400, fontSize: "clamp(14px,1.35vw,16px)", lineHeight: 1.45, color: open === i ? "var(--t1)" : "var(--t2)", transition: "color 0.2s, font-weight 0.2s" }}>{item.q}</span>
                      <span style={{ width: 24, height: 24, flexShrink: 0, border: `1px solid ${open === i ? "rgba(201,168,124,0.28)" : "var(--bd)"}`, background: open === i ? "rgba(201,168,124,0.06)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: open === i ? "var(--gold)" : "var(--t3)", transition: "all 0.22s", marginTop: 2 }}>
                        {open === i ? <Minus size={10} /> : <Plus size={10} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16,1,0.3,1] }} style={{ overflow: "hidden" }}>
                          <p className="t-body" style={{ paddingBottom: 22, paddingRight: 42, fontSize: 13 }}>{item.a}</p>
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
      <style>{`@media(max-width:900px){.faq-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
