"use client";

/**
 * Homepage composition — everything that renders below <HeroSection /> on `/`.
 * Wrap the tree in your app’s TransitionProvider so TransitionLink / MagneticButton work.
 */
import ProblemSection from "./components/ProblemSection";
import PinnedNarrative from "./components/PinnedNarrative";
import ServicesSnapshot from "./components/ServicesSnapshot";
import ProcessSection from "./components/ProcessSection";
import PrinciplesSection from "./components/PrinciplesSection";
import CTASection from "./components/CTASection";
import SiteFooter from "./components/SiteFooter";

export default function HomeBelowHero() {
  return (
    <>
      <ProblemSection />
      <PinnedNarrative />
      <ServicesSnapshot />
      <ProcessSection />
      <PrinciplesSection />
      <CTASection />
      <SiteFooter variant="home" />
    </>
  );
}
