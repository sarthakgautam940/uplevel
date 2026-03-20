'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'

function useCountUp(target: number, started: boolean, duration = 1800) {
  const [val, setVal] = useState(0)
  const [blurring, setBlurring] = useState(false)

  useEffect(() => {
    if (!started) return
    setBlurring(true)
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(eased * target)
      setVal(current)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        // snap sharp on completion
        setTimeout(() => setBlurring(false), 60)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])

  return { val, blurring }
}

function StatBlock({ value, suffix, label, delay, started }: {
  value: number; suffix: string; label: string; delay: number; started: boolean
}) {
  const { val, blurring } = useCountUp(value, started, 1600 + delay)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      padding: '32px 0',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(40px, 5.5vw, 72px)',
        fontWeight: 900,
        letterSpacing: '-0.035em',
        color: 'var(--t1)',
        lineHeight: 1,
        transition: blurring ? 'none' : 'filter 0.06s ease-out',
        filter: blurring ? 'blur(3px)' : 'blur(0px)',
      }}>
        {val}<span style={{ color: 'var(--el)', fontSize: '0.7em' }}>{suffix}</span>
      </div>
      <div style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: 'var(--t2)',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsStarted, setStatsStarted] = useState(false)
  const [wordEls, setWordEls] = useState<HTMLElement[]>([])

  const statement = brand.manifesto.statement
  const words = statement.split(' ')

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    // collect word elements
    if (wordsRef.current) {
      const spans = Array.from(wordsRef.current.querySelectorAll<HTMLElement>('.word-inner'))
      setWordEls(spans)
    }
  }, [])

  useEffect(() => {
    if (!wordEls.length || !sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current

    // eyebrow
    gsap.fromTo(eyebrowRef.current, {
      x: -24, opacity: 0
    }, {
      x: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
    })

    // Inside-out word stagger: words in middle stagger faster
    const total = wordEls.length
    const center = (total - 1) / 2

    // Set all words to initial hidden state
    gsap.set(wordEls, { y: '110%', opacity: 0 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        wordEls.forEach((el, i) => {
          const distFromCenter = Math.abs(i - center)
          const maxDist = Math.max(center, total - 1 - center)
          // Normalized distance 0=center, 1=edge
          const norm = distFromCenter / maxDist
          // Inside (norm=0) animates first, outside (norm=1) animates last
          const delay = norm * 0.55 + 0.1

          gsap.to(el, {
            y: '0%',
            opacity: 1,
            duration: 0.95,
            delay,
            ease: 'cubic.out',
            onComplete: () => {
              // Special treatments
              const word = el.getAttribute('data-word') || ''
              if (word === 'extraordinary') {
                const underline = el.parentElement?.querySelector<HTMLElement>('.word-underline')
                if (underline) {
                  gsap.fromTo(underline, { scaleX: 0 }, {
                    scaleX: 1, duration: 0.3, ease: 'power2.inOut',
                    transformOrigin: 'left center',
                    onComplete: () => {
                      gsap.to(underline, { opacity: 0, delay: 1, duration: 0.4 })
                    }
                  })
                }
              }
              if (word === 'presence') {
                gsap.to(el, { opacity: 1.0, duration: 0.12 })
                setTimeout(() => gsap.to(el, { opacity: 0.8, duration: 0.3 }), 200)
              }
            }
          })
        })

        // Body paragraph after statement completes
        gsap.fromTo(bodyRef.current, { y: 22, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.95, delay: 1.1, ease: 'expo.out'
        })

        // Stats entrance
        if (statsRef.current) {
          gsap.fromTo(statsRef.current.children, {
            y: 30, opacity: 0
          }, {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12, delay: 1.3, ease: 'expo.out',
            onComplete: () => setStatsStarted(true)
          })
        }
      },
      once: true,
    })

    return () => ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger === section) t.kill()
    })
  }, [wordEls])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        overflow: 'hidden',
      }}
    >
      {/* subtle ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '60%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(47,126,255,0.04) 0%, transparent 70%)',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.28em',
          color: 'var(--el)',
          textTransform: 'uppercase',
          marginBottom: '48px',
          opacity: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{
            display: 'inline-block', width: '28px', height: '1px',
            background: 'var(--el)', opacity: 0.5
          }} />
          {brand.manifesto.eyebrow}
        </div>

        {/* Statement — word by word */}
        <div
          ref={wordsRef}
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(26px,3.8vw,56px)',
            fontWeight: 700,
            letterSpacing: '-0.022em',
            lineHeight: 1.15,
            color: 'var(--t1)',
            maxWidth: '900px',
            marginBottom: '48px',
          }}
        >
          {words.map((word, i) => {
            const clean = word.replace(/[.,]/g, '')
            const isExtraordinary = clean === 'extraordinary'
            const isPresence = clean === 'presence'

            return (
              <span
                key={i}
                style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em', position: 'relative' }}
              >
                <span
                  className="word-inner"
                  data-word={clean}
                  style={{
                    display: 'inline-block',
                    transform: 'translateY(110%)',
                    opacity: 0,
                    color: isPresence ? 'var(--el-hi)' : 'var(--t1)',
                  }}
                >
                  {word}
                </span>
                {isExtraordinary && (
                  <span
                    className="word-underline"
                    style={{
                      position: 'absolute',
                      bottom: '2px', left: 0,
                      width: '100%', height: '1px',
                      background: 'var(--el)',
                      transformOrigin: 'left center',
                      transform: 'scaleX(0)',
                    }}
                  />
                )}
              </span>
            )
          })}
        </div>

        {/* Body paragraph */}
        <div ref={bodyRef} style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(13px,1.05vw,15px)',
          fontWeight: 300,
          lineHeight: 1.85,
          color: 'var(--t2)',
          maxWidth: '520px',
          marginBottom: '80px',
          opacity: 0,
        }}>
          {brand.manifesto.body}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0 clamp(24px,5vw,80px)',
            maxWidth: '780px',
          }}
        >
          {brand.manifesto.stats.map((s, i) => (
            <StatBlock
              key={i}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              delay={i * 200}
              started={statsStarted}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
