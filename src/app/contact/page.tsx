'use client'

import { useState } from 'react'
import { BRAND } from '@/lib/brand'

const BUSINESS_TYPES = [
  'Pool Builder',
  'HVAC Operator',
  'Custom Home Builder',
  'Wine Cellar / Specialty',
  'General Contractor',
  'Landscaping / Hardscape',
  'Other',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    businessType: '',
    phone: '',
    challenge: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder submit
    setSubmitted(true)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 'clamp(120px, 16vh, 180px) clamp(24px, 5vw, 80px) clamp(80px, 10vh, 120px)',
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(40px, 6vw, 100px)',
        alignItems: 'start',
      }}
    >
      {/* Left — pitch */}
      <div>
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
          Let&apos;s build
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-outfit)',
            fontWeight: 900,
            fontSize: 'clamp(40px, 7vw, 88px)',
            letterSpacing: '-0.035em',
            lineHeight: 0.91,
            color: '#F1F2FF',
            marginBottom: '24px',
          }}
        >
          Start the
          <br />
          <span style={{ fontStyle: 'italic', color: '#5C6278' }}>build.</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            lineHeight: 1.7,
            color: '#5C6278',
            maxWidth: '440px',
            marginBottom: '40px',
          }}
        >
          Tell us who you are and what&apos;s not working. We&apos;ll come back with a
          clear scope, timeline, and investment within 24 hours.
        </p>

        {/* Data points */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {[
            '24-hour response guarantee',
            'Free strategy call included',
            '48-hour average launch',
            'Month-to-month after 90 days',
          ].map(point => (
            <div
              key={point}
              style={{
                display: 'flex',
                gap: '12px',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: '#5C6278',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#2F7EFF', fontSize: '8px' }}>◆</span>
              {point}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '48px',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            color: '#5C6278',
          }}
        >
          Or email directly:{' '}
          <a
            href={`mailto:${BRAND.email}`}
            style={{ color: '#2F7EFF', cursor: 'none' }}
            data-cursor="Email"
          >
            {BRAND.email}
          </a>
        </div>
      </div>

      {/* Right — form */}
      <div>
        {submitted ? (
          <div
            style={{
              padding: '48px',
              background: '#0C0D14',
              border: '1px solid rgba(47,126,255,0.3)',
              borderRadius: '2px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 900,
                fontSize: '32px',
                color: '#F1F2FF',
                marginBottom: '16px',
              }}
            >
              Received.
            </div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '15px',
                color: '#5C6278',
                lineHeight: 1.65,
              }}
            >
              We&apos;ll be in touch within 24 hours with a clear scope and next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: '#0C0D14',
                border: '1px solid #21222E',
                borderRadius: '2px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Name */}
              <FormField label="Your name" required>
                <input
                  type="text"
                  required
                  placeholder="John Marcus"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </FormField>

              {/* Business type */}
              <FormField label="Business type" required>
                <select
                  required
                  value={form.businessType}
                  onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                >
                  <option value="">Select your vertical</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>

              {/* Phone */}
              <FormField label="Phone number" required>
                <input
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </FormField>

              {/* Challenge */}
              <FormField label="What's your biggest challenge right now?">
                <textarea
                  rows={4}
                  placeholder="Not enough quality leads, can't be reached after hours, website looks dated..."
                  value={form.challenge}
                  onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))}
                />
              </FormField>

              {/* Scarcity */}
              <div className="alert-pulse">
                <div className="alert-dot" />
                1 OF 3 SLOTS AVAILABLE THIS QUARTER
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                data-cursor="Submit"
                style={{ justifyContent: 'center' }}
              >
                Begin → Get your scope in 24 hours
              </button>

              <p
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  color: 'rgba(92,98,120,0.5)',
                  textAlign: 'center',
                }}
              >
                No sales calls. No pressure. A scope and a decision.
              </p>
            </div>
          </form>
        )}
      </div>

      <style>{`
        input, select, textarea {
          width: 100%;
          background: #13141E;
          border: 1px solid #21222E;
          border-radius: 1px;
          padding: 12px 16px;
          font-family: var(--font-dm-sans);
          font-weight: 300;
          font-size: 14px;
          color: #F1F2FF;
          outline: none;
          cursor: none;
          transition: border-color 200ms;
          resize: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(47,126,255,0.5);
        }
        input::placeholder, textarea::placeholder {
          color: #5C6278;
        }
        select {
          appearance: none;
          cursor: none;
        }
        option {
          background: #13141E;
          color: #F1F2FF;
        }
      `}</style>
    </main>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: '#5C6278',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {label} {required && <span style={{ color: '#2F7EFF' }}>*</span>}
      </label>
      {children}
    </div>
  )
}
