"use client";
import{useState,useCallback,useEffect,useRef}from"react";
import dynamic from"next/dynamic";
import Nav from"@/components/Nav";
import Hero from"@/components/Hero";
import{MarqueeStrip,Manifesto,KineticBand,Services,Stats,Process,Pricing,Testimonials,FAQ}from"@/components/Sections";
import Footer from"@/components/Footer";
const Loader=dynamic(()=>import("@/components/Loader"),{ssr:false});
const Cursor=dynamic(()=>import("@/components/Cursor"),{ssr:false});
const SmoothScroll=dynamic(()=>import("@/components/SmoothScroll"),{ssr:false});
const AIWidget=dynamic(()=>import("@/components/AIWidget"),{ssr:false});

export default function Home(){
  const[loaded,setLoaded]=useState(false);
  const[heroReady,setHeroReady]=useState(false);
  const mainRef=useRef<HTMLDivElement>(null);
  const onDone=useCallback(()=>{setLoaded(true);setTimeout(()=>setHeroReady(true),100);},[]);
  useEffect(()=>{if(!loaded||!mainRef.current)return;mainRef.current.style.opacity="1";mainRef.current.style.transform="none";},[loaded]);
  return(<>
    <Cursor/><SmoothScroll/>
    {!loaded&&<Loader onDone={onDone}/>}
    <div ref={mainRef} style={{opacity:0,transform:"scale(0.998)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
      <Nav/>
      <main>
        <Hero ready={heroReady}/>
        <MarqueeStrip/>
        <Manifesto/>
        <KineticBand/>
        <Services/>
        <Stats/>
        <Process/>
        <Pricing/>
        <Testimonials/>
        <FAQ/>
      </main>
      <Footer/>
      <AIWidget/>
    </div>
  </>);
}
