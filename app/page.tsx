'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import Cursor from '@/components/Cursor'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import Manifesto from '@/components/sections/Manifesto'
import KineticBand from '@/components/sections/KineticBand'
import Services from '@/components/sections/Services'
import WorkPreview from '@/components/sections/WorkPreview'
import Stats from '@/components/sections/Stats'
import Process from '@/components/sections/Process'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'

const Loader = dynamic(() => import('@/components/Loader'), { ssr: false })
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })

export default function Home() {
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [heroReady, setHeroReady] = useState(false)

  const handleLoaderExitStart = useCallback(() => {
    // Hero entrance starts at 30% of aperture opening = 264ms into exit
    setTimeout(() => {
      setHeroReady(true)
    }, 264)
  }, [])

  const handleLoaderComplete = useCallback(() => {
    setLoaderVisible(false)
  }, [])

  return (
    <SmoothScroll>
      <Cursor />
      <Nav />

      {loaderVisible && (
        <Loader
          onExitStart={handleLoaderExitStart}
          onComplete={handleLoaderComplete}
        />
      )}

      <main style={{ background: 'var(--void)', overflowX: 'hidden' }}>
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
        <Footer />
      </main>
    </SmoothScroll>
  )
}
