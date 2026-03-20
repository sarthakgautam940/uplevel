'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'
import { Check } from 'lucide-react'

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<Array<HTMLDivElement | null>>([])
  const fillsRef = useRef<Array<HTMLDivElement | null>>([])
  const authorityBorderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo([eyebrowRef.current, headRef.current], {
      y: 20, opacity: 0
    }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
    })

    // Cards drop + background fill simultaneously bottom→top
    const cardEls = cardsRef.current.filter(Boolean)
    const fillEls = fillsRef.current.filter(Boolean)

    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        cardEls.forEach((card, i) => {
          gsap.fromTo(card, { y: -40, opacity: 0 }, {
            y: 0, opacity: 1,
            duration: 0.85,
            delay: i * 0.09,
            ease: 'expo.out',
          })
        })

        fillEls.forEach((fill, i) => {
          gsap.fromTo(fill, { clipPath: 'inset(100% 0 0 0)' }, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.85,
            delay: i * 0.09,
            ease: 'expo.out',
          })
        })

        // Authority card pulse after all land
        setTimeout(() => {
          if (authorityBorderRef.current) {
            gsap.to(authorityBorderRef.current, {
              opacity: 0.8,
              duration: 0.5,
              yoyo: true,
              repeat: 2,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(authorityBorderRef.current, { opacity: 0.3 })
              }
            })
          }
        }, 700)
      }
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="pricing"
      style={{
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={eyebrowRef} style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', letterSpacing: '0.28em',
          color: 'var(--el)', textTransform: 'uppercase',
          marginBottom: '20px', opacity: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
          Transparent Pricing
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
          Pick your system.<br />
          <span style={{ color: 'var(--t2)' }}>Scale when ready.</span>
        </h2>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2px',
          alignItems: 'start',
        }}>
          {brand.pricing.map((tier, i) => (
            <div
              key={tier.name}
              ref={el => { cardsRef.current[i] = el }}
              style={{
                position: 'relative',
                opacity: 0,
                overflow: 'hidden',
              }}
            >
              {/* Background fill layer — clip-path bottom→top */}
              <div
                ref={el => { fillsRef.current[i] = el }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: tier.highlight
                    ? 'linear-gradient(160deg, rgba(47,126,255,0.12) 0%, rgba(47,126,255,0.04) 100%)'
                    : 'var(--srf)',
                  clipPath: 'inset(100% 0 0 0)',
                  zIndex: 0,
                }}
              />

              {/* Authority animated border */}
              {tier.highlight && (
                <div
                  ref={authorityBorderRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '1px solid rgba(47,126,255,0.3)',
                    pointerEvents: 'none',
                    zIndex: 2,
                    opacity: 0.3,
                  }}
                />
              )}

              {/* Non-highlight border */}
              {!tier.highlight && (
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '1px solid rgba(255,255,255,0.06)',
                  pointerEvents: 'none', zIndex: 2,
                }} />
              )}

              <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(28px,3vw,44px) clamp(24px,2.5vw,36px)' }}>
                {/* Badge */}
                {tier.badge && (
                  <div style={{
                    display: 'inline-block',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '8px', letterSpacing: '0.22em',
                    color: 'var(--el)',
                    textTransform: 'uppercase',
                    background: 'rgba(47,126,255,0.1)',
                    border: '1px solid rgba(47,126,255,0.2)',
                    padding: '4px 10px',
                    marginBottom: '16px',
                  }}>
                    {tier.badge}
                  </div>
                )}

                {!tier.badge && <div style={{ height: '30px', marginBottom: '16px' }} />}

                <h3 style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: 'clamp(20px,2.2vw,28px)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: 'var(--t1)',
                  marginBottom: '8px',
                }}>
                  {tier.name}
                </h3>

                <p style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 'clamp(12px,1vw,14px)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--t2)',
                  marginBottom: '28px',
                  minHeight: '42px',
                }}>
                  {tier.description}
                </p>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: 'clamp(28px,3.2vw,44px)',
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      color: tier.highlight ? 'var(--t1)' : 'var(--t1)',
                    }}>
                      {tier.price}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '9px', letterSpacing: '0.18em',
                    color: 'var(--t2)', marginTop: '4px',
                  }}>
                    then {tier.recurring}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tier.features.map((f, fi) => (
                    <li key={fi} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px', fontWeight: 300,
                      color: 'rgba(241,242,255,0.6)',
                      lineHeight: 1.5,
                    }}>
                      <Check size={12} color={tier.highlight ? 'var(--el)' : 'rgba(47,126,255,0.5)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  style={{
                    display: 'block',
                    padding: '14px 24px',
                    background: tier.highlight ? 'var(--el)' : 'transparent',
                    border: tier.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    color: tier.highlight ? '#fff' : 'var(--t2)',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    cursor: 'none',
                  }}
                  data-cursor="START"
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', letterSpacing: '0.18em',
          color: 'var(--t3)', textTransform: 'uppercase',
        }}>
          All packages · Month-to-month · Cancel anytime · No hidden fees
        </div>
      </div>
    </section>
  )
}
