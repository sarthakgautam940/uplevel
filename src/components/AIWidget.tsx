"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare } from "lucide-react";
import { brand } from "../../lib/brand.config";

type Msg = { role:"ai"|"user"; text:string };

const QR = ["What does it cost?","How fast can you launch?","What services do you offer?","Do you work with HVAC?"];

const RESP: Record<string,string> = {
  cost:"Starter builds from $3,500 + $297/mo. Our most popular Authority package is $6,500 + $497/mo. All month-to-month, no lock-in.",
  fast:"Most builds go live within 48 hours of your intake form and deposit. Our record is 29 hours.",
  service:"We build four systems: Website Systems, AI Phone Concierge (24/7), SEO & Local Growth, and Brand Identity. Usually sold as bundles.",
  hvac:"Absolutely — HVAC is a top vertical. We have storm/emergency landing pages and AI that qualifies urgent service calls. Let's talk.",
  default:"Great question — I'd love to get you a proper answer on a free 15-minute discovery call. Want to book one?",
};

const getResp = (msg:string) => {
  const m = msg.toLowerCase();
  if (m.match(/cost|price|how much|\$/)) return RESP.cost;
  if (m.match(/fast|quick|launch|time|hours|48/)) return RESP.fast;
  if (m.match(/service|offer|build|what do/)) return RESP.service;
  if (m.match(/hvac|roofing|plumb|contractor/)) return RESP.hvac;
  return RESP.default;
};

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{role:"ai",text:brand.aiConcierge.greeting}]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send = async (text:string) => {
    if (!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]);
    setInput(""); setTyping(true);
    await new Promise(r=>setTimeout(r,800+Math.random()*500));
    setTyping(false);
    setMsgs(m=>[...m,{role:"ai",text:getResp(text)}]);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{scale:0,opacity:0}}
        animate={{scale:1,opacity:1}}
        transition={{delay:2.5,duration:0.5,ease:[0.34,1.56,0.64,1]}}
        onClick={()=>setOpen(true)}
        style={{
          position:"fixed",bottom:24,right:24,zIndex:300,
          width:48,height:48,borderRadius:"50%",
          background:"var(--void)",border:"1px solid rgba(0,229,255,0.3)",
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"none",color:"var(--accent)",
          animation:"widgetPulse 3s ease-in-out infinite",
          boxShadow:"0 0 20px rgba(0,229,255,0.1)",
        }}
        data-cursor="CHAT"
        aria-label="Chat with ARIA"
      >
        <MessageSquare size={18}/>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,scale:0.9,y:16,originX:1,originY:1}}
            animate={{opacity:1,scale:1,y:0}}
            exit={{opacity:0,scale:0.9,y:16}}
            transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
            style={{
              position:"fixed",bottom:80,right:24,zIndex:300,
              width:"min(360px,calc(100vw-32px))",
              background:"var(--s1)",border:"1px solid var(--border)",
              backdropFilter:"blur(24px)",
              boxShadow:"0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,229,255,0.05)",
              display:"flex",flexDirection:"column",maxHeight:"68vh",
            }}
          >
            {/* Header */}
            <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",
              display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
              <div style={{width:28,height:28,borderRadius:"50%",
                background:"linear-gradient(135deg,rgba(0,229,255,0.15),rgba(255,69,0,0.1))",
                border:"1px solid rgba(0,229,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,color:"var(--accent)"}}>
                AI
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#fff"}}>
                  {brand.aiConcierge.name}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:"var(--accent)",opacity:0.8}}/>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#2a2a2a"}}>UpLevel AI · Online</span>
                </div>
              </div>
              <button onClick={()=>setOpen(false)}
                style={{background:"none",border:"none",cursor:"none",color:"#2a2a2a",padding:4}} data-cursor="">
                <X size={14}/>
              </button>
            </div>

            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"18px",display:"flex",
              flexDirection:"column",gap:12,scrollbarWidth:"none"}}>
              {msgs.map((m,i)=>(
                <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                  transition={{duration:0.25}} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{
                    maxWidth:"82%",padding:"9px 13px",
                    background:m.role==="user"?"var(--warm)":"rgba(0,229,255,0.05)",
                    border:m.role==="user"?"none":"1px solid rgba(0,229,255,0.1)",
                    fontFamily:"'DM Sans',sans-serif",fontSize:12,lineHeight:1.65,
                    color:m.role==="user"?"#fff":"#555",
                    borderRadius:m.role==="user"?"10px 10px 2px 10px":"10px 10px 10px 2px",
                  }}>{m.text}</div>
                </motion.div>
              ))}
              {typing&&(
                <div style={{display:"flex",gap:4,padding:"9px 13px",alignSelf:"flex-start"}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",opacity:0.4,
                      animation:`typingDot 1.2s ease-in-out ${i*0.2}s infinite`}}/>
                  ))}
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {/* Quick replies */}
            {msgs.length===1&&(
              <div style={{padding:"0 14px 10px",display:"flex",flexWrap:"wrap",gap:5}}>
                {QR.map(q=>(
                  <button key={q} onClick={()=>send(q)} data-cursor=""
                    style={{background:"none",border:"1px solid var(--border)",
                      padding:"4px 9px",fontFamily:"'DM Sans',sans-serif",
                      fontSize:10,color:"#2a2a2a",cursor:"none",borderRadius:18,
                      transition:"all 0.2s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(0,229,255,0.3)";(e.currentTarget as HTMLElement).style.color="var(--accent)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="#2a2a2a";}}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",
              display:"flex",gap:7,flexShrink:0}}>
              <input type="text" value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)}
                placeholder="Ask anything..."
                style={{flex:1,background:"rgba(255,255,255,0.025)",border:"1px solid var(--border)",
                  padding:"9px 13px",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#fff",
                  outline:"none",borderRadius:18}}
              />
              <button onClick={()=>send(input)} data-cursor=""
                style={{width:32,height:32,borderRadius:"50%",background:"var(--warm)",
                  border:"none",display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"none",color:"#fff",flexShrink:0}}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 5.5h9M5.5 1l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes widgetPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,255,0.3),0 0 20px rgba(0,229,255,0.1);}50%{box-shadow:0 0 0 8px rgba(0,229,255,0),0 0 20px rgba(0,229,255,0.1);}}
        @keyframes typingDot{0%,100%{transform:translateY(0);opacity:0.4;}50%{transform:translateY(-4px);opacity:1;}}
      `}</style>
    </>
  );
}
