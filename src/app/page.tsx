'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import ManifestoSection from '@/components/sections/ManifestoSection'
import KineticBand from '@/components/sections/KineticBand'
import ServicesSection from '@/components/sections/ServicesSection'
import WorkSection from '@/components/sections/WorkSection'
import StatsSection from '@/components/sections/StatsSection'
import ProcessSection from '@/components/sections/ProcessSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import PricingSection from '@/components/sections/PricingSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'
import IntroAnimation from '@/components/intro/IntroAnimation'

// Dynamic import Three.js world — SSR off
const WorldScene = dynamic(() => import('@/components/world/WorldScene'), {
  ssr: false,
  loading: () => null,
})

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  const handleIntroComplete = () => {
    setIntroComplete(true)
    // Hero content begins entrance while exit aperture is 30% open
    setTimeout(() => setHeroVisible(true), 200)
  }

  // Lock scroll during intro
  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [introComplete])

  return (
    <>
      {/* Three.js World — always rendered, fills viewport */}
      <WorldScene />

      {/* Intro animation — renders above world until exit */}
      {!introComplete && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {/* Hero — fixed overlay in world space */}
      {heroVisible && <HeroSection isVisible={heroVisible} />}

      {/*
        Scroll container — all sections layer above the Three.js world.
        The world camera journey continues behind all of them.
        800vh total scroll height corresponding to the camera journey.
      */}
      <div
        className="scroll-container"
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 600ms',
          pointerEvents: introComplete ? 'auto' : 'none',
        }}
      >
        {/* ── Hero spacer (100vh) ── */}
        <div style={{ height: '100vh' }} aria-hidden="true" />

        {/* ── Manifesto (100–200vh, camera rises above top plate) ── */}
        <ManifestoSection />

        {/* ── Kinetic band (transition element) ── */}
        <KineticBand />

        {/* ── Services (200–350vh, lateral camera gallery) ── */}
        <ServicesSection />

        {/* ── Work preview (350–470vh, glulam beam territory) ── */}
        <WorkSection />

        {/* ── Stats (visual breath section) ── */}
        <StatsSection />

        {/* ── Process (470–570vh, aerial overview) ── */}
        <ProcessSection />

        {/* ── Testimonials (570–650vh, amber warmth chapter) ── */}
        <TestimonialsSection />

        {/* ── Pricing (650–740vh, FOV compression corridor) ── */}
        <PricingSection />

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── Final CTA (740–800vh, backward camera movement) ── */}
        <FinalCTA />

        {/* ── Footer ── */}
        <Footer />
      </div>
    </>
  )
}
