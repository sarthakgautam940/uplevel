'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/brand'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false) // hidden during intro
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    // Hide during intro
    const timer = setTimeout(() => setHidden(false), 3200)

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setLastY(y)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [lastY])

  return (
    <nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 400ms',
      }}
    >
      <Link href="/" className="nav-logo" data-cursor="Home">
        Up<span>Level</span>
      </Link>

      <ul className="nav-links">
        {NAV_LINKS.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="nav-link" data-cursor="Navigate">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/contact" className="nav-cta" data-cursor="Contact">
        Get a slot →
      </Link>
    </nav>
  )
}
