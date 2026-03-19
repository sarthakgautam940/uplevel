"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Mic, TrendingUp, Palette, ChevronDown, Check } from "lucide-react";
import { brand } from "../../lib/brand.config";

const ICONS: Record<string,React.ReactNode> = {
  Monitor:<Monitor size={18}/>,Mic:<Mic size={18}/>,
  TrendingUp:<TrendingUp size={18}/>,Palette:<Palette size={18}/>,
};

function ServiceCard({ s, i, vis }: { s: typeof brand.services[0]; i: number; vis: boolean }) {
  const [open, setOpen] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0, gx:50, gy:50 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX-r.left)/r.width, cy = (e.clientY-r.top)/r.height;
    setTilt({ x:(cy-.5)*-12, y:(cx-.5)*12, gx:cx*100, gy:cy*100 });
  };
  const onLeave = () => setTilt({ x:0, y:0, gx:50, gy:50 });

  return (
    <motion.div
      initial={{ opacity:0, y:50 }}
      animate={vis ? { opacity:1, y:0 } : {}}
      transition={{ delay:i*0.1, duration:0.75, ease:[0.16,1,0.3,1] }}
    >
      <div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{
          background:"var(--s1)", border:"1px solid var(--border)",
          padding:"40px 34px", position:"relative", overflow:"hidden",
          transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle:"preserve-3d", transition:"border-color 0.3s",
          height:"100%",
        }}
        data-cursor=""
      >
        {/* Spotlight */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%,rgba(0,229,255,0.06) 0%,transparent 55%)`,
        }}/>
        {/* Big number bg */}
        <div style={{
          position:"absolute",top:16,right:20,
          fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:72,lineHeight:1,
          color:"rgba(255,255,255,0.02)",letterSpacing:"-0.04em",
        }}>{s.number}</div>

        <div style={{
          width:40,height:40,borderRadius:4,
          background:"rgba(0,229,255,0.07)",border:"1px solid rgba(0,229,255,0.12)",
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"var(--accent)",marginBottom:24,
        }}>{ICONS[s.icon]}</div>

        <h3 className="h-md" style={{marginBottom:12,color:"#fff"}}>{s.title}</h3>
        <p className="body" style={{marginBottom:20,fontSize:14}}>{s.body}</p>
        <div style={{
          fontFamily:"'Space Mono',monospace",fontSize:10,fontWeight:700,
          letterSpacing:"0.1em",color:"var(--warm)",marginBottom:20,
        }}>{s.price}</div>

        <button onClick={()=>setOpen(!open)} style={{
          background:"none",border:"none",cursor:"none",
          display:"flex",alignItems:"center",gap:7,padding:0,
          fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.14em",
          textTransform:"uppercase",color:"#333",
        }} data-cursor="">
          {open?"Hide deliverables":"See deliverables"}
          <motion.span animate={{rotate:open?180:0}} transition={{duration:0.3}}>
            <ChevronDown size={11}/>
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
              exit={{height:0,opacity:0}} transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
              style={{overflow:"hidden",paddingTop:16,marginTop:16,
                borderTop:"1px solid var(--border)",display:"flex",
                flexDirection:"column",gap:8,listStyle:"none"}}
            >
              {s.deliverables.map((d,j)=>(
                <li key={j} style={{display:"flex",alignItems:"center",gap:8,
                  fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555"}}>
                  <Check size={11} style={{color:"var(--accent)",flexShrink:0}}/>
                  {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:1,
          background:`linear-gradient(90deg,transparent,rgba(0,229,255,0.25),transparent)`,
          opacity: tilt.y!==0?1:0, transition:"opacity 0.3s",
        }}/>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  return (
    <section ref={ref} id="services" className="section" style={{background:"var(--void)"}}>
      <div className="wrap max">
        <div style={{marginBottom:64}}>
          <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}>
            <span className="eyebrow" style={{marginBottom:20,display:"flex"}}>What We Build</span>
          </motion.div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20}}>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1,duration:0.75}}
              className="h-lg" style={{color:"#fff"}}>
              Four systems.<br />One machine.
            </motion.h2>
            <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}}
              className="body" style={{maxWidth:300}}>
              We don't sell services. We build integrated revenue infrastructure — each component feeds the next.
            </motion.p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:2}}>
          {brand.services.map((s,i)=><ServiceCard key={s.number} s={s} i={i} vis={vis}/>)}
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.5}}
          style={{marginTop:48,textAlign:"center",paddingTop:40,borderTop:"1px solid var(--border)"}}>
          <a href="#pricing" onClick={e=>{e.preventDefault();document.querySelector("#pricing")?.scrollIntoView({behavior:"smooth"});}}
            className="btn btn-ghost" data-cursor="">See All Pricing →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
