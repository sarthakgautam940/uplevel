'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { scrollState, mouseState } from '@/lib/scroll'
import {
  BG_VERT, BG_FRAG,
  HOLO_VERT, HOLO_FRAG,
  PULSE_LINE_VERT, PULSE_LINE_FRAG,
  PARTICLE_VERT, PARTICLE_FRAG,
} from './shaders'

// ─── CAMERA KEYFRAMES ────────────────────────────────────────────────────────

interface CamKey {
  scroll: number
  pos: [number, number, number]
  lookAt: [number, number, number]
  fov: number
}

const KEYFRAMES: CamKey[] = [
  { scroll: 0,     pos: [0,   18,  80],  lookAt: [0,   12,   0],  fov: 55 },
  { scroll: 0.125, pos: [0,   16,  30],  lookAt: [0,   10,   0],  fov: 53 },
  { scroll: 0.25,  pos: [6,   30, -10],  lookAt: [0,   14,   0],  fov: 58 },
  { scroll: 0.31,  pos: [-12, 44, -90],  lookAt: [0,   14, -100], fov: 62 },
  { scroll: 0.44,  pos: [-60, 44, -90],  lookAt: [-60, 14, -160], fov: 62 },
  { scroll: 0.59,  pos: [-44, 28,-160],  lookAt: [-44, 12, -240], fov: 62 },
  { scroll: 0.71,  pos: [-44, 65,-200],  lookAt: [0,    0, -200], fov: 70 },
  { scroll: 0.81,  pos: [-44, 22,-240],  lookAt: [-44, 12, -320], fov: 60 },
  { scroll: 0.92,  pos: [0,   22,-320],  lookAt: [0,   12, -400], fov: 58 },
  { scroll: 1.0,   pos: [0,   36,-200],  lookAt: [0,   14, -300], fov: 60 },
]

// ─── ENVIRONMENT CHAPTERS ────────────────────────────────────────────────────

interface EnvChapter {
  range: [number, number]
  workLightIntensity: number
  workLightColor: [number, number, number] // rgb 0-1
  blueAccentIntensity: number
  fogDensity: number
  particleSpeedMult: number
}

const ENV_CHAPTERS: EnvChapter[] = [
  { range: [0,    0.25], workLightIntensity: 0.42, workLightColor: [1.0, 0.816, 0.502], blueAccentIntensity: 0.55, fogDensity: 0.003,  particleSpeedMult: 1.0  },
  { range: [0.25, 0.50], workLightIntensity: 0.37, workLightColor: [1.0, 0.816, 0.502], blueAccentIntensity: 0.70, fogDensity: 0.006,  particleSpeedMult: 1.3  },
  { range: [0.50, 0.71], workLightIntensity: 0.37, workLightColor: [1.0, 0.816, 0.502], blueAccentIntensity: 0.70, fogDensity: 0.005,  particleSpeedMult: 0.8  },
  { range: [0.71, 0.85], workLightIntensity: 0.50, workLightColor: [1.0, 0.722, 0.376], blueAccentIntensity: 0.60, fogDensity: 0.003,  particleSpeedMult: 0.35 },
  { range: [0.85, 1.0],  workLightIntensity: 0.42, workLightColor: [1.0, 0.816, 0.502], blueAccentIntensity: 0.55, fogDensity: 0.009,  particleSpeedMult: 1.0  },
]

// ─── MATH HELPERS ─────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function easeInOut(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

function lerpVec3(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)]
}

function getEnvChapter(progress: number): { from: EnvChapter; to: EnvChapter; t: number } {
  let from = ENV_CHAPTERS[0]
  let to = ENV_CHAPTERS[0]
  let t = 0

  for (let i = 0; i < ENV_CHAPTERS.length; i++) {
    if (progress >= ENV_CHAPTERS[i].range[0] && progress <= ENV_CHAPTERS[i].range[1]) {
      from = ENV_CHAPTERS[i]
      to = ENV_CHAPTERS[Math.min(i + 1, ENV_CHAPTERS.length - 1)]
      const span = from.range[1] - from.range[0]
      t = span > 0 ? (progress - from.range[0]) / span : 0
      break
    }
  }
  return { from, to, t }
}

function getCameraState(progress: number): { pos: [number,number,number]; lookAt: [number,number,number]; fov: number } {
  let fromKey = KEYFRAMES[0]
  let toKey = KEYFRAMES[KEYFRAMES.length - 1]

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (progress >= KEYFRAMES[i].scroll && progress <= KEYFRAMES[i+1].scroll) {
      fromKey = KEYFRAMES[i]
      toKey = KEYFRAMES[i+1]
      break
    }
  }

  const span = toKey.scroll - fromKey.scroll
  const rawT = span > 0 ? (progress - fromKey.scroll) / span : 0
  const t = easeInOut(clamp(rawT, 0, 1))

  return {
    pos: lerpVec3(fromKey.pos, toKey.pos, t),
    lookAt: lerpVec3(fromKey.lookAt, toKey.lookAt, t),
    fov: lerp(fromKey.fov, toKey.fov, t),
  }
}

