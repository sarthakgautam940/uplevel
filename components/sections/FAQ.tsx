'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'
import { Plus, Minus } from 'lucide-react'

const categories = ['All', 'Process', 'Pricing', 'AI', 'Results']

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<Array<HTMLDivElement | null>>([])
  const innerRefs = useRef<Array<HTMLDivElement | null>>([])

  const filtered = activeCategory === 'All'
    ? brand.faq
    : brand.faq.filter(f => f.category === activeCategory)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo(leftRef.current, { x: -24, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' }
    })
  }, [])

  // Animate accordion open/close
  useEffect(() => {
    answerRefs.current.forEach((el, i) => {
      if (!el || !innerRefs.current[i]) return
      const inner = innerRefs.current[i]!
      const isOpen = i === openIndex

      if (isOpen) {
        const h = inner.offsetHeight
        gsap.fromTo(el, { height: 0 }, {
          height: h, duration: 0.45, ease: 'expo.out',
          onComplete: () => { el.style.height = 'auto' }
        })
        gsap.fromTo(inner, { opacity: 0, y: 10 }, {
          opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'expo.out'
        })
      } else {
        const h = el.offsetHeight
        if (h > 0) {
          el.style.height = h + 'px'
          gsap.to(el, { height: 0, duration: 0.35, ease: 'power2.in' })
          gsap.to(inner, { opacity: 0, duration: 0.2 })
        }
      }
    })
  }, [openIndex, filtered])

  // Reset open when category changes
  useEffect(() => {
    setOpenIndex(null)
  }, [activeCategory])

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'start' }}>
        {/* Left — sticky */}
        <div ref={leftRef} style={{ position: 'sticky', top: '120px', opacity: 0 }}>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.28em',
            color: 'var(--el)', textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
            FAQ
          </div>

          <h2 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(28px,3.8vw,56px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--t1)',
            lineHeight: 1.1,
            marginBottom: '40px',
          }}>
            Questions<br />we get<br />a lot.
          </h2>

          {/* Category filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'none', border: 'none',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '9px', letterSpacing: '0.2em',
                  color: activeCategory === cat ? 'var(--el)' : 'var(--t2)',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: activeCategory === cat ? 'var(--el)' : 'rgba(255,255,255,0.12)',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right — accordion */}
        <div>
          {filtered.map((item, i) => (
            <div
              key={`${activeCategory}-${i}`}
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderLeft: openIndex === i ? '2px solid rgba(47,126,255,0.5)' : '2px solid transparent',
                paddingLeft: '20px',
                transition: 'border-color 0.3s ease',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                  width: '100%', background: 'none', border: 'none',
                  padding: '28px 0',
                  cursor: 'pointer',
                  gap: '20px',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '8px', letterSpacing: '0.2em',
                    color: 'var(--t3)', textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {item.category}
                  </div>
                  <div style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: 'clamp(16px,1.8vw,22px)',
                    fontWeight: 700,
                    letterSpacing: '-0.018em',
                    color: openIndex === i ? 'var(--t1)' : 'rgba(241,242,255,0.75)',
                    lineHeight: 1.3,
                    transition: 'color 0.2s ease',
                  }}>
                    {item.question}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginTop: '20px' }}>
                  {openIndex === i
                    ? <Minus size={16} color="var(--el)" />
                    : <Plus size={16} color="rgba(255,255,255,0.3)" />
                  }
                </div>
              </button>

              {/* Answer — height-animated */}
              <div
                ref={el => { answerRefs.current[i] = el }}
                style={{ height: 0, overflow: 'hidden' }}
              >
                <div
                  ref={el => { innerRefs.current[i] = el }}
                  style={{
                    paddingBottom: '28px',
                    opacity: 0,
                  }}
                >
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 'clamp(13px,1.05vw,15px)',
                    fontWeight: 300,
                    lineHeight: 1.85,
                    color: 'var(--t2)',
                    maxWidth: '560px',
                  }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Last border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        </div>
      </div>
    </section>
  )
}
