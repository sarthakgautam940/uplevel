"use client";
import { B } from "../../lib/brand";
export default function Footer(){
  const yr=new Date().getFullYear();
  const cols={"Services":["Website Systems","AI Phone Concierge","SEO & Growth","Brand Identity"],"Company":["Work","Process","Pricing","Contact"],"Legal":["Privacy","Terms","Refund Policy"]};
  return(
    <footer style={{background:"var(--ink)",borderTop:"1px solid var(--bd)",padding:"clamp(48px,7vw,80px) clamp(20px,4vw,64px) 28px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        {/* Animated large wordmark */}
        <div style={{paddingBottom:"clamp(36px,6vw,56px)",marginBottom:"clamp(36px,6vw,56px)",borderBottom:"1px solid var(--bd)",overflow:"hidden"}}>
          <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(48px,9.5vw,128px)",lineHeight:0.85,letterSpacing:"-0.03em",color:"transparent",WebkitTextStroke:"1px rgba(200,169,81,0.14)",userSelect:"none",animation:"footerWm 9s ease-in-out infinite"}}>
            UP<span style={{color:"rgba(200,169,81,0.14)"}}>LEVEL</span>
          </div>
          <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(48px,9.5vw,128px)",lineHeight:0.85,letterSpacing:"-0.03em",color:"transparent",WebkitTextStroke:"1px rgba(200,169,81,0.07)",userSelect:"none",transform:"translateX(18%)",animation:"footerWm 9s ease-in-out infinite 2.5s"}}>
            SERVICES
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:44,marginBottom:48,paddingBottom:48,borderBottom:"1px solid var(--bd)"}} className="ft-grid">
          <div>
            <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:15,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--white)",marginBottom:3}}>UP<span style={{color:"var(--gold)"}}>LEVEL</span></div>
            <div style={{fontFamily:"var(--mono)",fontSize:7,letterSpacing:"0.28em",textTransform:"uppercase",color:"var(--white-3)",marginBottom:14}}>SERVICES</div>
            <p className="t-body" style={{maxWidth:250,marginBottom:18,fontSize:12}}>Premium website systems, AI automation, and growth infrastructure for elite contractors.</p>
            <a href={`mailto:${B.email}`} style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.1em",color:"var(--white-3)",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--gold)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--white-3)"}>{B.email}</a>
          </div>
          {Object.entries(cols).map(([h,links])=>(
            <div key={h}>
              <div style={{fontFamily:"var(--mono)",fontSize:7,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--white-3)",marginBottom:16}}>{h}</div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                {links.map(l=>(
                  <li key={l}><a href="#" style={{fontFamily:"var(--sans)",fontSize:12,color:"var(--white-3)",textDecoration:"none",fontWeight:300,transition:"color 0.2s"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--white)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--white-3)"}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.12em",color:"var(--white-3)"}}>© {yr} UPLEVEL SERVICES LLC · VIRGINIA LLC</span>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)",opacity:0.5}}/>
            <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--white-3)"}}>{B.slots} SLOT AVAILABLE</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:600px){.ft-grid{grid-template-columns:1fr!important;}}@keyframes footerWm{0%,100%{opacity:1;}50%{opacity:0.55;}}`}</style>
    </footer>
  );
}
