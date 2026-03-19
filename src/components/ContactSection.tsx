"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Phone, Mail, User, Building } from "lucide-react";
import { brand } from "../../lib/brand.config";

interface FD { name:string;business:string;email:string;phone:string;service:string;message:string; }
const svcs=["Website System","AI Concierge","SEO & Growth","Brand Identity","Full Package","Not sure"];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [d, setD] = useState<FD>({name:"",business:"",email:"",phone:"",service:"",message:""});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const upd=(k:keyof FD,v:string)=>setD(p=>({...p,[k]:v}));
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!d.name||!d.email) return;
    setSending(true);
    await new Promise(r=>setTimeout(r,1100));
    setSending(false); setSent(true);
  };

  const inp: React.CSSProperties = {
    width:"100%",background:"rgba(255,255,255,0.025)",border:"1px solid var(--border)",
    padding:"13px 15px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#fff",outline:"none",
  };

  return (
    <section ref={ref} id="contact" className="section" style={{background:"var(--s1)",position:"relative",overflow:"hidden"}}>
      {/* Bg glow */}
      <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",
        width:"70vw",height:"50vw",
        background:"radial-gradient(ellipse,rgba(0,229,255,0.025) 0%,transparent 70%)",
        pointerEvents:"none"}}/>

      <div className="wrap max" style={{position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}} className="contact-grid">

          {/* Left */}
          <div>
            <motion.span initial={{opacity:0,y:12}} animate={vis?{opacity:1,y:0}:{}}
              className="eyebrow" style={{display:"flex",marginBottom:20}}>Get Started</motion.span>
            <motion.h2 initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.1}}
              className="h-lg" style={{color:"#fff",marginBottom:20}}>Let's build<br/>your system.</motion.h2>
            <motion.p initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.2}}
              className="body" style={{marginBottom:40,fontSize:15}}>
              Fill out the form or book a 15-minute discovery call. We'll build you a free preview of your site — no commitment required.
            </motion.p>
            <motion.div initial={{opacity:0,y:16}} animate={vis?{opacity:1,y:0}:{}} transition={{delay:0.3}}
              style={{display:"flex",flexDirection:"column",gap:14,marginBottom:40}}>
              {[
                {icon:<Phone size={13}/>,text:"Response within 24 hours — usually same day"},
                {icon:<Mail size={13}/>,text:"No pressure, no pitch — just answers"},
                {icon:<CheckCircle size={13}/>,text:"Free site audit included with every discovery call"},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{width:30,height:30,borderRadius:2,
                    background:"rgba(0,229,255,0.07)",border:"1px solid rgba(0,229,255,0.12)",
                    display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)",flexShrink:0}}>
                    {p.icon}
                  </span>
                  <span className="body" style={{fontSize:13}}>{p.text}</span>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{opacity:0}} animate={vis?{opacity:1}:{}} transition={{delay:0.4}}
              style={{display:"inline-flex",alignItems:"center",gap:10,padding:"11px 18px",
                border:"1px solid rgba(0,229,255,0.15)",background:"rgba(0,229,255,0.04)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",
                animation:"pulse-dot 2s ease-in-out infinite"}}/>
              <span className="mono" style={{fontSize:8,color:"var(--accent)"}}>
                {brand.availability.slotsTotal-brand.availability.slotsTaken} CLIENT SLOT{brand.availability.slotsTotal-brand.availability.slotsTaken!==1?"S":""} AVAILABLE · {brand.availability.currentBookingQuarter}
              </span>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div initial={{opacity:0,x:30}} animate={vis?{opacity:1,x:0}:{}}
            transition={{delay:0.25,duration:0.8,ease:[0.16,1,0.3,1]}}>
            <AnimatePresence mode="wait">
              {!sent?(
                <motion.form key="form" onSubmit={submit} exit={{opacity:0,y:-20}}
                  style={{background:"var(--s2)",border:"1px solid var(--border)",padding:"38px 34px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {[{k:"name",p:"Your name",icon:<User size={12}/>},{k:"business",p:"Business name",icon:<Building size={12}/>}].map(f=>(
                      <div key={f.k} style={{position:"relative"}}>
                        <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#2a2a2a",pointerEvents:"none"}}>{f.icon}</span>
                        <input type="text" placeholder={f.p} value={d[f.k as keyof FD]}
                          onChange={e=>upd(f.k as keyof FD,e.target.value)}
                          style={{...inp,paddingLeft:38}}
                          onFocus={e=>{e.target.style.borderColor="rgba(0,229,255,0.3)";}}
                          onBlur={e=>{e.target.style.borderColor="var(--border)";}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {[{k:"email",p:"Email address",t:"email",icon:<Mail size={12}/>},{k:"phone",p:"Phone (optional)",t:"tel",icon:<Phone size={12}/>}].map(f=>(
                      <div key={f.k} style={{position:"relative"}}>
                        <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#2a2a2a",pointerEvents:"none"}}>{f.icon}</span>
                        <input type={f.t} placeholder={f.p} value={d[f.k as keyof FD]}
                          onChange={e=>upd(f.k as keyof FD,e.target.value)}
                          style={{...inp,paddingLeft:38}}
                          onFocus={e=>{e.target.style.borderColor="rgba(0,229,255,0.3)";}}
                          onBlur={e=>{e.target.style.borderColor="var(--border)";}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:10}}>
                    <div className="mono" style={{fontSize:8,color:"#2a2a2a",marginBottom:8}}>I need help with...</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {svcs.map(s=>(
                        <button key={s} type="button" onClick={()=>upd("service",s)} data-cursor=""
                          style={{background:d.service===s?"rgba(0,229,255,0.08)":"transparent",
                            border:`1px solid ${d.service===s?"rgba(0,229,255,0.3)":"var(--border)"}`,
                            padding:"6px 10px",cursor:"none",fontFamily:"'DM Sans',sans-serif",
                            fontSize:11,color:d.service===s?"var(--accent)":"#2a2a2a",
                            transition:"all 0.2s"}}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder="Tell us about your business and goals..." value={d.message}
                    onChange={e=>upd("message",e.target.value)} rows={3}
                    style={{...inp,resize:"none",marginBottom:18,display:"block"}}
                    onFocus={e=>{e.target.style.borderColor="rgba(0,229,255,0.3)";}}
                    onBlur={e=>{e.target.style.borderColor="var(--border)";}}/>
                  <button type="submit" className="btn btn-fill" disabled={sending}
                    style={{width:"100%",justifyContent:"center",fontSize:10}} data-cursor="">
                    {sending?"SENDING...":"SEND MESSAGE →"}
                  </button>
                  <div style={{textAlign:"center",marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#2a2a2a"}}>
                    Or book directly:{" "}
                    <a href={brand.calendlyUrl} target="_blank" rel="noopener noreferrer"
                      style={{color:"var(--accent)",textDecoration:"underline"}}>Schedule 15-min call →</a>
                  </div>
                </motion.form>
              ):(
                <motion.div key="done" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                  transition={{duration:0.5,ease:[0.34,1.56,0.64,1]}}
                  style={{background:"var(--s2)",border:"1px solid rgba(0,229,255,0.25)",
                    padding:"60px 40px",textAlign:"center",boxShadow:"0 0 48px rgba(0,229,255,0.05)"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",
                    background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.18)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    margin:"0 auto 22px",color:"var(--accent)"}}>
                    <CheckCircle size={22}/>
                  </div>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,
                    color:"#fff",letterSpacing:"-0.02em",marginBottom:10}}>Message received.</h3>
                  <p className="body" style={{fontSize:14}}>
                    We'll be in touch within 24 hours — usually much faster.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.contact-grid{grid-template-columns:1fr!important;}}
        input::placeholder,textarea::placeholder{color:var(--text3);}
      `}</style>
    </section>
  );
}
