'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SmoothScrollProps {
  children: React.ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })

    let lenis: any = null

    const initLenis = async () => {
      const LenisModule = await import('lenis')
      const Lenis = LenisModule.default

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      })

      lenisRef.current = lenis

      lenis.on('scroll', () => {
        ScrollTrigger.update()
      })

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    initLenis()

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      gsap.ticker.remove((time: number) => {
        if (lenisRef.current) lenisRef.current.raf(time * 1000)
      })
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return <>{children}</>
}
