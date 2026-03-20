'use client'

import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  const [isHovering, setIsHovering] = useState(false)
  const [cursorLabel, setCursorLabel] = useState('')
  const [isDown, setIsDown] = useState(false)

  useEffect(() => {
    // Don't render on touch devices
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const LERP_RATE = 0.095

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseDown = () => setIsDown(true)
    const onMouseUp = () => setIsDown(false)

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      if (target) {
        const label = target.getAttribute('data-cursor') || ''
        setIsHovering(true)
        setCursorLabel(label)
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      if (target) {
        setIsHovering(false)
        setCursorLabel('')
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    const tick = () => {
      // Dot follows exactly
      dot.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px) scale(${isDown ? 0.5 : 1})`

      // Ring lerps behind
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, LERP_RATE)
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, LERP_RATE)

      const ringSize = isHovering ? 50 : 30
      ring.style.transform = `translate(${ringPos.current.x - ringSize / 2}px, ${
        ringPos.current.y - ringSize / 2
      }px)`
      ring.style.width = `${ringSize}px`
      ring.style.height = `${ringSize}px`

      // Label follows ring
      label.style.transform = `translate(${ringPos.current.x + 14}px, ${ringPos.current.y + 14}px)`

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [isDown, isHovering])

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 4 : 6,
          height: isHovering ? 4 : 6,
          background: '#fff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          transition: 'width 0.2s ease, height 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          border: `1px solid ${isHovering ? 'rgba(47,126,255,0.7)' : 'rgba(47,126,255,0.5)'}`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.25s var(--ease-expo), height 0.25s var(--ease-expo), border-color 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Label */}
      <div
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          letterSpacing: '0.18em',
          color: 'var(--el)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: cursorLabel ? 1 : 0,
          transition: 'opacity 0.15s ease',
          willChange: 'transform',
        }}
      >
        {cursorLabel}
      </div>
    </>
  )
}
