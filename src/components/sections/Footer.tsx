'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { BRAND } from '@/lib/brand'

const FOOTER_LETTERS = ['U', 'P', 'L', 'E', 'V', 'E', 'L']
const LETTER_VECTORS = [
  { y: 50, x: 40, rotate: -4 },   // U — bottom-left
  { y: -60, x: 0, rotate: 0 },    // P — straight down
  { y: 0, x: 40, rotate: 0 },     // L — from right
  { y: 50, x: 0, rotate: 0 },     // E — straight up
  { y: -40, x: 10, rotate: 0 },   // V — top-right
  { y: 0, x: -30, rotate: 0 },    // E — from left
  { y: 60, x: 0, rotate: 0 },     // L — straight up
]

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-5% 0px' })
  const [lineSweep, setLineSweep] = useState(false)

  // Trigger line sweep after letters assemble
  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setLineSweep(true), 1200)
      return () => clearTimeout(t)
    }
  }, [isInView])

  return (
    <footer
      ref={sectionRef}
      style={{
        position: 'relative',
        background: 'rgba(5,5,10,0.95)',
        borderTop: '1px solid #21222E',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px) clamp(32px, 4vh, 48px)',
      }}
    >
      {/* Particle canvas */}
      <FooterParticles />

      {/* Sweep line */}
      {lineSweep && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(47,126,255,0.25)',
            top: 0,
            animation: 'footerLineSweep 1.4s linear forwards',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}
      <style>{`
        @keyframes footerLineSweep {
          from { transform: translateY(0); }
          to { transform: translateY(calc(100vh)); }
        }
      `}</style>

      {/* Wordmark letters */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {FOOTER_LETTERS.map((letter, i) => {
          const vector = LETTER_VECTORS[i]
          return (
            <motion.span
              key={i}
              initial={{
                y: vector.y,
                x: vector.x,
                rotate: vector.rotate,
                opacity: 0,
              }}
              animate={isInView ? { y: 0, x: 0, rotate: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.055,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="footer-wordmark-letter"
              style={{
                opacity: isInView ? 0.12 : 0,
              }}
            >
              {letter}
            </motion.span>
          )
        })}
      </div>

      {/* Content overlay */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Four-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 900,
                fontSize: '20px',
                letterSpacing: '-0.025em',
                color: '#F1F2FF',
                marginBottom: '8px',
              }}
            >
              Up<span style={{ color: '#2F7EFF' }}>Level</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.25em',
                color: '#5C6278',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}
            >
              Richmond, VA
            </div>
            <a
              href={`mailto:${BRAND.email}`}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: '#2F7EFF',
                display: 'block',
                marginBottom: '16px',
                cursor: 'none',
              }}
              data-cursor="Email"
            >
              {BRAND.email}
            </a>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'rgba(92,98,120,0.5)',
              }}
            >
              47 clients · 98% satisfaction
            </div>
          </div>

          {/* Services column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#2F7EFF',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Services
            </div>
            {['Website Systems', 'AI Phone Concierge', 'SEO & Growth', 'Brand Identity'].map(item => (
              <Link
                key={item}
                href="/services"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '12px',
                  color: '#5C6278',
                  marginBottom: '10px',
                  cursor: 'none',
                  transition: 'color 200ms',
                }}
                data-cursor="Services"
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#F1F2FF' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5C6278' }}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Company column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#2F7EFF',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Company
            </div>
            {[
              { label: 'Work', href: '/work' },
              { label: 'Services', href: '/services' },
              { label: 'Process', href: '/#process' },
              { label: 'Contact', href: '/contact' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '12px',
                  color: '#5C6278',
                  marginBottom: '10px',
                  cursor: 'none',
                  transition: 'color 200ms',
                }}
                data-cursor="Navigate"
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#F1F2FF' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5C6278' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#2F7EFF',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Legal
            </div>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '12px',
                  color: '#5C6278',
                  marginBottom: '10px',
                  cursor: 'none',
                  transition: 'color 200ms',
                }}
                data-cursor="Legal"
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#F1F2FF' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5C6278' }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #21222E',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '8px',
              letterSpacing: '0.28em',
              color: 'rgba(241,242,255,0.2)',
            }}
          >
            © {new Date().getFullYear()} UPLEVEL SERVICES LLC · RICHMOND, VA · ALL RIGHTS RESERVED
          </div>

          {/* Availability dot — last persuasive element */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '8px',
              letterSpacing: '0.28em',
              color: 'rgba(241,242,255,0.2)',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#FF3D2E',
                animation: 'alertPulse 2s ease-in-out infinite',
              }}
            />
            ACCEPTING NEW CLIENTS
          </div>
        </div>
      </div>
    </footer>
  )
}

// Footer particle squares — drifting upward from bottom edge
function FooterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{
    x: number; y: number; vy: number; opacity: number; size: number; age: number; maxAge: number
  }>>([])
  const rafRef = useRef<number>(0)
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = (now: number) => {
      if (!canvas.width) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new particle
      if (now - lastSpawnRef.current > 300 + Math.random() * 100) {
        lastSpawnRef.current = now
        if (particlesRef.current.length < 25) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 4,
            vy: -(20 + Math.random() * 20) / 60, // px per frame at 60fps
            opacity: 0,
            size: 2,
            age: 0,
            maxAge: 180 + Math.random() * 60,
          })
        }
      }

      // Update + draw
      particlesRef.current = particlesRef.current.filter(p => {
        p.y += p.vy
        p.age++

        // Fade in, then fade out
        const halfLife = p.maxAge * 0.4
        if (p.age < halfLife) {
          p.opacity = (p.age / halfLife) * 0.02
        } else {
          p.opacity = ((p.maxAge - p.age) / (p.maxAge - halfLife)) * 0.02
        }

        if (p.opacity > 0) {
          ctx.fillStyle = `rgba(47, 126, 255, ${p.opacity})`
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }

        return p.age < p.maxAge
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
