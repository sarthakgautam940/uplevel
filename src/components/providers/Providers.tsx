'use client'

import { useEffect, useRef } from 'react'
import { scrollState, mouseState } from '@/lib/scroll'

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<import('lenis').default | null>(null)

  useEffect(() => {
    async function init() {
      const [
        { default: Lenis },
        { gsap },
        { ScrollTrigger },
      ] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      })

      lenisRef.current = lenis

      lenis.on('scroll', ({ progress, velocity, direction }: {
        progress: number
        velocity: number
        direction: number
      }) => {
        scrollState.progress = progress
        scrollState.velocity = velocity
        scrollState.direction = direction
        ScrollTrigger.update()
      })

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      // Hide scroll indicator once user starts scrolling
      lenis.on('scroll', () => {
        const indicator = document.querySelector('.scroll-indicator')
        if (indicator) indicator.classList.add('hidden')
      })
    }

    init()

    // Track mouse for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.rawX = e.clientX
      mouseState.rawY = e.clientY
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      lenisRef.current?.destroy()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <>{children}</>
}
