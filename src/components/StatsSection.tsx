"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useCountUp } from "../hooks/useCountUp";

function Stat({ value, suffix, label, sub, delay, vis }: any) {
  const n = useCountUp(value, 3000, vis);
  return (
    <motion.div initial={{opacity:0,y:32}} animate={vis?{opacity:1,y:0}:{}} transition={{delay,duration:0.7,ease:[0.16,1,0.3,1]}}
      style={{padding:"48px 0",borderRight:"1px solid var(--border)",textAlign:"center",position:"relative"}}>
      <div className="stat-num">{n}{suffix}</div>
      <div className="mono" style={{marginTop:12,marginBottom:4,color:"#555"}}>{label}</div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#333"}}>{sub}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.3});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{background:"var(--s1)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
      <div className="max wrap" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))"}}>
        <Stat value={brand.stats.projects} suffix="+" label="Clients Served" sub="Growing monthly" delay={0} vis={vis}/>
        <Stat value={brand.stats.satisfaction} suffix="%" label="Satisfaction" sub="Client-reported" delay={0.1} vis={vis}/>
        <Stat value={48} suffix="hr" label="Avg Launch" sub="Deposit to live" delay={0.2} vis={vis}/>
        <Stat value={brand.stats.avgRoi} suffix="%" label="Avg ROI" sub="Year one" delay={0.3} vis={vis}/>
      </div>
    </div>
  );
}
