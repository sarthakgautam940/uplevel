'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

interface HeroProps {
  ready: boolean
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT_SHADER = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.1 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 mouseInfluence = uMouse * 0.04;

  float field1 = fbm(uv * 3.0 + vec2(uTime * 0.06) + mouseInfluence);
  float field2 = fbm(uv * 5.5 - vec2(uTime * 0.04) + mouseInfluence * 0.6);
  float combined = field1 * 0.65 + field2 * 0.35;

  // Base: #05050A = (0.0196, 0.0196, 0.039)
  vec3 baseColor = vec3(0.0196, 0.0196, 0.039);
  // Light: #2F7EFF at 7%
  vec3 lightColor = vec3(0.184, 0.494, 1.0);

  vec3 color = baseColor + lightColor * combined * 0.07;

  // Warm micro-variation
  color.r += combined * 0.003;
  color.b += combined * 0.005;

  // Vignette
  vec2 vigUv = uv * 2.0 - 1.0;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.45;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`

export default function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLDivElement>(null)
  const bracketsRef = useRef<(HTMLDivElement | null)[]>([])
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const ambientGeomRef = useRef<HTMLCanvasElement>(null)

  // ── WebGL + Three.js Setup ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.NoToneMapping

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 5

    // ── Background Shader Plane ──────────────────────────────────────────
    const bgGeo = new THREE.PlaneGeometry(30, 20)
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
    })
    const bgMesh = new THREE.Mesh(bgGeo, bgMat)
    bgMesh.position.z = -3
    scene.add(bgMesh)

    // ── Mouse tracking with 2s delay ────────────────────────────────────
    const rawMouse = { x: 0, y: 0 }
    const delayedMouse = { x: 0, y: 0 }
    const mouseHistory: Array<{ x: number; y: number; time: number }> = []

    const onMouseMove = (e: MouseEvent) => {
      rawMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      rawMouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
      mouseHistory.push({ x: rawMouse.x, y: rawMouse.y, time: Date.now() })
      // Keep only recent 3 seconds of history
      const cutoff = Date.now() - 3000
      while (mouseHistory.length > 0 && mouseHistory[0].time < cutoff) {
        mouseHistory.shift()
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Three.js Glass Panels ────────────────────────────────────────────
    const panelGroup = new THREE.Group()
    panelGroup.position.x = 1.4 // Shift panels to right portion
    scene.add(panelGroup)

    // Panel dimensions
    const panelW = 1.6
    const panelH = 1.05

    // Helper: create glass panel group
    function createGlassPanel(
      w: number,
      h: number,
      fillColor: number,
      fillAlpha: number,
      edgeAlpha: number
    ) {
      const group = new THREE.Group()

      // Fill mesh
      const geo = new THREE.PlaneGeometry(w, h)
      const fillMat = new THREE.MeshBasicMaterial({
        color: fillColor,
        transparent: true,
        opacity: fillAlpha,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const fillMesh = new THREE.Mesh(geo, fillMat)
      group.add(fillMesh)

      // Edge wireframe
      const edgesGeo = new THREE.EdgesGeometry(geo)
      const edgeMat = new THREE.LineBasicMaterial({
        color: fillColor,
        transparent: true,
        opacity: edgeAlpha,
        depthWrite: false,
      })
      const edges = new THREE.LineSegments(edgesGeo, edgeMat)
      group.add(edges)

      return group
    }

    // Helper: create a line
    function createLine(points: THREE.Vector3[], color: number, opacity: number) {
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
      return new THREE.Line(geo, mat)
    }

    // Helper: create a rectangle outline
    function createRect(x: number, y: number, w: number, h: number, color: number, opacity: number) {
      const points = [
        new THREE.Vector3(x, y, 0),
        new THREE.Vector3(x + w, y, 0),
        new THREE.Vector3(x + w, y - h, 0),
        new THREE.Vector3(x, y - h, 0),
        new THREE.Vector3(x, y, 0),
      ]
      return createLine(points, color, opacity)
    }

    // ── Panel 1: Far — Website wireframe ────────────────────────────────
    const panel1 = createGlassPanel(panelW, panelH, 0x2F7EFF, 0.03, 0.18)
    panel1.position.set(-0.5, 0.3, -2.2)

    // Nav bar line
    const navLine = createLine(
      [new THREE.Vector3(-panelW / 2 + 0.08, panelH / 2 - 0.1, 0.001),
       new THREE.Vector3(panelW / 2 - 0.08, panelH / 2 - 0.1, 0.001)],
      0x2F7EFF, 0.3
    )
    panel1.add(navLine)

    // Headline blocks
    const hl1 = createRect(-panelW / 2 + 0.08, panelH / 2 - 0.22, 0.7, 0.06, 0x2F7EFF, 0.25)
    const hl2 = createRect(-panelW / 2 + 0.08, panelH / 2 - 0.33, 0.5, 0.05, 0x2F7EFF, 0.2)
    const hl3 = createRect(-panelW / 2 + 0.08, panelH / 2 - 0.44, 0.6, 0.04, 0x2F7EFF, 0.18)
    panel1.add(hl1, hl2, hl3)

    // Right column box
    const rightCol = createRect(0.3, panelH / 2 - 0.15, 0.45, 0.65, 0x2F7EFF, 0.22)
    panel1.add(rightCol)

    panelGroup.add(panel1)

    // ── Panel 2: Mid — AI Waveform ───────────────────────────────────────
    const panel2 = createGlassPanel(panelW * 1.05, panelH * 1.1, 0x78AAFF, 0.025, 0.16)
    panel2.position.set(0.15, -0.1, -0.9)

    // Waveform sine wave (will be updated each frame)
    const wavePoints: THREE.Vector3[] = []
    for (let i = 0; i <= 60; i++) {
      const x = (i / 60 - 0.5) * (panelW * 0.9)
      wavePoints.push(new THREE.Vector3(x, 0, 0.001))
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints)
    const waveMat = new THREE.LineBasicMaterial({ color: 0x78AAFF, transparent: true, opacity: 0.45, depthWrite: false })
    const waveLine = new THREE.Line(waveGeo, waveMat)
    waveLine.position.y = 0.05
    panel2.add(waveLine)

    // Data blocks below waveform
    const db1 = createRect(-0.58, -0.2, 0.32, 0.12, 0x78AAFF, 0.22)
    const db2 = createRect(-0.18, -0.2, 0.32, 0.12, 0x78AAFF, 0.22)
    const db3 = createRect(0.22, -0.2, 0.32, 0.12, 0x78AAFF, 0.22)
    panel2.add(db1, db2, db3)

    // Pulse circle
    const pulseRingGeo = new THREE.RingGeometry(0.06, 0.07, 32)
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x78AAFF,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat)
    pulseRing.position.set(0.55, 0.38, 0.001)
    panel2.add(pulseRing)

    panelGroup.add(panel2)

    // ── Panel 3: Near — Dashboard metrics ───────────────────────────────
    const panel3 = createGlassPanel(panelW * 1.1, panelH, 0xF1F2FF, 0.02, 0.12)
    panel3.position.set(0.9, 0.2, 0.0)

    // 2×3 grid of metric blocks
    const metricPositions = [
      [-0.5, 0.3], [0.0, 0.3], [0.5, 0.3],
      [-0.5, 0.05], [0.0, 0.05], [0.5, 0.05],
    ]
    metricPositions.forEach(([mx, my]) => {
      const block = createRect(mx - 0.18, my + 0.09, 0.34, 0.16, 0xF1F2FF, 0.18)
      panel3.add(block)
    })

    panelGroup.add(panel3)

    // ── Particles ─────────────────────────────────────────────────────────
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x2F7EFF,
      size: 0.018,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    particles.position.x = 1.4 // align with panels
    scene.add(particles)

    // ── Mouse parallax targets for panels ───────────────────────────────
    const mouseX = { current: 0, target: 0 }
    const mouseY = { current: 0, target: 0 }

    const onMouseMovePanels = (e: MouseEvent) => {
      mouseX.target = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY.target = -((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', onMouseMovePanels)

    // ── Scroll-linked panel behavior ─────────────────────────────────────
    let scrollProgress = 0
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      scrollProgress = clamp01(-rect.top / (sectionHeight - window.innerHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

    // ── Render Loop ───────────────────────────────────────────────────────
    let animId = 0
    let waveOffset = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const now = performance.now() / 1000

      // Update BG shader
      bgMat.uniforms.uTime.value = now

      // Apply 2s delayed mouse to BG
      const twoSecondsAgo = Date.now() - 2000
      const histEntry = mouseHistory.find((h) => h.time >= twoSecondsAgo) || mouseHistory[0]
      if (histEntry) {
        delayedMouse.x = lerp(delayedMouse.x, histEntry.x * 0.05, 0.0038)
        delayedMouse.y = lerp(delayedMouse.y, histEntry.y * 0.05, 0.0038)
      }
      bgMat.uniforms.uMouse.value.set(delayedMouse.x, delayedMouse.y)

      // Lerp panel mouse parallax
      mouseX.current = lerp(mouseX.current, mouseX.target, 0.06)
      mouseY.current = lerp(mouseY.current, mouseY.target, 0.06)

      // Float panels
      const p1Base = { x: -0.5, y: 0.3, z: -2.2 }
      const p2Base = { x: 0.15, y: -0.1, z: -0.9 }
      const p3Base = { x: 0.9, y: 0.2, z: 0.0 }

      // Scroll behavior: panels drift apart
      let p1z = p1Base.z
      let p2z = p2Base.z
      let sp = clamp01((scrollProgress - 0.3) / 0.3)
      if (sp > 0) {
        p1z = lerp(p1Base.z, -3.0, sp)
        p2z = lerp(p2Base.z, -1.4, sp)
      }

      // Scroll: panels flatten (Y rotation toward 0)
      const sp2 = clamp01((scrollProgress - 0.6) / 0.25)

      panel1.position.x = p1Base.x + mouseX.current * 0.4 * 0.3
      panel1.position.y = p1Base.y + mouseY.current * 0.4 * 0.3 + Math.sin(now / 7.1) * 0.04
      panel1.position.z = p1z
      panel1.rotation.y = lerp(lerp(-0.15, -0.15, sp), 0, sp2)

      panel2.position.x = p2Base.x + mouseX.current * 0.7 * 0.3
      panel2.position.y = p2Base.y + mouseY.current * 0.7 * 0.3 + Math.sin(now / 5.3) * 0.05
      panel2.position.z = p2z

      panel3.position.x = p3Base.x + mouseX.current * 1.0 * 0.3
      panel3.position.y = p3Base.y + mouseY.current * 1.0 * 0.3 + Math.sin(now / 8.7) * 0.035
      panel3.position.z = p3Base.z

      // Animate waveform on panel 2
      waveOffset += 0.025
      const positions2 = waveGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i <= 60; i++) {
        const x = (i / 60 - 0.5) * (panelW * 0.9)
        const amplitude = 0.06 + Math.sin(now * 0.4) * 0.02
        const y = Math.sin(i * 0.3 + waveOffset) * amplitude
        positions2.setXYZ(i, x, y, 0.001)
      }
      positions2.needsUpdate = true

      // Pulse ring animation
      const pulseScale = 1 + Math.sin(now * 2.0) * 0.15
      pulseRing.scale.set(pulseScale, pulseScale, 1);
      (pulseRing.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(now * 2.0) * 0.15

      // Particles drift
      const pPos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        let py = pPos.getY(i)
        py += 0.002 * Math.sin(now * 0.5 + i * 0.3)
        pPos.setY(i, py)
      }
      pPos.needsUpdate = true

      // Fade panels on scroll exit
      const sp3 = clamp01((scrollProgress - 0.85) / 0.15)
      panelGroup.children.forEach((child) => {
        child.traverse((obj) => {
          if ((obj as any).material) {
            const mat = (obj as any).material
            if (mat.opacity !== undefined) {
              mat.opacity *= (1 - sp3 * 0.8)
            }
          }
        })
      })
      particles.material.opacity = 0.6 * (1 - sp3)

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
      bgMat.uniforms.uResolution.value.set(W, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousemove', onMouseMovePanels)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.clear()
    }
  }, [])

  // ── Ambient intro geometry canvas (top-right corner, 8% scale) ─────────
  useEffect(() => {
    const canvas = ambientGeomRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const S = 80
    canvas.width = S * 2
    canvas.height = S * 2

    const cx = S
    const cy = S
    const outerR = S * 0.72
    const innerR = outerR * 0.48
    const opacity = 0.08

    ctx.clearRect(0, 0, S * 2, S * 2)

    // Outer circle
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${opacity})`
    ctx.lineWidth = 1
    ctx.stroke()

