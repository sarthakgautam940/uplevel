'use client'

import Link from 'next/link'
import { CASE_STUDIES } from '@/lib/brand'

export default function WorkPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 'clamp(120px, 16vh, 180px) clamp(24px, 5vw, 80px) clamp(80px, 10vh, 120px)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Eyebrow */}
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
        Case studies
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-outfit)',
          fontWeight: 900,
          fontSize: 'clamp(52px, 9vw, 120px)',
          letterSpacing: '-0.035em',
          lineHeight: 0.91,
          color: '#F1F2FF',
          marginBottom: '64px',
        }}
      >
        The work<br />
        <span style={{ color: '#5C6278' }}>speaks.</span>
      </h1>

      {/* Case studies list */}
      <div>
        {CASE_STUDIES.map((cs, i) => (
          <div
            key={cs.id}
            style={{
              borderBottom: '1px solid #21222E',
              padding: '40px 0',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.3em',
                  color: '#2F7EFF',
                  marginBottom: '12px',
                }}
              >
                0{i + 1} · {cs.vertical}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontSize: 'clamp(24px, 3.5vw, 40px)',
                  letterSpacing: '-0.025em',
                  color: '#F1F2FF',
                  marginBottom: '12px',
                }}
              >
                {cs.client}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '15px',
                  color: '#5C6278',
                  lineHeight: 1.65,
                  maxWidth: '600px',
                  marginBottom: '16px',
                }}
              >
                {cs.story}
              </p>
              <blockquote
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  color: '#5C6278',
                  borderLeft: '2px solid rgba(47,126,255,0.3)',
                  paddingLeft: '16px',
                  maxWidth: '560px',
                }}
              >
                &quot;{cs.quote}&quot;
              </blockquote>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  letterSpacing: '-0.04em',
                  color: '#2F7EFF',
                  lineHeight: 1,
                }}
              >
                {cs.metric}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#5C6278',
                  textTransform: 'uppercase',
                }}
              >
                {cs.metricLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ paddingTop: '64px', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '18px',
            color: '#5C6278',
            marginBottom: '32px',
          }}
        >
          Ready to add your name to this list?
        </p>
        <Link href="/contact" className="btn btn-primary" data-cursor="Start">
          Start your build →
        </Link>
      </div>
    </main>
  )
}
