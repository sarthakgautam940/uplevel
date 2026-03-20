'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CASE_STUDIES } from '@/lib/brand'

export default function WorkSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section ref={sectionRef} style={{ padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', letterSpacing: '0.35em', color: '#2F7EFF', textTransform: 'uppercase', marginBottom: '16px' }}
          >Selected work</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '108%' }} animate={isInView ? { y: 0 } : {}} transition={{ duration: 0.72, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              style={{ fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 0.92, color: '#F1F2FF', display: 'block' }}
            >Built. Launched.<br /><span style={{ color: '#5C6278' }}>Measured.</span></motion.h2>
          </div>
        </div>
        <motion.a
          href="/work" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }}
          data-cursor="View all"
          style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', letterSpacing: '0.28em', color: '#5C6278', textDecoration: 'none', textTransform: 'uppercase', cursor: 'none', transition: 'color 200ms' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = '#F1F2FF' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5C6278' }}
        >All case studies →</motion.a>
      </div>
      <div>
        {CASE_STUDIES.map((cs, i) => (
          <WorkRow key={cs.id} caseStudy={cs} index={i} isInView={isInView} />
        ))}
      </div>
    </section>
  )
}

function WorkRow({ caseStudy, index, isInView }: { caseStudy: typeof CASE_STUDIES[number]; index: number; isInView: boolean }) {
  const [, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: [0.19, 1, 0.22, 1] }}
      className="work-card" data-cursor="Read case"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#2F7EFF' }}>0{index + 1}</span>
          <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '-0.02em', color: '#F1F2FF' }}>{caseStudy.client}</h3>
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', letterSpacing: '0.2em', color: '#5C6278', marginBottom: '12px' }}>{caseStudy.vertical}</div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '14px', color: '#5C6278', lineHeight: 1.6, maxWidth: '540px' }}>{caseStudy.story}</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {caseStudy.services.map(s => (
            <span key={s} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.2em', color: '#5C6278', padding: '4px 10px', border: '1px solid #21222E', borderRadius: '1px' }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.04em', color: '#2F7EFF', lineHeight: 1, marginBottom: '4px' }}>{caseStudy.metric}</div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.22em', color: '#5C6278', textTransform: 'uppercase' }}>{caseStudy.metricLabel}</div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.18em', color: '#5C6278', marginTop: '12px', opacity: 0.6 }}>{caseStudy.timeframe}</div>
      </div>
    </motion.div>
  )
}
