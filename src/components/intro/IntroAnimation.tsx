'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface IntroProps {
  onComplete: () => void
}

const WORDMARK_LETTERS = ['U', 'P', 'L', 'E', 'V', 'E', 'L']

// Non-uniform reveal groups — thought becoming articulate
// Group 0 first, then 1, then 2
const LETTER_GROUPS = [2, 0, 1, 0, 2, 1, 2] // index → group
const GROUP_DELAYS = [480, 560, 640] // ms from wordmark start

export default function IntroAnimation({ onComplete }: IntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  const [letterStates, setLetterStates] = useState<boolean[]>(Array(7).fill(false))
  const [showServices, setShowServices] = useState(false)
  const [showAccentLine, setShowAccentLine] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressReady, setProgressReady] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [statusText, setStatusText] = useState('SYSTEM INITIALIZING')

  const progressRef = useRef(0)
  const progressAnimRef = useRef<number>(0)

  // ── Canvas drawing ───────────────────────────────────────────────────────────
  const drawFrame = useCallback((elapsed: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    ctx.clearRect(0, 0, W, H)

    // ── Stage 1: Grid (0–400ms) ──────────────────────────────────────────────
    const gridProgress = Math.min(Math.max((elapsed - 0) / 400, 0), 1)
    if (gridProgress > 0) {
      const maxRadius = Math.sqrt(cx * cx + cy * cy) * gridProgress

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2)
      ctx.clip()

      // Major grid lines — 80px intervals
      ctx.strokeStyle = `rgba(241, 242, 255, 0.055)`
      ctx.lineWidth = 0.5
      for (let x = cx % 80; x < W; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = cy % 80; y < H; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Minor grid lines — 16px intervals
      ctx.strokeStyle = `rgba(241, 242, 255, 0.018)`
      ctx.lineWidth = 0.3
      for (let x = cx % 16; x < W; x += 16) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = cy % 16; y < H; y += 16) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      ctx.restore()
    }

    // ── Stage 2: Crosshair (200–680ms) ──────────────────────────────────────
    const crosshairStart = 200
    const circleP = Math.min(Math.max((elapsed - crosshairStart) / 180, 0), 1)

    if (circleP > 0) {
      const accentAlpha = Math.min(circleP * 2, 1)

      // Center circle
      ctx.beginPath()
      ctx.arc(cx, cy, 11, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(47, 126, 255, ${accentAlpha * 0.85})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Extending lines — appear at 280ms
      const lineP = Math.min(Math.max((elapsed - 280) / 45, 0), 1)
      const lineLen = lineP * 36

      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]
      dirs.forEach(([dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(cx + dx * 14, cy + dy * 14)
        ctx.lineTo(cx + dx * (14 + lineLen), cy + dy * (14 + lineLen))
        ctx.strokeStyle = `rgba(47, 126, 255, ${accentAlpha * 0.8})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Tick marks at line ends (appear at 340ms)
      const tickP = Math.min(Math.max((elapsed - 340) / 20, 0), 1)
      if (tickP > 0) {
        dirs.forEach(([dx, dy]) => {
          const ex = cx + dx * (14 + 36)
          const ey = cy + dy * (14 + 36)
          const tx = dy !== 0 ? 6 : 0
          const ty = dx !== 0 ? 6 : 0
          ctx.beginPath()
          ctx.moveTo(ex - tx, ey - ty)
          ctx.lineTo(ex + tx, ey + ty)
          ctx.strokeStyle = `rgba(47, 126, 255, ${tickP * accentAlpha * 0.7})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        })
      }

      // Subtle opacity breath during hold (340–680ms)
      if (elapsed > 340 && elapsed < 680) {
        const breathT = (elapsed - 340) / 340
        const breath = 0.88 + Math.sin(breathT * Math.PI) * 0.06
        ctx.globalAlpha = breath
        // Re-draw circle at breathed opacity
        ctx.beginPath()
        ctx.arc(cx, cy, 11, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(47, 126, 255, ${breath * 0.85})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    // ── Stage 2b: Crosshair retract (600–680ms) ─────────────────────────────
    if (elapsed > 600) {
      const retractP = Math.min((elapsed - 600) / 80, 1)
      // Lines contract
      const lineLen = (1 - retractP) * 36
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]
      dirs.forEach(([dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(cx + dx * 14, cy + dy * 14)
        ctx.lineTo(cx + dx * (14 + lineLen), cy + dy * (14 + lineLen))
        ctx.strokeStyle = `rgba(47, 126, 255, ${(1 - retractP) * 0.8})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
      // Circle fade
      if (retractP > 0.5) {
        const circFade = 1 - (retractP - 0.5) / 0.5
        ctx.beginPath()
        ctx.arc(cx, cy, 11, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(47, 126, 255, ${circFade * 0.85})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // ── Stage 5: Contracting geometry during exit ────────────────────────────
    if (isExiting) {
      const exitP = Math.min(Math.max((elapsed - 0) / 680, 0), 1)
      const scale = 1 - exitP * exitP // ease-in contraction
      if (scale > 0) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scale, scale)
        ctx.translate(-cx, -cy)

        // Grid fading
        ctx.strokeStyle = `rgba(241, 242, 255, ${(1 - exitP) * 0.04})`
        ctx.lineWidth = 0.5
        for (let x = cx % 80; x < W; x += 80) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
        }
        for (let y = cy % 80; y < H; y += 80) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
        }
        ctx.restore()
      }
    }
  }, [isExiting])

  // ── Canvas size ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Animation loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    startTimeRef.current = performance.now()

    const loop = () => {
      const elapsed = performance.now() - startTimeRef.current
      drawFrame(elapsed)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafRef.current)
  }, [drawFrame])

  // ── Timed DOM state triggers ─────────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Wordmark letter reveals — non-uniform groups
    WORDMARK_LETTERS.forEach((_, i) => {
      const group = LETTER_GROUPS[i]
      const delay = 600 + GROUP_DELAYS[group]
      timers.push(setTimeout(() => {
        setLetterStates(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, delay))
    })

    // SERVICES fade-in (after last letter: ~1100ms)
    timers.push(setTimeout(() => setShowServices(true), 1120))

    // Accent line draw (after SERVICES: ~1200ms)
    timers.push(setTimeout(() => setShowAccentLine(true), 1180))

    // Status text (980ms)
    timers.push(setTimeout(() => setShowStatus(true), 980))

    // Progress bar (1000ms)
    timers.push(setTimeout(() => setShowProgress(true), 1000))

    // Progress ready (1800ms — bar almost full)
    timers.push(setTimeout(() => {
      setProgressReady(true)
      setStatusText('SYSTEM READY')
    }, 1800))

    // Animate progress bar nonlinearly
    timers.push(setTimeout(() => {
      const startP = performance.now()
      const animProgress = () => {
        const t = (performance.now() - startP) / 1000
        if (t < 0.4) {
          // Fast: 0 → 108/160
          progressRef.current = (t / 0.4) * (108 / 160)
        } else if (t < 0.7) {
          // Slower: 108 → 148/160
          progressRef.current = (108 / 160) + ((t - 0.4) / 0.3) * (40 / 160)
        } else if (t < 0.8) {
          // Snap: 148 → 160/160
          progressRef.current = 1.0
        } else {
          progressRef.current = 1.0
          return
        }
        progressAnimRef.current = requestAnimationFrame(animProgress)
      }
      progressAnimRef.current = requestAnimationFrame(animProgress)
    }, 1000))

    // BEGIN EXIT (2600ms)
    timers.push(setTimeout(() => {
      triggerExit()
    }, 2600))

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(progressAnimRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const triggerExit = useCallback(async () => {
    setIsExiting(true)

    const { gsap } = await import('gsap')

    // Panels slide out
    gsap.to(leftPanelRef.current, {
      x: '-100%',
      duration: 0.72,
      ease: 'power3.inOut',
    })
    gsap.to(rightPanelRef.current, {
      x: '100%',
      duration: 0.72,
      ease: 'power3.inOut',
      onComplete: () => {
        onComplete()
      }
    })
  }, [onComplete])

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
    >
      {/* Canvas — grid + crosshair geometry */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* Left panel */}
      <div
        ref={leftPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: '#05050A',
          zIndex: 10,
        }}
      />

      {/* Right panel */}
      <div
        ref={rightPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: '#05050A',
          zIndex: 10,
        }}
      />

      {/* DOM elements — above panels */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            marginBottom: '8px',
          }}
        >
          {WORDMARK_LETTERS.map((letter, i) => (
            <div
              key={i}
              style={{
                overflow: 'hidden',
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  letterSpacing: '-0.04em',
                  color: '#F1F2FF',
                  transform: letterStates[i] ? 'translateY(0)' : 'translateY(110%)',
                  transition: `transform 600ms cubic-bezier(0.19, 1, 0.22, 1) ${i * 18}ms`,
                  willChange: 'transform',
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* SERVICES sub-label */}
        <div
          style={{
            overflow: 'hidden',
            height: '20px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontWeight: 400,
              fontSize: '11px',
              letterSpacing: '0.45em',
              color: '#5C6278',
              textTransform: 'uppercase',
              opacity: showServices ? 1 : 0,
              transform: showServices ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 400ms, transform 400ms cubic-bezier(0.19, 1, 0.22, 1)',
            }}
          >
            SERVICES
          </span>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: '220px',
            height: '1px',
            background: '#2F7EFF',
            transformOrigin: 'left center',
            transform: showAccentLine ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 600ms cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        />

        {/* Location */}
        <div
          style={{
            marginTop: '16px',
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.35em',
            color: 'rgba(92, 98, 120, 0.6)',
            textTransform: 'uppercase',
            opacity: showServices ? 1 : 0,
            transition: 'opacity 600ms 200ms',
          }}
        >
          RICHMOND, VA
        </div>
      </div>

      {/* Status + Progress — bottom center */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '200px',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: '#2F7EFF',
            textTransform: 'uppercase',
            opacity: showStatus ? 1 : 0,
            transition: 'opacity 300ms',
          }}
        >
          {statusText}
        </span>

        {/* Progress bar */}
        <div
          style={{
            width: '160px',
            height: '1px',
            background: 'rgba(47, 126, 255, 0.2)',
            position: 'relative',
            opacity: showProgress ? 1 : 0,
            transition: 'opacity 300ms',
          }}
        >
          <ProgressBar progressRef={progressRef} ready={progressReady} />
        </div>
      </div>

      {/* Data readouts — top corners */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '40px',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: showStatus ? 1 : 0,
          transform: showStatus ? 'translateX(0)' : 'translateX(-16px)',
          transition: 'opacity 400ms, transform 400ms cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '8px',
          letterSpacing: '0.25em',
          color: 'rgba(92, 98, 120, 0.5)',
          lineHeight: 2.2,
        }}>
          <div>CLIENT BUILD v1.0</div>
          <div>ENV: PRODUCTION</div>
          <div>STACK: NEXT.JS 15</div>
          <div>STATUS: NOMINAL</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '40px',
          zIndex: 20,
          pointerEvents: 'none',
          textAlign: 'right',
          opacity: showStatus ? 1 : 0,
          transform: showStatus ? 'translateX(0)' : 'translateX(16px)',
          transition: 'opacity 400ms 100ms, transform 400ms 100ms cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '8px',
          letterSpacing: '0.25em',
          color: 'rgba(92, 98, 120, 0.5)',
          lineHeight: 2.2,
        }}>
          <div>47 CLIENTS ACTIVE</div>
          <div>98% SATISFACTION</div>
          <div>340% AVG ROI Y1</div>
          <div>SYSTEMS READY</div>
        </div>
      </div>
    </div>
  )
}

// ── Progress bar as a self-updating component ────────────────────────────────

function ProgressBar({
  progressRef,
  ready,
}: {
  progressRef: React.MutableRefObject<number>
  ready: boolean
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const update = () => {
      if (barRef.current) {
        barRef.current.style.width = `${progressRef.current * 160}px`
        barRef.current.style.background = ready
          ? '#2F7EFF'
          : 'rgba(47, 126, 255, 0.85)'
      }
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [progressRef, ready])

  return (
    <div
      ref={barRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '0px',
        background: 'rgba(47, 126, 255, 0.85)',
        transition: ready ? 'background 200ms' : 'none',
      }}
    />
  )
}
