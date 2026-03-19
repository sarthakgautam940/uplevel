"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Phone, Mail, User, Building2, MessageSquare, X } from "lucide-react";
import { B } from "../../lib/brand";

// ─── CONTACT ──────────────────────────────────────────────────────
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [data, setData] = useState({ name:"",business:"",email:"",phone:"",service:"",message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));
  const svcs = ["Website System","AI Concierge","SEO & Growth","Brand Identity","Full Package","Not sure"];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false); setSent(true);
  };

  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    width: "100%", background: "rgba(255,240,215,0.02)", border: "none",
    borderBottom: "1px solid var(--bd-hi)", padding: "12px 0 12px 36px",
    fontFamily: "var(--sans)", fontSize: 13, color: "var(--t1)", outline: "none",
    transition: "border-color 0.25s ease", fontWeight: 300, ...extra,
  });

  return (
    <section ref={ref} id="contact" className="sect" style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Decorative large text bg */}
      <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(100px,22vw,280px)", color: "rgba(201,168,124,0.018)", letterSpacing: "-0.03em", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} className="mob-hide">
        START
      </div>

      <div className="wrap cap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }} className="contact-grid">

          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={vis ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: 20 }}>
              <span className="eyebrow">Get Started</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="t-lg" style={{ color: "var(--t1)", marginBottom: 20 }}>
              Let's build your<br />system.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="t-body" style={{ marginBottom: 40, fontSize: 14 }}>
              Fill out the form or book a free 15-minute call. We'll show you exactly what your system will look like — no commitment required.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
              {[{ icon: <Phone size={12}/>, t: "Response within 24 hours — usually same day" },
                { icon: <Mail size={12}/>, t: "No pressure, no pitch — just answers" },
                { icon: <CheckCircle size={12}/>, t: "Free site audit included with every call" }].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 2, background: "rgba(201,168,124,0.07)", border: "1px solid rgba(201,168,124,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>{p.icon}</span>
                  <span className="t-body" style={{ fontSize: 13 }}>{p.t}</span>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={vis ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", border: "1px solid rgba(201,168,124,0.14)", background: "rgba(201,168,124,0.03)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", animation: "badge-pulse 2.5s ease-in-out infinite" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
                {B.slots} CLIENT SLOT AVAILABLE · {B.quarter}
              </span>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 28 }} animate={vis ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.22, duration: 0.8, ease: [0.16,1,0.3,1] }}>
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -18 }}
                  className="card" style={{ padding: "clamp(28px,3.5vw,42px)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {[{ k:"name", p:"Your name", icon:<User size={11}/> }, { k:"business", p:"Business name", icon:<Building2 size={11}/> }].map(f => (
                      <div key={f.k} style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--t3)", pointerEvents: "none" }}>{f.icon}</span>
                        <input type="text" placeholder={f.p} value={data[f.k as keyof typeof data]}
                          onChange={e => upd(f.k as keyof typeof data, e.target.value)}
                          style={inp()} onFocus={e => e.target.style.borderColor = "rgba(201,168,124,0.35)"} onBlur={e => e.target.style.borderColor = "var(--bd-hi)"} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {[{ k:"email", p:"Email", t:"email", icon:<Mail size={11}/> }, { k:"phone", p:"Phone (optional)", t:"tel", icon:<Phone size={11}/> }].map(f => (
                      <div key={f.k} style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--t3)", pointerEvents: "none" }}>{f.icon}</span>
                        <input type={f.t} placeholder={f.p} value={data[f.k as keyof typeof data]}
                          onChange={e => upd(f.k as keyof typeof data, e.target.value)}
                          style={inp()} onFocus={e => e.target.style.borderColor = "rgba(201,168,124,0.35)"} onBlur={e => e.target.style.borderColor = "var(--bd-hi)"} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 8 }}>I need help with...</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {svcs.map(s => (
                        <button key={s} type="button" onClick={() => upd("service", s)} data-cursor=""
                          style={{ background: data.service === s ? "rgba(201,168,124,0.08)" : "transparent", border: `1px solid ${data.service === s ? "rgba(201,168,124,0.28)" : "var(--bd)"}`, padding: "6px 10px", cursor: "none", fontFamily: "var(--sans)", fontSize: 11, color: data.service === s ? "var(--gold)" : "var(--t3)", fontWeight: 300, transition: "all 0.2s" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ position: "relative", marginBottom: 18 }}>
                    <textarea placeholder="Tell us about your business and goals..." value={data.message} onChange={e => upd("message", e.target.value)} rows={3}
                      style={{ ...inp({ paddingLeft: 0, resize: "none", display: "block" }) }}
                      onFocus={e => e.target.style.borderColor = "rgba(201,168,124,0.35)"} onBlur={e => e.target.style.borderColor = "var(--bd-hi)"} />
                  </div>
                  <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: "100%", justifyContent: "center", fontSize: 9 }} data-cursor="">
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: 16, fontFamily: "var(--sans)", fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>
                    Or:{" "}
                    <a href={B.calendly} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "underline" }}>
                      Schedule 15-min call →
                    </a>
                  </div>
                </motion.form>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.34,1.56,0.64,1] }}
                  className="card" style={{ padding: "56px 40px", textAlign: "center", borderColor: "rgba(201,168,124,0.22)", boxShadow: "0 0 40px rgba(201,168,124,0.05)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(201,168,124,0.08)", border: "1px solid rgba(201,168,124,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--gold)" }}>
                    <CheckCircle size={20} />
                  </div>
                  <h3 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 24, color: "var(--t1)", marginBottom: 10, letterSpacing: "-0.02em" }}>Message received.</h3>
                  <p className="t-body" style={{ fontSize: 13 }}>We'll be in touch within 24 hours — usually much faster.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.contact-grid{grid-template-columns:1fr!important;}}
        input::placeholder,textarea::placeholder{color:var(--t3);}
      `}</style>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────
export function Footer() {
  const yr = new Date().getFullYear();
  const cols = {
    Services: ["Website Systems","AI Phone Concierge","SEO & Growth","Brand Identity"],
    Company: ["About","Process","Pricing","Case Studies"],
    Legal: ["Privacy Policy","Terms","Refund Policy"],
  };

  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--bd)", padding: "clamp(48px,7vw,80px) clamp(20px,4vw,64px) 28px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Footer 3D animated wordmark */}
        <div style={{ paddingBottom: "clamp(40px,6vw,60px)", marginBottom: "clamp(40px,6vw,60px)", borderBottom: "1px solid var(--bd)", overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(52px,10vw,130px)", lineHeight: 0.85, letterSpacing: "-0.03em", color: "transparent", WebkitTextStroke: "1px rgba(201,168,124,0.12)", userSelect: "none", animation: "footerPulse 8s ease-in-out infinite" }}>
            UPLEVEL
          </div>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(52px,10vw,130px)", lineHeight: 0.85, letterSpacing: "-0.03em", color: "transparent", WebkitTextStroke: "1px rgba(201,168,124,0.06)", userSelect: "none", marginTop: -"clamp(52px,10vw,130px)" as any, transform: "translateX(15%)", animation: "footerPulse 8s ease-in-out infinite 2s" }}>
            SERVICES
          </div>
        </div>

        {/* Links grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--bd)" }} className="footer-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 16, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--t1)" }}>
                UP<span style={{ color: "var(--gold)" }}>LEVEL</span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--t3)", marginTop: 3 }}>SERVICES</div>
            </div>
            <p className="t-body" style={{ maxWidth: 260, marginBottom: 20, fontSize: 12 }}>Premium website systems, AI automation, and growth infrastructure for elite contractors.</p>
            <a href={`mailto:${B.email}`} style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--t3)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--t3)"}
            >{B.email}</a>
          </div>
          {Object.entries(cols).map(([h, links]) => (
            <div key={h}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 7, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 16 }}>{h}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => (
                  <li key={l}><a href="#" style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--t3)", textDecoration: "none", fontWeight: 300, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--t1)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--t3)"}
                  >{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em", color: "var(--t3)" }}>© {yr} UPLEVEL SERVICES LLC · VIRGINIA LLC</span>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: 0.5 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t3)" }}>{B.slots} SLOT AVAILABLE</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important;}}
        @keyframes footerPulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
      `}</style>
    </footer>
  );
}

