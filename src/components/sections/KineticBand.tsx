'use client'

import { useEffect, useRef } from 'react'

const BAND_TEXT = [
  'POOL BUILDERS · HVAC SYSTEMS · CUSTOM HOMES · WINE CELLARS · LANDSCAPING · GENERAL CONTRACTORS',
  'WEBSITE SYSTEMS · AI PHONE AGENTS · SEO DOMINATION · BRAND IDENTITY · DIGITAL PRESENCE',
  'RICHMOND VA · DALLAS TX · ATLANTA GA · NATIONWIDE · BUILT TO PERFORM · 48 HOUR LAUNCH',
]

const SPEEDS = [0.85, 1.0, 1.15]
const DIRECTIONS = [-1, 1, -1] // alternating directions

export default function KineticBand() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const offsetsRef = useRef([0, 0, 0])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        const width = row.scrollWidth / 2
        offsetsRef.current[i] += DIRECTIONS[i] * SPEEDS[i] * 0.4

        // Seamless loop
        if (DIRECTIONS[i] < 0 && offsetsRef.current[i] <= -width) {
          offsetsRef.current[i] = 0
        } else if (DIRECTIONS[i] > 0 && offsetsRef.current[i] >= 0) {
          offsetsRef.current[i] = -width
        }

        row.style.transform = `translateX(${offsetsRef.current[i]}px)`
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    // Initialize offsets
    offsetsRef.current[1] = -200 // row 2 starts offset for visual variety
    animate()

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '20px 0',
        borderTop: '1px solid #21222E',
        borderBottom: '1px solid #21222E',
      }}
    >
      {/* Edge fades */}
      <div className="kinetic-edge-fade-left" />
      <div className="kinetic-edge-fade-right" />

      {BAND_TEXT.map((text, rowIndex) => {
        const isOutline = rowIndex === 1
        const doubled = `${text} · ${text} · ${text} · ${text} · `

        return (
          <div
            key={rowIndex}
            style={{ overflow: 'hidden', padding: '4px 0' }}
          >
            <div
              ref={el => { rowRefs.current[rowIndex] = el }}
              style={{
                display: 'inline-flex',
                whiteSpace: 'nowrap',
                willChange: 'transform',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontSize: 'clamp(40px, 7vw, 96px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  paddingRight: '2em',
                  color: isOutline ? 'transparent' : '#F1F2FF',
                  WebkitTextStroke: isOutline ? '1px rgba(241,242,255,0.18)' : undefined,
                  display: 'block',
                }}
              >
                {doubled}
              </span>
              {/* Duplicate for seamless loop */}
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontSize: 'clamp(40px, 7vw, 96px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  paddingRight: '2em',
                  color: isOutline ? 'transparent' : '#F1F2FF',
                  WebkitTextStroke: isOutline ? '1px rgba(241,242,255,0.18)' : undefined,
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
              >
                {doubled}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
