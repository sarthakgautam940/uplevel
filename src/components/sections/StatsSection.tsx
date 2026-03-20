'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { STATS } from '@/lib/brand'

function useCountUp(target: number, isActive: boolean, delay: number, duration = 1100) {
  const [value, setValue] = useState(0)
  const [sharp, setSharp] = useState(false)
  const [pulse, setPulse] = useState(false)
  const rafRef = useRef<number>(0)
  const fired = useRef(false)

  useEffect(() => {
    if (!isActive || fired.current) return
    fired.current = true
    const timer = setTimeout(() => {
      const start = performance.now()
      const tick = () => {
        const t = Math.min((performance.now() - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(eased * target))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setValue(target)
          setSharp(true)
          setPulse(true)
          setTimeout(() => setPulse(false), 800)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(rafRef.current) }
  }, [isActive, target, delay, duration])

  return { value, sharp, pulse }
}

function StatBlock({ stat, isActive, delay }: { stat: typeof STATS[number]; isActive: boolean; delay: number }) {
  const { value, sharp, pulse } = useCountUp(stat.value, isActive, delay)
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <style>{`@keyframes statRadialPulse{from{opacity:1;transform:scale(0.5)}to{opacity:0;transform:scale(2)}}`}</style>
      {pulse && (
        <div style={{ position: 'absolute', inset: '-30px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(47,126,255,0.07) 0%, transparent 60%)', animation: 'statRadialPulse 800ms ease-out forwards', pointerEvents: 'none' }} />
      )}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: delay / 1000, ease: [0.19, 1, 0.22, 1] }}>
        <div style={{ fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 80px)', letterSpacing: '-0.04em', lineHeight: 1, color: '#F1F2FF', marginBottom: '8px', filter: sharp ? 'blur(0)' : 'blur(0.6px)', transition: sharp ? 'filter 0ms' : 'none' }}>
          {value}{stat.suffix}
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', letterSpacing: '0.3em', color: '#5C6278', textTransform: 'uppercase' }}>{stat.label}</div>
      </motion.div>
    </div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })
  return (
    <section ref={sectionRef} style={{ background: '#0C0D14', padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)', position: 'relative', borderTop: '1px solid #21222E', borderBottom: '1px solid #21222E' }}>
      <motion.div
        initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(47,126,255,0.3), transparent)', transformOrigin: 'left center' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', maxWidth: '960px', margin: '0 auto' }}>
        {STATS.map((stat, i) => (
          <StatBlock key={stat.label} stat={stat} isActive={isInView} delay={i * 160} />
        ))}
      </div>
    </section>
  )
}
