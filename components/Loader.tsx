'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoaderProps {
  onExitStart: () => void
  onComplete: () => void
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeOutBack(t: number, s = 1.4): number {
  const c1 = s
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

function progress(t: number, start: number, dur: number): number {
  return clamp01((t - start) / dur)
}

export default function Loader({ onExitStart, onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const progressArcRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  // Refs for individual wordmark letters
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const glassLine1Ref = useRef<HTMLSpanElement>(null)
  const glassLine2Ref = useRef<HTMLSpanElement>(null)
  const glassLine3Ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const leftPanel = leftPanelRef.current
    const rightPanel = rightPanelRef.current
    if (!canvas || !container || !leftPanel || !rightPanel) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    const startTime = Date.now()
    let rafId = 0
    let exited = false

    // ─── Canvas Drawing Functions ───────────────────────────────────────

    function drawGrid(opacity: number) {
      const size = 64
      ctx!.strokeStyle = `rgba(255,255,255,${opacity})`
      ctx!.lineWidth = 0.5
      ctx!.beginPath()
      for (let x = 0; x <= W; x += size) {
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, H)
      }
      for (let y = 0; y <= H; y += size) {
        ctx!.moveTo(0, y)
        ctx!.lineTo(W, y)
      }
      ctx!.stroke()
    }

    function drawOuterCircle(t: number) {
      const cx = W / 2
      const cy = H / 2
      const r = Math.min(W, H) * 0.38
      const p = easeOutCubic(progress(t, 0.2, 0.9))
      if (p <= 0) return

      const startAngle = -Math.PI / 2
      const endAngle = startAngle + Math.PI * 2 * p

      ctx!.beginPath()
      ctx!.arc(cx, cy, r, startAngle, endAngle, false)
      ctx!.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx!.lineWidth = 0.8
      ctx!.stroke()

      // Ghost nib — last 15° arc, 3× opacity
      if (p < 1) {
        const nibAngle = (15 * Math.PI) / 180
        ctx!.beginPath()
        ctx!.arc(cx, cy, r, endAngle - nibAngle, endAngle, false)
        ctx!.strokeStyle = 'rgba(255,255,255,0.21)'
        ctx!.lineWidth = 1.5
        ctx!.stroke()
      }
    }

    function drawInnerCircle(t: number) {
      const cx = W / 2
      const cy = H / 2
      const outerR = Math.min(W, H) * 0.38
      const r = outerR * 0.48
      const p = easeOutCubic(progress(t, 0.4, 0.8))
      if (p <= 0) return

      // CCW from 3 o'clock
      const sweepAngle = Math.PI * 2 * p
      ctx!.save()
      ctx!.setLineDash([6, 14])
      ctx!.beginPath()
      if (p >= 1) {
        ctx!.arc(cx, cy, r, 0, Math.PI * 2, false)
      } else {
        ctx!.arc(cx, cy, r, 0, sweepAngle, true)
      }
      ctx!.strokeStyle = 'rgba(47,126,255,0.14)'
      ctx!.lineWidth = 0.8
      ctx!.stroke()
      ctx!.restore()
    }

    function drawCompassLine(
      t: number,
      startT: number,
      dx: number,
      dy: number,
      cx: number,
      cy: number,
      outerR: number,
      innerR: number
    ) {
      const p = easeOutCubic(progress(t, startT, 0.03))
      if (p <= 0) return

      const compassLen = innerR * 0.55
      const startX = cx + dx * innerR
      const startY = cy + dy * innerR
      const endX = cx + dx * (innerR + compassLen * p)
      const endY = cy + dy * (innerR + compassLen * p)

      ctx!.beginPath()
      ctx!.moveTo(startX, startY)
      ctx!.lineTo(endX, endY)
      ctx!.strokeStyle = 'rgba(47,126,255,0.55)'
      ctx!.lineWidth = 0.65
      ctx!.stroke()

      // Tick mark at endpoint when fully extended
      if (p >= 0.99) {
        const perpX = dy
        const perpY = dx
        const tx = cx + dx * (innerR + compassLen)
        const ty = cy + dy * (innerR + compassLen)
        ctx!.beginPath()
        ctx!.moveTo(tx - perpX * 2.5, ty - perpY * 2.5)
        ctx!.lineTo(tx + perpX * 2.5, ty + perpY * 2.5)
        ctx!.strokeStyle = 'rgba(47,126,255,0.55)'
        ctx!.lineWidth = 0.65
        ctx!.stroke()
      }
    }

    function drawArcTicks(t: number) {
      const cx = W / 2
      const cy = H / 2
      const outerR = Math.min(W, H) * 0.38
      const innerR = outerR * 0.48

      for (let i = 0; i < 8; i++) {
        const delay = i * 0.07
        const p = easeOutBack(clamp01(progress(t, 1.0 + delay, 0.07)), 1.4)
        if (p <= 0) continue

        const angle = (i * Math.PI) / 4
        const tx = cx + Math.cos(angle) * innerR
        const ty = cy + Math.sin(angle) * innerR
        const armLen = 4 * p

        ctx!.save()
        ctx!.translate(tx, ty)
        ctx!.strokeStyle = 'rgba(47,126,255,0.5)'
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(-armLen / 2, 0)
        ctx!.lineTo(armLen / 2, 0)
        ctx!.moveTo(0, -armLen / 2)
        ctx!.lineTo(0, armLen / 2)
        ctx!.stroke()
        ctx!.restore()
      }
    }

    function drawCrosshair(t: number) {
      const cx = W / 2
      const cy = H / 2
      ctx!.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx!.lineWidth = 0.4

      // Horizontal
      const ph = easeOutCubic(progress(t, 1.15, 0.38))
      if (ph > 0) {
        ctx!.beginPath()
        ctx!.moveTo(cx - (W / 2) * ph, cy)
        ctx!.lineTo(cx + (W / 2) * ph, cy)
        ctx!.stroke()
      }

      // Vertical
      const pv = easeOutCubic(progress(t, 1.25, 0.38))
      if (pv > 0) {
        ctx!.beginPath()
        ctx!.moveTo(cx, cy - (H / 2) * pv)
        ctx!.lineTo(cx, cy + (H / 2) * pv)
        ctx!.stroke()
      }
    }

    function drawCenterLock(t: number) {
      const cx = W / 2
      const cy = H / 2
      const p = progress(t, 1.35, 0.25)
      if (p <= 0) return

      const s = easeOutBack(Math.min(p, 1), 1.4)

      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.scale(s, s)

      // Diamond (8px, rotated 45°)
      ctx!.rotate(Math.PI / 4)
      ctx!.beginPath()
      ctx!.rect(-4, -4, 8, 8)
      ctx!.fillStyle = 'rgba(47,126,255,0.08)'
      ctx!.fill()
      ctx!.strokeStyle = 'rgba(47,126,255,1.0)'
      ctx!.lineWidth = 1
      ctx!.stroke()
      ctx!.rotate(-Math.PI / 4)

      // Outer square
      ctx!.beginPath()
      ctx!.rect(-6.5, -6.5, 13, 13)
      ctx!.strokeStyle = 'rgba(47,126,255,0.22)'
      ctx!.lineWidth = 0.8
      ctx!.stroke()

      ctx!.restore()
    }

    function drawProgressArc(t: number) {
      const totalDur = 2.2
      const p = Math.min(1, t / totalDur)

      const container = progressArcRef.current
      const counter = counterRef.current
      if (!container || !counter) return

      // Draw arc in SVG-like fashion using canvas circle in the DOM via CSS
      // We'll update the CSS variable for the arc
      const degrees = p * 345
      const counterVal = Math.floor(p * 100)

      container.style.setProperty('--arc-deg', `${degrees}deg`)
      counter.textContent = String(counterVal).padStart(3, '0')
    }

    // ─── Canvas Animation Loop ───────────────────────────────────────────

    function drawFrame() {
      const t = (Date.now() - startTime) / 1000

      ctx!.clearRect(0, 0, W, H)
      ctx!.fillStyle = '#05050A'
      ctx!.fillRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const outerR = Math.min(W, H) * 0.38
      const innerR = outerR * 0.48

      // Grid
      const gridOpacity = clamp01(t / 0.6) * 0.035
      drawGrid(gridOpacity)

      // Outer circle CW from 12 o'clock
      drawOuterCircle(t)

      // Inner dashed circle CCW from 3 o'clock
      drawInnerCircle(t)

      // Compass lines: E, W, N, S
      drawCompassLine(t, 0.85, 1, 0, cx, cy, outerR, innerR)   // E
      drawCompassLine(t, 0.92, -1, 0, cx, cy, outerR, innerR)  // W
      drawCompassLine(t, 0.99, 0, -1, cx, cy, outerR, innerR)  // N
      drawCompassLine(t, 1.06, 0, 1, cx, cy, outerR, innerR)   // S

      // Arc tick marks
      drawArcTicks(t)

      // Crosshairs
      drawCrosshair(t)

      // Center lock
      drawCenterLock(t)

      // Progress arc
      drawProgressArc(t)
    }

    // ─── DOM Animations (GSAP) ──────────────────────────────────────────

    const tl = gsap.timeline({ delay: 0 })

    // Letters rise
    const letters = 'UPLEVEL'.split('')
    const letterDelays = [1.45, 1.52, 1.52, 1.74, 1.74, 1.81, 1.81]

    letters.forEach((_, i) => {
      const el = letterRefs.current[i]
      if (!el) return
      gsap.set(el, { y: '110%', skewX: -2 })
      tl.to(
        el,
        {
          y: '0%',
          skewX: 0,
          duration: 0.72,
          ease: 'expo.out',
        },
        letterDelays[i]
      )
    })

    // Accent line under wordmark
    const accentLine = document.getElementById('loader-accent-line')
    if (accentLine) {
      gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left' })
      tl.to(accentLine, { scaleX: 1, duration: 0.32, ease: 'expo.out' }, 1.9)
    }

    // SERVICES label
    const servicesLabel = document.getElementById('loader-services')
    if (servicesLabel) {
      gsap.set(servicesLabel, { opacity: 0 })
      tl.to(servicesLabel, { opacity: 1, duration: 0.4 }, 1.95)
    }

    // Glass typewriter
    const typeText = (
      el: HTMLElement | null,
      text: string,
      startDelay: number,
      charDelay = 0.03
    ) => {
      if (!el) return
      el.textContent = ''
      gsap.delayedCall(startDelay, () => {
        let i = 0
        const interval = setInterval(() => {
          if (i < text.length) {
            el.textContent += text[i]
            i++
          } else {
            clearInterval(interval)
          }
        }, charDelay * 1000)
      })
    }

    typeText(glassLine1Ref.current, 'SYS.ONLINE', 1.5, 0.03)
    typeText(glassLine2Ref.current, 'CLIENTS ▸ 047', 1.65, 0.03)
    typeText(glassLine3Ref.current, 'UPTIME ▸ 99.9%', 1.8, 0.03)

    // ─── RAF Loop ────────────────────────────────────────────────────────

    const loop = () => {
      if (!exited) {
        drawFrame()
        rafId = requestAnimationFrame(loop)
      }
    }
    rafId = requestAnimationFrame(loop)

    // ─── Exit Sequence ──────────────────────────────────────────────────

    const exitTimer = setTimeout(() => {
      onExitStart()
      exited = true
      cancelAnimationFrame(rafId)

      const exitTL = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 100)
        },
      })

      // Canvas geometry contracts and fades
      exitTL.to(canvas, {
        scale: 0.0,
        opacity: 0,
        duration: 0.68,
        ease: 'power2.in',
      }, 0)

      // Wordmark fades and rises
      const wm = wordmarkRef.current
      if (wm) {
        exitTL.to(wm, { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' }, 0.05)
      }

      // Glass fades
      const gl = glassRef.current
      if (gl) {
        exitTL.to(gl, { opacity: 0, duration: 0.25 }, 0)
      }

      // Progress arc fades
      if (progressArcRef.current) {
        exitTL.to(progressArcRef.current, { opacity: 0, duration: 0.2 }, 0)
      }

      // Aperture: left panel slides left with red fringe
      if (leftPanel) {
        leftPanel.style.boxShadow = 'inset -2px 0 8px rgba(255,61,46,0.18)'
        exitTL.to(leftPanel, {
          x: '-100%',
          duration: 0.88,
          ease: 'power2.inOut',
        }, 0.06)
      }

      // Aperture: right panel slides right with blue fringe
      if (rightPanel) {
        rightPanel.style.boxShadow = 'inset 2px 0 8px rgba(47,126,255,0.18)'
        exitTL.to(rightPanel, {
          x: '100%',
          duration: 0.88,
          ease: 'power2.inOut',
        }, 0.06)
      }
    }, 2400)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(exitTimer)
      window.removeEventListener('resize', resize)
      tl.kill()
    }
  }, [onExitStart, onComplete])

  const letters = 'UPLEVEL'.split('')

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        overflow: 'hidden',
        pointerEvents: 'all',
      }}
    >
      {/* Two aperture panels */}
      <div
        ref={leftPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: '#05050A',
          zIndex: 9001,
        }}
      />
      <div
        ref={rightPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: '#05050A',
          zIndex: 9001,
        }}
      />

      {/* Canvas for geometry — above panels */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9002,
          display: 'block',
        }}
      />

      {/* Wordmark */}
      <div
        ref={wordmarkRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9003,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {/* Letters container */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(2px, 0.5vw, 8px)',
            overflow: 'hidden',
            lineHeight: 1,
          }}
        >
          {letters.map((letter, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                ref={(el) => { letterRefs.current[i] = el }}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5.5vw, 80px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--t1)',
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* Accent line */}
        <div
          id="loader-accent-line"
          style={{
            width: 42,
            height: 1,
            background: 'var(--el)',
            margin: '8px auto 0',
          }}
        />

        {/* SERVICES label */}
        <div
          id="loader-services"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.36em',
            color: 'var(--t2)',
            marginTop: 8,
          }}
        >
          SERVICES
        </div>
      </div>

      {/* Glass status — top right */}
      <div
        ref={glassRef}
        style={{
          position: 'absolute',
          top: 'clamp(80px, 10vh, 120px)',
          right: 'clamp(24px, 4vw, 80px)',
          zIndex: 9003,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--el)',
              display: 'block',
              animation: 'pulse-dot 1s ease infinite',
            }}
          />
          <span
            ref={glassLine1Ref}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              color: 'var(--el)',
            }}
          />
        </div>
        <span
          ref={glassLine2Ref}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: 'rgba(241,242,255,0.28)',
          }}
        />
        <span
          ref={glassLine3Ref}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: 'rgba(241,242,255,0.28)',
          }}
        />
      </div>

      {/* Progress arc + counter — bottom center */}
      <div
        ref={progressArcRef}
        id="loader-progress"
        style={{
          position: 'absolute',
          bottom: 'clamp(32px, 5vh, 60px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9003,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* SVG arc */}
        <ProgressArc />

        <div
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.24em',
            color: 'var(--t2)',
          }}
        >
          000
        </div>
      </div>

      <style>{`
        @keyframes arc-sweep {
          from { stroke-dashoffset: 176; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}

function ProgressArc() {
  const r = 28
  const circ = 2 * Math.PI * r
  const portion = 345 / 360

  return (
    <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={1}
      />
      {/* Animated arc */}
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke="rgba(47,126,255,0.5)"
        strokeWidth={1}
        strokeDasharray={`${circ * portion} ${circ}`}
        strokeLinecap="round"
        style={{
          animation: 'arc-anim 2.2s cubic-bezier(0.16,1,0.3,1) forwards',
          strokeDashoffset: circ * portion,
        }}
      />
      <style>{`
        @keyframes arc-anim {
          from { stroke-dashoffset: ${circ * portion}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  )
}
