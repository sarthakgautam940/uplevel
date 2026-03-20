'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { brand } from '@/lib/brand'
import { ArrowRight } from 'lucide-react'

const featured = brand.work.slice(0, 3)

function WorkCard({ project, index }: { project: (typeof brand.work)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const metricRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const card = cardRef.current
    const metric = metricRef.current
    if (!card || !metric) return

    const onEnter = () => {
      gsap.to(metric, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' })
      card.style.borderColor = project.accent + '55'
    }

    const onLeave = () => {
      gsap.to(metric, { opacity: 0, y: 8, duration: 0.3 })
      card.style.borderColor = 'rgba(255,255,255,0.06)'
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [project.accent])

  return (
    <Link href={`/work/${project.slug}`} style={{ textDecoration: 'none' }}>
      <div
        ref={cardRef}
        data-cursor="VIEW"
        style={{
          position: 'relative',
          background: 'var(--srf)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(28px,3vw,44px) clamp(24px,3vw,40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          transition: 'border-color 0.4s ease, background 0.3s ease',
          cursor: 'none',
          overflow: 'hidden',
        }}
      >
        {/* accent wash */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(135deg, transparent 60%, ${project.accent}06 100%)`,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px,3vw,48px)', flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          {/* Index */}
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: 'var(--t3)',
            flexShrink: 0,
          }}>
            0{index + 1}
          </span>

          {/* Name + type */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(20px,2.4vw,32px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: 'var(--t1)',
              lineHeight: 1.1,
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {project.name}
            </div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'var(--t2)',
              textTransform: 'uppercase',
            }}>
              {project.type} · {project.location}
            </div>
          </div>

          {/* Story */}
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(12px,1vw,14px)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(241,242,255,0.35)',
            maxWidth: '360px',
            flex: 1,
            display: 'none',
          }}
          className="card-story"
          >
            {project.story}
          </p>
        </div>

        {/* Metric reveal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <div
            ref={metricRef}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              opacity: 0,
              transform: 'translateY(8px)',
            }}
          >
            <div style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(24px,3vw,40px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: 'var(--t1)',
              lineHeight: 1,
            }}>
              {project.metric}
            </div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px',
              letterSpacing: '0.18em',
              color: 'var(--t2)',
              textTransform: 'uppercase',
              marginTop: '4px',
              textAlign: 'right',
            }}>
              {project.metricLabel}
            </div>
          </div>

          <ArrowRight size={16} color="rgba(47,126,255,0.4)" />
        </div>
      </div>
    </Link>
  )
}

export default function WorkPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo([eyebrowRef.current, headRef.current], {
      y: 24, opacity: 0
    }, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' }
    })

    const cards = cardsRef.current?.children
    if (cards) {
      gsap.fromTo(Array.from(cards), {
        y: 40, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(48px,6vw,80px)', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div ref={eyebrowRef} style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px', letterSpacing: '0.28em',
              color: 'var(--el)', textTransform: 'uppercase',
              marginBottom: '20px', opacity: 0,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
              Selected Work
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
              Real clients.<br />
              <span style={{ color: 'var(--t2)' }}>Real results.</span>
            </h2>
          </div>

          <Link
            href="/work"
            data-cursor="VIEW"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px', letterSpacing: '0.22em',
              color: 'var(--el)', textTransform: 'uppercase',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              cursor: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            See all work <ArrowRight size={12} />
          </Link>
        </div>

        <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {featured.map((project, i) => (
            <WorkCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