    // Inner dashed circle
    ctx.save()
    ctx.setLineDash([4, 8])
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(47,126,255,${opacity * 1.5})`
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()

    // Compass lines
    const dirs = [[1, 0], [-1, 0], [0, -1], [0, 1]]
    dirs.forEach(([dx, dy]) => {
      const len = innerR * 0.55
      ctx.beginPath()
      ctx.moveTo(cx + dx * innerR, cy + dy * innerR)
      ctx.lineTo(cx + dx * (innerR + len), cy + dy * (innerR + len))
      ctx.strokeStyle = `rgba(47,126,255,${opacity * 2})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    })

    // Crosshair
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(S * 2, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, S * 2)
    ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.5})`
    ctx.lineWidth = 0.4
    ctx.stroke()
  }, [])

  // ── GSAP Scroll Pin ────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return

    const pin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=120vh',
      pin: true,
      scrub: 1.5,
      pinSpacing: true,
    })

    return () => {
      pin.kill()
    }
  }, [])

  // ── Hero entrance animations (fires when ready=true) ──────────────────
  useEffect(() => {
    if (!ready) return

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // Eyebrow
    if (eyebrowRef.current) {
      gsap.set(eyebrowRef.current, { x: -20, opacity: 0 })
      tl.to(eyebrowRef.current, { x: 0, opacity: 1, duration: 0.6 }, 0.05)
    }

    // Headline lines (overflow:hidden wrappers, each inner span animates)
    const lineRefs = [line1Ref, line2Ref, line3Ref]
    const lineDelays = [0.16, 0.27, 0.38]
    lineRefs.forEach((lineRef, i) => {
      const inner = lineRef.current?.querySelector('.line-inner') as HTMLElement | null
      if (!inner) return
      gsap.set(inner, { y: '108%', skewY: 1 })
      tl.to(inner, { y: '0%', skewY: 0, duration: 1.1, ease: 'expo.out' }, lineDelays[i])
    })

    // Sub copy
    if (subRef.current) {
      gsap.set(subRef.current, { y: 20, opacity: 0 })
      tl.to(subRef.current, { y: 0, opacity: 1, duration: 0.95 }, 0.62)
    }

    // CTAs
    if (ctasRef.current) {
      gsap.set(ctasRef.current, { y: 18, opacity: 0 })
      tl.to(ctasRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.82)
    }

    // Badges
    if (badgesRef.current) {
      gsap.set(badgesRef.current, { opacity: 0 })
      tl.to(badgesRef.current, { opacity: 1, duration: 0.6 }, 0.98)
    }

    // Corner brackets stagger
    bracketsRef.current.forEach((br, i) => {
      if (!br) return
      gsap.set(br, { opacity: 0 })
      tl.to(br, { opacity: 1, duration: 0.4 }, 1.2 + i * 0.04)
    })

    // Readout
    if (readoutRef.current) {
      gsap.set(readoutRef.current, { x: 16, opacity: 0 })
      tl.to(readoutRef.current, { x: 0, opacity: 1, duration: 0.6 }, 1.4)
    }

    // Scroll indicator
    if (scrollIndicatorRef.current) {
      gsap.set(scrollIndicatorRef.current, { opacity: 0 })
      tl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.6 }, 1.6)
    }
  }, [ready])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* WebGL Canvas — full viewport background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 0,
        }}
      />

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
        <div
          key={pos}
          ref={(el) => { bracketsRef.current[i] = el }}
          style={{
            position: 'absolute',
            width: 18,
            height: 18,
            borderColor: 'rgba(47,126,255,0.3)',
            borderStyle: 'solid',
            zIndex: 10,
            ...(pos === 'tl' ? { top: 24, left: 24, borderWidth: '1px 0 0 1px' } : {}),
            ...(pos === 'tr' ? { top: 24, right: 24, borderWidth: '1px 1px 0 0' } : {}),
            ...(pos === 'bl' ? { bottom: 24, left: 24, borderWidth: '0 0 1px 1px' } : {}),
            ...(pos === 'br' ? { bottom: 24, right: 24, borderWidth: '0 1px 1px 0' } : {}),
          }}
        />
      ))}

      {/* System readout — top right */}
      <div
        ref={readoutRef}
        style={{
          position: 'absolute',
          top: 'clamp(80px, 12vh, 120px)',
          right: 'clamp(24px, 4vw, 80px)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--el)',
              display: 'block',
              animation: 'pulse-dot 1.5s ease infinite',
            }}
          />
          <span className="t-micro t-el">SYS.ONLINE</span>
        </div>
        {[
          ['CLIENTS ACTIVE', '47+'],
          ['SLOT AVAILABLE', '1'],
          ['AVG.ROI YR1', '340%'],
        ].map(([label, value], i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.22em',
                color: 'rgba(241,242,255,0.25)',
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.18em',
                color: i === 1 ? 'var(--alert)' : 'rgba(241,242,255,0.5)',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Ambient geometry top-right — intro elements at 8% opacity drift ──*/}
      <canvas
        ref={ambientGeomRef}
        style={{
          position: 'absolute',
          top: 'clamp(80px, 10vh, 120px)',
          right: 'clamp(24px, 4vw, 80px)',
          width: 80,
          height: 80,
          opacity: 0.5,
          zIndex: 9,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* ── Left column content ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(24px, 6vw, 120px)',
          paddingTop: 'clamp(80px, 10vh, 120px)',
          maxWidth: '52%',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            letterSpacing: '0.28em',
            color: 'var(--el)',
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          RICHMOND, VA&nbsp;&nbsp;·&nbsp;&nbsp;DIGITAL GROWTH AGENCY
        </div>

        {/* Headline — 3 lines, each overflow:hidden wrapper */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'var(--fs-hero)',
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            color: 'var(--t1)',
            margin: 0,
            marginBottom: 32,
          }}
        >
          {[
            { text: 'THE WEBSITE', ref: line1Ref },
            { text: 'YOUR WORK', ref: line2Ref },
            { text: 'DESERVES.', ref: line3Ref, italic: true },
          ].map(({ text, ref, italic }) => (
            <div
              key={text}
              ref={ref}
              style={{ overflow: 'hidden', lineHeight: 0.96 }}
            >
              <span
                className="line-inner"
                style={{
                  display: 'block',
                  fontStyle: italic ? 'italic' : 'normal',
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </h1>

        {/* Sub copy */}
        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'var(--fs-body)',
            lineHeight: 1.85,
            color: 'var(--t2)',
            maxWidth: 460,
            marginBottom: 36,
          }}
        >
          UpLevel builds premium website systems, AI phone agents, and automated lead pipelines for
          elite contractors — live in 48 hours.
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}
        >
          <MagneticLink href="/contact" className="btn-electric" label="START">
            START A PROJECT →
          </MagneticLink>
          <MagneticLink href="/work" className="btn-ghost" label="VIEW">
            SEE OUR WORK
          </MagneticLink>
        </div>

        {/* Micro-trust badges */}
        <div
          ref={badgesRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            letterSpacing: '0.2em',
            color: 'rgba(241,242,255,0.2)',
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {['⬥ 48-HOUR DELIVERY', '⬥ MONTH-TO-MONTH', '⬥ VA LLC EST. 2024'].map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator — bottom center */}
      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 1,
            height: 54,
            background: 'linear-gradient(to bottom, transparent, rgba(47,126,255,0.35))',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'var(--el)',
              animation: 'scroll-dot 2s ease-in-out infinite',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 7,
            letterSpacing: '0.22em',
            color: 'rgba(241,242,255,0.2)',
          }}
        >
          SCROLL
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-left-col { max-width: 100% !important; }
        }
      `}</style>
    </section>
  )
}

// Magnetic link component
function MagneticLink({
  href,
  className,
  label,
  children,
}: {
  href: string
  className: string
  label: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const dist = Math.sqrt(x * x + y * y)
    const maxDist = 80
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 8
      el.style.transform = `translate(${(x / dist) * strength}px, ${(y / dist) * strength}px)`
    }
  }

  const onMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = ''
      ref.current.style.transition = 'transform 0.4s var(--ease-expo)'
    }
  }

  return (
    <Link
      href={href}
      ref={ref}
      className={className}
      data-cursor={label}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.1s ease' }}
    >
      {children}
    </Link>
  )
}
