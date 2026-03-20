'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/brand'

const ROTATIONS = [-2.5, 2.0, -1.8]

function TestimonialCard({ t, index, isInView }: { t: typeof TESTIMONIALS[number]; index: number; isInView: boolean }) {
  const rotation = ROTATIONS[index] ?? 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: [0.19, 1, 0.22, 1] }}
    >
      <div
        className="testimonial-card" data-cursor="Testimonial"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 400ms cubic-bezier(0.19,1,0.22,1)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-6px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg)` }}
      >
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#2F7EFF', marginBottom: '16px' }}>{t.metric}</div>
        <blockquote style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '14px', lineHeight: 1.65, color: '#5C6278', fontStyle: 'italic', marginBottom: '20px', borderLeft: '2px solid rgba(47,126,255,0.2)', paddingLeft: '14px' }}>
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div>
          <div style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '13px', color: '#F1F2FF' }}>{t.author}</div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.18em', color: '#5C6278' }}>{t.role} · {t.market}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const featuredQuote = TESTIMONIALS[2]

  return (
    <section ref={sectionRef} style={{ padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px)', position: 'relative', background: 'linear-gradient(to bottom, transparent, rgba(12,13,20,0.4), transparent)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: '40px', left: '40px', fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(200px, 28vw, 400px)', lineHeight: 1, color: 'rgba(47,126,255,0.025)', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>&ldquo;</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '64px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', letterSpacing: '0.35em', color: '#2F7EFF', textTransform: 'uppercase', marginBottom: '16px' }}>
            Client voice
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }} style={{ maxWidth: '900px', marginBottom: '80px' }}>
          <blockquote style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500, fontSize: 'clamp(18px, 2.2vw, 28px)', lineHeight: 1.5, letterSpacing: '-0.01em', color: '#F1F2FF', marginBottom: '24px', fontStyle: 'italic' }}>
            &ldquo;{featuredQuote.quote}&rdquo;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '32px', height: '1px', background: '#2F7EFF' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '14px', color: '#F1F2FF' }}>{featuredQuote.author}</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', letterSpacing: '0.2em', color: '#5C6278' }}>{featuredQuote.role} · {featuredQuote.market}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: '18px', color: '#2F7EFF' }}>{featuredQuote.metric}</div>
          </div>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