// ─── AI WIDGET ────────────────────────────────────────────────────
const QR = ["What does it cost?","How fast can you launch?","What do you offer?","Do you work with HVAC?"];
const RESP: Record<string,string> = {
  cost:"Starter from $3,500 + $297/mo. Authority (most popular): $6,500 + $497/mo. All month-to-month, no lock-in.",
  fast:"Most builds go live within 48 hours of your intake form and deposit. Our record is 29 hours.",
  offer:"We build four systems: Website Systems, AI Phone Concierge (24/7), SEO & Local Growth, and Brand Identity. Usually sold as bundles.",
  hvac:"Absolutely — HVAC is a top vertical. Storm/emergency landing pages, AI that qualifies urgent calls, review automation. Let's talk.",
  default:"Great question — I'd love to get you a proper answer on a free 15-minute discovery call. Want to book one?",
};
const getR = (m: string) => {
  const ml = m.toLowerCase();
  if (ml.match(/cost|price|how much/)) return RESP.cost;
  if (ml.match(/fast|quick|launch|hours|48/)) return RESP.fast;
  if (ml.match(/service|offer|build|what do/)) return RESP.offer;
  if (ml.match(/hvac|roof|plumb|contrac/)) return RESP.hvac;
  return RESP.default;
};
type Msg = { role:"ai"|"user"; text:string };

