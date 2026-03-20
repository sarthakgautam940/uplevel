'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  // Draw ambient intro geometry at 4% opacity
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      draw()
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const minD = Math.min(W, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.035)'
      ctx.lineWidth = 0.5
      const gridSize = 64
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Outer circle
      const outerR = minD * 0.38
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Inner dashed circle
      const innerR = outerR * 0.48
      ctx.beginPath()
      ctx.setLineDash([6, 14])
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(47,126,255,0.14)'
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.setLineDash([])

      // Compass lines
      const lineLen = innerR * 0.55
      const dirs = [
        [cx + lineLen, cy], [cx - lineLen, cy],
        [cx, cy - lineLen], [cx, cy + lineLen]
      ]
      dirs.forEach(([ex, ey]) => {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = 'rgba(47,126,255,0.55)'
        ctx.lineWidth = 0.65
        ctx.stroke()
        // tick mark
        const dx = ex - cx, dy = ey - cy
        const len = Math.sqrt(dx * dx + dy * dy)
        const nx = dx / len, ny = dy / len
        const px = -ny, py = nx
        ctx.beginPath()
        ctx.moveTo(ex + px * 3, ey + py * 3)
        ctx.lineTo(ex - px * 3, ey - py * 3)
        ctx.stroke()
      })

      // Crosshairs — full viewport
      ctx.beginPath()
      ctx.moveTo(0, cy); ctx.lineTo(W, cy)
      ctx.moveTo(cx, 0); ctx.lineTo(cx, H)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 0.4
      ctx.stroke()

      // Center diamond
      const ds = 8
      ctx.beginPath()
      ctx.moveTo(cx, cy - ds); ctx.lineTo(cx + ds, cy)
      ctx.lineTo(cx, cy + ds); ctx.lineTo(cx - ds, cy)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(47,126,255,1)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = 'rgba(47,126,255,0.08)'
      ctx.fill()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Entrance animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    // Headline: gravity drop — y:-60 + scale(0.92)→0, scale(1)
    gsap.fromTo(headRef.current, {
      y: -60, scale: 0.92, opacity: 0
    }, {
      y: 0, scale: 1, opacity: 1,
      duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
    })

    // Line draws left→right
    gsap.fromTo(lineRef.current, { scaleX: 0 }, {
      scaleX: 1, duration: 0.8, delay: 0.6, ease: 'power2.inOut',
      transformOrigin: 'left center',
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
    })

    // Content fades
    gsap.fromTo(contentRef.current?.children ? Array.from(contentRef.current.children) : [], {
      y: 20, opacity: 0
    }, {
      y: 0, opacity: 1,
      duration: 0.9, stagger: 0.1, delay: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cta"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,100px)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Ambient geometry canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      />

      {/* Radial glow at center */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(47,126,255,0.05) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px', width: '100%' }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', letterSpacing: '0.28em',
          color: 'var(--el)', textTransform: 'uppercase',
          marginBottom: '40px',
          display: 'inline-flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
          Ready to Uplevel
          <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
        </div>

        {/* Italic headline */}
        <h2
          ref={headRef}
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontStyle: 'italic',
            fontSize: 'clamp(72px,11vw,160px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--t1)',
            lineHeight: 0.92,
            marginBottom: '40px',
            opacity: 0,
          }}
        >
          Ready?
        </h2>

        {/* Accent line */}
        <div
          ref={lineRef}
          style={{
            width: '220px',
            height: '2px',
            background: 'var(--el)',
            margin: '0 auto 40px',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />

        {/* Content */}
        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(13px,1.05vw,16px)',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'var(--t2)',
            maxWidth: '440px',
          }}>
            One discovery call. We show you the exact gaps in your current digital presence. No obligation.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/contact"
              data-cursor="START"
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: 'var(--el)',
                color: '#fff',
                fontFamily: '"DM Mono", monospace',
                fontSize: '9px', letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
                cursor: 'none',
              }}
            >
              Start a Project →
            </Link>

            <Link
              href={brand.calendly}
              target="_blank"
              data-cursor="VIEW"
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--t2)',
                fontFamily: '"DM Mono", monospace',
                fontSize: '9px', letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'none',
              }}
            >
              Book a Call
            </Link>
          </div>

          {/* Scarcity badge — ONLY red on the page */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '8px 18px',
            border: '1px solid rgba(255,61,46,0.25)',
            background: 'rgba(255,61,46,0.05)',
            marginTop: '12px',
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'var(--alert)',
              animation: 'pulse-dot 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.22em',
              color: 'var(--alert)', textTransform: 'uppercase',
            }}>
              {brand.slots} client slot available this quarter
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
