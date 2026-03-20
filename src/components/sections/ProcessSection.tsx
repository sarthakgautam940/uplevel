'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { PROCESS_STEPS } from '@/lib/brand'

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
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
          How it works
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
            Five stages.<br />
            <span style={{ color: '#5C6278' }}>No surprises.</span>
          </motion.h2>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '60px',
          alignItems: 'start',
        }}
      >
        {/* Left: step selectors */}
        <div>
          {PROCESS_STEPS.map((step, i) => (
            <button
              key={step.id}
              className={`process-step-btn ${activeStep === i ? 'active' : ''}`}
              onClick={() => setActiveStep(i)}
              data-cursor="Step"
              style={{
                animation: activeStep === i
                  ? 'activeBorderPulse 2s ease-in-out infinite'
                  : 'none',
              }}
            >
              <span className="step-number">{step.number}</span>
              <span className="step-name">{step.name}</span>
              {activeStep === i && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: '#2F7EFF',
                    opacity: 0.6,
                  }}
                >
                  {step.timeline}
                </span>
              )}
            </button>
          ))}
          <style>{`
            @keyframes activeBorderPulse {
              0%, 100% { border-left-color: rgba(47,126,255,0.3); }
              50% { border-left-color: rgba(47,126,255,0.8); }
            }
          `}</style>
        </div>

        {/* Right: detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          >
            <StepDetail step={PROCESS_STEPS[activeStep]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function StepDetail({ step }: { step: typeof PROCESS_STEPS[number] }) {
  return (
    <div>
      {/* Timeline badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          padding: '6px 14px',
          border: '1px solid rgba(47,126,255,0.2)',
          borderRadius: '1px',
        }}
      >
        <div
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#2F7EFF',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#2F7EFF',
            textTransform: 'uppercase',
          }}
        >
          {step.timeline}
        </span>
      </div>

      {/* Body */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: 'clamp(15px, 1.5vw, 18px)',
          lineHeight: 1.7,
          color: '#5C6278',
          marginBottom: '32px',
        }}
      >
        {step.body}
      </p>

      {/* What happens checklist */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#2F7EFF',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          What happens
        </div>
        <ul style={{ listStyle: 'none' }}>
          {step.checklist.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid #21222E',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '14px',
                color: '#F1F2FF',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  border: '1px solid rgba(47,126,255,0.4)',
                  borderRadius: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ color: '#2F7EFF', fontSize: '8px' }}>✓</span>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Your role / Our role */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          padding: '24px',
          background: '#0C0D14',
          border: '1px solid #21222E',
          borderRadius: '2px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#5C6278',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Your role
          </div>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#5C6278',
            }}
          >
            {step.youDo}
          </p>
        </div>
        <div style={{ borderLeft: '1px solid #21222E', paddingLeft: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#2F7EFF',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Our role
          </div>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#5C6278',
            }}
          >
            {step.weDo}
          </p>
        </div>
      </div>
    </div>
  )
}
