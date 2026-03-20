'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const items = [
  'WEBSITE SYSTEMS',
  '⬥',
  'AI CONCIERGE',
  '⬥',
  'SEO DOMINATION',
  '⬥',
  'BRAND IDENTITY',
  '⬥',
  '48-HOUR DELIVERY',
  '⬥',
  'RICHMOND, VA',
  '⬥',
  'CONTRACTOR-FOCUSED',
  '⬥',
  'MONTH-TO-MONTH',
  '⬥',
]

export default function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollVelocity = useRef(0)
  const baseSpeed = useRef(0.4)
  const lastScroll = useRef(0)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const track = trackRef.current
    if (!track) return

    let xPos = 0
    const singleW = track.scrollWidth / 2

    const tick = () => {
      // velocity fades toward base speed
      scrollVelocity.current = gsap.utils.interpolate(
        scrollVelocity.current,
        baseSpeed.current,
        0.08
      )
      xPos -= scrollVelocity.current
      if (xPos <= -singleW) xPos += singleW
      track.style.transform = `translateX(${xPos}px)`
      animRef.current = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const currentScroll = window.scrollY
      const delta = currentScroll - lastScroll.current
      lastScroll.current = currentScroll
      scrollVelocity.current = Math.max(0.2, Math.abs(delta) * 0.18 + 0.4)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const repeated = [...items, ...items, ...items, ...items]

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(47,126,255,0.03)',
        padding: '14px 0',
        zIndex: 2,
      }}
    >
      {/* left + right fade masks */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, var(--void) 0%, transparent 8%, transparent 92%, var(--void) 100%)',
      }} />

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              padding: item === '⬥' ? '0 18px' : '0 28px',
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px',
              letterSpacing: item === '⬥' ? '0' : '0.22em',
              color: item === '⬥' ? 'var(--el)' : 'rgba(241,242,255,0.28)',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
