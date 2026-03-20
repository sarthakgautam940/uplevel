'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const [label, setLabel] = useState('')
  const [isHover, setIsHover] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 480px)').matches
    if (isMobile) return

    setIsVisible(true)

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }

      // Label follows dot
      if (labelRef.current) {
        labelRef.current.style.left = `${e.clientX + 18}px`
        labelRef.current.style.top = `${e.clientY - 6}px`
      }
    }

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorLabel = target.getAttribute('data-cursor') ||
        target.closest('[data-cursor]')?.getAttribute('data-cursor') || ''
      setLabel(cursorLabel)
      setIsHover(true)
    }

    const onMouseLeave = () => {
      setLabel('')
      setIsHover(false)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Attach to all interactive elements
    const interactiveSelector = 'a, button, [data-cursor], .card, .work-card, .process-step-btn, .accordion-trigger'
    const addListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter as EventListener)
        el.addEventListener('mouseleave', onMouseLeave)
      })
    }

    // MutationObserver to handle dynamic content
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })
    addListeners()

    // Ring lagging animation
    const animate = () => {
      const lerp = 0.12
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          width: isHover ? '10px' : '6px',
          height: isHover ? '10px' : '6px',
          opacity: isHover ? 0.8 : 1,
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          width: isHover ? '48px' : '32px',
          height: isHover ? '48px' : '32px',
          borderColor: isHover
            ? 'rgba(47, 126, 255, 0.7)'
            : 'rgba(47, 126, 255, 0.5)',
        }}
      />
      <div
        ref={labelRef}
        className="cursor-label"
        style={{ opacity: label ? 1 : 0 }}
      >
        {label}
      </div>
    </>
  )
}
