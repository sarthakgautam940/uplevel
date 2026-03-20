'use client'

import { useRef, useEffect } from 'react'

const rows = [
  {
    text: 'THE WEBSITE YOUR WORK DESERVES · THE WEBSITE YOUR WORK DESERVES · THE WEBSITE YOUR WORK DESERVES · ',
    outlined: false,
    baseSpeed: 0.35,
    dir: -1,
    parallax: 0.85,
  },
  {
    text: 'AI  ·  AUTOMATION  ·  SEO  ·  DESIGN  ·  GROWTH  ·  AI  ·  AUTOMATION  ·  SEO  ·  DESIGN  ·  GROWTH  · ',
    outlined: true,
    baseSpeed: 0.42,
    dir: 1,
    parallax: 1.0,
  },
  {
    text: 'BUILD FAST. LAUNCH SMART. DOMINATE. · BUILD FAST. LAUNCH SMART. DOMINATE. · BUILD FAST. LAUNCH SMART. DOMINATE. · ',
    outlined: false,
    baseSpeed: 0.38,
    dir: -1,
    parallax: 0.88,
  },
]

export default function KineticBand() {
  const trackRefs = useRef<Array<HTMLDivElement | null>>([null, null, null])
  const positions = useRef([0, 0, 0])
  const velocities = useRef([0.35, 0.42, 0.38])
  const prevScroll = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    prevScroll.current = window.scrollY
    velocities.current = [0.35, 0.42, 0.38]

    const tick = () => {
      const currentScroll = window.scrollY
      const delta = currentScroll - prevScroll.current
      prevScroll.current = currentScroll

      rows.forEach((row, i) => {
        const target = row.baseSpeed * row.dir + delta * row.parallax * 0.10 * row.dir
        velocities.current[i] += (target - velocities.current[i]) * 0.06
        positions.current[i] -= velocities.current[i]

        const track = trackRefs.current[i]
        if (track) {
          const halfW = track.scrollWidth / 2
          if (positions.current[i] <= -halfW) positions.current[i] += halfW
          if (positions.current[i] >= 0) positions.current[i] -= halfW
          track.style.transform = `translateX(${positions.current[i]}px)`
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(60px,8vw,120px) 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Edge fades */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, var(--void) 0%, transparent 6%, transparent 94%, var(--void) 100%)',
      }} />

      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            overflow: 'hidden',
            padding: i === 1 ? '4px 0' : '0',
          }}
        >
          <div
            ref={el => { trackRefs.current[i] = el }}
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              willChange: 'transform',
              marginBottom: i < 2 ? 'clamp(4px,1vw,12px)' : 0,
            }}
          >
            {[row.text, row.text].map((t, j) => (
              <span
                key={j}
                style={{
                  display: 'inline-block',
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 8vw, 120px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  paddingRight: '0.3em',
                  color: row.outlined ? 'transparent' : 'var(--t1)',
                  WebkitTextStroke: row.outlined ? '1px rgba(241,242,255,0.18)' : 'none',
                  opacity: row.outlined ? 1 : 0.08,
                  userSelect: 'none',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
