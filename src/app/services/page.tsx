'use client'

import Link from 'next/link'
import { SERVICES } from '@/lib/brand'

export default function ServicesPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 'clamp(120px, 16vh, 180px) clamp(24px, 5vw, 80px) clamp(80px, 10vh, 120px)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          letterSpacing: '0.35em',
          color: '#2F7EFF',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        What we build
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-outfit)',
          fontWeight: 900,
          fontSize: 'clamp(52px, 9vw, 120px)',
          letterSpacing: '-0.035em',
          lineHeight: 0.91,
          color: '#F1F2FF',
          marginBottom: '80px',
        }}
      >
        Four systems.<br />
        <span style={{ color: '#5C6278' }}>One operator.</span>
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '2px',
        }}
      >
        {SERVICES.map((service) => (
          <div
            key={service.id}
            style={{
              background: '#0C0D14',
              border: '1px solid #21222E',
              padding: '48px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#2F7EFF',
                marginBottom: '16px',
              }}
            >
              {service.number}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 900,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                letterSpacing: '-0.025em',
                lineHeight: 0.95,
                color: '#F1F2FF',
                marginBottom: '8px',
              }}
            >
              {service.name}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#5C6278',
                marginBottom: '24px',
              }}
            >
              {service.headline}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: 1.7,
                color: '#5C6278',
                marginBottom: '32px',
              }}
            >
              {service.body}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #21222E',
                paddingTop: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 900,
                    fontSize: '24px',
                    color: '#F1F2FF',
                  }}
                >
                  {service.price}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: '#5C6278',
                  }}
                >
                  {service.retainer}
                </div>
              </div>

              <Link href="/contact" className="btn btn-ghost" data-cursor="Get started" style={{ fontSize: '12px', padding: '10px 18px' }}>
                Get started →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
