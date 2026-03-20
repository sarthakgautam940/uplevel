'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

const stats = [
  { value: brand.stats.clients, suffix: '+', label: 'Contractor Clients', sub: 'Across 11 states' },
  { value: brand.stats.satisfaction, suffix: '%', label: 'Client Satisfaction', sub: 'Net promoter score' },
  { value: brand.stats.avgLaunch, suffix: 'hr', label: 'Average Launch', sub: 'From brief to live' },
  { value: brand.stats.roi, suffix: '%', label: 'Average Year-One ROI', sub: 'Across all clients' },
]

function StatItem({
  stat,
  started,
  index,
}: {
  stat: (typeof stats)[0]
  started: boolean
  index: number
}) {
  const [val, setVal] = useState(0)
  const [sharp, setSharp] = useState(false)
  const pulseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!started) return
    const duration = 1800
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setVal(Math.round(eased * stat.value))

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setVal(stat.value)
        // snap sharp + radial pulse
        setTimeout(() => {
          setSharp(true)
          if (pulseRef.current) {
            gsap.fromTo(pulseRef.current,
              { scale: 0, opacity: 0.06 },
              { scale: 3.5, opacity: 0, duration: 0.8, ease: 'power2.out' }
            )
          }
        }, 40)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, stat.value])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      padding: 'clamp(36px,4vw,56px) clamp(24px,3vw,40px)',
      borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial pulse origin */}
      <div ref={pulseRef} style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '80px', height: '80px',
        marginLeft: '-40px', marginTop: '-40px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(47,126,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'scale(0)',
      }} />

      <div style={{
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(48px,6vw,88px)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        color: 'var(--t1)',
        lineHeight: 1,
        filter: started && !sharp ? 'blur(2px)' : 'blur(0px)',
        transition: sharp ? 'filter 0.05s ease-out' : 'none',
        position: 'relative', zIndex: 1,
      }}>
        {val}<span style={{ color: 'var(--el)', fontSize: '0.55em', letterSpacing: '-0.01em' }}>{stat.suffix}</span>
      </div>

      <div style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 'clamp(13px,1.05vw,15px)',
        fontWeight: 300,
        color: 'var(--t1)',
        opacity: 0.7,
        position: 'relative', zIndex: 1,
      }}>
        {stat.label}
      </div>

      <div style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: '9px',
        letterSpacing: '0.18em',
        color: 'var(--t2)',
        textTransform: 'uppercase',
        position: 'relative', zIndex: 1,
      }}>
        {stat.sub}
      </div>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setStarted(true),
      once: true,
    })

    gsap.fromTo(section, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' }
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--srf)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        opacity: 0,
      }}
    >
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}>
        {stats.map((stat, i) => (
          <StatItem key={i} stat={stat} started={started} index={i} />
        ))}
      </div>
    </section>
  )
}
