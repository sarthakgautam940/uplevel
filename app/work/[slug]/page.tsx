import Link from 'next/link'
import { brand } from '@/lib/brand'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return brand.work.map(w => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = brand.work.find(w => w.slug === slug)
  return { title: project ? `${project.name} — UpLevel Services` : 'Case Study — UpLevel Services' }
}

export default async function WorkSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = brand.work.find(w => w.slug === slug)
  if (!project) notFound()

  return (
    <main style={{
      background: 'var(--void)',
      minHeight: '100vh',
      padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
    }}>
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
          Placeholder — Full Case Study Coming
        </div>

        <div style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', letterSpacing: '0.22em',
          color: 'var(--t2)', textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          {project.type} · {project.location}
        </div>

        <h1 style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(48px,7vw,112px)',
          fontWeight: 900,
          letterSpacing: '-0.035em',
          color: 'var(--t1)',
          lineHeight: 0.95,
          marginBottom: '40px',
        }}>
          {project.name}
        </h1>

        {/* Key metric */}
        <div style={{
          display: 'inline-block',
          padding: '32px 48px',
          background: 'var(--srf)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '48px',
        }}>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.2em',
            color: 'var(--el)', textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Key Result
          </div>
          <div style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(40px,6vw,80px)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            color: 'var(--t1)',
            lineHeight: 1,
          }}>
            {project.metric}
          </div>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.16em',
            color: 'var(--t2)', textTransform: 'uppercase',
            marginTop: '6px',
          }}>
            {project.metricLabel}
          </div>
        </div>

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(16px,1.6vw,22px)',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'var(--t2)',
          maxWidth: '660px',
          marginBottom: '80px',
        }}>
          {project.story}
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/work" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--t2)',
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            ← All Work
          </Link>
          <Link href="/contact" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'var(--el)',
            color: '#fff',
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.2em',
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
