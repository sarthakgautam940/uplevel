'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { PRICING_TIERS } from '@/lib/brand'
import Link from 'next/link'

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const [, setCardsLanded] = useState(false)

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setCardsLanded(true), 700)
      return () => clearTimeout(t)
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)',
        background: 'rgba(12,13,20,0.6)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: '600px',
          marginBottom: '64px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: '#2F7EFF',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Investment
        </motion.div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '108%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.72, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 900,
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              color: '#F1F2FF',
              display: 'block',
            }}
          >
            Built for contractors
            <br />
            <span style={{ color: '#5C6278' }}>at every stage.</span>
          </motion.h2>
        </div>
      </div>

      {/* Scarcity indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: '32px' }}
      >
        <div className="alert-pulse">
          <div className="alert-dot" />
          1 OF 3 SLOTS AVAILABLE FOR Q2
        </div>
      </motion.div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {PRICING_TIERS.map((tier, i) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Footer notes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          'Month-to-month after 3-month commitment',
          '48-hour average launch time',
          'No long-term contracts',
          'Full IP ownership on delivery',
        ].map(note => (
          <div
            key={note}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: '#5C6278',
            }}
          >
            <span style={{ color: '#2F7EFF', fontSize: '8px' }}>◆</span>
            {note}
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function PricingCard({
  tier,
  index,
  isInView,
}: {
  tier: typeof PRICING_TIERS[number]
  index: number
  isInView: boolean
}) {
  const [fillProgress, setFillProgress] = useState(100) // 100 = fully transparent (inset 100%)
  const [borderPulsed, setBorderPulsed] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const delay = index * 80

    // Card drops AND fills from bottom simultaneously
    const t = setTimeout(() => {
      setFillProgress(0) // fill from bottom to top
      if (tier.featured) {
        const t2 = setTimeout(() => setBorderPulsed(true), 700)
        return () => clearTimeout(t2)
      }
    }, delay)
    return () => clearTimeout(t)
  }, [isInView, index, tier.featured])

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <div
        className={`pricing-card ${tier.featured ? 'featured' : ''}`}
        data-cursor={tier.featured ? 'Most popular' : 'Pricing'}
        style={{
          position: 'relative',
          overflow: 'hidden',
          animation: borderPulsed && tier.featured
            ? 'pricingBorderPulse 500ms ease-out forwards'
            : 'none',
        }}
      >
        {/* Background fill from bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: tier.featured
              ? 'linear-gradient(to top, rgba(47,126,255,0.08), rgba(47,126,255,0.02))'
              : 'linear-gradient(to top, rgba(19,20,30,0.8), transparent)',
            clipPath: `inset(${fillProgress}% 0 0% 0)`,
            transition: 'clip-path 550ms cubic-bezier(0.19,1,0.22,1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {tier.featured && (
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#2F7EFF',
                textTransform: 'uppercase',
                marginBottom: '12px',
                padding: '3px 10px',
                border: '1px solid rgba(47,126,255,0.3)',
                borderRadius: '1px',
              }}
            >
              Most popular
            </div>
          )}

          <h3
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '-0.02em',
              color: '#F1F2FF',
              marginBottom: '8px',
            }}
          >
            {tier.name}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '13px',
              color: '#5C6278',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            {tier.description}
          </p>

          {/* Price */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 900,
                fontSize: '36px',
                letterSpacing: '-0.04em',
                color: '#F1F2FF',
                lineHeight: 1,
              }}
            >
              {tier.setup}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#5C6278',
                marginTop: '4px',
              }}
            >
              setup + {tier.retainer}
            </div>
          </div>

          {/* Ideal for */}
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: '#2F7EFF',
              opacity: 0.6,
              marginBottom: '20px',
            }}
          >
            {tier.ideal}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#21222E', marginBottom: '20px' }} />

          {/* Services list */}
          <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
            {tier.services.map((service, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '8px 0',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '13px',
                  color: '#5C6278',
                  borderBottom: '1px solid rgba(33,34,46,0.5)',
                }}
              >
                <span style={{ color: '#2F7EFF', fontSize: '10px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                {service}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/contact"
            data-cursor="Start"
            className={`btn ${tier.featured ? 'btn-primary' : 'btn-ghost'}`}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {tier.cta}
          </Link>
        </div>

        <style>{`
          @keyframes pricingBorderPulse {
            0% { box-shadow: 0 0 0 0 rgba(47,126,255,0); }
            50% { box-shadow: 0 0 0 1px rgba(47,126,255,0.8); }
            100% { box-shadow: 0 0 0 0 rgba(47,126,255,0); }
          }
        `}</style>
      </div>
    </motion.div>
  )
}
