'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  // Draw the intro geometry at 4% opacity — the machine was always running
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const cx = W / 2
    const cy = H / 2

    ctx.clearRect(0, 0, W, H)
    ctx.globalAlpha = 0.04

    // Grid
    ctx.strokeStyle = 'rgba(241,242,255,1)'
    ctx.lineWidth = 0.5
    for (let x = cx % 80; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = cy % 80; y < H; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Crosshair at center
    ctx.strokeStyle = 'rgba(47,126,255,1)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.stroke()
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]
    dirs.forEach(([dx, dy]) => {
      ctx.beginPath()
      ctx.moveTo(cx + dx * 14, cy + dy * 14)
      ctx.lineTo(cx + dx * 50, cy + dy * 50)
      ctx.stroke()
    })

    // Compass circle
    ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke()

    // Corner targets
    const corners = [[80, 80], [W - 80, 80], [80, H - 80], [W - 80, H - 80]]
    corners.forEach(([ox, oy]) => {
      const size = 24
      ctx.beginPath()
      ctx.moveTo(ox - size, oy); ctx.lineTo(ox, oy); ctx.lineTo(ox, oy - size)
      ctx.moveTo(ox + size, oy); ctx.lineTo(ox, oy); ctx.lineTo(ox, oy - size + size * 2)
      ctx.stroke()
    })

    ctx.globalAlpha = 1
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background geometry canvas */}
      <canvas
        ref={canvasRef}
        className="cta-geometry-canvas"
        aria-hidden="true"
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ overflow: 'hidden', marginBottom: '8px' }}>
          <motion.h2
            initial={{ y: '-60px', scale: 0.92, opacity: 0 }}
            animate={isInView ? { y: 0, scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.0, 0.0, 0.2, 1] }}
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 'clamp(72px, 11vw, 160px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#F1F2FF',
              display: 'block',
            }}
          >
            Ready?
          </motion.h2>
        </div>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          style={{
            width: '220px',
            height: '2px',
            background: '#2F7EFF',
            margin: '24px auto',
            transformOrigin: 'left center',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.6vw, 19px)',
            color: '#5C6278',
            maxWidth: '480px',
            lineHeight: 1.65,
            margin: '0 auto 40px',
          }}
        >
          Three slots available per quarter. We keep it small
          so every client gets our full attention.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.75, ease: [0.19, 1, 0.22, 1] }}
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <Link href="/contact" data-cursor="Start" className="btn btn-primary">
            Start the build →
          </Link>
          <Link href="/contact" data-cursor="Call" className="btn btn-ghost">
            Book free strategy call
          </Link>
        </motion.div>

        {/* Availability badge — only alert red on this page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          <div className="alert-pulse" style={{ justifyContent: 'center' }}>
            <div className="alert-dot" />
            LIMITED AVAILABILITY · Q2 {new Date().getFullYear()}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
