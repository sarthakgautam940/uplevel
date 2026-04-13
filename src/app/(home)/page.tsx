"use client";

import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ProcessSection from "@/components/ProcessSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import ServicesSnapshot from "@/components/ServicesSnapshot";
import CTASection from "@/components/CTASection";
import SiteFooter from "@/components/SiteFooter";
import CalibrationPreloader from "@/components/CalibrationPreloader";

export default function Home() {
  const [ready, setReady] = useState(false);

  const handlePreloaderDone = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      <CalibrationPreloader onComplete={handlePreloaderDone} />
      <main className="relative z-[2] min-h-screen bg-[var(--void)]">
        <HeroSection ready={ready} />
        <ProblemSection />
        <ServicesSnapshot />
        <ProcessSection />
        <PrinciplesSection />
        <CTASection />
        <SiteFooter />
      </main>
    </>
  );
}
