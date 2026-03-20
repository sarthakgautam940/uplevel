'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface HeroProps {
  isVisible: boolean
}

export default function HeroSection({ isVisible }: HeroProps) {
  const [lineStates, setLineStates] = useState([false, false, false])
  const [eyebrowVisible, setEyebrowVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [readoutVisible, setReadoutVisible] = useState(false)

  const btn1Ref = useRef<HTMLAnchorElement>(null)
  const btn2Ref = useRef<HTMLAnchorElement>(null)
  const hoveredBtn = useRef<number | null>(null)

  // Staggered entrance when hero becomes visible
  useEffect(() => {
    if (!isVisible) return

    const timers = [
      setTimeout(() => setEyebrowVisible(true), 100),
      setTimeout(() => setLineStates([true, false, false]), 250),
      setTimeout(() => setLineStates([true, true, false]), 360),
      setTimeout(() => setLineStates([true, true, true]), 470),
      setTimeout(() => setSubVisible(true), 760),
      setTimeout(() => setCtaVisible(true), 920),
      setTimeout(() => setReadoutVisible(true), 600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [isVisible])

  // Magnetic button behavior
  useEffect(() => {
    if (!isVisible) return

    const btns = [btn1Ref.current, btn2Ref.current]

    const handleMouseMove = (e: MouseEvent) => {
      btns.forEach((btn, i) => {
        if (!btn) return
        const rect = btn.getBoundingClientRect()
        const btnCx = rect.left + rect.width / 2
        const btnCy = rect.top + rect.height / 2
        const dx = e.clientX - btnCx
        const dy = e.clientY - btnCy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 80 && hoveredBtn.current !== (1 - i)) {
          const factor = (1 - dist / 80) * 8
          btn.style.transform = `translate(${dx * factor / 80}px, ${dy * factor / 80}px)`
        } else {
          btn.style.transform = ''
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isVisible])

  const READOUT_LINES = [
    `SYS · ${new Date().getFullYear()} · BLUEPRINT ZERO`,
    'CAM: HERO POSITION [0,18,80]',
    'ENV: CHAPTER I · THE FRAME',
    'STATUS: ALL SYSTEMS NOMINAL',
  ]

  return (
    <section
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 'clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px)',
      }}
    >
      {/* System readout — upper right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px, 10vh, 120px)',
          right: 'clamp(24px, 5vw, 80px)',
          pointerEvents: 'none',
        }}
      >
        {READOUT_LINES.map((line, i) => (
          <div
            key={i}
            className="system-readout-line"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              letterSpacing: '0.28em',
              color: '#5C6278',
              lineHeight: 2.2,
              opacity: readoutVisible ? 0.8 : 0,
              transform: readoutVisible ? 'translateX(0)' : 'translateX(16px)',
              transition: `opacity 400ms ${i * 80}ms, transform 400ms ${i * 80}ms cubic-bezier(0.19,1,0.22,1)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Main hero content — bottom left */}
      <div style={{ maxWidth: '800px', pointerEvents: 'auto' }}>
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: '#2F7EFF',
            textTransform: 'uppercase',
            marginBottom: '20px',
            opacity: eyebrowVisible ? 1 : 0,
            transform: eyebrowVisible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 500ms cubic-bezier(0.19,1,0.22,1), transform 500ms cubic-bezier(0.19,1,0.22,1)',
          }}
        >
          Digital Systems for Elite Contractors
        </div>

        {/* Headline — 3 lines */}
        <div style={{ marginBottom: '28px' }}>
          {[
            { text: 'Your business.', italic: false },
            { text: 'Engineered', italic: false },
            { text: 'to perform.', italic: true },
          ].map((line, i) => (
            <div
              key={i}
              style={{ overflow: 'hidden', lineHeight: 0.95, marginBottom: '2px' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontStyle: line.italic ? 'italic' : 'normal',
                  fontSize: 'clamp(52px, 9vw, 130px)',
                  lineHeight: 0.91,
                  letterSpacing: '-0.036em',
                  color: '#F1F2FF',
                  transform: lineStates[i]
                    ? 'translateY(0) skewY(0deg)'
                    : 'translateY(108%) skewY(1.2deg)',
                  transition: `transform 720ms cubic-bezier(0.19, 1, 0.22, 1) ${i * 40}ms`,
                  willChange: 'transform',
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Sub copy */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.6vw, 19px)',
            lineHeight: 1.65,
            color: '#5C6278',
            maxWidth: '460px',
            marginBottom: '36px',
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 850ms cubic-bezier(0.19,1,0.22,1), transform 850ms cubic-bezier(0.19,1,0.22,1)',
          }}
        >
          Website systems, AI phone agents, and SEO built for contractors who have earned
          the right to look extraordinary online. 48-hour launch. Month-to-month.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 500ms, transform 500ms cubic-bezier(0.19,1,0.22,1)',
          }}
        >
          <Link
            href="/contact"
            ref={btn1Ref}
            data-cursor="Start"
            className="btn btn-primary"
            onMouseEnter={() => { hoveredBtn.current = 0 }}
            onMouseLeave={() => { hoveredBtn.current = null }}
            style={{ transition: 'transform 300ms cubic-bezier(0.19,1,0.22,1), background-color 150ms' }}
          >
            Start your build →
          </Link>
          <Link
            href="/work"
            ref={btn2Ref}
            data-cursor="View work"
            className="btn btn-ghost"
            onMouseEnter={() => { hoveredBtn.current = 1 }}
            onMouseLeave={() => { hoveredBtn.current = null }}
            style={{ transition: 'transform 300ms cubic-bezier(0.19,1,0.22,1), border-color 150ms' }}
          >
            See the work
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-indicator"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 600ms 400ms',
        }}
      >
        <div className="scroll-indicator-line">
          <div className="scroll-indicator-dot" />
        </div>
      </div>
    </section>
  )
}
