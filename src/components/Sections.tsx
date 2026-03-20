"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Check, Plus, Minus, Star } from "lucide-react";
import { B } from "../../lib/brand";

function useVis(t=0.1){
  const ref=useRef<any>(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:t});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[t]);
  return{ref,vis};
}

function CountUp({target,vis,suf=""}:{target:number;vis:boolean;suf?:string}){
  const[n,setN]=useState(0);
  useEffect(()=>{
    if(!vis)return;
    const dur=2600,t0=performance.now();
    let raf:number;
    const tick=()=>{const t=Math.min((performance.now()-t0)/dur,1);const e=1-Math.pow(1-t,4);setN(Math.round(e*target));if(t<1)raf=requestAnimationFrame(tick);};
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[vis,target]);
  return<>{n}{suf}</>;
}

export function MarqueeStrip(){
  const items=["WEBSITES","AI SYSTEMS","LOCAL SEO","BRAND IDENTITY","LEAD AUTOMATION","48-HR DELIVERY","VOICE AI","CONVERSION SYSTEMS"];
  const dbl=[...items,...items];
  return(
    <div style={{borderTop:"1px solid var(--bd)",borderBottom:"1px solid var(--bd)",background:"rgba(200,169,81,0.02)",padding:"14px 0",overflow:"hidden"}}>
      <div className="mq-inner">
        {dbl.map((t,i)=>(
          <span key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--white-3)",whiteSpace:"nowrap"}}>{t}</span>
            <span style={{margin:"0 24px",color:"var(--gold)",opacity:0.25,fontSize:7}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Manifesto(){
  const{ref,vis}=useVis(0.15);
  const words=B.manifesto.statement.split(" ");
  return(
    <section ref={ref} className="sect" style={{background:"var(--ink)"}}>
      <div className="pad cap">
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"clamp(28px,5vw,72px)",alignItems:"start"}} className="mf-grid">
          <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.2}}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,paddingTop:6}} className="mob-off">
            <div style={{width:1,height:44,background:"var(--bd-hi)"}}/>
            <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--white-3)",writingMode:"vertical-rl",transform:"rotate(180deg)"}}>PHILOSOPHY</span>
          </motion.div>
          <div>
            <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:26}}>
              <span className="eyebrow">Our Belief</span>
            </motion.div>
            <h2 style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:"clamp(26px,3.5vw,52px)",lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:30}}>
              {words.map((word,i)=>(
                <span key={i} style={{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"}}>
                  <motion.span initial={{y:"108%",opacity:0}} animate={vis?{y:"0%",opacity:1}:{}} transition={{delay:0.1+i*0.042,duration:0.78,ease:[0.16,1,0.3,1]}} style={{display:"inline-block",color:"var(--white)"}}>{word}</motion.span>
                  {i<words.length-1&&<span style={{display:"inline-block",width:"0.24em"}}/>}
                </span>
              ))}
            </h2>
            <motion.p initial={{opacity:0,y:18}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.55}} className="t-body"
              style={{maxWidth:560,borderLeft:"1px solid rgba(200,169,81,0.18)",paddingLeft:20,marginBottom:48,fontSize:"clamp(13px,1.05vw,15px)"}}>
              {B.manifesto.body}
            </motion.p>
            <motion.div initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.7}}
              style={{display:"flex",flexWrap:"wrap",gap:36,paddingTop:28,borderTop:"1px solid var(--bd)"}}>
              {[{v:`${B.stats.clients}+`,l:"Clients"},{v:`${B.stats.satisfaction}%`,l:"Satisfaction"},{v:"48hr",l:"Avg Launch"}].map((s,i)=>(
                <div key={i}>
                  <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",lineHeight:1,color:"var(--white)",marginBottom:5}}>{s.v}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--white-3)"}}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.mf-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

export function KineticBand(){
  const ref=useRef<HTMLDivElement>(null);
  const[ox,setOx]=useState(0);
  useEffect(()=>{
    const fn=()=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();const frac=(r.top+r.height/2)/window.innerHeight-0.5;setOx(frac*(-13));};
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  const rows=[
    {t:"THE WEBSITE YOUR WORK DESERVES ·",solid:true},
    {t:"AI  ·  AUTOMATION  ·  SEO  ·  DESIGN  ·  GROWTH ·",solid:false},
    {t:"BUILD FAST. LAUNCH SMART. DOMINATE. ·",solid:true},
  ];
  return(
    <div ref={ref} style={{overflow:"hidden",padding:"clamp(48px,7vw,88px) 0",borderTop:"1px solid var(--bd)",borderBottom:"1px solid var(--bd)",background:"var(--ink-2)",position:"relative"}}>
      {["left","right"].map(s=>(
        <div key={s} style={{position:"absolute",top:0,bottom:0,[s]:0,width:"9%",background:`linear-gradient(to ${s==="left"?"right":"left"},var(--ink-2),transparent)`,zIndex:2,pointerEvents:"none"}}/>
      ))}
      {rows.map((row,i)=>(
        <div key={i} style={{transform:`translateX(${ox*(i===1?-1:1)}%)`,transition:"transform 0.1s linear",marginBottom:i<2?4:0}}>
          <span style={{fontFamily:"var(--serif)",fontWeight:700,whiteSpace:"nowrap",fontSize:"clamp(40px,7vw,100px)",lineHeight:0.93,letterSpacing:"-0.025em",display:"block",color:row.solid?"var(--white)":"transparent",WebkitTextStroke:row.solid?undefined:"1px rgba(200,169,81,0.14)"}}>
            {row.t+row.t}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Services(){
  const{ref,vis}=useVis(0.08);
  return(
    <section ref={ref} id="services" className="sect" style={{background:"var(--ink)"}}>
      <div className="pad cap">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:56}}>
          <div>
            <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}>
              <span className="eyebrow">What We Build</span>
            </motion.div>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1,duration:0.75}} className="t-h1" style={{color:"var(--white)"}}>
              Four systems.<br/>One machine.
            </motion.h2>
          </div>
          <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}} className="t-body" style={{maxWidth:280}}>
            Each component amplifies the others. We don't sell them separately.
          </motion.p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:2}}>
          {B.services.map((s,i)=><ServiceCard key={s.n} s={s} i={i} vis={vis}/>)}
        </div>
        <motion.div initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.5}}
          style={{marginTop:44,textAlign:"center",paddingTop:36,borderTop:"1px solid var(--bd)"}}>
          <a href="/services" className="btn btn-ghost" style={{fontSize:9}} data-cursor="">View Full Services →</a>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({s,i,vis}:{s:typeof B.services[0];i:number;vis:boolean}){
  const cRef=useRef<HTMLDivElement>(null);
  const[open,setOpen]=useState(false);
  const[tilt,setTilt]=useState({x:0,y:0,mx:50,my:50});
  const onMv=(e:React.MouseEvent)=>{
    if(!cRef.current)return;
    const r=cRef.current.getBoundingClientRect();
    const cx=(e.clientX-r.left)/r.width,cy=(e.clientY-r.top)/r.height;
    setTilt({x:(cy-.5)*-10,y:(cx-.5)*10,mx:cx*100,my:cy*100});
  };
  const onLv=()=>setTilt({x:0,y:0,mx:50,my:50});
  return(
    <motion.div initial={{opacity:0,y:44,rotateX:-10}} animate={vis?{opacity:1,y:0,rotateX:0}:{}} transition={{delay:i*0.09,duration:0.88,ease:[0.16,1,0.3,1]}}>
      <div ref={cRef} onMouseMove={onMv} onMouseLeave={onLv} className="card"
        style={{padding:"clamp(26px,2.8vw,38px)",height:"100%",transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transformStyle:"preserve-3d",transition:"border-color 0.3s",cursor:"none"}} data-cursor="">
        <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at ${tilt.mx}% ${tilt.my}%,rgba(200,169,81,0.05),transparent 55%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:16,right:20,fontFamily:"var(--serif)",fontWeight:800,fontSize:70,lineHeight:1,color:"rgba(200,169,81,0.04)",letterSpacing:"-0.04em"}}>{s.n}</div>
        <div style={{fontSize:18,marginBottom:18}}>{s.icon}</div>
        <h3 className="t-h2" style={{color:"var(--white)",marginBottom:10,fontSize:"clamp(17px,1.8vw,22px)"}}>{s.title}</h3>
        <p className="t-body" style={{marginBottom:18,fontSize:13}}>{s.sub}</p>
        <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.1em",color:"var(--gold)",marginBottom:18}}>{s.price}</div>
        <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"none",display:"flex",alignItems:"center",gap:7,fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--white-3)",padding:0}} data-cursor="">
          {open?"Hide":"Deliverables"}
          <motion.span animate={{rotate:open?180:0}} transition={{duration:0.26}}>▾</motion.span>
        </button>
        <AnimatePresence>
          {open&&(
            <motion.ul initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}}
              style={{overflow:"hidden",paddingTop:14,marginTop:14,borderTop:"1px solid var(--bd)",listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
              {s.deliverables.map((d,j)=>(
                <li key={j} style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--sans)",fontSize:12,color:"var(--white-2)",fontWeight:300}}>
                  <Check size={10} style={{color:"var(--gold)",flexShrink:0}}/>{d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(200,169,81,0.22),transparent)`,opacity:tilt.y!==0?1:0,transition:"opacity 0.3s"}}/>
      </div>
    </motion.div>
  );
}

export function Stats(){
  const{ref,vis}=useVis(0.25);
  const stats=[
    {val:B.stats.clients,suf:"+",label:"Clients Served",sub:"Growing monthly"},
    {val:B.stats.satisfaction,suf:"%",label:"Satisfaction",sub:"Client-reported"},
    {val:48,suf:"hr",label:"Avg Launch",sub:"Deposit to live"},
    {val:B.stats.roi,suf:"%",label:"Avg ROI Yr1",sub:"Client-attributed"},
  ];
  return(
    <div ref={ref} style={{borderTop:"1px solid var(--bd)",borderBottom:"1px solid var(--bd)",background:"var(--ink-2)"}}>
      <div className="pad cap">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))"}}>
          {stats.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:28}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:i*0.09,duration:0.7,ease:[0.16,1,0.3,1]}}
              style={{padding:"44px 0",borderRight:i<stats.length-1?"1px solid var(--bd)":"none",textAlign:"center"}}>
              <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(38px,5.5vw,72px)",lineHeight:0.94,letterSpacing:"-0.035em",background:"linear-gradient(135deg,var(--white) 30%,rgba(200,169,81,0.65) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:10}}>
                <CountUp target={s.val} vis={vis} suf={s.suf}/>
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--white-2)",marginBottom:4}}>{s.label}</div>
              <div style={{fontFamily:"var(--sans)",fontSize:11,color:"var(--white-3)",fontWeight:300}}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Process(){
  const{ref,vis}=useVis(0.08);
  const[active,setActive]=useState(0);
  const step=B.process[active];
  return(
    <section ref={ref} id="process" className="sect" style={{background:"var(--ink)"}}>
      <div className="pad cap">
        <div style={{marginBottom:52}}>
          <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}><span className="eyebrow">How We Work</span></motion.div>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}} className="t-h1" style={{color:"var(--white)"}}>Zero to live.<br/>Five steps.</motion.h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start"}} className="proc-grid">
          <div>
            {B.process.map((p,i)=>(
              <motion.button key={p.n} initial={{opacity:0,x:-22}} animate={vis?{opacity:1,x:0}:{}} transition={{delay:i*0.07,duration:0.6}}
                onClick={()=>setActive(i)}
                style={{width:"100%",border:"none",cursor:"none",padding:"19px 20px",textAlign:"left",borderLeft:`2px solid ${active===i?"var(--gold)":"var(--bd)"}`,marginBottom:3,background:active===i?"rgba(200,169,81,0.03)":"transparent",transition:"all 0.28s ease"} as React.CSSProperties} data-cursor="">
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <span style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:32,lineHeight:1,letterSpacing:"-0.04em",color:active===i?"rgba(200,169,81,0.2)":"rgba(247,244,238,0.04)",transition:"color 0.28s",minWidth:44}}>{p.n}</span>
                  <div>
                    <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.16em",textTransform:"uppercase",color:active===i?"var(--gold)":"var(--white-3)",marginBottom:3,transition:"color 0.28s"}}>{p.label}</div>
                    <div style={{fontFamily:"var(--serif)",fontWeight:600,fontSize:16,color:active===i?"var(--white)":"var(--white-2)",transition:"color 0.28s"}}>{p.title}</div>
                  </div>
                  <span style={{marginLeft:"auto",color:active===i?"var(--gold)":"var(--white-3)",transition:"color 0.28s"}}>→</span>
                </div>
              </motion.button>
            ))}
            <div style={{display:"flex",gap:5,marginTop:14}}>
              {B.process.map((_,i)=><button key={i} onClick={()=>setActive(i)} style={{width:active===i?22:5,height:2,background:active===i?"var(--gold)":"var(--bd-hi)",border:"none",cursor:"none",borderRadius:1,transition:"all 0.28s ease"}}/>)}
            </div>
          </div>
          <div style={{position:"sticky",top:88}}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{opacity:0,x:22,y:8}} animate={{opacity:1,x:0,y:0}} exit={{opacity:0,x:-18}} transition={{duration:0.36,ease:[0.16,1,0.3,1]}} className="card" style={{padding:"clamp(26px,3vw,36px)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:20,borderBottom:"1px solid var(--bd)"}}>
                  <div>
                    <span className="eyebrow" style={{display:"flex",marginBottom:8,fontSize:8}}>{step.label}</span>
                    <h3 className="t-h2" style={{color:"var(--white)",fontSize:"clamp(17px,2vw,24px)"}}>{step.title}</h3>
                  </div>
                  <div style={{padding:"5px 10px",background:"rgba(200,169,81,0.07)",border:"1px solid rgba(200,169,81,0.18)",flexShrink:0}}>
                    <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.12em",color:"var(--gold)"}}>{step.time}</span>
                  </div>
                </div>
                <p className="t-body" style={{marginBottom:22,fontSize:13}}>{step.body}</p>
                <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--white-3)",marginBottom:10}}>What happens</div>
                {step.what.map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bd)",fontFamily:"var(--sans)",fontSize:12,color:"var(--white-2)",fontWeight:300}}>
                    <span style={{width:16,height:16,borderRadius:"50%",background:"rgba(200,169,81,0.07)",border:"1px solid rgba(200,169,81,0.14)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"var(--mono)",fontSize:7,color:"var(--gold)"}}>{i+1}</span>
                    {item}
                  </div>
                ))}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
                  {[{l:"Your role",t:step.you},{l:"Our role",t:step.us}].map((r,i)=>(
                    <div key={i} style={{padding:"12px 14px",background:"rgba(247,244,238,0.018)",border:"1px solid var(--bd)"}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:7,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--white-3)",marginBottom:6}}>{r.l}</div>
                      <p style={{fontFamily:"var(--sans)",fontSize:11,lineHeight:1.6,color:"var(--white-2)",fontWeight:300}}>{r.t}</p>
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

export function Pricing(){
  const{ref,vis}=useVis(0.05);
  const go=()=>window.location.href="/contact";
  return(
    <section ref={ref} id="pricing" className="sect" style={{background:"var(--ink-2)"}}>
      <div className="pad cap">
        <div style={{textAlign:"center",marginBottom:56}}>
          <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{display:"flex",justifyContent:"center",marginBottom:18}}><span className="eyebrow">Pricing</span></motion.div>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}} className="t-h1" style={{color:"var(--white)"}}>Transparent.<br/>No surprises.</motion.h2>
          <motion.p initial={{opacity:0,y:14}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}} className="t-body" style={{maxWidth:400,margin:"14px auto 0"}}>
            All tiers include 48-hour delivery and month-to-month contracts. No lock-in.
          </motion.p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:2,alignItems:"stretch"}}>
          {B.pricing.map((tier,i)=>(
            <motion.div key={tier.name} initial={{opacity:0,y:44}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:i*0.09,duration:0.78,ease:[0.16,1,0.3,1]}} style={{position:"relative"}}>
              {tier.badge&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",padding:"4px 14px",background:tier.hi?"var(--gold)":"rgba(200,169,81,0.6)",fontFamily:"var(--mono)",fontSize:8,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--ink)",whiteSpace:"nowrap",zIndex:2}}>{tier.badge}</div>}
              <div style={{background:tier.hi?"var(--ink-3)":"var(--ink-2)",border:`1px solid ${tier.hi?"rgba(200,169,81,0.3)":"var(--bd)"}`,boxShadow:tier.hi?"0 0 60px rgba(200,169,81,0.06)":"none",padding:"clamp(28px,3vw,38px) clamp(20px,2.5vw,28px)",height:"100%",display:"flex",flexDirection:"column"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",color:tier.hi?"var(--gold)":"var(--white-3)",marginBottom:10}}>{tier.name}</div>
                <div style={{marginBottom:5}}>
                  <span style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(24px,3.2vw,38px)",color:"var(--white)",letterSpacing:"-0.03em"}}>{tier.setup}</span>
                  <span style={{fontFamily:"var(--sans)",fontSize:10,color:"var(--white-3)",marginLeft:5,fontWeight:300}}>setup</span>
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--gold)",marginBottom:14,opacity:0.8}}>+ {tier.mo}</div>
                <p className="t-body" style={{fontSize:12,marginBottom:22,paddingBottom:22,borderBottom:"1px solid var(--bd)"}}>{tier.desc}</p>
                <ul style={{flex:1,listStyle:"none",display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
                  {tier.features.map((f,j)=>(
                    <li key={j} style={{display:"flex",alignItems:"flex-start",gap:8,fontFamily:"var(--sans)",fontSize:12,lineHeight:1.5,color:f.startsWith("Everything")?"var(--white-3)":"var(--white-2)",fontWeight:300,fontStyle:f.startsWith("Everything")?"italic":"normal"}}>
                      <Check size={10} style={{color:tier.hi?"var(--gold)":"var(--white-3)",flexShrink:0,marginTop:3}}/>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={go} className={`btn ${tier.hi?"btn-gold":"btn-ghost"}`} style={{width:"100%",justifyContent:"center",fontSize:9}} data-cursor="">
                  {tier.name==="Bespoke"?"Let's Talk":"Start a Project"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.5}} className="t-body" style={{textAlign:"center",marginTop:24,fontSize:11}}>
          50% deposit to begin · 50% at launch · cancel after 3 months · {" "}
          <button onClick={go} style={{background:"none",border:"none",cursor:"none",color:"var(--gold)",fontFamily:"var(--sans)",fontSize:11,fontWeight:300,textDecoration:"underline"}} data-cursor="">Need custom pricing?</button>
        </motion.p>
      </div>
    </section>
  );
}

export function Testimonials(){
  const{ref,vis}=useVis(0.08);
  const rots=[-2.5,2.0,-1.8];
  return(
    <section ref={ref} className="sect" style={{background:"var(--ink)"}}>
      <div className="pad cap">
        <div style={{marginBottom:52,maxWidth:500}}>
          <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}><span className="eyebrow">Social Proof</span></motion.div>
          <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}} className="t-h1" style={{color:"var(--white)"}}>Don't take<br/>our word for it.</motion.h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:20}} className="tg">
          {B.testimonials.map((t,i)=>(
            <motion.div key={t.name} initial={{opacity:0,y:54,rotate:rots[i]*2}} animate={vis?{opacity:1,y:0,rotate:rots[i]}:{}} transition={{delay:i*0.11,duration:0.92,ease:[0.16,1,0.3,1]}}
              whileHover={{rotate:0,y:-6,transition:{duration:0.4}}} className="card" style={{padding:"clamp(20px,2.5vw,30px)",cursor:"none"}} data-cursor="">
              <div style={{position:"absolute",top:20,right:20,fontFamily:"var(--serif)",fontSize:52,lineHeight:1,color:"rgba(200,169,81,0.06)"}}>"</div>
              <div style={{display:"flex",gap:3,marginBottom:16}}>
                {Array.from({length:5}).map((_,j)=><Star key={j} size={10} fill="var(--gold)" style={{color:"var(--gold)"}}/>)}
              </div>
              <blockquote style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:13,lineHeight:1.8,color:"var(--white-2)",marginBottom:20,fontStyle:"italic"}}>"{t.quote}"</blockquote>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(200,169,81,0.08)",border:"1px solid rgba(200,169,81,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontWeight:700,fontSize:10,color:"var(--gold)"}}>{t.init}</div>
                <div>
                  <div style={{fontFamily:"var(--serif)",fontWeight:600,fontSize:13,color:"var(--white)"}}>{t.name}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.1em",color:"var(--white-3)"}}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{opacity:0,y:26}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.42,duration:0.85}} className="card" style={{padding:"clamp(28px,4vw,52px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:"clamp(28px,4vw,52px)",top:32,fontFamily:"var(--serif)",fontWeight:800,fontSize:110,lineHeight:1,color:"rgba(200,169,81,0.035)"}}>"</div>
          <div style={{display:"flex",gap:3,marginBottom:20}}>
            {Array.from({length:5}).map((_,j)=><Star key={j} size={13} fill="var(--gold)" style={{color:"var(--gold)"}}/>)}
          </div>
          <blockquote style={{fontFamily:"var(--serif)",fontWeight:500,fontSize:"clamp(16px,2vw,24px)",lineHeight:1.45,letterSpacing:"-0.015em",color:"var(--white)",maxWidth:820,marginBottom:26}}>
            "{B.featured.quote}"
          </blockquote>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,rgba(200,169,81,0.12),rgba(200,169,81,0.04))",border:"1px solid rgba(200,169,81,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontWeight:700,fontSize:12,color:"var(--gold)"}}>{B.featured.init}</div>
            <div>
              <div style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:14,color:"var(--white)"}}>{B.featured.name}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.1em",color:"var(--white-3)"}}>{B.featured.project}</div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:900px){.tg{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

export function FAQ(){
  const{ref,vis}=useVis(0.05);
  const[open,setOpen]=useState<number|null>(0);
  const[cat,setCat]=useState("All");
  const cats=["All",...Array.from(new Set(B.faq.map(f=>f.cat)))];
  const filtered=cat==="All"?B.faq:B.faq.filter(f=>f.cat===cat);
  return(
    <section ref={ref} id="faq" className="sect" style={{background:"var(--ink-2)"}}>
      <div className="pad cap">
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"clamp(36px,6vw,80px)",alignItems:"start"}} className="fq-grid">
          <div style={{position:"sticky",top:88}}>
            <motion.div initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}} style={{marginBottom:18}}><span className="eyebrow">FAQ</span></motion.div>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}} className="t-h1" style={{color:"var(--white)",fontSize:"clamp(26px,4vw,52px)",marginBottom:18}}>
              Questions<br/>we get<br/>a lot.
            </motion.h2>
            <motion.p initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.2}} className="t-body" style={{marginBottom:26,fontSize:13}}>Still have questions?</motion.p>
            <motion.button initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.3}}
              onClick={()=>window.location.href="/contact"} className="btn btn-gold" style={{fontSize:9,marginBottom:30}} data-cursor="">Book Free Call →</motion.button>
            <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.35}} style={{display:"flex",flexDirection:"column",gap:3}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>{setCat(c);setOpen(null);}}
                  style={{background:"none",border:"none",cursor:"none",padding:"9px 0",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.12em",textTransform:"uppercase",color:cat===c?"var(--gold)":"var(--white-3)",fontWeight:cat===c?500:300,transition:"color 0.2s"}} data-cursor="">
                  {c}
                  {cat===c&&<span style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)"}}/>}
                </button>
              ))}
            </motion.div>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={cat} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.26}}>
                {filtered.map((item,i)=>(
                  <motion.div key={item.q} initial={{opacity:0,y:8}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:i*0.04}} style={{borderBottom:"1px solid var(--bd)"}}>
                    <button onClick={()=>setOpen(open===i?null:i)}
                      style={{width:"100%",background:"none",border:"none",cursor:"none",padding:"20px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:18,textAlign:"left"}} data-cursor="">
                      <span style={{fontFamily:"var(--serif)",fontWeight:open===i?600:400,fontSize:"clamp(13px,1.3vw,16px)",lineHeight:1.45,color:open===i?"var(--white)":"var(--white-2)",transition:"color 0.2s"}}>{item.q}</span>
                      <span style={{width:24,height:24,flexShrink:0,border:`1px solid ${open===i?"rgba(200,169,81,0.28)":"var(--bd)"}`,background:open===i?"rgba(200,169,81,0.06)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:open===i?"var(--gold)":"var(--white-3)",transition:"all 0.22s",marginTop:2}}>
                        {open===i?<Minus size={10}/>:<Plus size={10}/>}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open===i&&(
                        <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3,ease:[0.16,1,0.3,1]}} style={{overflow:"hidden"}}>
                          <p className="t-body" style={{paddingBottom:22,paddingRight:42,fontSize:13}}>{item.a}</p>
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
      <style>{`@media(max-width:900px){.fq-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
