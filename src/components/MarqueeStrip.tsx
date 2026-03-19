"use client";
const items = [
  "WEBSITES","AI VOICE AGENTS","SEO","BRANDING","LEAD SYSTEMS",
  "48-HOUR DELIVERY","AUTOMATION","CONVERSION","GROWTH",
  "WEBSITES","AI VOICE AGENTS","SEO","BRANDING","LEAD SYSTEMS",
  "48-HOUR DELIVERY","AUTOMATION","CONVERSION","GROWTH",
];
const Sep = () => (
  <span style={{ margin:"0 28px", color:"var(--accent)", opacity:0.3, fontSize:8 }}>◆</span>
);
export default function MarqueeStrip() {
  return (
    <div style={{
      borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",
      background:"rgba(0,229,255,0.02)", overflow:"hidden", padding:"16px 0",
    }}>
      <div className="marquee-inner">
        {items.map((t,i) => (
          <span key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <span className="mono" style={{fontSize:9,color:"#2a2a2a",whiteSpace:"nowrap"}}>{t}</span>
            <Sep/>
          </span>
        ))}
      </div>
    </div>
  );
}
