'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'
import { Star } from 'lucide-react'

const { featured, cards } = brand.testimonials

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const quoteWrapRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null])
  const cardContainerRef = useRef<HTMLDivElement>(null)

  const rotations = [-2.5, 2.0, -1.8]
  const parallaxRates = [1.05, 1.0, 0.95]

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    // Eyebrow
    gsap.fromTo(eyebrowRef.current, { x: -20, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
    })

    // Featured quote: clip-path sweep left→right scrubbed to scroll
    const qw = quoteWrapRef.current
    if (qw) {
      gsap.fromTo(qw, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
      }, {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: qw,
          start: 'top 75%',
          end: 'top 30%',
          scrub: 0.8,
        }
      })
    }

    // Cards entrance with rotations
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.set(card, { rotation: rotations[i], y: 40, opacity: 0 })
      gsap.to(card, {
        y: 0, opacity: 1,
        duration: 0.9,
        delay: i * 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: cardContainerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      })

      // Hover: straighten + lift
      const onEnter = () => {
        gsap.to(card, { rotation: 0, y: -6, duration: 0.4, ease: 'expo.out', overwrite: true })
      }
      const onLeave = () => {
        gsap.to(card, { rotation: rotations[i], y: 0, duration: 0.6, ease: 'expo.out', overwrite: true })
      }
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
    })

    // Parallax differential on cards
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.to(card, {
        y: `-${(parallaxRates[i] - 1) * 60}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: cardContainerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger === section || t.vars.trigger === quoteWrapRef.current || t.vars.trigger === cardContainerRef.current) {
        t.kill()
      }
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ambient glow */}
      <div style={{
        position: 'absolute',
        top: '20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(47,126,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', letterSpacing: '0.28em',
          color: 'var(--el)', textTransform: 'uppercase',
          marginBottom: '64px', opacity: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
          Client Outcomes
        </div>

        {/* Featured pull-quote */}
        <div
          ref={quoteWrapRef}
          style={{
            marginBottom: 'clamp(80px,10vw,140px)',
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0,
          }}
        >
          <div style={{
            fontFamily: '"Outfit", sans-serif',
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.2vw,52px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            color: 'var(--t1)',
            maxWidth: '900px',
            marginBottom: '32px',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: '-0.3em', left: '-0.15em',
              fontFamily: '"Outfit", sans-serif',
              fontSize: '4em',
              color: 'rgba(47,126,255,0.06)',
              lineHeight: 1,
              fontStyle: 'normal',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>"</span>
            {featured.quote}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: 'var(--srf2)',
              border: '1px solid rgba(47,126,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Outfit", sans-serif',
              fontSize: '14px', fontWeight: 900,
              color: 'var(--el)',
            }}>
              {featured.name[0]}
            </div>
            <div>
              <div style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px', fontWeight: 400,
                color: 'var(--t1)', marginBottom: '2px',
              }}>
                {featured.name}
              </div>
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '8px', letterSpacing: '0.2em',
                color: 'var(--t2)', textTransform: 'uppercase',
              }}>
                {featured.title} · {featured.company}
              </div>
            </div>
          </div>
        </div>

        {/* Three rotated cards */}
        <div
          ref={cardContainerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px,2vw,28px)',
            alignItems: 'start',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              style={{
                background: 'var(--srf)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: 'clamp(24px,2.5vw,36px)',
                transformOrigin: 'center center',
                cursor: 'default',
                opacity: 0,
                position: 'relative',
              }}
            >
              {/* large quote mark bg */}
              <div style={{
                position: 'absolute',
                top: '12px', right: '16px',
                fontFamily: '"Outfit", sans-serif',
                fontSize: '80px',
                color: 'rgba(47,126,255,0.05)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}>"</div>

              {/* Stars — electric blue */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                {Array.from({ length: card.stars }).map((_, si) => (
                  <Star key={si} size={12} fill="var(--el)" color="var(--el)" />
                ))}
              </div>

              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 'clamp(13px,1.05vw,15px)',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(241,242,255,0.7)',
                marginBottom: '24px',
                position: 'relative', zIndex: 1,
              }}>
                "{card.quote}"
              </p>

              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '16px',
              }}>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: 400,
                  color: 'var(--t1)',
                }}>
                  {card.name}
                </div>
                <div style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '8px', letterSpacing: '0.18em',
                  color: 'var(--t2)', textTransform: 'uppercase',
                  marginTop: '3px',
                }}>
                  {card.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
