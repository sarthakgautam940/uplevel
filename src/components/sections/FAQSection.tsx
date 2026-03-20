'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FAQ_ITEMS } from '@/lib/brand'
import Link from 'next/link'

const CATEGORIES = ['All', 'Process', 'Pricing', 'AI', 'Results'] as const
type Category = typeof CATEGORIES[number]

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const [openItem, setOpenItem] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filtered = FAQ_ITEMS.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  )

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left sticky column */}
        <div style={{ position: 'sticky', top: '100px' }}>
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
            Questions
          </motion.div>

          <div style={{ overflow: 'hidden', marginBottom: '40px' }}>
            <motion.h2
              initial={{ y: '108%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              style={{
                fontFamily: 'var(--font-outfit)',
                fontWeight: 900,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                letterSpacing: '-0.025em',
                lineHeight: 0.95,
                color: '#F1F2FF',
                display: 'block',
              }}
            >
              What you
              <br />
              need to know.
            </motion.h2>
          </div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '40px',
            }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setOpenItem(null)
                }}
                data-cursor="Filter"
                style={{
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  padding: '10px 0',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: activeCategory === cat ? '#F1F2FF' : '#5C6278',
                  cursor: 'none',
                  borderLeft: `2px solid ${activeCategory === cat ? '#2F7EFF' : 'transparent'}`,
                  paddingLeft: '12px',
                  transition: 'color 200ms, border-color 200ms',
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/contact"
              data-cursor="Book call"
              className="btn btn-ghost"
              style={{ fontSize: '12px', padding: '10px 18px' }}
            >
              Book free strategy call →
            </Link>
          </motion.div>
        </div>

        {/* Right accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((item, i) => (
                <FAQItem
                  key={item.q}
                  item={item}
                  isOpen={openItem === i}
                  onToggle={() => setOpenItem(openItem === i ? null : i)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: typeof FAQ_ITEMS[number]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div
      className="accordion-item"
      style={{
        borderLeft: isOpen ? '2px solid rgba(47,126,255,0.5)' : '2px solid transparent',
        paddingLeft: isOpen ? '16px' : '0',
        marginLeft: isOpen ? '-2px' : '0',
        transition: 'border-color 300ms, padding 300ms, margin 300ms',
      }}
    >
      <button
        className="accordion-trigger"
        onClick={onToggle}
        data-cursor={isOpen ? 'Close' : 'Open'}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#2F7EFF',
              opacity: 0.6,
              flexShrink: 0,
              marginTop: '3px',
            }}
          >
            0{index + 1}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 700,
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              letterSpacing: '-0.01em',
              color: isOpen ? '#F1F2FF' : '#5C6278',
              lineHeight: 1.3,
              transition: 'color 200ms',
              textAlign: 'left',
            }}
          >
            {item.q}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '16px',
            color: '#5C6278',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 300ms cubic-bezier(0.19,1,0.22,1)',
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="accordion-content-inner"
              style={{ paddingBottom: '20px' }}
            >
              {/* Gradient fade from bottom */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: 1.75,
                  color: '#5C6278',
                }}
              >
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
