"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { brand } from "../../lib/brand.config";

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const rots = [-2, 1.5, -1.2];
  return (
    <section ref={ref} id="testimonials" className="section" style={{background:"var(--s1)"}}>
      <div className="wrap max">
        <div style={{marginBottom:64,maxWidth:560}}>
          <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
            className="eyebrow" style={{display:"flex",marginBottom:20}}>Social Proof</motion.span>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
            className="h-lg" style={{color:"#fff"}}>Don't take<br/>our word for it.</motion.h2>
        </div>

        {/* Angled testimonial cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:40}}
          className="testi-grid">
          {brand.testimonials.map((t,i)=>(
            <motion.div key={t.name}
              initial={{opacity:0,y:60,rotate:rots[i]*2}} animate={vis?{opacity:1,y:0,rotate:rots[i]}:{}}
              transition={{delay:i*0.12,duration:0.9,ease:[0.16,1,0.3,1]}}
              whileHover={{rotate:0,y:-8,transition:{duration:0.4}}}
              style={{background:"var(--s2)",border:"1px solid var(--border)",
                padding:"32px 28px",cursor:"none",position:"relative"}}
              data-cursor=""
            >
              <div style={{
                position:"absolute",top:24,right:24,fontFamily:"'Syne',sans-serif",
                fontWeight:800,fontSize:64,lineHeight:1,color:"rgba(0,229,255,0.05)",
              }}>"</div>
              <div style={{display:"flex",gap:3,marginBottom:18}}>
                {Array.from({length:5}).map((_,j)=>(<Star key={j} size={11} fill="var(--warm)" style={{color:"var(--warm)"}}/>))}
              </div>
              <blockquote style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,
                lineHeight:1.8,color:"#555",marginBottom:24,fontStyle:"italic"}}>
                "{t.quote}"
              </blockquote>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:"50%",
                  background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:"var(--accent)"}}>
                  {t.initials}
                </div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#fff"}}>{t.name}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#333"}}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured */}
        <motion.div initial={{opacity:0,y:30}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.45,duration:0.8}}
          style={{background:"var(--s2)",border:"1px solid var(--border)",
            padding:"48px clamp(24px,5vw,56px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:"clamp(24px,5vw,56px)",top:36,
            fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:120,lineHeight:1,
            color:"rgba(0,229,255,0.03)"}}>
            "
          </div>
          <div style={{display:"flex",gap:3,marginBottom:22}}>
            {Array.from({length:5}).map((_,j)=>(<Star key={j} size={14} fill="var(--warm)" style={{color:"var(--warm)"}}/>))}
          </div>
          <blockquote style={{fontFamily:"'Syne',sans-serif",fontWeight:500,
            fontSize:"clamp(18px,2.2vw,26px)",lineHeight:1.45,letterSpacing:"-0.02em",
            color:"#fff",maxWidth:820,marginBottom:28}}>
            "{brand.featuredTestimonial.quote}"
          </blockquote>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",
              background:"linear-gradient(135deg,rgba(0,229,255,0.12),rgba(255,69,0,0.08))",
              border:"1px solid rgba(0,229,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--accent)"}}>
              {brand.featuredTestimonial.initials}
            </div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#fff"}}>
                {brand.featuredTestimonial.name}
              </div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#333"}}>
                {brand.featuredTestimonial.project}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review grid */}
        <motion.div initial={{opacity:0,y:30}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.55}}
          style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:2,marginTop:2}}>
          {brand.realReviews.map((r,i)=>(
            <div key={i} style={{background:"var(--s2)",border:"1px solid var(--border)",padding:"18px 18px"}}>
              <div style={{display:"flex",gap:2,marginBottom:9}}>
                {Array.from({length:r.stars}).map((_,j)=>(<Star key={j} size={9} fill="var(--warm)" style={{color:"var(--warm)"}}/>))}
              </div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,lineHeight:1.65,color:"#444",
                marginBottom:10,fontStyle:"italic"}}>"{r.text}"</p>
              <div className="mono" style={{fontSize:7,color:"var(--accent)",marginBottom:3}}>{r.highlight}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#2a2a2a"}}>— {r.name}</div>
            </div>
          ))}
        </motion.div>
      </div>
      <style>{`
        @media(max-width:900px){.testi-grid{grid-template-columns:1fr!important;}}
        @media(max-width:600px){.testi-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
