import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import Problem from "@/components/Problem";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import CaseStudies from "@/components/CaseStudies";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BookCall from "@/components/BookCall";
import Footer from "@/components/Footer";
import AIWidget from "@/components/AIWidget";

export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 2 }}>
      <Navigation />
      <Hero />
      <TrustMarquee />
      <Problem />
      <Stats />
      <HowItWorks />
      <CaseStudies />
      <Pricing />
      <Testimonials />
      <FAQ />
      <BookCall />
      <Footer />
      <AIWidget />
    </main>
  );
}
