"use client";
import { brand } from "../../lib/brand.config";

const cols = {
  Services: ["Website Systems","AI Phone Concierge","SEO & Growth","Brand Identity","Review Automation"],
  Company: ["About","Process","Pricing","Case Studies","Blog"],
  Legal: ["Privacy Policy","Terms of Service","Refund Policy"],
};

export default function Footer() {
  const yr = new Date().getFullYear();
  const slots = brand.availability.slotsTotal - brand.availability.slotsTaken;

  return (
    <footer style={{
      background:"var(--void)",borderTop:"1px solid var(--border)",
      padding:"60px clamp(20px,4vw,64px) 28px",
    }}>
      <div style={{ maxWidth:1440, margin:"0 auto" }}>
        <div style={{
          display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,
          marginBottom:56,paddingBottom:56,borderBottom:"1px solid var(--border)",
        }} className="footer-grid">

          {/* Brand col */}
          <div>
            <div style={{ marginBottom:14 }}>
              <div style={{
                fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,
                letterSpacing:"0.06em",textTransform:"uppercase",color:"#fff",
              }}>
                UP<span style={{color:"var(--accent)"}}>LEVEL</span>
              </div>
              <div style={{
                fontFamily:"'Space Mono',monospace",fontSize:7,letterSpacing:"0.28em",
                textTransform:"uppercase",color:"#1a1a1a",marginTop:3,
              }}>SERVICES</div>
            </div>
            <p className="body" style={{maxWidth:260,marginBottom:20,fontSize:12}}>
              Premium website systems, AI automation, and growth infrastructure for elite contractors.
            </p>
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {[
                {href:brand.social.instagram,label:"IN"},
                {href:brand.social.linkedin,label:"LI"},
                {href:brand.social.facebook,label:"FB"},
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width:30,height:30,border:"1px solid var(--border)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Space Mono',monospace",fontSize:8,color:"#2a2a2a",
                    textDecoration:"none",transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(0,229,255,0.3)";(e.currentTarget as HTMLElement).style.color="var(--accent)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="#2a2a2a";}}
                >{s.label}</a>
              ))}
            </div>
            <a href={`mailto:${brand.email}`}
              style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#2a2a2a",textDecoration:"none",transition:"color 0.2s"}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--accent)"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="#2a2a2a"}
            >{brand.email}</a>
          </div>

          {Object.entries(cols).map(([heading,links])=>(
            <div key={heading}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,fontWeight:700,
                letterSpacing:"0.2em",textTransform:"uppercase",color:"#1a1a1a",marginBottom:18}}>
                {heading}
              </div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                {links.map(l=>(
                  <li key={l}>
                    <a href="#" style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#2a2a2a",
                      textDecoration:"none",transition:"color 0.2s"}}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="#fff"}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="#2a2a2a"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#1a1a1a"}}>
            © {yr} UpLevel Services LLC · Virginia LLC · All rights reserved.
          </span>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:"var(--accent)",opacity:0.6}}/>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.14em",
              textTransform:"uppercase",color:"#1a1a1a"}}>
              {slots} slot{slots!==1?"s":""} available
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </footer>
  );
}
