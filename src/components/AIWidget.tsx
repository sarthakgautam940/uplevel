"use client";
import{useState,useRef,useEffect}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{X,MessageSquare}from"lucide-react";
import{B}from"../../lib/brand";
type Msg={role:"ai"|"user";text:string};
const QR=["What does it cost?","How fast can you launch?","What do you build?","Do you work with HVAC?"];
const R:Record<string,string>={cost:`Starter from $3,500+$297/mo. Authority (most popular) $6,500+$497/mo. All month-to-month.`,fast:`Most builds live within 48 hours of intake form + deposit. Record: 29 hours.`,build:`Four systems: Website Systems, AI Phone Concierge, SEO & Growth, Brand Identity — usually bundled.`,hvac:`Yes — HVAC is a top vertical. Storm/emergency pages, AI for urgent calls, review automation. Let's talk.`,default:`Great question — book a free 15-min call and I'll get you a full answer from the team.`};
const get=(m:string)=>{const ml=m.toLowerCase();if(ml.match(/cost|price|how much/))return R.cost;if(ml.match(/fast|quick|launch|hours/))return R.fast;if(ml.match(/build|service|offer|what do/))return R.build;if(ml.match(/hvac|roof|plumb/))return R.hvac;return R.default;};
export default function AIWidget(){
  const[open,setOpen]=useState(false);
  const[msgs,setMsgs]=useState<Msg[]>([{role:"ai",text:"Hey — I'm Aria, UpLevel's AI. I can answer questions about services, pricing, and process. What would you like to know?"}]);
  const[inp,setInp]=useState("");
  const[typing,setTyping]=useState(false);
  const endRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async(text:string)=>{if(!text.trim())return;setMsgs(m=>[...m,{role:"user",text}]);setInp("");setTyping(true);await new Promise(r=>setTimeout(r,750+Math.random()*450));setTyping(false);setMsgs(m=>[...m,{role:"ai",text:get(text)}]);};
  return(<>
    <motion.button initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:3,duration:0.5,ease:[0.34,1.56,0.64,1]}}
      onClick={()=>setOpen(true)} aria-label="Chat with Aria"
      style={{position:"fixed",bottom:22,right:22,zIndex:400,width:46,height:46,borderRadius:"50%",background:"var(--ink)",border:"1px solid rgba(200,169,81,0.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"none",color:"var(--gold)",animation:"wPulse 3.5s ease-in-out infinite"}} data-cursor="CHAT">
      <MessageSquare size={18}/>
    </motion.button>
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0,scale:0.92,y:14}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.92,y:14}} transition={{duration:0.36,ease:[0.16,1,0.3,1]}}
          style={{position:"fixed",bottom:76,right:22,zIndex:400,width:"min(350px,calc(100vw-32px))",background:"var(--ink-2)",border:"1px solid var(--bd-hi)",boxShadow:"0 24px 80px rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",maxHeight:"66vh"}}>
          <div style={{padding:"13px 18px",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(200,169,81,0.1)",border:"1px solid rgba(200,169,81,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:9,fontWeight:700,color:"var(--gold)"}}>AI</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:12,color:"var(--white)"}}>ARIA</div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)",opacity:0.7}}/><span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--white-3)"}}>UpLevel AI · Online</span></div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",cursor:"none",color:"var(--white-3)",padding:4}} data-cursor=""><X size={13}/></button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:11,scrollbarWidth:"none"}}>
            {msgs.map((m,i)=>(
              <motion.div key={i} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{duration:0.2}} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"83%",padding:"9px 13px",background:m.role==="user"?"var(--gold)":"rgba(247,244,238,0.03)",border:m.role==="user"?"none":"1px solid var(--bd)",fontFamily:"var(--sans)",fontSize:12,lineHeight:1.65,color:m.role==="user"?"var(--ink)":"var(--white-2)",fontWeight:300,borderRadius:m.role==="user"?"10px 10px 2px 10px":"10px 10px 10px 2px"}}>{m.text}</div>
              </motion.div>
            ))}
            {typing&&<div style={{display:"flex",gap:4,padding:"9px 13px",alignSelf:"flex-start"}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",opacity:0.4,animation:`tDot 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}</div>}
            <div ref={endRef}/>
          </div>
          {msgs.length===1&&<div style={{padding:"0 14px 10px",display:"flex",flexWrap:"wrap",gap:5}}>{QR.map(q=><button key={q} onClick={()=>send(q)} data-cursor="" style={{background:"none",border:"1px solid var(--bd)",padding:"4px 9px",fontFamily:"var(--sans)",fontSize:10,color:"var(--white-3)",cursor:"none",borderRadius:18,transition:"all 0.2s",fontWeight:300}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(200,169,81,0.3)";(e.currentTarget as HTMLElement).style.color="var(--gold)";}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--bd)";(e.currentTarget as HTMLElement).style.color="var(--white-3)";}}>{q}</button>)}</div>}
          <div style={{padding:"10px 14px",borderTop:"1px solid var(--bd)",display:"flex",gap:7,flexShrink:0}}>
            <input type="text" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(inp)} placeholder="Ask anything..." style={{flex:1,background:"rgba(247,244,238,0.02)",border:"1px solid var(--bd)",padding:"8px 12px",fontFamily:"var(--sans)",fontSize:12,color:"var(--white)",outline:"none",borderRadius:18,fontWeight:300}}/>
            <button onClick={()=>send(inp)} data-cursor="" style={{width:30,height:30,borderRadius:"50%",background:"var(--gold)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"none",color:"var(--ink)",flexShrink:0}}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <style>{`@keyframes wPulse{0%,100%{box-shadow:0 0 0 0 rgba(200,169,81,0.3);}50%{box-shadow:0 0 0 8px rgba(200,169,81,0);}}@keyframes tDot{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-4px);opacity:1;}}`}</style>
  </>);
}
