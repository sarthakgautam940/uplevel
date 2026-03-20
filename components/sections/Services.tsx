'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

function ServiceCard({
  service,
  delay,
  entryY,
  entryRot,
}: {
  service: (typeof brand.services)[0]
  delay: number
  entryY: number
  entryRot: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const topLineRef = useRef<HTMLDivElement>(null)
  const tilt = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })
  const entered = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const card = cardRef.current
    if (!card) return

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const nx = (mx / rect.width) * 2 - 1   // -1 to 1
      const ny = (my / rect.height) * 2 - 1

      mouse.current = { x: mx, y: my }

      // ghost number tracks cursor max 4px
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${nx * 4}px, ${ny * 4}px)`
      }

      // spotlight follows cursor instantly
      if (spotRef.current) {
        spotRef.current.style.background =
          `radial-gradient(200px circle at ${mx}px ${my}px, rgba(47,126,255,0.07) 0%, transparent 70%)`
      }

      // 3D tilt toward mouse
      const targetX = -ny * 8
      const targetY = nx * 8
      tilt.current.x += (targetX - tilt.current.x) * 0.12
      tilt.current.y += (targetY - tilt.current.y) * 0.12

      card.style.transform = `perspective(900px) rotateX(${tilt.current.x}deg) rotateY(${tilt.current.y}deg)`
    }

    const onEnter = () => {
      entered.current = true
      // top-line pulse
      if (topLineRef.current) {
        gsap.to(topLineRef.current, {
          opacity: 0.5, duration: 0.2, yoyo: true, repeat: 1,
          onComplete: () => { gsap.set(topLineRef.current, { opacity: 1 }) }
        })
      }
    }

    const onLeave = () => {
      entered.current = false
      if (ghostRef.current) ghostRef.current.style.transform = ''
      if (spotRef.current) spotRef.current.style.background = ''
      gsap.to(card, {
        rotateX: 0, rotateY: 0, duration: 0.8, ease: 'expo.out',
        overwrite: true,
      })
      tilt.current = { x: 0, y: 0 }
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        background: 'var(--srf)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 36px 44px',
        cursor: 'default',
        transformOrigin: 'center center',
        willChange: 'transform',
        overflow: 'hidden',
      }}
    >
      {/* Spotlight overlay */}
      <div ref={spotRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        borderRadius: 'inherit',
      }} />

      {/* Top accent line */}
      <div ref={topLineRef} style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'var(--el)',
        transformOrigin: 'left center',
      }} />

      {/* Ghost number */}
      <span ref={ghostRef} style={{
        position: 'absolute',
        top: '24px', right: '28px',
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(80px, 10vw, 140px)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(47,126,255,0.07)',
        lineHeight: 1,
        letterSpacing: '-0.04em',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'transform 0.05s linear',
        userSelect: 'none',
      }}>
        {service.id}
      </span>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '8px',
          letterSpacing: '0.28em',
          color: 'var(--el)',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {service.id} — {service.short}
        </div>

        <h3 style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(22px,2.8vw,32px)',
          fontWeight: 900,
          letterSpacing: '-0.022em',
          color: 'var(--t1)',
          marginBottom: '16px',
          lineHeight: 1.1,
        }}>
          {service.name}
        </h3>

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(13px,1.05vw,15px)',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'var(--t2)',
          marginBottom: '32px',
        }}>
          {service.description}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {service.deliverables.map((d, i) => (
            <li key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              color: 'rgba(241,242,255,0.55)',
            }}>
              <span style={{
                display: 'inline-block',
                width: '4px', height: '4px',
                background: 'var(--el)',
                borderRadius: '50%',
                flexShrink: 0,
                opacity: 0.7,
              }} />
              {d}
            </li>
          ))}
        </ul>

        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '24px',
        }}>
          <span style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(22px,2.2vw,28px)',
            fontWeight: 900,
            color: 'var(--t1)',
            letterSpacing: '-0.02em',
          }}>
            {service.price}
          </span>
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: 'var(--t2)',
          }}>
            + {service.recurring}
          </span>
        </div>
      </div>
    </div>
  )
}

const cardEntries = [
  { y: -80, rot: -1.5, delay: 0 },
  { y: -110, rot: 0.8, delay: 80 },
  { y: -65, rot: -0.5, delay: 160 },
  { y: -95, rot: 1.2, delay: 240 },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo([eyebrowRef.current, headRef.current], {
      y: 20, opacity: 0
    }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    })

    const cards = gridRef.current?.children
    if (cards) {
      Array.from(cards).forEach((card, i) => {
        const e = cardEntries[i]
        gsap.set(card, { y: e.y, rotation: e.rot, opacity: 0 })
        gsap.to(card, {
          y: 0, rotation: 0, opacity: 1,
          duration: 0.9,
          delay: e.delay / 1000,
          ease: 'back.out(1.56)',
          scrollTrigger: {
            trigger: section, start: 'top 65%', toggleActions: 'play none none none'
          },
          onComplete: () => {
            // draw top line after card lands
            const line = (card as HTMLElement).querySelector<HTMLElement>('[data-topline]')
            if (line) {
              gsap.fromTo(line, { scaleX: 0 }, {
                scaleX: 1, duration: 0.35, ease: 'power2.inOut',
                transformOrigin: 'left center', delay: 0.05,
              })
            }
          }
        })
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div ref={eyebrowRef} style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.28em',
          color: 'var(--el)',
          textTransform: 'uppercase',
          marginBottom: '20px',
          opacity: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
          What We Build
        </div>

        <h2 ref={headRef} style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(38px,5.5vw,88px)',
          fontWeight: 700,
          letterSpacing: '-0.028em',
          color: 'var(--t1)',
          lineHeight: 1.0,
          marginBottom: 'clamp(48px,6vw,80px)',
          opacity: 0,
        }}>
          Four systems.<br />
          <span style={{ color: 'var(--t2)', fontWeight: 700 }}>One outcome.</span>
        </h2>

        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2px',
          }}
        >
          {brand.services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              delay={cardEntries[i].delay}
              entryY={cardEntries[i].y}
              entryRot={cardEntries[i].rot}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
