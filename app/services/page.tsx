import Link from 'next/link'
import { brand } from '@/lib/brand'

export const metadata = { title: 'Services — UpLevel Services' }

export default function ServicesPage() {
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
          What We Build.
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
          Four systems. Each one engineered to grow contractor revenue. Full alternating layout with process and pricing coming in Phase 2.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '80px' }}>
          {brand.services.map((service, i) => (
            <div key={service.id} style={{
              padding: 'clamp(28px,3vw,48px) clamp(24px,3vw,40px)',
              background: 'var(--srf)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: '2px solid rgba(47,126,255,0.3)',
              display: 'flex', alignItems: 'flex-start', gap: '40px',
              flexWrap: 'wrap',
            }}>
              <div style={{ minWidth: '200px' }}>
                <div style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '8px', letterSpacing: '0.24em',
                  color: 'var(--el)', textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>{service.id}</div>
                <h2 style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: 'clamp(22px,2.5vw,36px)',
                  fontWeight: 900,
                  letterSpacing: '-0.022em',
                  color: 'var(--t1)',
                  marginBottom: '8px',
                }}>{service.name}</h2>
                <div style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: 'clamp(18px,2vw,28px)',
                  fontWeight: 900,
                  color: 'var(--t1)',
                }}>
                  {service.price}
                  <span style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '10px',
                    color: 'var(--t2)',
                    fontWeight: 400,
                    marginLeft: '8px',
                    letterSpacing: '0.14em',
                  }}>
                    + {service.recurring}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 'clamp(13px,1.05vw,15px)',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--t2)',
                  marginBottom: '20px',
                }}>{service.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {service.deliverables.map((d, di) => (
                    <li key={di} style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px', fontWeight: 300,
                      color: 'rgba(241,242,255,0.5)',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--el)', opacity: 0.6 }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
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
            Start a Project →
          </Link>
        </div>
      </div>
    </main>
  )
}
