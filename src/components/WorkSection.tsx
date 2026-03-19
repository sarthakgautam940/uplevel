"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";

function WorkCard({ item, i }: { item: typeof brand.gallery[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-r.top)/r.height-.5)*-8, y:((e.clientX-r.left)/r.width-.5)*8 });
  };

  // Color palette per card
  const palettes = ["#00E5FF","#FF4500","#7FFF00","#FF6B9D","#FFD700","#9D4EDD"];
  const col = palettes[i % palettes.length];

  return (
    <div
      ref={ref}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{ setHov(false); setTilt({x:0,y:0}); }}
      onMouseMove={onMove}
      data-cursor="VIEW"
      style={{
        width:"clamp(300px,28vw,400px)", flexShrink:0,
        height:480,
        background:"var(--s1)", border:"1px solid var(--border)",
        position:"relative", overflow:"hidden", cursor:"none",
        borderColor: hov ? col+"44" : undefined,
        transform:`perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov?1.02:1})`,
        transformStyle:"preserve-3d",
        transition:"transform 0.4s ease, border-color 0.3s ease",
      } as React.CSSProperties}
    >
      {/* Gradient bg */}
      <div style={{
        position:"absolute",inset:0,
        background:`linear-gradient(135deg, var(--void) 0%, ${col}0d 100%)`,
        transition:"opacity 0.4s",
        opacity: hov ? 1 : 0.5,
      }}/>

      {/* Grid pattern overlay */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`linear-gradient(${col}0a 1px,transparent 1px),linear-gradient(90deg,${col}0a 1px,transparent 1px)`,
        backgroundSize:"40px 40px",
        opacity: hov ? 0.6 : 0.2,
        transition:"opacity 0.4s",
      }}/>

      {/* Simulated browser bars */}
      <div style={{height:28,background:"rgba(255,255,255,0.02)",borderBottom:"1px solid var(--border)",
        display:"flex",alignItems:"center",padding:"0 12px",gap:5,flexShrink:0}}>
        {["#FF5F57","#FEBC2E","#28C840"].map((c,j)=>(
          <div key={j} style={{width:6,height:6,borderRadius:"50%",background:c,opacity:0.5}}/>
        ))}
        <div style={{flex:1,height:8,background:"rgba(255,255,255,0.04)",borderRadius:2,marginLeft:8,maxWidth:160}}/>
      </div>

      {/* Content preview */}
      <div style={{padding:"24px 20px",flex:1}}>
        <div style={{
          width:"55%",height:6,borderRadius:2,marginBottom:12,
          background:`linear-gradient(90deg,${col}30,${col}0a)`,
        }}/>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,lineHeight:1.1,
          color:`${col}cc`,letterSpacing:"-0.02em",marginBottom:8}}>
          {item.title}
        </div>
        <div style={{width:"70%",height:3,background:"rgba(255,255,255,0.06)",borderRadius:1,marginBottom:6}}/>
        <div style={{width:"50%",height:3,background:"rgba(255,255,255,0.04)",borderRadius:1,marginBottom:6}}/>
        <div style={{width:"60%",height:3,background:"rgba(255,255,255,0.04)",borderRadius:1,marginBottom:20}}/>
        <div style={{display:"flex",gap:6}}>
          <div style={{width:56,height:16,background:`${col}25`,borderRadius:2}}/>
          <div style={{width:44,height:16,background:"rgba(255,255,255,0.05)",borderRadius:2}}/>
        </div>
      </div>

      {/* Hover detail overlay */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
            transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
            style={{
              position:"absolute",inset:0,background:"rgba(0,0,0,0.88)",
              display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"28px 24px",
            }}
          >
            <div style={{
              fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.16em",
              textTransform:"uppercase",color:col,marginBottom:8,
            }}>{item.investment} · {item.duration}</div>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,
              color:"#fff",letterSpacing:"-0.02em",marginBottom:8}}>{item.title}</h3>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.65,
              color:"#666",marginBottom:16}}>{item.story}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {item.materials.map((m,j)=>(
                <span key={j} className="tag" style={{fontSize:7,borderColor:`${col}25`,color:col}}>{m}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible bottom label */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,
        background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        padding:"20px 20px 18px",
        opacity: hov ? 0 : 1, transition:"opacity 0.3s",
      }}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#fff"}}>{item.title}</div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444",marginTop:2}}>{item.location}</div>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);}},{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  // Drag-to-scroll
  useEffect(()=>{
    const track=trackRef.current; if(!track) return;
    let dragging=false, startX=0, scrollX=0;
    const down=(e:MouseEvent)=>{dragging=true;startX=e.pageX;scrollX=track.scrollLeft;track.style.cursor="grabbing";};
    const move=(e:MouseEvent)=>{if(!dragging)return;e.preventDefault();track.scrollLeft=scrollX-(e.pageX-startX);};
    const up=()=>{dragging=false;track.style.cursor="grab";};
    track.addEventListener("mousedown",down);
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    return()=>{track.removeEventListener("mousedown",down);window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
  },[]);

  return (
    <section ref={ref} id="results" className="section" style={{background:"var(--void)",overflow:"hidden"}}>
      {/* Header */}
      <div className="wrap max" style={{marginBottom:48}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20}}>
          <div>
            <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
              className="eyebrow" style={{display:"flex",marginBottom:20}}>Case Studies</motion.span>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
              className="h-lg" style={{color:"#fff"}}>Real clients.<br/>Real results.</motion.h2>
          </div>
          <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}}
            className="body" style={{maxWidth:280}}>Drag or scroll to explore. Hover cards for project detail.</motion.p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        style={{
          overflowX:"auto",overflowY:"visible",
          padding:"0 clamp(20px,4vw,64px) 40px",
          scrollbarWidth:"none",cursor:"grab",
        }}
      >
        <div style={{display:"flex",gap:2,width:"max-content"}}>
          {brand.gallery.map((item,i)=>(
            <motion.div
              key={item.title}
              initial={{opacity:0,x:40}} animate={vis?{opacity:1,x:0}:{}}
              transition={{delay:i*0.08,duration:0.7,ease:[0.16,1,0.3,1]}}
            >
              <WorkCard item={item} i={i}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
