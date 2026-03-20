"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MarqueeStrip, Manifesto, KineticBand, Services,
  WorkPreview, Stats, Process, Testimonials,
  Pricing, FAQ, FinalCTA,
} from "@/components/Sections";

const Loader       = dynamic(() => import("@/components/Loader"),       { ssr:false });
const Cursor       = dynamic(() => import("@/components/Cursor"),       { ssr:false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr:false });
const Nav          = dynamic(() => import("@/components/Nav"),          { ssr:false });
const Hero         = dynamic(() => import("@/components/Hero"),         { ssr:false });
const Footer       = dynamic(() => import("@/components/Footer"),       { ssr:false });

export default function Home() {
  const [loaded,    setLoaded]    = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const onComplete = useCallback(() => {
    setLoaded(true);
    setTimeout(() => setHeroReady(true), 100);
  }, []);

  useEffect(() => {
    if (!loaded || !mainRef.current) return;
    const el = mainRef.current;
    el.style.transition = "opacity .55s ease, transform .55s ease";
    el.style.opacity    = "1";
    el.style.transform  = "none";
  }, [loaded]);

  return (
    <>
      <Cursor />
      <SmoothScroll />
      {!loaded && <Loader onComplete={onComplete} />}
      <div ref={mainRef} style={{ opacity:0, transform:"scale(0.998)" }}>
        <Nav />
        <main>
          <Hero ready={heroReady} />
          <MarqueeStrip />
          <Manifesto />
          <KineticBand />
          <Services />
          <WorkPreview />
          <Stats />
          <Process />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
