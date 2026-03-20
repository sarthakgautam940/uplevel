'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { SERVICES } from '@/lib/brand'

const CARD_ENTERS = [
  { y: -80, rotate: -1.5 },
  { y: -110, rotate: 0.8 },
  { y: -65, rotate: -0.5 },
  { y: -95, rotate: 1.2 },
]

function ServiceCard({
  service,
  index,
  isInView,
  suppressMagnetic,
  onHover,
  onLeave,
}: {
  service: typeof SERVICES[number]
  index: number
  isInView: boolean
  suppressMagnetic: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const [topLineVisible, setTopLineVisible] = useState(false)
  const [, setSettled] = useState(false)

  const enter = CARD_ENTERS[index]
  const delay = index * 0.08

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || suppressMagnetic) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })
  }

  const handleMouseEnter = () => {
    if (suppressMagnetic) return
    setIsHovered(true)
    onHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onLeave()
  }

  // Track when card animation settles
  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setSettled(true), (delay + 0.6) * 1000)
      return () => clearTimeout(t)
    }
  }, [isInView, delay])

  // Top line draws slightly before card settles
  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setTopLineVisible(true), (delay + 0.5) * 1000)
      return () => clearTimeout(t)
    }
  }, [isInView, delay])

  // 3D tilt
  const getTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return { rx: 0, ry: 0 }
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 8
    return { rx, ry }
  }

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  return (
    <motion.div
      initial={{ y: enter.y, rotate: enter.rotate, opacity: 0 }}
      animate={isInView ? { y: 0, rotate: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{ perspective: '800px' }}
    >
      <div
        ref={cardRef}
        className="card"
        data-cursor={`Service ${index + 1}`}
        onMouseMove={(e) => {
          handleMouseMove(e)
          if (!suppressMagnetic) setTilt(getTilt(e))
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          handleMouseLeave()
          setTilt({ rx: 0, ry: 0 })
        }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          transform: isHovered
            ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
            : 'perspective(800px) rotateX(0) rotateY(0)',
          transition: isHovered ? 'transform 100ms' : 'transform 400ms cubic-bezier(0.19,1,0.22,1)',
          borderColor: isHovered ? 'rgba(47,126,255,0.3)' : undefined,
          cursor: 'none',
        }}
      >
        {/* Top accent line — draws before card lands */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: '#2F7EFF',
            transformOrigin: 'left center',
            transform: topLineVisible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 400ms cubic-bezier(0.19,1,0.22,1)',
            zIndex: 2,
          }}
        />

        {/* Spotlight */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(47,126,255,0.07) 0%, transparent 60%)`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Number */}
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

          {/* Name */}
          <h3
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 900,
              fontSize: 'clamp(22px, 2.5vw, 30px)',
              letterSpacing: '-0.02em',
              color: '#F1F2FF',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            {service.name}
          </h3>

          {/* Headline */}
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              color: '#5C6278',
              marginBottom: '16px',
              lineHeight: 1.4,
            }}
          >
            {service.headline}
          </p>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: '#21222E',
              marginBottom: '16px',
            }}
          />

          {/* Body */}
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '14px',
              lineHeight: 1.65,
              color: '#5C6278',
              marginBottom: '20px',
            }}
          >
            {service.body}
          </p>

          {/* Features */}
          <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
            {service.features.map((feature, fi) => (
              <li
                key={fi}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  color: '#5C6278',
                  padding: '6px 0',
                  borderBottom: '1px solid #21222E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ color: '#2F7EFF', fontSize: '8px' }}>◆</span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 900,
                  fontSize: '22px',
                  letterSpacing: '-0.02em',
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

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#2F7EFF',
                opacity: 0.7,
              }}
            >
              Learn more →
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: 'clamp(80px, 12vh, 120px) clamp(24px, 5vw, 80px)',
        position: 'relative',
      }}
    >
      {/* Eyebrow + Headline */}
      <div style={{ marginBottom: '64px', maxWidth: '600px' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
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
        </motion.div>

        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '108%', skewY: 1.2 }}
            animate={isInView ? { y: 0, skewY: 0 } : {}}
            transition={{ duration: 0.72, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 72px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              color: '#F1F2FF',
              display: 'block',
            }}
          >
            Four systems.
            <br />
            <span style={{ color: '#5C6278' }}>One operator.</span>
          </motion.h2>
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {SERVICES.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={i}
            isInView={isInView}
            suppressMagnetic={hoveredCard !== null && hoveredCard !== i}
            onHover={() => setHoveredCard(i)}
            onLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>
    </section>
  )
}
