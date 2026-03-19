"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import ManifestoSection from "@/components/ManifestoSection";
import KineticBand from "@/components/KineticBand";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import WorkSection from "@/components/WorkSection";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIWidget from "@/components/AIWidget";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const onLoaderDone = useCallback(() => {
    setLoaded(true);
    // Small delay before hero animations fire
    setTimeout(() => setHeroReady(true), 80);
  }, []);

  // Page entrance — fade in main content after loader
  useEffect(() => {
    if (!loaded || !mainRef.current) return;
    mainRef.current.style.opacity = "1";
    mainRef.current.style.transform = "none";
  }, [loaded]);

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Loading screen */}
      {!loaded && <LoadingScreen onDone={onLoaderDone} />}

      {/* Main site */}
      <div
        ref={mainRef}
        style={{
          opacity: 0,
          transform: "scale(0.995)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <Navigation />
        <main>
          <Hero ready={heroReady} />
          <div id="marquee">
            <MarqueeStrip />
          </div>
          <ManifestoSection />
          <KineticBand />
          <ServicesSection />
          <StatsSection />
          <WorkSection />
          <ProcessSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
        <AIWidget />
      </div>
    </>
  );
}
