"use client";
import dynamic from"next/dynamic";
import Nav from"@/components/Nav";
import{Services,Stats,Process,Pricing}from"@/components/Sections";
import Footer from"@/components/Footer";
const Cursor=dynamic(()=>import("@/components/Cursor"),{ssr:false});
const SmoothScroll=dynamic(()=>import("@/components/SmoothScroll"),{ssr:false});
export default function ServicesPage(){
  return(<>
    <Cursor/><SmoothScroll/>
    <Nav/>
    <main style={{background:"var(--ink)",paddingTop:64}}>
      <div style={{padding:"clamp(80px,12vw,140px) clamp(20px,4vw,64px) 0"}}>
        <div style={{maxWidth:1400,margin:"0 auto",marginBottom:"clamp(60px,8vw,100px)"}}>
          <span className="eyebrow" style={{display:"flex",marginBottom:22}}>What We Offer</span>
          <h1 className="t-display" style={{color:"var(--white)",maxWidth:700}}>Four systems.<br/><span style={{fontStyle:"italic"}}>One machine.</span></h1>
        </div>
      </div>
      <Services/><Stats/><Process/><Pricing/>
    </main>
    <Footer/>
  </>);
}
