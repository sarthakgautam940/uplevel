"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { brand } from "../../lib/brand.config";

export default function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [open, setOpen] = useState<number|null>(0);
  const [cat, setCat] = useState("All");
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.05});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const cats = useMemo(()=>["All",...Array.from(new Set(brand.faq.map(f=>f.category)))],[]);
  const filtered = useMemo(()=>cat==="All"?brand.faq:brand.faq.filter(f=>f.category===cat),[cat]);
  return (
    <section ref={ref} id="faq" className="section" style={{background:"var(--void)"}}>
      <div className="wrap max">
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:80,alignItems:"start"}} className="faq-grid">
          <div style={{position:"sticky",top:100}}>
            <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
              className="eyebrow" style={{display:"flex",marginBottom:20}}>FAQ</motion.span>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
              className="h-lg" style={{color:"#fff",fontSize:"clamp(32px,4vw,56px)"}}>Questions<br/>we get<br/>a lot.</motion.h2>
            <motion.p initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.2}}
              className="body" style={{marginTop:20,marginBottom:32,fontSize:14}}>
              Still have questions? Book a free 15-minute call.
            </motion.p>
            <motion.button initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.3}}
              onClick={()=>document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"})}
              className="btn btn-fill" style={{fontSize:9}} data-cursor="">
              Book Free Call →
            </motion.button>
            <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.35}}
              style={{marginTop:36,display:"flex",flexDirection:"column",gap:4}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>{setCat(c);setOpen(null);}}
                  style={{
                    background:"none",border:"none",cursor:"none",padding:"9px 0",
                    borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",
                    justifyContent:"space-between",fontFamily:"'Space Mono',monospace",
                    fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",
                    color:cat===c?"var(--accent)":"#2a2a2a",fontWeight:cat===c?700:400,
                    transition:"color 0.2s",textAlign:"left",
                  }} data-cursor="">
                  {c}
                  {cat===c&&<span style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)"}}/>}
                </button>
              ))}
            </motion.div>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={cat}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                exit={{opacity:0,y:-10}} transition={{duration:0.3}}>
                {filtered.map((item,i)=>(
                  <motion.div key={item.q}
                    initial={{opacity:0,y:10}} animate={vis?{opacity:1,y:0}:{}}
                    transition={{delay:i*0.04,duration:0.5}}
                    style={{borderBottom:"1px solid var(--border)"}}>
                    <button onClick={()=>setOpen(open===i?null:i)}
                      style={{width:"100%",background:"none",border:"none",cursor:"none",
                        padding:"22px 0",display:"flex",alignItems:"flex-start",
                        justifyContent:"space-between",gap:20,textAlign:"left"}} data-cursor="">
                      <span style={{fontFamily:"'Syne',sans-serif",
                        fontWeight:open===i?700:400,fontSize:"clamp(14px,1.4vw,16px)",
                        lineHeight:1.45,color:open===i?"#fff":"#444",
                        transition:"color 0.2s,font-weight 0.2s"}}>
                        {item.q}
                      </span>
                      <span style={{
                        width:26,height:26,flexShrink:0,borderRadius:2,
                        border:`1px solid ${open===i?"rgba(0,229,255,0.3)":"var(--border)"}`,
                        background:open===i?"rgba(0,229,255,0.07)":"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:open===i?"var(--accent)":"#2a2a2a",
                        transition:"all 0.25s",marginTop:2,
                      }}>
                        {open===i?<Minus size={11}/>:<Plus size={11}/>}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open===i&&(
                        <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                          exit={{height:0,opacity:0}} transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
                          style={{overflow:"hidden"}}>
                          <p className="body" style={{paddingBottom:24,paddingRight:44,fontSize:14}}>{item.a}</p>
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
