"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamic imports — all heavy components are client-side only
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });
const Navigation = dynamic(() => import("@/components/Navigation"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const TrustMarquee = dynamic(() => import("@/components/TrustMarquee"), { ssr: false });
const Manifesto = dynamic(() => import("@/components/Manifesto"), { ssr: false });
const Services = dynamic(() => import("@/components/Services"), { ssr: false });
const Work = dynamic(() => import("@/components/Work"), { ssr: false });
const Process = dynamic(() => import("@/components/Process"), { ssr: false });
const Stats = dynamic(() => import("@/components/Stats"), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });

export default function Home() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (loaderComplete) {
      // Small delay to let exit animation complete
      const timer = setTimeout(() => setContentVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loaderComplete]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <LoadingScreen onComplete={() => setLoaderComplete(true)} />

      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
          background: "var(--bg)",
          minHeight: "100vh",
        }}
      >
        <Navigation />

        <main>
          <Hero loaderComplete={loaderComplete} />
          <TrustMarquee />
          <Manifesto />
          <Services />
          <Work />
          <Process />
          <Stats />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>

        <Footer />
        <AIChat />
      </div>
    </>
  );
}
