import Link from 'next/link'
import { brand } from '@/lib/brand'

export const metadata = { title: 'Our Work — UpLevel Services' }

export default function WorkPage() {
  return (
    <main style={{ background: 'var(--void)', minHeight: '100vh', padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)' }}>
      {/* PLACEHOLDER — FULL VERSION COMING */}
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{
          display: 'inline-block',
          fontFamily: '"DM Mono", monospace',
          fontSize: '8px', letterSpacing: '0.22em',
          color: 'var(--el)', textTransform: 'uppercase',
          border: '1px solid rgba(47,126,255,0.2)',
          padding: '4px 10px', marginBottom: '40px',
        }}>
          Placeholder — Full Version Coming
        </div>

        <h1 style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(48px,7vw,112px)',
          fontWeight: 900,
          letterSpacing: '-0.035em',
          color: 'var(--t1)',
          lineHeight: 0.95,
          marginBottom: '24px',
        }}>
          Real Clients.<br />
          <span style={{ color: 'var(--t2)' }}>Real Results.</span>
        </h1>

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(13px,1.05vw,15px)',
          fontWeight: 300,
          lineHeight: 1.85,
          color: 'var(--t2)',
          maxWidth: '520px',
          marginBottom: '80px',
        }}>
          Full horizontal drag-scroll gallery with card animations coming in Phase 2.
          Below are the case studies available now.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {brand.work.map((project, i) => (
            <Link key={project.slug} href={`/work/${project.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'clamp(24px,3vw,40px)',
                background: 'var(--srf)',
                border: '1px solid rgba(255,255,255,0.06)',
                gap: '24px',
                transition: 'border-color 0.3s ease',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px', minWidth: 0 }}>
                  <span style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '9px', letterSpacing: '0.2em',
                    color: 'var(--t3)',
                  }}>0{i + 1}</span>
                  <div>
                    <div style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: 'clamp(20px,2.5vw,32px)',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      color: 'var(--t1)',
                      marginBottom: '4px',
                    }}>{project.name}</div>
                    <div style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: '9px', letterSpacing: '0.18em',
                      color: 'var(--t2)', textTransform: 'uppercase',
                    }}>{project.type} · {project.location}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: 'clamp(22px,3vw,40px)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: 'var(--t1)',
                  }}>{project.metric}</div>
                  <div style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '8px', letterSpacing: '0.16em',
                    color: 'var(--t2)', textTransform: 'uppercase',
                  }}>{project.metricLabel}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/contact" style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: 'var(--el)',
            color: '#fff',
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.22em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Ready to be next? →
          </Link>
        </div>
      </div>
    </main>
  )
}
