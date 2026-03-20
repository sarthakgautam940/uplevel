'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { STATS } from '@/lib/brand'

const STATEMENT_WORDS = [
  'Every', 'contractor', 'who', 'builds', 'something',
  'extraordinary', 'deserves', 'a', 'digital', 'presence',
  'that', 'says', 'so.'
]

// Inside-out stagger: words near center reveal first
// Center index ≈ 6 (extraordinary). Distance from center determines delay.
function getWordDelay(index: number, total: number): number {
  const center = total / 2
  const dist = Math.abs(index - center)
  // Center words: 0ms, edge words: up to 320ms
  return dist * 28
}

function useCountUp(target: number, isActive: boolean, duration = 1200) {
  const [value, setValue] = useState(0)
  const [isBlurred, setIsBlurred] = useState(false)
  const [hasFired, setHasFired] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive || hasFired) return
    setHasFired(true)
    setIsBlurred(true)
    const start = performance.now()

    const tick = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
      const current = Math.round(eased * target)
      setValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
        // Snap to sharp
        setIsBlurred(false)
        // Radial pulse via CSS class — handled by parent
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, target, duration, hasFired])

  return { value, isBlurred }
}

function StatBlock({
  stat,
  isActive,
  index,
}: {
  stat: typeof STATS[number]
  isActive: boolean
  index: number
}) {
  const { value, isBlurred } = useCountUp(stat.value, isActive, 1000 + index * 120)
  const [pulsed, setPulsed] = useState(false)

  useEffect(() => {
    if (!isBlurred && isActive && !pulsed) {
      setPulsed(true)
    }
  }, [isBlurred, isActive, pulsed])

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      {/* Radial pulse on landing */}
      {pulsed && (
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(47,126,255,0.06) 0%, transparent 70%)',
            animation: 'statPulseOut 800ms ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          fontFamily: 'var(--font-outfit)',
          fontWeight: 900,
          fontSize: 'clamp(44px, 6vw, 72px)',
          letterSpacing: '-0.04em',
          color: '#F1F2FF',
          lineHeight: 1,
          marginBottom: '8px',
          filter: isBlurred ? 'blur(0.6px)' : 'blur(0)',
          transition: isBlurred ? 'none' : 'filter 0ms',
        }}
      >
        {value}{stat.suffix}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: '#5C6278',
          textTransform: 'uppercase',
        }}
      >
        {stat.label}
      </div>
    </div>
  )
}

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })
  const [wordsVisible, setWordsVisible] = useState<boolean[]>(Array(STATEMENT_WORDS.length).fill(false))
  const [bodyVisible, setBodyVisible] = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const [specialWords, setSpecialWords] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!isInView) return

    STATEMENT_WORDS.forEach((_, i) => {
      const delay = getWordDelay(i, STATEMENT_WORDS.length)
      setTimeout(() => {
        setWordsVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, delay)
    })

    // Body text after words complete
    const maxDelay = Math.max(...STATEMENT_WORDS.map((_, i) => getWordDelay(i, STATEMENT_WORDS.length)))
    setTimeout(() => setBodyVisible(true), maxDelay + 200)
    setTimeout(() => setStatsActive(true), maxDelay + 400)

    // Special word treatments
    setTimeout(() => setSpecialWords(prev => ({ ...prev, extraordinary: true })), getWordDelay(5, STATEMENT_WORDS.length) + 100)
    setTimeout(() => setSpecialWords(prev => ({ ...prev, digital: true })), getWordDelay(8, STATEMENT_WORDS.length) + 100)
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 8vw, 140px)',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes statPulseOut {
          from { transform: scale(0.3); opacity: 1; }
          to { transform: scale(1.8); opacity: 0; }
        }
        @keyframes underlineDraw {
          from { scaleX: 0; }
          to { scaleX: 1; }
        }
        @keyframes opacityLift {
          0%, 100% { opacity: 1; }
          30% { opacity: 1.0; filter: brightness(1.12); }
        }
      `}</style>

      {/* Statement */}
      <div
        style={{
          maxWidth: '1000px',
          textAlign: 'center',
          marginBottom: '72px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-outfit)',
            fontWeight: 900,
            fontSize: 'clamp(32px, 4.5vw, 60px)',
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            color: '#F1F2FF',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 0.28em',
            rowGap: '0.06em',
          }}
        >
          {STATEMENT_WORDS.map((word, i) => {
            const isExtraordinary = word === 'extraordinary'
            const isDigital = word === 'digital' || word === 'presence'
            const isSo = word === 'so.'

            return (
              <span key={i} style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: wordsVisible[i] ? 'translateY(0)' : 'translateY(110%)',
                    transition: `transform 560ms cubic-bezier(0.19, 1, 0.22, 1)`,
                    color: isExtraordinary && specialWords.extraordinary ? '#F1F2FF' : '#F1F2FF',
                    animation: isDigital && specialWords.digital
                      ? 'opacityLift 600ms ease-out forwards'
                      : 'none',
                  }}
                >
                  {isSo ? (
                    <>
                      <span>so</span>
                      <span
                        style={{
                          display: 'inline-block',
                          transform: wordsVisible[i] ? 'translateY(0)' : 'translateY(200%)',
                          transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 80ms',
                        }}
                      >.</span>
                    </>
                  ) : word}
                </span>

                {/* Underline for "extraordinary" */}
                {isExtraordinary && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#2F7EFF',
                      transformOrigin: 'left center',
                      transform: specialWords.extraordinary ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 500ms cubic-bezier(0.19,1,0.22,1)',
                    }}
                  />
                )}
                {/* Delayed underline dissolve */}
                {isExtraordinary && specialWords.extraordinary && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#2F7EFF',
                      transformOrigin: 'left center',
                      animation: 'underlineFade 1s 400ms ease-out forwards',
                    }}
                  />
                )}
              </span>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={bodyVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: 'clamp(15px, 1.5vw, 18px)',
          lineHeight: 1.7,
          color: '#5C6278',
          maxWidth: '580px',
          textAlign: 'center',
          marginBottom: '72px',
        }}
      >
        We build digital systems for contractors who have 20 years of craft and
        a reputation that deserves a digital presence to match. 47 clients. 98% satisfaction.
        The average client sees 340% ROI in year one.
      </motion.p>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {STATS.map((stat, i) => (
          <StatBlock key={stat.label} stat={stat} isActive={statsActive} index={i} />
        ))}
      </div>
    </section>
  )
}
