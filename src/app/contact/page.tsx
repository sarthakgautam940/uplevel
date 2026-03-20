"use client";
import{useState}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{CheckCircle,Phone,Mail,User,Building2}from"lucide-react";
import dynamic from"next/dynamic";
import Nav from"@/components/Nav";
import Footer from"@/components/Footer";
import{B}from"../../../lib/brand";
const Cursor=dynamic(()=>import("@/components/Cursor"),{ssr:false});
const SmoothScroll=dynamic(()=>import("@/components/SmoothScroll"),{ssr:false});
type FD={name:string;business:string;email:string;phone:string;service:string;message:string};
const svcs=["Website System","AI Concierge","SEO & Growth","Brand Identity","Full Package","Not sure"];
export default function Contact(){
  const[d,setD]=useState<FD>({name:"",business:"",email:"",phone:"",service:"",message:""});
  const[sent,setSent]=useState(false);
  const[loading,setLoading]=useState(false);
  const upd=(k:keyof FD,v:string)=>setD(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!d.name||!d.email)return;setLoading(true);await new Promise(r=>setTimeout(r,1100));setLoading(false);setSent(true);};
  const inp=(extra:React.CSSProperties={}):React.CSSProperties=>({width:"100%",background:"rgba(247,244,238,0.02)",border:"none",borderBottom:"1px solid var(--bd-hi)",padding:"12px 0 12px 34px",fontFamily:"var(--sans)",fontSize:13,color:"var(--white)",outline:"none",transition:"border-color 0.25s",fontWeight:300,...extra});
  return(<>
    <Cursor/><SmoothScroll/>
    <Nav/>
    <main style={{background:"var(--ink)",minHeight:"100vh",paddingTop:64}}>
      <section style={{padding:"clamp(80px,12vw,140px) clamp(20px,4vw,64px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(40px,6vw,80px)",alignItems:"center"}} className="ct-grid">
            <div>
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{marginBottom:22}}><span className="eyebrow">Get Started</span></motion.div>
              <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:1,ease:[0.16,1,0.3,1]}} className="t-display" style={{color:"var(--white)",marginBottom:22}}>
                Let&apos;s build<br/><span style={{fontStyle:"italic"}}>your system.</span>
              </motion.h1>
              <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="t-body" style={{marginBottom:40,fontSize:15}}>
                Fill out the form or book a free 15-minute call. We&apos;ll show you exactly what your system will look like — no commitment required.
              </motion.p>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.45}}
                style={{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 16px",border:"1px solid rgba(200,169,81,0.16)",background:"rgba(200,169,81,0.035)"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",animation:"dot-pulse 2.5s ease-in-out infinite"}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--gold)"}}>
                  {B.slots} CLIENT SLOT AVAILABLE
                </span>
              </motion.div>
            </div>
            <motion.div initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{delay:0.22,duration:0.85,ease:[0.16,1,0.3,1]}}>
              <AnimatePresence mode="wait">
                {!sent?(
                  <motion.form key="form" onSubmit={submit} exit={{opacity:0,y:-18}}
                    style={{background:"var(--ink-2)",border:"1px solid var(--bd)",padding:"clamp(28px,4vw,44px)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                      {[{k:"name",p:"Your name"},{k:"business",p:"Business name"}].map(f=>(
                        <input key={f.k} type="text" placeholder={f.p} value={d[f.k as keyof FD]} onChange={e=>upd(f.k as keyof FD,e.target.value)} style={{...inp(),paddingLeft:0}} onFocus={e=>e.target.style.borderColor="rgba(200,169,81,0.35)"} onBlur={e=>e.target.style.borderColor="var(--bd-hi)"}/>
                      ))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                      <input type="email" placeholder="Email" value={d.email} onChange={e=>upd("email",e.target.value)} style={{...inp(),paddingLeft:0}} onFocus={e=>e.target.style.borderColor="rgba(200,169,81,0.35)"} onBlur={e=>e.target.style.borderColor="var(--bd-hi)"}/>
                      <input type="tel" placeholder="Phone (optional)" value={d.phone} onChange={e=>upd("phone",e.target.value)} style={{...inp(),paddingLeft:0}} onFocus={e=>e.target.style.borderColor="rgba(200,169,81,0.35)"} onBlur={e=>e.target.style.borderColor="var(--bd-hi)"}/>
                    </div>
                    <div style={{marginBottom:16}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--white-3)",marginBottom:8}}>I need help with...</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                        {svcs.map(s=>(
                          <button key={s} type="button" onClick={()=>upd("service",s)} data-cursor=""
                            style={{background:d.service===s?"rgba(200,169,81,0.08)":"transparent",border:`1px solid ${d.service===s?"rgba(200,169,81,0.28)":"var(--bd)"}`,padding:"6px 10px",cursor:"none",fontFamily:"var(--sans)",fontSize:11,color:d.service===s?"var(--gold)":"var(--white-3)",fontWeight:300,transition:"all 0.2s"}}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea placeholder="Tell us about your goals..." value={d.message} onChange={e=>upd("message",e.target.value)} rows={3}
                      style={{...inp({paddingLeft:0,resize:"none",display:"block"}),marginBottom:18}}
                      onFocus={e=>e.target.style.borderColor="rgba(200,169,81,0.35)"} onBlur={e=>e.target.style.borderColor="var(--bd-hi)"}/>
                    <button type="submit" className="btn btn-gold" disabled={loading} style={{width:"100%",justifyContent:"center",fontSize:9}} data-cursor="">
                      {loading?"Sending...":"Send Message →"}
                    </button>
                    <div style={{textAlign:"center",marginTop:16,fontFamily:"var(--sans)",fontSize:11,color:"var(--white-3)",fontWeight:300}}>
                      Or: <a href={B.calendly} target="_blank" rel="noopener noreferrer" style={{color:"var(--gold)",textDecoration:"underline"}}>Schedule 15-min call →</a>
                    </div>
                  </motion.form>
                ):(
                  <motion.div key="done" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.5,ease:[0.34,1.56,0.64,1]}}
                    style={{background:"var(--ink-2)",border:"1px solid rgba(200,169,81,0.22)",padding:"56px 40px",textAlign:"center"}}>
                    <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(200,169,81,0.08)",border:"1px solid rgba(200,169,81,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"var(--gold)"}}>
                      <CheckCircle size={20}/>
                    </div>
                    <h3 style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:26,color:"var(--white)",marginBottom:10,letterSpacing:"-0.02em"}}>Message received.</h3>
                    <p className="t-body" style={{fontSize:13}}>We&apos;ll be in touch within 24 hours — usually much faster.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
    <style>{`@media(max-width:900px){.ct-grid{grid-template-columns:1fr!important;}}input::placeholder,textarea::placeholder{color:var(--white-3);}`}</style>
  </>);
}
