'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 clamp(24px, 4vw, 80px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(5, 5, 10, 0.88)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--bd)' : '1px solid transparent',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          data-cursor=""
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: '-0.02em',
            color: 'var(--t1)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1,
          }}
        >
          UPLEVEL
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 7,
              letterSpacing: '0.28em',
              color: 'var(--t2)',
              fontWeight: 400,
              marginTop: 3,
            }}
          >
            SERVICES
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="VIEW"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: pathname === link.href ? 'var(--el)' : 'var(--t2)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                position: 'relative',
              }}
            >
              {link.label}
              {pathname === link.href && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: 'var(--el)',
                  }}
                />
              )}
            </Link>
          ))}

          {/* Availability Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              border: '1px solid rgba(255,61,46,0.3)',
              background: 'rgba(255,61,46,0.06)',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--alert)',
                animation: 'pulse-dot 1.5s ease infinite',
                display: 'block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 7,
                letterSpacing: '0.2em',
                color: 'var(--alert)',
                textTransform: 'uppercase',
              }}
            >
              1 SLOT OPEN
            </span>
          </div>

          <Link href="/contact" data-cursor="START" className="btn-electric" style={{ padding: '10px 20px' }}>
            START PROJECT
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'none',
            padding: 8,
          }}
          className="mobile-menu-btn"
        >
          <div style={{ width: 22, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span
              style={{
                display: 'block',
                height: 1,
                background: 'var(--t1)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                height: 1,
                background: 'var(--t1)',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                height: 1,
                background: 'var(--t1)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5,5,10,0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 48,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(36px, 8vw, 72px)',
                color: 'var(--t1)',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn-electric"
          >
            START PROJECT
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