// ─── CANVAS TEXTURE HELPERS ───────────────────────────────────────────────────

function createSitePlanTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 384
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 512, 384)

  const c = '#2F7EFF'
  ctx.strokeStyle = c
  ctx.fillStyle = c
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.9

  // Outer boundary
  ctx.strokeRect(24, 24, 464, 336)

  // Interior walls
  ctx.beginPath()
  ctx.moveTo(200, 24); ctx.lineTo(200, 240)
  ctx.moveTo(24, 160); ctx.lineTo(200, 160)
  ctx.moveTo(200, 180); ctx.lineTo(488, 180)
  ctx.moveTo(350, 180); ctx.lineTo(350, 360)
  ctx.moveTo(24, 260); ctx.lineTo(200, 260)
  ctx.stroke()

  // Door swings
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(120, 160, 36, -Math.PI/2, 0); ctx.stroke()
  ctx.beginPath()
  ctx.arc(350, 280, 30, 0, Math.PI/2); ctx.stroke()
  ctx.globalAlpha = 0.9
  ctx.lineWidth = 1.2

  // Dimension lines
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 0.7
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  // Exterior dimension — top
  ctx.moveTo(24, 10); ctx.lineTo(488, 10)
  ctx.moveTo(24, 6); ctx.lineTo(24, 14)
  ctx.moveTo(488, 6); ctx.lineTo(488, 14)
  ctx.stroke()
  ctx.setLineDash([])

  // Room labels
  ctx.globalAlpha = 0.55
  ctx.font = '500 9px DM Mono, monospace'
  ctx.textAlign = 'center'
  ctx.fillText('GARAGE', 112, 100)
  ctx.fillText('KITCHEN', 344, 100)
  ctx.fillText('GREAT RM', 344, 280)
  ctx.fillText('MASTER', 112, 210)
  ctx.fillText('BATH', 112, 310)

  // Dimension values
  ctx.font = '400 7px DM Mono, monospace'
  ctx.globalAlpha = 0.4
  ctx.fillText("30'-0\"", 256, 8)

  // North arrow
  ctx.globalAlpha = 0.7
  ctx.font = '700 10px DM Mono, monospace'
  ctx.textAlign = 'right'
  ctx.fillText('N ↑', 500, 40)

  return canvas
}

function createDashboardTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 320
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 512, 320)

  ctx.fillStyle = '#2F7EFF'
  ctx.font = '400 9px DM Mono, monospace'
  ctx.globalAlpha = 0.5

  // Title
  ctx.textAlign = 'left'
  ctx.fillText('SYSTEM STATUS · ACTIVE', 20, 28)

  // Separator
  ctx.globalAlpha = 0.3
  ctx.fillRect(20, 36, 472, 0.8)
  ctx.globalAlpha = 0.5

  // Three metric pods
  const pods = [
    { label: 'AVG ROI YR.1', value: '340%', x: 20 },
    { label: 'SATISFACTION', value: '98%', x: 190 },
    { label: 'LAUNCH TIME', value: '48hr', x: 360 },
  ]

  pods.forEach(pod => {
    ctx.globalAlpha = 0.4
    ctx.font = '400 7px DM Mono, monospace'
    ctx.fillText(pod.label, pod.x, 62)

    ctx.globalAlpha = 0.95
    ctx.font = '900 36px Outfit, sans-serif'
    ctx.fillText(pod.value, pod.x, 105)

    // Small bar under value
    ctx.globalAlpha = 0.25
    ctx.fillRect(pod.x, 112, 120, 1)
    ctx.globalAlpha = 0.55
    ctx.fillRect(pod.x, 112, pod === pods[0] ? 115 : pod === pods[1] ? 100 : 90, 1)
  })

  // Bar chart row
  ctx.globalAlpha = 0.3
  ctx.fillRect(20, 140, 472, 0.8)

  // Bottom metadata
  ctx.globalAlpha = 0.35
  ctx.font = '400 7px DM Mono, monospace'
  ctx.fillText('47 CLIENTS  ·  RICHMOND, VA  ·  FOUNDED 2023', 20, 165)

  // Uptime indicator
  ctx.globalAlpha = 0.6
  ctx.fillStyle = '#2F7EFF'
  ctx.beginPath()
  ctx.arc(20, 185, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 0.35
  ctx.font = '400 7px DM Mono, monospace'
  ctx.fillStyle = '#2F7EFF'
  ctx.fillText('SYSTEMS OPERATIONAL', 30, 188)

  return canvas
}

function createProcessFlowTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 480
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 256, 480)

  ctx.strokeStyle = '#2F7EFF'
  ctx.fillStyle = '#2F7EFF'

  const stages = [
    { label: '01 DISCOVERY', y: 40 },
    { label: '02 BUILD', y: 130 },
    { label: '03 REVIEW', y: 220 },
    { label: '04 LAUNCH', y: 310 },
    { label: '05 OPTIMIZE', y: 400 },
  ]

  stages.forEach((stage, i) => {
    // Box
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 1
    ctx.strokeRect(20, stage.y, 216, 46)

    // Label
    ctx.globalAlpha = 0.7
    ctx.font = '400 10px DM Mono, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(stage.label, 34, stage.y + 28)

    // Connector line (not for last)
    if (i < stages.length - 1) {
      ctx.globalAlpha = 0.25
      ctx.lineWidth = 0.8
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(128, stage.y + 46)
      ctx.lineTo(128, stages[i+1].y)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrow head
      ctx.globalAlpha = 0.4
      ctx.lineWidth = 0.8
      ctx.beginPath()
      const ay = stages[i+1].y - 6
      ctx.moveTo(122, ay); ctx.lineTo(128, stages[i+1].y); ctx.lineTo(134, ay)
      ctx.stroke()
    }
  })

  return canvas
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WorldScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!mountRef.current) return

    const mount = mountRef.current

    // ── Dynamic imports (client-side only) ──────────────────────────────────
    let destroyed = false
    const objects: {
      renderer?: import('three').WebGLRenderer
      composer?: import('three/examples/jsm/postprocessing/EffectComposer.js').EffectComposer
    } = {}

    async function init() {
      const THREE = await import('three')
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')

      if (destroyed) return

      // ── Renderer ──────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      })
      objects.renderer = renderer
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.85
      mount.appendChild(renderer.domElement)

      // ── Scene ─────────────────────────────────────────────────────────────
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x05050A, 0.003)

      // ── Camera ────────────────────────────────────────────────────────────
      const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1200
      )
      camera.position.set(0, 18, 80)

      // Camera proxy — GSAP will animate this OR we lerp from scroll
      const camProxy = {
        x: 0, y: 18, z: 80,
        lx: 0, ly: 12, lz: 0,
        fov: 55,
        // Mouse-based tilt (applied on top)
        tiltX: 0, tiltY: 0,
      }

      // ── Post-processing ───────────────────────────────────────────────────
      const composer = new EffectComposer(renderer)
      objects.composer = composer
      composer.addPass(new RenderPass(scene, camera))

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.1,   // strength
        0.55,  // radius
        0.82   // threshold
      )
      composer.addPass(bloom)

      // ── BACKGROUND SHADER ─────────────────────────────────────────────────
      const bgGeo = new THREE.PlaneGeometry(2, 2)
      const bgMat = new THREE.ShaderMaterial({
        vertexShader: BG_VERT,
        fragmentShader: BG_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        depthWrite: false,
        depthTest: false,
      })
      const bgMesh = new THREE.Mesh(bgGeo, bgMat)
      bgMesh.frustumCulled = false
      bgMesh.renderOrder = -1

      // Background renders in a separate orthographic camera pass (screen-space)
      const bgScene = new THREE.Scene()
      const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      bgScene.add(bgMesh)

      // ── MATERIAL LIBRARY ──────────────────────────────────────────────────
      const woodMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#181A27'),
        specular: new THREE.Color('#2040C0'),
        shininess: 180,
      })
      const woodMatFg = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#14162A'),
        specular: new THREE.Color('#3050D0'),
        shininess: 280,
      })
      const woodMatFar = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#0E0F1A'),
        specular: new THREE.Color('#1530A0'),
        shininess: 80,
        transparent: true,
        opacity: 0.7,
      })
      const floorMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#080910'),
        roughness: 0.94,
        metalness: 0.04,
      })
      const fixtureMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#2A2B35'),
        shininess: 60,
      })

      // ── FLOOR PLANE ───────────────────────────────────────────────────────
      const floorGeo = new THREE.PlaneGeometry(500, 500)
      const floor = new THREE.Mesh(floorGeo, floorMat)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = 0
      scene.add(floor)

      // Floor grid (control joints — 4-unit cells)
      const gridLines: number[] = []
      const gridExtent = 200
      const gridStep = 4
      for (let x = -gridExtent; x <= gridExtent; x += gridStep) {
        gridLines.push(x, 0.05, -gridExtent, x, 0.05, gridExtent)
      }
      for (let z = -gridExtent; z <= gridExtent; z += gridStep) {
        gridLines.push(-gridExtent, 0.05, z, gridExtent, 0.05, z)
      }
      const gridGeo = new THREE.BufferGeometry()
      gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridLines, 3))
      const gridMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#131420'),
        transparent: true,
        opacity: 0.38,
      })
      scene.add(new THREE.LineSegments(gridGeo, gridMat))

      // ── STRUCTURAL FRAME ──────────────────────────────────────────────────
      const structuralGroup = new THREE.Group()

      // Studs — 14 mid-frame
      const studGeo = new THREE.BoxGeometry(0.25, 40, 0.125)
      for (let i = 0; i < 14; i++) {
        const stud = new THREE.Mesh(studGeo, woodMat)
        stud.position.set(
          -9.33 + i * 1.333,
          20,
          -80 - (i % 3) * 13.33
        )
        structuralGroup.add(stud)
      }

      // Top plates (double)
      const plateGeo = new THREE.BoxGeometry(42, 0.25, 0.375)
      const topPlate1 = new THREE.Mesh(plateGeo, woodMat)
      topPlate1.position.set(0, 40, -90)
      structuralGroup.add(topPlate1)
      const topPlate2 = new THREE.Mesh(plateGeo, woodMat)
      topPlate2.position.set(0, 40.25, -90)
      structuralGroup.add(topPlate2)

      // Bottom plate
      const bottomPlate = new THREE.Mesh(plateGeo, woodMat)
      bottomPlate.position.set(0, 0.125, -90)
      structuralGroup.add(bottomPlate)

      // Ridge beam
      const ridgeGeo = new THREE.BoxGeometry(64, 1.75, 2.5)
      const ridge = new THREE.Mesh(ridgeGeo, woodMat)
      ridge.position.set(0, 44, -90)
      structuralGroup.add(ridge)

      // Ceiling joists — 8
      const joistGeo = new THREE.BoxGeometry(0.25, 0.125, 18)
      for (let i = 0; i < 8; i++) {
        const joist = new THREE.Mesh(joistGeo, woodMat)
        joist.position.set(-5.25 + i * 1.5, 38, -85)
        structuralGroup.add(joist)
      }

      // Header beams
      const headerGeo = new THREE.BoxGeometry(8, 1.5, 0.5)
      const headerPositions = [[-10, 26, -85], [0, 26, -95], [10, 26, -80]] as const
      headerPositions.forEach(([x, y, z]) => {
        const h = new THREE.Mesh(headerGeo, woodMat)
        h.position.set(x, y, z)
        structuralGroup.add(h)
      })

      // Foreground posts (4) — flanking the camera view
      const postGeo = new THREE.BoxGeometry(0.5, 40, 0.5)
      const postPositions = [[-18, 20, -28], [18, 20, -28], [-18, 20, -32], [18, 20, -32]] as const
      postPositions.forEach(([x, y, z]) => {
        const post = new THREE.Mesh(postGeo, woodMatFg)
        post.position.set(x, y, z)
        structuralGroup.add(post)
      })

      // Foreground post base (anchor bolt standoffs)
      const standoffGeo = new THREE.BoxGeometry(0.5, 2, 0.5)
      const standoffMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#1A1B28'),
        shininess: 40,
        metalness: 0.6,
      } as THREE.MeshPhongMaterialParameters)
      postPositions.forEach(([x, , z]) => {
        const so = new THREE.Mesh(standoffGeo, standoffMat)
        so.position.set(x, 1, z)
        structuralGroup.add(so)
      })

      // Far frame — LineSegments (barely visible at z: -240)
      const farFrameLines: number[] = []
      for (let i = 0; i < 16; i++) {
        const fx = -12 + i * 1.6
        farFrameLines.push(fx, 0, -240, fx, 40, -240)
      }
      farFrameLines.push(-12, 0, -240, 12, 0, -240)
      farFrameLines.push(-12, 40, -240, 12, 40, -240)
      farFrameLines.push(-12, 8, -240, 12, 8, -240)
      farFrameLines.push(-12, 24, -240, 12, 24, -240)

      const farGeo = new THREE.BufferGeometry()
      farGeo.setAttribute('position', new THREE.Float32BufferAttribute(farFrameLines, 3))
      const farMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#1B1C2B'),
        transparent: true,
        opacity: 0.07,
      })
      structuralGroup.add(new THREE.LineSegments(farGeo, farMat))

      // Glulam beams in the far section (z: -160 area)
      const glulamGeo = new THREE.BoxGeometry(3.5, 1.8, 0.5)
      const glulamPositions = [[-15, 42, -165], [0, 42, -170], [15, 42, -160]] as const
      glulamPositions.forEach(([x, y, z]) => {
        const gl = new THREE.Mesh(glulamGeo, woodMatFar)
        gl.position.set(x, y, z)
        structuralGroup.add(gl)
      })

      scene.add(structuralGroup)

      // ── WORK LIGHTS ───────────────────────────────────────────────────────
      const lightGroup = new THREE.Group()
      const workLightPositions = [
        [-24, 41, -60],
        [-10, 41, -80],
        [4,   41, -70],
        [18,  41, -65],
        [32,  41, -90],
      ] as const

      const spotLights: THREE.SpotLight[] = []

      workLightPositions.forEach(([x, y, z], i) => {
        // Fixture housing
        const housingGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 8)
        const housing = new THREE.Mesh(housingGeo, fixtureMat)
        housing.position.set(x, y + 0.4, z)
        lightGroup.add(housing)

        // Cord
        const cordGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 4)
        const cord = new THREE.Mesh(cordGeo, fixtureMat)
        cord.position.set(x, y + 1.1, z)
        lightGroup.add(cord)

        // Emissive face (bloom source)
        const faceGeo = new THREE.CircleGeometry(0.38, 12)
        const faceMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#FFF8D0'),
        })
        const face = new THREE.Mesh(faceGeo, faceMat)
        face.rotation.x = Math.PI / 2
        face.position.set(x, y + 0.02, z)
        lightGroup.add(face)

        // SpotLight
        const spot = new THREE.SpotLight(
          new THREE.Color(0xFFD080),
          0.42,
          65,
          Math.PI / 5,
          0.35,
          2
        )
        spot.position.set(x, y, z)
        spot.target.position.set(x, 0, z)
        lightGroup.add(spot)
        lightGroup.add(spot.target)
        spotLights.push(spot)

        // Phase offset for sway animation
        spot.userData.swayPhase = i * 1.26 + Math.random() * 1.0
        spot.userData.swayFreq = 0.28 + Math.random() * 0.15 // rad/s
        spot.userData.swayAmplitude = 1.2 * (Math.PI / 180) // degrees to radians
        housing.userData.swayPhase = spot.userData.swayPhase
        housing.userData.swayFreq = spot.userData.swayFreq
      })

      // Blue accent point light — forward in the scene
      const blueAccent = new THREE.PointLight(new THREE.Color('#2F7EFF'), 0.55, 200, 2)
      blueAccent.position.set(8, 20, -80)
      scene.add(blueAccent)

      // Secondary blue accent (forward, fades in at scroll 0.25)
      const blueAccent2 = new THREE.PointLight(new THREE.Color('#2F7EFF'), 0, 200, 2)
      blueAccent2.position.set(-20, 18, -180)
      scene.add(blueAccent2)

      // Ambient
      const ambient = new THREE.AmbientLight(new THREE.Color('#0A0C18'), 0.08)
      scene.add(ambient)

      // Overhead directional (moonlight — fades in during aerial section)
      const overhead = new THREE.DirectionalLight(new THREE.Color('#C8D8F0'), 0)
      overhead.position.set(0, 200, 0)
      overhead.target.position.set(0, 0, 0)
      scene.add(overhead)
      scene.add(overhead.target)

      scene.add(lightGroup)

      // ── HOLOGRAPHIC ELEMENTS ──────────────────────────────────────────────

      const holoGroup = new THREE.Group()

      function makeHoloPlane(
        canvas: HTMLCanvasElement,
        w: number, h: number,
        pos: [number,number,number],
        rotY: number, rotX: number,
        baseOpacity: number
      ): THREE.Mesh {
        const geo = new THREE.PlaneGeometry(w, h)
        const tex = new THREE.CanvasTexture(canvas)

        // Glow backing plane (slightly larger, very low opacity)
        const backingMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.04,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
        const backingGeo = new THREE.PlaneGeometry(w * 1.06, h * 1.06)
        const backing = new THREE.Mesh(backingGeo, backingMat)

        const mat = new THREE.ShaderMaterial({
          vertexShader: HOLO_VERT,
          fragmentShader: HOLO_FRAG,
          uniforms: {
            uTime: { value: 0 },
            uTexture: { value: tex },
            uOpacity: { value: baseOpacity },
          },
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })

        const mesh = new THREE.Mesh(geo, mat)
        mesh.add(backing)
        mesh.position.set(...pos)
        mesh.rotation.y = rotY * (Math.PI / 180)
        mesh.rotation.x = rotX * (Math.PI / 180)

        // Oscillation params
        mesh.userData.oscY = { phase: Math.random() * Math.PI * 2, freq: 0.08 + Math.random() * 0.04, amp: 1.2 }
        mesh.userData.oscRotY = { phase: Math.random() * Math.PI * 2, freq: 0.065 + Math.random() * 0.03, amp: 2.0 * (Math.PI / 180) }

        return mesh
      }

      // Element 1: Site Plan
      const sitePlanCanvas = createSitePlanTexture()
      const sitePlan = makeHoloPlane(sitePlanCanvas, 22, 16, [-11, 10, -42], 14, -4, 0.22)
      holoGroup.add(sitePlan)

      // Element 3: Dashboard
      const dashCanvas = createDashboardTexture()
      const dashboard = makeHoloPlane(dashCanvas, 30, 18, [8, 13, -58], -18, 0, 0.28)
      dashboard.userData.opacity = { base: 0.0, target: 0.28 } // fades in at scroll 0.25
      holoGroup.add(dashboard)

      // Element 4: Process Flow
      const procCanvas = createProcessFlowTexture()
      const processFlow = makeHoloPlane(procCanvas, 14, 26, [-5, 18, -65], 8, 5, 0.22)
      processFlow.userData.opacity = { base: 0.0, target: 0.22 }
      holoGroup.add(processFlow)

      // Second site plan (elevation drawing)
      const elev = createSitePlanTexture() // simplified: reuse canvas but we'll add differentiation
      const elevation = makeHoloPlane(elev, 20, 14, [-14, 12, -75], 5, -2, 0.16)
      elevation.userData.opacity = { base: 0.0, target: 0.16 }
      holoGroup.add(elevation)

      // ── MEASUREMENT ANNOTATION LINES ─────────────────────────────────────
      const annotationLines: number[] = []
      const annotations = [
        { x1: -9, z1: -75, x2: 9,  z2: -75, y: 6 },
        { x1: -12, z1: -55, x2: -4, z2: -55, y: 14 },
        { x1: 4,  z1: -85, x2: 12, z2: -85, y: 10 },
        { x1: -6, z1: -95, x2: 6,  z2: -95, y: 18 },
        { x1: -15, z1: -65, x2: -8, z2: -65, y: 22 },
        { x1: 8,  z1: -100, x2: 16, z2: -100, y: 8 },
        { x1: -3, z1: -110, x2: 10, z2: -110, y: 28 },
        { x1: -18, z1: -80, x2: -8, z2: -80, y: 32 },
        { x1: 12, z1: -70, x2: 20, z2: -70, y: 16 },
        { x1: -5, z1: -120, x2: 8,  z2: -120, y: 12 },
        { x1: -20, z1: -50, x2: -14, z2: -50, y: 24 },
      ]

      annotations.forEach(a => {
        // Main dimension line
        annotationLines.push(a.x1, a.y, a.z1, a.x2, a.y, a.z2)
        // End ticks
        annotationLines.push(a.x1, a.y - 0.3, a.z1, a.x1, a.y + 0.3, a.z1)
        annotationLines.push(a.x2, a.y - 0.3, a.z2, a.x2, a.y + 0.3, a.z2)
      })

      const annoGeo = new THREE.BufferGeometry()
      annoGeo.setAttribute('position', new THREE.Float32BufferAttribute(annotationLines, 3))
      const annoMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#2F7EFF'),
        transparent: true,
        opacity: 0.18,
      })
      const annoMesh = new THREE.LineSegments(annoGeo, annoMat)
      holoGroup.add(annoMesh)

      // Annotation cluster oscillation
      annoMesh.userData.oscRotY = { phase: 0.3, freq: 0.018, amp: 0.5 * (Math.PI / 180) }

      // ── STRUCTURAL ANALYSIS PULSE LINES ──────────────────────────────────
      const pulseLines: number[] = []
      const pulsePhases: number[] = []

      // Trace along studs
      for (let i = 0; i < 14; i++) {
        const x = -9.33 + i * 1.333
        const z = -80 - (i % 3) * 13.33
        const segments = 8
        for (let s = 0; s < segments; s++) {
          const y1 = (s / segments) * 40
          const y2 = ((s + 1) / segments) * 40
          pulseLines.push(x, y1, z, x, y2, z)
          pulsePhases.push(s / segments, (s + 1) / segments)
        }
      }
      // Trace along top plate
      for (let i = 0; i < 20; i++) {
        const x1 = -10 + i * 1
        const x2 = x1 + 1
        pulseLines.push(x1, 40, -90, x2, 40, -90)
        pulsePhases.push(0.5 + (i / 20) * 0.5, 0.5 + ((i + 1) / 20) * 0.5)
      }

      const pulseGeo = new THREE.BufferGeometry()
      pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute(pulseLines, 3))
      pulseGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(pulsePhases, 1))

      const pulseMat = new THREE.ShaderMaterial({
        vertexShader: PULSE_LINE_VERT,
        fragmentShader: PULSE_LINE_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uBaseOpacity: { value: 0.05 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      holoGroup.add(new THREE.LineSegments(pulseGeo, pulseMat))

      // Connection node points
      const nodePositions: number[] = []
      for (let i = 0; i < 14; i++) {
        nodePositions.push(-9.33 + i * 1.333, 0, -80 - (i % 3) * 13.33)    // base
        nodePositions.push(-9.33 + i * 1.333, 40, -80 - (i % 3) * 13.33)   // top
        nodePositions.push(-9.33 + i * 1.333, 26, -80 - (i % 3) * 13.33)   // header
      }

      const nodeGeo = new THREE.BufferGeometry()
      nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3))
      const nodeMat = new THREE.PointsMaterial({
        color: new THREE.Color('#2F7EFF'),
        size: 0.18,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
      holoGroup.add(new THREE.Points(nodeGeo, nodeMat))

      scene.add(holoGroup)

      // ── SURVEY STAKE MARKERS (Chapter 4 — Testimonials) ───────────────────
      const stakeGroup = new THREE.Group()
      stakeGroup.visible = false

      const stakePositions = [
        [-50, 0, -242], [-46, 0, -258], [-40, 0, -245],
        [-35, 0, -252], [-54, 0, -256], [-44, 0, -265],
        [-38, 0, -238], [-56, 0, -248],
      ] as const

      const stakeLineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#FFD080'),
        transparent: true,
        opacity: 0,
      })

      stakePositions.forEach(([x, , z]) => {
        const stakeLines = [x, 0.2, z, x, 1.4, z]
        const sg = new THREE.BufferGeometry()
        sg.setAttribute('position', new THREE.Float32BufferAttribute(stakeLines, 3))
        stakeGroup.add(new THREE.LineSegments(sg, stakeLineMat.clone()))

        const dotGeo = new THREE.BufferGeometry()
        dotGeo.setAttribute('position', new THREE.Float32BufferAttribute([x, 1.4, z], 3))
        const dotMat = new THREE.PointsMaterial({
          color: new THREE.Color('#FFD080'),
          size: 0.25,
          transparent: true,
          opacity: 0,
        })
        stakeGroup.add(new THREE.Points(dotGeo, dotMat))
      })

      scene.add(stakeGroup)

      // ── ATMOSPHERIC PARTICLES ──────────────────────────────────────────────
      const PARTICLE_COUNT = 200

      const pPositions = new Float32Array(PARTICLE_COUNT * 3)
      const pSizes = new Float32Array(PARTICLE_COUNT)
      const pOpacities = new Float32Array(PARTICLE_COUNT)
      const pVelocities: [number, number, number][] = []

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPositions[i*3]   = (Math.random() - 0.5) * 80
        pPositions[i*3+1] = Math.random() * 50
        pPositions[i*3+2] = (Math.random() - 0.5) * 80 - 60
        pSizes[i] = 0.4 + Math.random() * 1.4
        pOpacities[i] = 0.008 + Math.random() * 0.014
        pVelocities.push([
          (Math.random() - 0.5) * 0.003,
          0.001 + Math.random() * 0.002,
          (Math.random() - 0.5) * 0.001,
        ])
      }

      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
      particleGeo.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1))
      particleGeo.setAttribute('aOpacity', new THREE.BufferAttribute(pOpacities, 1))

      const particleMat = new THREE.ShaderMaterial({
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        uniforms: {
          uTime: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)

      // ── RESIZE HANDLER ────────────────────────────────────────────────────
      const onResize = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        composer.setSize(w, h);
        (bgMat.uniforms.uResolution.value as THREE.Vector2).set(w, h)
      }
      window.addEventListener('resize', onResize)

      // ── ANIMATION LOOP ────────────────────────────────────────────────────
      let prevTime = performance.now()

      const animate = () => {
        if (destroyed) return
        rafRef.current = requestAnimationFrame(animate)

        const now = performance.now()
        const dt = (now - prevTime) / 1000 // seconds
        prevTime = now
        const elapsed = now / 1000

        const progress = scrollState.progress
        const { from, to, t: envT } = getEnvChapter(progress)

        // ── Update camera from scroll ──────────────────────────────────────
        const { pos, lookAt, fov } = getCameraState(progress)

        // Mouse tilt (subtle, adds depth sensation)
        const targetTiltX = mouseState.y * 1.5
        const targetTiltY = mouseState.x * 1.5
        camProxy.tiltX += (targetTiltX - camProxy.tiltX) * 0.05
        camProxy.tiltY += (targetTiltY - camProxy.tiltY) * 0.05

        camera.position.set(pos[0], pos[1], pos[2])
        camera.lookAt(
          lookAt[0] + camProxy.tiltY * 2,
          lookAt[1] + camProxy.tiltX * 1.5,
          lookAt[2]
        )
        if (Math.abs(camera.fov - fov) > 0.05) {
          camera.fov += (fov - camera.fov) * 0.04
          camera.updateProjectionMatrix()
        }

        // ── Background shader time ─────────────────────────────────────────
        bgMat.uniforms.uTime.value = elapsed

        // ── Holographic shader time ────────────────────────────────────────
        holoGroup.children.forEach(child => {
          const mat = (child as THREE.Mesh).material
          if (mat instanceof THREE.ShaderMaterial && mat.uniforms.uTime) {
            mat.uniforms.uTime.value = elapsed
          }
          // Update children (backing planes)
          ;(child as THREE.Mesh).children?.forEach(c => {
            const cm = (c as THREE.Mesh).material
            if (cm instanceof THREE.ShaderMaterial && cm.uniforms.uTime) {
              cm.uniforms.uTime.value = elapsed
            }
          })
        })

        // ── Pulse line shader time ─────────────────────────────────────────
        pulseMat.uniforms.uTime.value = elapsed

        // ── Particle shader time ───────────────────────────────────────────
        particleMat.uniforms.uTime.value = elapsed

        // ── Particle movement ──────────────────────────────────────────────
        const speedMult = lerp(from.particleSpeedMult, to.particleSpeedMult, envT)
        const pPos = particleGeo.attributes.position
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          pPos.setXYZ(
            i,
            pPos.getX(i) + pVelocities[i][0] * speedMult,
            pPos.getY(i) + pVelocities[i][1] * speedMult * (1 + progress * 0.3),
            pPos.getZ(i) + pVelocities[i][2] * speedMult
          )
          // Wrap particles vertically
          if (pPos.getY(i) > 55) {
            pPos.setY(i, -2)
            pPos.setX(i, (Math.random() - 0.5) * 80)
          }
        }
        pPos.needsUpdate = true

        // ── Work light sway ───────────────────────────────────────────────
        const envIntensity = lerp(from.workLightIntensity, to.workLightIntensity, envT)
        const envColorR = lerp(from.workLightColor[0], to.workLightColor[0], envT)
        const envColorG = lerp(from.workLightColor[1], to.workLightColor[1], envT)
        const envColorB = lerp(from.workLightColor[2], to.workLightColor[2], envT)

        spotLights.forEach((spot) => {
          const { swayPhase, swayFreq, swayAmplitude } = spot.userData as {
            swayPhase: number
            swayFreq: number
            swayAmplitude: number
          }
          const sway = Math.sin(elapsed * swayFreq + swayPhase) * swayAmplitude
          spot.target.position.x = spot.position.x + Math.sin(sway) * 3
          spot.target.updateMatrixWorld()
          spot.intensity = envIntensity
          spot.color.setRGB(envColorR, envColorG, envColorB)
        })

        // ── Blue accent intensity ──────────────────────────────────────────
        const blueIntensity = lerp(from.blueAccentIntensity, to.blueAccentIntensity, envT)
        blueAccent.intensity = blueIntensity
        blueAccent2.intensity = progress > 0.25 ? lerp(0, 0.40, clamp((progress - 0.25) / 0.1, 0, 1)) : 0

        // ── Overhead moonlight (aerial section, progress 0.5-0.75) ─────────
        if (progress > 0.62 && progress < 0.81) {
          const t = clamp((progress - 0.62) / 0.09, 0, 1)
          const t2 = clamp((0.81 - progress) / 0.06, 0, 1)
          overhead.intensity = 0.16 * Math.min(t, t2)
        } else {
          overhead.intensity = 0
        }

        // ── Fog density ───────────────────────────────────────────────────
        const targetFog = lerp(from.fogDensity, to.fogDensity, envT)
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.density += (targetFog - scene.fog.density) * 0.02
        }

        // ── Holographic opacity transitions ───────────────────────────────
        const dashOp = progress > 0.25 ? clamp((progress - 0.25) / 0.05, 0, 1) * 0.28 : 0
        const dashMat = (dashboard.material as THREE.ShaderMaterial)
        if (dashMat.uniforms.uOpacity) dashMat.uniforms.uOpacity.value = dashOp

        const procOp = progress > 0.28 ? clamp((progress - 0.28) / 0.05, 0, 1) * 0.22 : 0
        const procMat = (processFlow.material as THREE.ShaderMaterial)
        if (procMat.uniforms.uOpacity) procMat.uniforms.uOpacity.value = procOp

        // ── Holographic plane ambient oscillation ─────────────────────────
        holoGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.userData.oscY) {
            const oscY = child.userData.oscY as { phase: number; freq: number; amp: number }
            child.position.y += Math.sin(elapsed * oscY.freq + oscY.phase) * oscY.amp * dt * 0.5
          }
          if (child instanceof THREE.Mesh && child.userData.oscRotY) {
            const oscRot = child.userData.oscRotY as { phase: number; freq: number; amp: number }
            child.rotation.y = child.userData.baseRotY
              ? child.userData.baseRotY + Math.sin(elapsed * oscRot.freq + oscRot.phase) * oscRot.amp
              : child.rotation.y + Math.sin(elapsed * oscRot.freq + oscRot.phase) * oscRot.amp * dt
          }
        })

        // ── Survey stakes (Testimonials chapter) ──────────────────────────
        if (progress > 0.78) {
          const stakeT = clamp((progress - 0.78) / 0.04, 0, 1)
          stakeGroup.visible = stakeT > 0
          stakeGroup.children.forEach(child => {
            if (child instanceof THREE.LineSegments) {
              ;(child.material as THREE.LineBasicMaterial).opacity = stakeT * 0.55
            }
            if (child instanceof THREE.Points) {
              ;(child.material as THREE.PointsMaterial).opacity = stakeT * 0.5
            }
          })
        } else {
          stakeGroup.visible = false
        }

        // ── Red floor ring (Pricing section — scroll ~0.88) ───────────────
        // (handled via a separate thin ring geometry we add dynamically)

        // ── Render ────────────────────────────────────────────────────────
        // Render background first (no depth test)
        renderer.autoClear = false
        renderer.clear()
        renderer.render(bgScene, bgCamera)

        // Render main scene via composer (bloom)
        composer.render()
      }

      animate()

      // Cleanup
      return () => {
        destroyed = true
        cancelAnimationFrame(rafRef.current)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        mount.removeChild(renderer.domElement)

        // Dispose geometries and materials
        scene.traverse(obj => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose()
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })
      }
    }

    const cleanup = init()

    return () => {
      destroyed = true
      cleanup.then(fn => fn?.())
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="world-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
