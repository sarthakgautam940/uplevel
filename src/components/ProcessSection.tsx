"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { Clock, User, Zap } from "lucide-react";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [vis, setVis] = useState(false);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);}},{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  const step = brand.process[active];

  return (
    <section ref={ref} id="process" className="section" style={{background:"var(--s1)"}}>
      <div className="wrap max">
        {/* Header */}
        <div style={{marginBottom:64}}>
          <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
            className="eyebrow" style={{display:"flex",marginBottom:20}}>How We Work</motion.span>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
            className="h-lg" style={{color:"#fff"}}>Zero to live<br/>in 5 steps.</motion.h2>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}
          className="process-grid">

          {/* Step list */}
          <div>
            {brand.process.map((s,i)=>(
              <motion.button
                key={s.step}
                initial={{opacity:0,x:-30}} animate={vis?{opacity:1,x:0}:{}}
                transition={{delay:i*0.07,duration:0.6}}
                onClick={()=>setActive(i)}
                style={{
                  width:"100%",border:"none",cursor:"none",
                  padding:"22px 24px",textAlign:"left",
                  borderLeft:`2px solid ${active===i?"var(--accent)":"var(--border)"}`,
                  marginBottom:3,
                  background: active===i?"rgba(0,229,255,0.03)":"transparent",
                  transition:"all 0.3s ease",
                } as React.CSSProperties}
                data-cursor=""
              >
                <div style={{display:"flex",alignItems:"center",gap:18}}>
                  <span style={{
                    fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,lineHeight:1,
                    letterSpacing:"-0.04em",minWidth:52,
                    color: active===i?"rgba(0,229,255,0.18)":"rgba(255,255,255,0.04)",
                    transition:"color 0.3s",
                  }}>{s.step}</span>
                  <div>
                    <div className="mono" style={{
                      fontSize:8,
                      color:active===i?"var(--accent)":"#2a2a2a",
                      marginBottom:4,transition:"color 0.3s",
                    }}>{s.label}</div>
                    <div style={{
                      fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,
                      color:active===i?"#fff":"#444",transition:"color 0.3s",
                    }}>{s.title}</div>
                  </div>
                  <div style={{marginLeft:"auto",color:active===i?"var(--accent)":"#2a2a2a",transition:"color 0.3s"}}>→</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{position:"sticky",top:100}}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{opacity:0,x:24,y:8}} animate={{opacity:1,x:0,y:0}}
                exit={{opacity:0,x:-16}} transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
                style={{background:"var(--s2)",border:"1px solid var(--border)",padding:"38px 34px"}}
              >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                  marginBottom:24,paddingBottom:24,borderBottom:"1px solid var(--border)"}}>
                  <div>
                    <span className="eyebrow" style={{display:"flex",marginBottom:10,fontSize:8}}>{step.label}</span>
                    <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:24,
                      color:"#fff",letterSpacing:"-0.02em"}}>{step.title}</h3>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,
                    padding:"6px 12px",background:"rgba(255,69,0,0.08)",border:"1px solid rgba(255,69,0,0.2)",
                    flexShrink:0}}>
                    <Clock size={10} style={{color:"var(--warm)"}}/>
                    <span className="mono" style={{fontSize:8,color:"var(--warm)"}}>{step.duration}</span>
                  </div>
                </div>
                <p className="body" style={{marginBottom:28,fontSize:14}}>{step.body}</p>

                <div style={{marginBottom:24}}>
                  <div className="mono" style={{fontSize:8,color:"#2a2a2a",marginBottom:10}}>What happens</div>
                  {step.weeklyBreakdown.map((item,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",
                      borderBottom:"1px solid var(--border)"}}>
                      <span style={{width:18,height:18,borderRadius:"50%",
                        background:"rgba(0,229,255,0.07)",border:"1px solid rgba(0,229,255,0.12)",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        fontFamily:"'Space Mono',monospace",fontSize:8,color:"var(--accent)"}}>
                        {i+1}
                      </span>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555"}}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{icon:<User size={11}/>,label:"Your role",text:step.clientRole},
                    {icon:<Zap size={11}/>,label:"Our role",text:step.meridianRole}].map((r,i)=>(
                    <div key={i} style={{padding:"12px 14px",background:"rgba(255,255,255,0.02)",
                      border:"1px solid var(--border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
                        <span style={{color:"var(--accent)"}}>{r.icon}</span>
                        <span className="mono" style={{fontSize:8,color:"#2a2a2a"}}>{r.label}</span>
                      </div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,lineHeight:1.6,color:"#444"}}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div style={{display:"flex",gap:5,marginTop:14,justifyContent:"center"}}>
              {brand.process.map((_,i)=>(
                <button key={i} onClick={()=>setActive(i)}
                  style={{width:active===i?22:5,height:3,
                    background:active===i?"var(--accent)":"var(--border)",
                    border:"none",cursor:"none",borderRadius:2,transition:"all 0.3s ease"}}/>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.process-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
