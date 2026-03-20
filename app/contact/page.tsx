'use client'

import { useState } from 'react'
import Link from 'next/link'
import { brand } from '@/lib/brand'

const services = ['Website System', 'AI Concierge', 'SEO Domination', 'Brand Identity', 'Full Package']

export default function ContactPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', business: '', email: '', phone: '', message: ''
  })

  const toggleService = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, services: selected }),
      })
      setSubmitted(true)
    } catch {
      // fail silently for placeholder
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <main style={{
      background: 'var(--void)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background text texture */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 900,
        fontSize: 'clamp(120px,20vw,300px)',
        letterSpacing: '-0.04em',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(241,242,255,0.02)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}>
        START
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1300px', margin: '0 auto',
        padding: 'clamp(100px,14vw,180px) clamp(24px,6vw,100px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 'clamp(40px,6vw,100px)',
        alignItems: 'start',
      }}>
        {/* Left */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px', letterSpacing: '0.28em',
            color: 'var(--el)', textTransform: 'uppercase',
            marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--el)', opacity: 0.5 }} />
            Let's Build
          </div>

          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(32px,4.5vw,64px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--t1)',
            lineHeight: 1.05,
            marginBottom: '32px',
          }}>
            Let's build your system.
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {[
              '48-hour average delivery',
              'Month-to-month contracts',
              'Strategy call included',
              'Money-back guarantee on process',
            ].map((point, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  display: 'inline-block', width: '4px', height: '4px',
                  borderRadius: '50%', background: 'var(--el)',
                }} />
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', fontWeight: 300,
                  color: 'var(--t2)',
                }}>
                  {point}
                </span>
              </div>
            ))}
          </div>

          {/* Availability badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '8px 16px',
            border: '1px solid rgba(255,61,46,0.25)',
            background: 'rgba(255,61,46,0.05)',
            marginBottom: '32px',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', background: 'var(--alert)',
              animation: 'pulse-dot 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '8px', letterSpacing: '0.2em',
              color: 'var(--alert)', textTransform: 'uppercase',
            }}>
              {brand.slots} slot available this quarter
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href={`mailto:${brand.email}`} style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px', letterSpacing: '0.18em',
              color: 'var(--el)', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              {brand.email}
            </a>
            <a href={brand.calendly} target="_blank" rel="noreferrer" style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px', letterSpacing: '0.18em',
              color: 'var(--t2)', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Book a discovery call →
            </a>
          </div>
        </div>

        {/* Right — Form */}
        <div style={{
          background: 'var(--srf)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(32px,4vw,56px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {submitted ? (
            // Success state
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: '48px', height: '48px',
                border: '1px solid var(--el)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                fontFamily: '"DM Mono", monospace',
                fontSize: '20px',
                color: 'var(--el)',
              }}>✓</div>
              <h2 style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: 'clamp(22px,2.8vw,36px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--t1)',
                marginBottom: '16px',
              }}>
                Message received.
              </h2>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '15px', fontWeight: 300,
                lineHeight: 1.8, color: 'var(--t2)',
                maxWidth: '360px', margin: '0 auto',
              }}>
                We'll review your project details and reach out within 24 hours to schedule your discovery call.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Input fields */}
              {[
                { key: 'name', label: 'Your Name', placeholder: 'James Whitfield' },
                { key: 'business', label: 'Business Name', placeholder: 'Cascade Custom Homes' },
                { key: 'email', label: 'Email Address', placeholder: 'james@cascadehomes.com' },
                { key: 'phone', label: 'Phone Number', placeholder: '+1 (804) 555-0100' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{
                    display: 'block',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '8px', letterSpacing: '0.2em',
                    color: 'var(--t2)', textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'var(--srf2)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      padding: '14px 16px',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '14px', fontWeight: 300,
                      color: 'var(--t1)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              {/* Service chips */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '8px', letterSpacing: '0.2em',
                  color: 'var(--t2)', textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  I'm interested in
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {services.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleService(s)}
                      style={{
                        padding: '8px 16px',
                        background: selected.includes(s) ? 'var(--el)' : 'transparent',
                        border: selected.includes(s) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: selected.includes(s) ? '#fff' : 'var(--t2)',
                        fontFamily: '"DM Mono", monospace',
                        fontSize: '8px', letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '8px', letterSpacing: '0.2em',
                  color: 'var(--t2)', textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  Tell us about your business
                </label>
                <textarea
                  placeholder="We're a pool builder in Charleston doing about $1.8M/year. Our current website is embarrassing..."
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  style={{
                    width: '100%',
                    background: 'var(--srf2)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '14px 16px',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '14px', fontWeight: 300,
                    color: 'var(--t1)',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: loading ? 'rgba(47,126,255,0.5)' : 'var(--el)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '9px', letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>

              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '8px', letterSpacing: '0.16em',
                color: 'var(--t3)', textAlign: 'center', textTransform: 'uppercase',
              }}>
                We respond within 24 hours · No spam ever
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