export function AIWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role:"ai", text:"Hey — I'm Aria, UpLevel's AI. I can answer questions about our services, pricing, and process. What would you like to know?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput(""); setTyping(true);
    await new Promise(r => setTimeout(r, 750 + Math.random() * 500));
    setTyping(false);
    setMsgs(m => [...m, { role: "ai", text: getR(text) }]);
  };

  return (
    <>
      <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.8, duration: 0.5, ease: [0.34,1.56,0.64,1] }}
        onClick={() => setOpen(true)}
        style={{ position: "fixed", bottom: 22, right: 22, zIndex: 400, width: 46, height: 46, borderRadius: "50%", background: "var(--bg)", border: "1px solid rgba(201,168,124,0.28)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", color: "var(--gold)", boxShadow: "0 0 24px rgba(201,168,124,0.08)", animation: "widgetPulse 3.5s ease-in-out infinite" }}
        data-cursor="CHAT" aria-label="Chat with Aria">
        <MessageSquare size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 14 }} transition={{ duration: 0.38, ease: [0.16,1,0.3,1] }}
            style={{ position: "fixed", bottom: 76, right: 22, zIndex: 400, width: "min(350px,calc(100vw-32px))", background: "var(--s1)", border: "1px solid var(--bd-hi)", boxShadow: "0 24px 80px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", maxHeight: "66vh" }}>
            {/* Header */}
            <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--bd)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(201,168,124,0.1)", border: "1px solid rgba(201,168,124,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: 9, fontWeight: 700, color: "var(--gold)" }}>AI</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 12, color: "var(--t1)" }}>ARIA</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: 0.7 }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.1em", color: "var(--t3)" }}>UpLevel AI · Online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "none", color: "var(--t3)", padding: 4 }} data-cursor=""><X size={13} /></button>
            </div>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 11, scrollbarWidth: "none" }}>
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "83%", padding: "9px 13px", background: m.role === "user" ? "var(--gold)" : "rgba(255,240,215,0.035)", border: m.role === "user" ? "none" : "1px solid var(--bd)", fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.65, color: m.role === "user" ? "var(--bg)" : "var(--t2)", fontWeight: m.role === "user" ? 400 : 300, borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px" }}>{m.text}</div>
                </motion.div>
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 4, padding: "9px 13px", alignSelf: "flex-start" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", opacity: 0.4, animation: `typingDot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
              )}
              <div ref={endRef} />
            </div>
            {msgs.length === 1 && (
              <div style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {QR.map(q => (
                  <button key={q} onClick={() => send(q)} data-cursor="" style={{ background: "none", border: "1px solid var(--bd)", padding: "4px 9px", fontFamily: "var(--sans)", fontSize: 10, color: "var(--t3)", cursor: "none", borderRadius: 18, transition: "all 0.2s", fontWeight: 300 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,124,0.28)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bd)"; (e.currentTarget as HTMLElement).style.color = "var(--t3)"; }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--bd)", display: "flex", gap: 7, flexShrink: 0 }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask anything..."
                style={{ flex: 1, background: "rgba(255,240,215,0.025)", border: "1px solid var(--bd)", padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 12, color: "var(--t1)", outline: "none", borderRadius: 18, fontWeight: 300 }} />
              <button onClick={() => send(input)} data-cursor="" style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--gold)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", color: "var(--bg)", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes widgetPulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,124,0.3),0 0 24px rgba(201,168,124,0.08);}50%{box-shadow:0 0 0 8px rgba(201,168,124,0),0 0 24px rgba(201,168,124,0.08);}}
        @keyframes typingDot{0%,100%{transform:translateY(0);opacity:0.4;}50%{transform:translateY(-4px);opacity:1;}}
      `}</style>
    </>
  );
}
