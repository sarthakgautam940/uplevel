"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { brand } from "../../lib/brand.config";

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.05});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const go=()=>document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"});
  return (
    <section ref={ref} id="pricing" className="section" style={{background:"var(--void)"}}>
      <div className="wrap max">
        <div style={{textAlign:"center",marginBottom:64}}>
          <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
            className="eyebrow" style={{display:"flex",justifyContent:"center",marginBottom:20}}>Pricing</motion.span>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
            className="h-lg" style={{color:"#fff"}}>Transparent.<br/>No surprises.</motion.h2>
          <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}}
            className="body" style={{maxWidth:440,margin:"20px auto 0"}}>
            All tiers include 48-hour delivery, custom code, and month-to-month contracts.
          </motion.p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:2,alignItems:"stretch"}}>
          {brand.pricingTiers.map((tier,i)=>(
            <motion.div key={tier.name}
              initial={{opacity:0,y:48}} animate={vis?{opacity:1,y:0}:{}}
              transition={{delay:i*0.09,duration:0.75,ease:[0.16,1,0.3,1]}}
              style={{position:"relative"}}
            >
              {tier.badge&&(
                <div style={{
                  position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",
                  padding:"4px 14px",whiteSpace:"nowrap",zIndex:2,
                  background:tier.isHighlighted?"var(--accent)":"var(--warm)",
                  fontFamily:"'Space Mono',monospace",fontSize:8,fontWeight:700,
                  letterSpacing:"0.16em",textTransform:"uppercase",
                  color:tier.isHighlighted?"#000":"#fff",
                }}>{tier.badge}</div>
              )}
              <div style={{
                background: tier.isHighlighted?"var(--s2)":"var(--s1)",
                border:`1px solid ${tier.isHighlighted?"rgba(0,229,255,0.3)":"var(--border)"}`,
                boxShadow: tier.isHighlighted?"0 0 60px rgba(0,229,255,0.05)":"none",
                padding:"40px 30px 34px",height:"100%",
                display:"flex",flexDirection:"column",
              }}>
                <div className="mono" style={{
                  fontSize:9,marginBottom:10,
                  color:tier.isHighlighted?"var(--accent)":"#333",
                }}>{tier.name}</div>
                <div style={{marginBottom:6}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,
                    fontSize:"clamp(26px,3.5vw,38px)",color:"#fff",letterSpacing:"-0.03em"}}>
                    {tier.setup}
                  </span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444",marginLeft:5}}>setup</span>
                </div>
                <div className="mono" style={{fontSize:10,color:"var(--warm)",marginBottom:16}}>+ {tier.monthly}</div>
                <p className="body" style={{fontSize:12,marginBottom:24,paddingBottom:24,borderBottom:"1px solid var(--border)"}}>
                  {tier.description}
                </p>
                <ul style={{flex:1,display:"flex",flexDirection:"column",gap:9,marginBottom:28,listStyle:"none"}}>
                  {tier.features.map((f,j)=>(
                    <li key={j} style={{display:"flex",alignItems:"flex-start",gap:8,
                      fontFamily:"'DM Sans',sans-serif",fontSize:12,lineHeight:1.5,
                      color:f.startsWith("Everything")?"#333":"#555",
                      fontStyle:f.startsWith("Everything")?"italic":"normal"}}>
                      <Check size={10} style={{color:tier.isHighlighted?"var(--accent)":"#2a2a2a",flexShrink:0,marginTop:3}}/>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={go} className={`btn ${tier.isHighlighted?"btn-fill":"btn-ghost"}`}
                  style={{width:"100%",justifyContent:"center",fontSize:9}} data-cursor="">
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.5}}
          className="body" style={{textAlign:"center",marginTop:32,fontSize:11}}>
          50% deposit to begin · remaining 50% at launch · cancel anytime after 3 months
        </motion.p>
      </div>
    </section>
  );
}
