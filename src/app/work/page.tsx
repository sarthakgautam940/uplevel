"use client";
import{useEffect,useRef,useState}from"react";
import{motion,AnimatePresence}from"framer-motion";
import dynamic from"next/dynamic";
import Nav from"@/components/Nav";
import Footer from"@/components/Footer";
import{B}from"../../../lib/brand";
const Cursor=dynamic(()=>import("@/components/Cursor"),{ssr:false});
const SmoothScroll=dynamic(()=>import("@/components/SmoothScroll"),{ssr:false});

export default function Work(){
  const[hov,setHov]=useState<number|null>(null);
  const trackRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const t=trackRef.current;if(!t)return;
    let drag=false,sx=0,sc=0;
    const dn=(e:MouseEvent)=>{drag=true;sx=e.pageX;sc=t.scrollLeft;t.style.cursor="grabbing";};
    const mv=(e:MouseEvent)=>{if(!drag)return;t.scrollLeft=sc-(e.pageX-sx);};
    const up=()=>{drag=false;t.style.cursor="grab";};
    t.addEventListener("mousedown",dn);window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);
    return()=>{t.removeEventListener("mousedown",dn);window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};
  },[]);
  return(<>
    <Cursor/><SmoothScroll/>
    <Nav/>
    <main style={{background:"var(--ink)",minHeight:"100vh",paddingTop:64}}>
      {/* Hero */}
      <section style={{padding:"clamp(80px,12vw,140px) clamp(20px,4vw,64px) clamp(60px,8vw,100px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{marginBottom:22}}><span className="eyebrow">Our Work</span></motion.div>
          <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:1,ease:[0.16,1,0.3,1]}} className="t-display" style={{color:"var(--white)",maxWidth:700,marginBottom:24}}>
            Real clients.<br/><span style={{fontStyle:"italic"}}>Real results.</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="t-body" style={{maxWidth:460}}>
            Drag to explore every build. Each project is a complete revenue machine — not just a website.
          </motion.p>
        </div>
      </section>

      {/* Horizontal scroll gallery */}
      <div ref={trackRef} style={{overflowX:"auto",scrollbarWidth:"none",cursor:"grab",padding:"0 0 clamp(40px,6vw,80px)"}}>
        <div style={{display:"flex",gap:2,width:"max-content",padding:"0 clamp(20px,4vw,64px)"}}>
          {B.work.map((w,i)=>(
            <motion.div key={w.slug} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{delay:i*0.07,duration:0.7,ease:[0.16,1,0.3,1]}}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} data-cursor="VIEW"
              style={{width:"clamp(300px,28vw,380px)",height:500,flexShrink:0,background:w.color,border:`1px solid ${hov===i?w.accent+"55":"var(--bd)"}`,position:"relative",overflow:"hidden",transition:"border-color 0.3s",cursor:"none"}}>
              {/* Grid pattern */}
              <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${w.accent}0a 1px,transparent 1px),linear-gradient(90deg,${w.accent}0a 1px,transparent 1px)`,backgroundSize:"40px 40px",opacity:hov===i?0.7:0.25,transition:"opacity 0.4s"}}/>
              {/* Browser chrome sim */}
              <div style={{height:26,background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",padding:"0 12px",gap:5,flexShrink:0}}>
                {["#FF5F57","#FEBC2E","#28C840"].map((c,j)=><div key={j} style={{width:6,height:6,borderRadius:"50%",background:c,opacity:0.5}}/>)}
                <div style={{marginLeft:8,height:8,flex:1,maxWidth:180,background:"rgba(255,255,255,0.04)",borderRadius:2}}/>
              </div>
              <div style={{padding:"clamp(20px,3vw,28px)"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:w.accent,opacity:0.7,marginBottom:8}}>{w.tier}</div>
                <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(22px,3vw,34px)",color:"rgba(255,255,255,0.85)",letterSpacing:"-0.02em",lineHeight:1.1}}>{w.title}</div>
              </div>
              {/* Hover overlay */}
              <AnimatePresence>
                {hov===i&&(
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.28}}
                    style={{position:"absolute",inset:0,background:"rgba(5,5,6,0.92)",padding:"clamp(20px,3vw,28px)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:w.accent,marginBottom:8}}>{w.cat} · {w.year}</div>
                    <h3 style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:22,color:"var(--white)",letterSpacing:"-0.02em",marginBottom:12}}>{w.title}</h3>
                    <p style={{fontFamily:"var(--sans)",fontSize:13,lineHeight:1.65,color:"var(--white-2)",fontWeight:300}}>{w.story}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bottom label */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)",padding:"20px clamp(20px,3vw,28px) 18px",opacity:hov===i?0:1,transition:"opacity 0.28s"}}>
                <div style={{fontFamily:"var(--serif)",fontWeight:600,fontSize:16,color:"rgba(255,255,255,0.8)"}}>{w.title}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.1em",color:"rgba(255,255,255,0.35)",marginTop:3}}>{w.cat}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:"clamp(60px,8vw,100px) clamp(20px,4vw,64px)",textAlign:"center"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{borderTop:"1px solid var(--bd)",paddingTop:"clamp(48px,6vw,72px)"}}>
            <h2 className="t-h1" style={{color:"var(--white)",marginBottom:20}}>Ready to be next?</h2>
            <p className="t-body" style={{maxWidth:420,margin:"0 auto 36px"}}>Join 47+ contractors who replaced their old site with a system that actually generates revenue.</p>
            <a href="/contact" className="btn btn-gold" style={{fontSize:10}} data-cursor="START">Start a Project →</a>
          </div>
        </div>
      </div>
    </main>
    <Footer/>
  </>);
}
