'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<Array<HTMLDivElement | null>>([])
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const container = containerRef.current
    const track = trackRef.current
    if (!section || !container || !track) return

    // Eyebrow + head entrance
    gsap.fromTo([eyebrowRef.current, headRef.current], {
      y: 20, opacity: 0
    }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
    })

    // Horizontal scroll — pin container and scrub track X
    const stepCount = brand.process.length
    const stepWidth = 380 + 48 // card width + gap
    const totalScroll = stepWidth * (stepCount - 1)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 15%',
          end: `+=${totalScroll + 200}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Determine active step from scroll progress
            const activeIndex = Math.round(self.progress * (stepCount - 1))
            lineRefs.current.forEach((line, i) => {
              if (!line) return
              const isActive = i === activeIndex
              const isPast = i < activeIndex
              gsap.to(line, {
                scaleX: isActive || isPast ? 1 : 0,
                duration: 0.4,
                ease: 'power2.inOut',
                transformOrigin: 'left center',
                overwrite: true,
              })
            })

            // Step opacity + color
            const steps = container.querySelectorAll<HTMLElement>('[data-step]')
            steps.forEach((step, i) => {
              const isActive = i === activeIndex
              gsap.to(step, {
                opacity: isActive ? 1 : 0.3,
                duration: 0.3,
                overwrite: true,
              })
              const num = step.querySelector<HTMLElement>('[data-step-num]')
              if (num) {
                gsap.to(num, {
                  color: isActive ? '#2F7EFF' : 'rgba(255,255,255,0.2)',
                  duration: 0.3,
                  overwrite: true,
                })
              }
              const border = step.querySelector<HTMLElement>('[data-step-border]')
              if (border) {
                gsap.to(border, {
                  opacity: isActive ? 0.5 : 0,
                  duration: 0.3,
                  overwrite: true,
                })
              }
            })
          }
        }
      })

      tl.to(track, {
        x: -totalScroll,
        ease: 'none',
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        position: 'relative',
        padding: 'clamp(100px,14vw,180px) 0 0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 clamp(24px,6vw,100px)', marginBottom: 'clamp(48px,6vw,80px)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div ref={eyebrowRef} style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.28em',
            color: 'var(--el)', textTransform: 'uppercase',
            marginBottom: '20px', opacity: 0,
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
            How It Works
          </div>
          <h2 ref={headRef} style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(38px,5.5vw,88px)',
            fontWeight: 700,
            letterSpacing: '-0.028em',
            color: 'var(--t1)',
            lineHeight: 1.0,
            opacity: 0,
          }}>
            48 hours.<br />
            <span style={{ color: 'var(--t2)' }}>Five moves.</span>
          </h2>
        </div>
      </div>

      {/* Pinned horizontal scroll container */}
      <div ref={containerRef} style={{ overflow: 'hidden' }}>
        <div style={{ paddingLeft: 'clamp(24px,6vw,100px)', paddingBottom: 'clamp(80px,10vw,140px)' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: '48px',
              alignItems: 'flex-start',
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {brand.process.map((step, i) => (
              <div
                key={step.number}
                data-step
                style={{
                  width: '380px',
                  flexShrink: 0,
                  opacity: i === 0 ? 1 : 0.3,
                  position: 'relative',
                  transition: 'none',
                }}
              >
                {/* Animated left border */}
                <div
                  data-step-border
                  style={{
                    position: 'absolute',
                    left: '-2px', top: 0, bottom: 0,
                    width: '2px',
                    background: 'var(--el)',
                    opacity: i === 0 ? 0.5 : 0,
                    animation: i === 0 ? 'borderPulse 2s ease-in-out infinite' : 'none',
                  }}
                />

                {/* Connector line to next step */}
                {i < brand.process.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    left: '100%',
                    width: '48px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                  }}>
                    <div
                      ref={el => { lineRefs.current[i] = el }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--el)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left center',
                      }}
                    />
                  </div>
                )}

                <div style={{ paddingLeft: '24px' }}>
                  <div
                    data-step-num
                    style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: 'clamp(48px,6vw,72px)',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: i === 0 ? '#2F7EFF' : 'rgba(255,255,255,0.2)',
                      lineHeight: 1,
                      marginBottom: '20px',
                      transition: 'none',
                    }}
                  >
                    {step.number}
                  </div>

                  <div style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '8px',
                    letterSpacing: '0.24em',
                    color: 'var(--t2)',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}>
                    {step.duration}
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
                    {step.title}
                  </h3>

                  <p style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 'clamp(13px,1.05vw,15px)',
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: 'var(--t2)',
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes borderPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  )
}
