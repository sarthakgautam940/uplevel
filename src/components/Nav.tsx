"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { B } from "../../lib/brand";

const LINKS = [
  { label:"Work",     href:"/work"     },
  { label:"Services", href:"/services" },
  { label:"Process",  href:"/#process" },
  { label:"Pricing",  href:"/#pricing" },
  { label:"Contact",  href:"/contact"  },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [mob,   setMob]   = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mob ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mob]);

  const go = (href: string, e: React.MouseEvent) => {
    e.preventDefault(); setMob(false);
    if (href.startsWith("/#")) {
      if (path === "/") document.getElementById(href.slice(2))?.scrollIntoView({ behavior:"smooth" });
      else { window.location.href = href; }
    } else { window.location.href = href; }
  };

  return (
    <>
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:500,
        height:64, padding:"0 clamp(20px,4vw,64px)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: stuck ? "rgba(5,5,10,0.88)" : "transparent",
        backdropFilter: stuck ? "blur(24px) saturate(160%)" : "none",
        WebkitBackdropFilter: stuck ? "blur(24px) saturate(160%)" : "none",
        borderBottom: stuck ? "1px solid var(--bd)" : "1px solid transparent",
        transition:"background .5s, border-color .5s",
      }}>
        <Link href="/" data-cursor="" style={{
          fontFamily:"var(--f-disp)", fontWeight:900, fontSize:15,
          letterSpacing:"0.08em", textTransform:"uppercase",
          color:"var(--t1)", textDecoration:"none", cursor:"none",
          display:"flex", flexDirection:"column", gap:3, lineHeight:1,
        }}>
          <span>UP<span style={{color:"var(--el)"}}>LEVEL</span></span>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:7, letterSpacing:"0.32em", color:"var(--t3)" }}>SERVICES</span>
        </Link>

        <nav className="desk" style={{ display:"flex", gap:32, alignItems:"center" }}>
          {LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={e=>go(l.href,e)} data-cursor=""
              style={{
                fontFamily:"var(--f-mono)", fontSize:8.5, letterSpacing:"0.14em",
                textTransform:"uppercase", color: path===l.href ? "var(--t1)" : "var(--t2)",
                textDecoration:"none", cursor:"none", transition:"color .2s",
                position:"relative",
              }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--t1)"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=path===l.href?"var(--t1)":"var(--t2)"}
            >{l.label}</a>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div className="desk" style={{
            display:"flex", alignItems:"center", gap:7, padding:"6px 12px",
            border:"1px solid var(--bd-el)", background:"var(--el-lo)",
          }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--el)", animation:"elPulse 2.5s ease-in-out infinite" }} />
            <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--el)" }}>
              {B.slots} SLOT OPEN
            </span>
          </div>
          <a href="/contact" onClick={e=>go("/contact",e)} className="btn btn-el" data-cursor="START"
            style={{ padding:"10px 20px", fontSize:9 }}>Start a Project</a>
          <button onClick={()=>setMob(!mob)} className="mob" data-cursor="" aria-label="Menu"
            style={{ background:"none", border:"1px solid var(--bd-hi)", width:36, height:36, cursor:"none",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5 }}>
            {[0,1,2].map(i=>(
              <span key={i} style={{ width:16, height:1, background:"var(--t1)", display:"block",
                transition:"transform .28s var(--expo), opacity .28s",
                transform: mob&&i===0?"rotate(45deg) translate(4px,4px)":mob&&i===2?"rotate(-45deg) translate(4px,-4px)":"none",
                opacity: mob&&i===1?0:1 }} />
            ))}
          </button>
        </div>
      </header>

      {mob && (
        <div style={{
          position:"fixed", inset:0, zIndex:490, background:"rgba(5,5,10,0.97)",
          backdropFilter:"blur(24px)", display:"flex", flexDirection:"column",
          padding:"80px clamp(20px,4vw,64px) 40px",
        }}>
          {LINKS.map((l,i)=>(
            <a key={l.label} href={l.href} onClick={e=>go(l.href,e)}
              style={{
                fontFamily:"var(--f-disp)", fontWeight:700,
                fontSize:"clamp(28px,7vw,44px)", letterSpacing:"-0.022em",
                color:"var(--t1)", textDecoration:"none", padding:"14px 0",
                borderBottom:"1px solid var(--bd)",
                animation:`navIn .4s var(--expo) ${i*.05}s both`,
              }}>{l.label}</a>
          ))}
          <a href="/contact" onClick={e=>go("/contact",e)} className="btn btn-el"
            style={{ marginTop:32, alignSelf:"flex-start" }}>Start a Project →</a>
        </div>
      )}
      <style>{`@keyframes navIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
}
