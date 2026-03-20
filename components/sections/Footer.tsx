'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

const LETTERS = ['U', 'P', 'L', 'E', 'V', 'E', 'L']
const letterEntries = [
  { x: 40, y: 50, rot: -4 },   // U — bottom-left
  { x: 0, y: -60, rot: 0 },    // P — straight down
  { x: 40, y: 0, rot: 0 },     // L — from right
  { x: 0, y: 50, rot: 0 },     // E — straight up
  { x: 10, y: -40, rot: 0 },   // V — top-right
  { x: -30, y: 0, rot: 0 },    // E — from left
  { x: 0, y: 60, rot: 0 },     // L — straight up
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
  const scanLineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [assembled, setAssembled] = useState(false)

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    interface Particle {
      x: number; y: number; vx: number; vy: number; life: number; maxLife: number
    }

    const particles: Particle[] = []
    let spawnTimer = 0
    let raf: number

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(20 + Math.random() * 20) / 60,
        life: 0,
        maxLife: 90 + Math.random() * 60,
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      spawnTimer++
      if (spawnTimer > 18 + Math.random() * 18) {
        spawnParticle()
        spawnTimer = 0
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        const progress = p.life / p.maxLife
        const fade = progress < 0.5
          ? progress * 2
          : 1 - (progress - 0.5) * 2

        ctx.fillStyle = `rgba(47,126,255,${0.03 * fade})`
        ctx.fillRect(p.x, p.y, 2, 2)

        if (p.life >= p.maxLife || p.y < canvas.height * 0.4) {
          particles.splice(i, 1)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Wordmark assembly scroll trigger
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const footer = footerRef.current
    if (!footer) return

    // Set initial states for letters
    letterRefs.current.forEach((el, i) => {
      if (!el) return
      const e = letterEntries[i]
      gsap.set(el, { x: e.x, y: e.y, rotation: e.rot, opacity: 0 })
    })

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Assemble letters with elastic stagger
        letterRefs.current.forEach((el, i) => {
          if (!el) return
          gsap.to(el, {
            x: 0, y: 0, rotation: 0, opacity: 1,
            duration: 0.9,
            delay: i * 0.055,
            ease: 'back.out(1.56)',
          })
        })

        // Scan line after assembly (~900ms + 300ms rest)
        setTimeout(() => {
          setAssembled(true)
          if (scanLineRef.current) {
            gsap.fromTo(scanLineRef.current, {
              top: 0, opacity: 0.25
            }, {
              top: '100%', opacity: 0.25,
              duration: 1.4,
              ease: 'none',
              onComplete: () => {
                gsap.set(scanLineRef.current, { opacity: 0 })
              }
            })
          }
        }, 1200)

        // Content fades after scan
        setTimeout(() => {
          if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, {
              opacity: 1, y: 0, duration: 0.8, ease: 'expo.out'
            })
          }
        }, 1800)
      }
    })
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        background: 'var(--void)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Wordmark layer — texture behind content */}
      <div
        ref={wordmarkRef}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={el => { letterRefs.current[i] = el }}
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(80px,14vw,200px)',
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(241,242,255,0.12)',
              lineHeight: 1,
              display: 'inline-block',
              opacity: 0,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Scan line */}
      <div
        ref={scanLineRef}
        style={{
          position: 'absolute',
          left: 0, right: 0,
          top: 0,
          height: '1px',
          background: 'var(--el)',
          opacity: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Main content — 4 column grid */}
      <div
        ref={contentRef}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1300px', margin: '0 auto',
          padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,100px) clamp(40px,5vw,64px)',
          opacity: 0,
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'clamp(32px,4vw,64px)',
          marginBottom: 'clamp(48px,6vw,80px)',
        }}>
          {/* Col 1 — Brand */}
          <div>
            <div style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: '18px', fontWeight: 900,
              letterSpacing: '-0.02em', color: 'var(--t1)',
              marginBottom: '16px',
            }}>
              UpLevel Services
            </div>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px', fontWeight: 300,
              lineHeight: 1.8, color: 'var(--t2)',
              maxWidth: '240px', marginBottom: '20px',
            }}>
              Premium website systems, AI agents, and lead pipelines for elite contractors.
            </p>
            <a
              href={`mailto:${brand.email}`}
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '9px', letterSpacing: '0.18em',
                color: 'var(--el)', textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              {brand.email}
            </a>
          </div>

          {/* Col 2 — Services */}
          <div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.22em',
              color: 'var(--t3)', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Services
            </div>
            {['Website System', 'AI Concierge', 'SEO Domination', 'Brand Identity'].map(s => (
              <div key={s} style={{ marginBottom: '12px' }}>
                <Link href="/services" style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: 300,
                  color: 'rgba(241,242,255,0.45)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}>
                  {s}
                </Link>
              </div>
            ))}
          </div>

          {/* Col 3 — Company */}
          <div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.22em',
              color: 'var(--t3)', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Company
            </div>
            {[
              { label: 'Our Work', href: '/work' },
              { label: 'Services', href: '/services' },
              { label: 'Process', href: '/#process' },
              { label: 'Contact', href: '/contact' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '12px' }}>
                <Link href={l.href} style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: 300,
                  color: 'rgba(241,242,255,0.45)',
                  textDecoration: 'none',
                }}>
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Col 4 — Legal */}
          <div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.22em',
              color: 'var(--t3)', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Legal
            </div>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <Link href="#" style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: 300,
                  color: 'rgba(241,242,255,0.45)',
                  textDecoration: 'none',
                }}>
                  {l}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '8px', letterSpacing: '0.28em',
            color: 'rgba(241,242,255,0.2)',
            textTransform: 'uppercase',
          }}>
            © {new Date().getFullYear()} UpLevel Services LLC · Richmond, VA · All rights reserved
          </div>

          {/* Last persuasive element — red availability dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '4px', height: '4px',
              borderRadius: '50%',
              background: 'var(--alert)',
              animation: 'pulse-dot 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.2em',
              color: 'rgba(255,61,46,0.6)',
              textTransform: 'uppercase',
            }}>
              {brand.slots} slot available
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
