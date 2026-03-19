"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

// ─────────────────────────────────────────────────────────────────
// WebGL: reactive signal grid with ripple, mouse glow, noise energy
// ─────────────────────────────────────────────────────────────────
function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vert = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;
    const frag = `
precision highp float;
uniform vec2 u_res; uniform vec2 u_mouse; uniform float u_time; uniform vec2 u_click;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}

float grid(vec2 uv, float size){
  vec2 g = abs(fract(uv/size - 0.5) - 0.5) / fwidth(uv/size);
  return 1.0 - min(min(g.x,g.y), 1.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 asp = vec2(uv.x*ar, uv.y);

  // Fine grid + coarse grid
  float g1 = grid(asp, 0.045) * 0.8;
  float g2 = grid(asp, 0.225) * 2.0;

  // Mouse distance (in aspect-corrected space)
  vec2 m = vec2(u_mouse.x*ar, u_mouse.y);
  float md = length(asp - m);

  // Glow from mouse
  float glow = 0.09 / (md * md + 0.05);

  // Click ripple
  vec2 cm = vec2(u_click.x*ar, u_click.y);
  float cd = length(asp - cm);
  float age = mod(u_time, 10.0);
  float ripple = max(0.0, 0.18 * sin((cd - age*0.7)*20.0) * exp(-cd*3.0) * exp(-age*0.8));

  // Animated energy noise
  float n1 = noise(asp*5.0 + vec2(u_time*0.18, u_time*0.11));
  float n2 = noise(asp*12.0 - vec2(u_time*0.13, u_time*0.22));
  float energy = n1 * n2 * 0.06;

  // Pulse wave from center
  float cDist = length(asp - vec2(ar*0.5, 0.5));
  float pulse = abs(sin(cDist*15.0 - u_time*1.8)) * exp(-cDist*3.5) * 0.05;

  // Scanning line
  float scanY = mod(u_time*0.12, 1.0);
  float scan = exp(-abs(uv.y - scanY)*80.0) * 0.04;

  // Vignette
  vec2 vig = uv - 0.5;
  float v = 1.0 - dot(vig*1.7, vig*1.7);
  v = clamp(v, 0.0, 1.0);

  float I = (g1*0.03 + g2*0.09 + glow*0.14 + ripple + energy + pulse + scan) * v;
  vec3 col = vec3(0.0, 0.898, 1.0) * I;
  gl_FragColor = vec4(col, I*1.1);
}`;

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uClick = gl.getUniformLocation(prog, "u_click");

    const mouse = { x: 0.5, y: 0.5 };
    const click = { x: 0.5, y: 0.5 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    const onClick = (e: MouseEvent) => {
      click.x = e.clientX / window.innerWidth;
      click.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    let raf: number;
    const draw = (t: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, 1 - mouse.y);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform2f(uClick, click.x, 1 - click.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none",
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────
// Three.js: Rotating wireframe icosahedron + particle field
// ─────────────────────────────────────────────────────────────────
function ThreeGeo() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cleanup: (() => void) | undefined;

    import("three").then((THREE) => {
      const W = mount.offsetWidth, H = mount.offsetHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      camera.position.z = 3.2;

      // Main icosahedron wire
      const icoGeo = new THREE.IcosahedronGeometry(1, 1);
      const edgeGeo = new THREE.EdgesGeometry(icoGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.4 });
      const wire = new THREE.LineSegments(edgeGeo, wireMat);
      scene.add(wire);

      // Inner glow fill
      const fillMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.03, side: THREE.BackSide });
      scene.add(new THREE.Mesh(icoGeo, fillMat));

      // Outer cage
      const outerGeo = new THREE.IcosahedronGeometry(1.45, 0);
      const outerEdge = new THREE.EdgesGeometry(outerGeo);
      const outerMat = new THREE.LineBasicMaterial({ color: 0xFF4500, transparent: true, opacity: 0.12 });
      const outerWire = new THREE.LineSegments(outerEdge, outerMat);
      scene.add(outerWire);

      // Particle system
      const pCount = 180;
      const pPositions = new Float32Array(pCount * 3);
      const pSpeeds = new Float32Array(pCount);
      for (let i = 0; i < pCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.6 + Math.random() * 1.2;
        pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pPositions[i * 3 + 2] = r * Math.cos(phi);
        pSpeeds[i] = 0.3 + Math.random() * 0.7;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({ color: 0x00E5FF, size: 0.025, transparent: true, opacity: 0.5 });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      let mx = 0, my = 0;
      const onMove = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      let raf: number;
      const animate = (t: number) => {
        raf = requestAnimationFrame(animate);
        const time = t / 1000;
        wire.rotation.x = time * 0.11 + my * 0.18;
        wire.rotation.y = time * 0.17 + mx * 0.18;
        outerWire.rotation.x = -time * 0.08 + my * 0.1;
        outerWire.rotation.y = -time * 0.13 + mx * 0.1;
        particles.rotation.y = time * 0.05;
        particles.rotation.x = time * 0.03;
        wireMat.opacity = 0.32 + Math.sin(time * 0.9) * 0.12;
        pMat.opacity = 0.4 + Math.sin(time * 1.2) * 0.15;

        // Pulse outer cage
        outerMat.opacity = 0.08 + Math.abs(Math.sin(time * 0.5)) * 0.1;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(animate);

      const ro = new ResizeObserver(() => {
        const w = mount.offsetWidth, h = mount.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      ro.observe(mount);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        ro.disconnect();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    });

    return () => cleanup?.();
  }, []);

  return (
    <div ref={mountRef} style={{
      position: "absolute", right: "-8%", top: "48%",
      transform: "translateY(-50%)",
      width: "min(54vw, 680px)", height: "min(54vw, 680px)",
      pointerEvents: "none",
    }} className="mob-hide" />
  );
}

// ─────────────────────────────────────────────────────────────────
// Chromatic aberration text on hover
// ─────────────────────────────────────────────────────────────────
function ChromaText({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", display: "inline-block", ...style }}
      className={className}
    >
      {/* Red channel offset */}
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0,
        color: "rgba(255,50,50,0.6)",
        transform: hov ? "translate(-2px, 0)" : "translate(0,0)",
        transition: "transform 0.15s ease",
        pointerEvents: "none",
      }}>{children}</span>
      {/* Blue channel offset */}
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0,
        color: "rgba(0,150,255,0.6)",
        transform: hov ? "translate(2px, 0)" : "translate(0,0)",
        transition: "transform 0.15s ease",
        pointerEvents: "none",
      }}>{children}</span>
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// Scramble eyebrow
// ─────────────────────────────────────────────────────────────────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▲◆■○×";
function ScrambleText({ text, run }: { text: string; run: boolean }) {
  const [chars, setChars] = useState(text.split("").map(c => ({ c, done: false })));

  useEffect(() => {
    if (!run) return;
    let raf: number;
    const t0 = performance.now();
    const STAGGER = 38, CYCLE = 520;
    const tick = () => {
      const now = performance.now() - t0;
      setChars(text.split("").map((final, i) => {
        const s = i * STAGGER, e = s + CYCLE;
        if (now < s) return { c: " ", done: false };
        if (now >= e) return { c: final, done: true };
        return { c: final === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false };
      }));
      if (now < (text.length - 1) * STAGGER + CYCLE + 50) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, text]);

  return (
    <span>
      {chars.map((g, i) => (
        <span key={i} style={{
          color: g.done ? "var(--accent)" : "rgba(0,229,255,0.35)",
          fontFamily: "'Space Mono', monospace",
          display: "inline-block",
          minWidth: g.c === " " ? "0.3em" : undefined,
        }}>{g.c}</span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// Headline — big clip-reveal like Alche/Antonsson
// ─────────────────────────────────────────────────────────────────
function BigLine({ text, delay, run, outline }: { text: string; delay: number; run: boolean; outline?: boolean }) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 0.92 }}>
      <motion.div
        initial={{ y: "105%", skewY: 2 }}
        animate={run ? { y: "0%", skewY: 0 } : {}}
        transition={{ delay, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="h-xl"
        style={{
          display: "block",
          color: outline ? "transparent" : "#fff",
          WebkitTextStroke: outline ? "1px rgba(0,229,255,0.3)" : undefined,
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Hero
// ─────────────────────────────────────────────────────────────────
export default function Hero({ ready }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const [run, setRun] = useState(false);

  useMagneticEffect(btn1Ref, 0.42);
  useMagneticEffect(btn2Ref, 0.32);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (ready) setTimeout(() => setRun(true), 60);
  }, [ready]);

  const slots = brand.availability.slotsTotal - brand.availability.slotsTaken;

  return (
    <section ref={sectionRef} id="hero" style={{
      position: "relative", minHeight: "100svh",
      display: "flex", alignItems: "center",
      overflow: "hidden", background: "#000",
    }}>
      {/* WebGL shader background */}
      <SignalCanvas />

      {/* Three.js rotating geometry — right */}
      <ThreeGeo />

      {/* Dark gradient fade at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Left edge accent line */}
      <motion.div
        initial={{ scaleY: 0 }} animate={run ? { scaleY: 1 } : {}}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", left: 0, top: "15%", bottom: "15%",
          width: 1, background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.25), transparent)",
          transformOrigin: "top",
        }}
      />

      {/* System readout top-right (Alche-style data overlay) */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={run ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.5, duration: 0.7 }}
        style={{
          position: "absolute", top: 80, right: "clamp(20px,4vw,64px)", zIndex: 3,
          display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end",
        }}
        className="mob-hide"
      >
        {[
          { label: "SYS.ONLINE", val: "", accent: true },
          { label: "CLIENTS", val: `${brand.stats.projects}+` },
          { label: "SLOTS OPEN", val: `${slots}` },
          { label: "AVG.LAUNCH", val: "48HRS" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {row.accent && <div style={{
              width: 5, height: 5, borderRadius: "50%", background: "#00E5FF",
              animation: "pulse-dot 2s ease-in-out infinite", flexShrink: 0,
            }} />}
            {row.val && <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9,
              letterSpacing: "0.14em", color: "#fff",
            }}>{row.val}</span>}
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 8,
              letterSpacing: "0.14em", color: row.accent ? "#00E5FF" : "#1a1a1a",
            }}>{row.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Corner brackets */}
      {[
        { style: { top: 0, left: 0 }, bt: true, bl: true },
        { style: { top: 0, right: 0 }, bt: true, br: true },
        { style: { bottom: 0, left: 0 }, bb: true, bl: true },
        { style: { bottom: 0, right: 0 }, bb: true, br: true },
      ].map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 + i * 0.05, duration: 0.6 }}
          style={{
            position: "absolute", width: 18, height: 18,
            ...c.style as object,
            borderTop: (c as any).bt ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderBottom: (c as any).bb ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderLeft: (c as any).bl ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderRight: (c as any).br ? "1px solid rgba(0,229,255,0.2)" : "none",
          }}
        />
      ))}

      {/* Main content — parallax */}
      <motion.div style={{ y: parallaxY, opacity: contentOpacity, position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ padding: "108px clamp(20px,4vw,64px) 80px", maxWidth: 1440, margin: "0 auto" }}>

          {/* Eyebrow scramble */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={run ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}
          >
            <div style={{ width: 28, height: 1, background: "#00E5FF", opacity: 0.4 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: "#444" }}>
              <ScrambleText text={brand.hero.eyebrow} run={run} />
            </span>
          </motion.div>

          {/* Massive headline — clip reveal */}
          <div style={{ maxWidth: "min(920px,72vw)", marginBottom: 44 }}>
            {brand.hero.headlineLines.map((line, i) => (
              <BigLine key={i} text={line} delay={0.22 + i * 0.11} run={run} outline={i === 2} />
            ))}
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={run ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.72, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="body"
            style={{ maxWidth: 500, marginBottom: 48, fontSize: "clamp(14px,1.3vw,16px)" }}
          >
            {brand.hero.subtext}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={run ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 64 }}
          >
            <a
              ref={btn1Ref}
              href="#contact"
              onClick={e => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn btn-fill"
              data-cursor="BOOK"
            >
              {brand.hero.ctaPrimary} →
            </a>
            <a
              ref={btn2Ref}
              href="#results"
              onClick={e => { e.preventDefault(); document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn btn-ghost"
              data-cursor="VIEW"
            >
              {brand.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={run ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}
          >
            {["⚡ 48-HOUR LAUNCH", "🔒 MONTH-TO-MONTH", "✓ VA LLC EST. 2024"].map((b, i) => (
              <span key={i} style={{
                fontFamily: "'Space Mono', monospace", fontSize: 8,
                letterSpacing: "0.14em", color: "#222",
              }}>{b}</span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={run ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3,
          cursor: "none",
        }}
        onClick={() => document.querySelector("#marquee")?.scrollIntoView({ behavior: "smooth" })}
        data-cursor=""
      >
        <div style={{
          width: 1, height: 52,
          background: "linear-gradient(to bottom, rgba(0,229,255,0.4), transparent)",
          animation: "scrollPulse 2.2s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 7,
          letterSpacing: "0.2em", color: "#222",
        }}>SCROLL</span>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
        animate={run ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ delay: 1.35, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          position: "absolute", right: "clamp(20px,4vw,64px)", bottom: 80,
          zIndex: 3,
        }}
        className="mob-hide"
      >
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          border: "1px solid rgba(0,229,255,0.2)",
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 26, lineHeight: 1, color: "#fff",
          }}>{brand.stats.projects}</span>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 7,
            letterSpacing: "0.12em", textAlign: "center", color: "#2a2a2a",
          }}>CLIENTS<br />SERVED</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes scrollPulse {
          0%,100%{opacity:0.3;transform:scaleY(1);}
          50%{opacity:0.9;transform:scaleY(0.65);}
        }
      `}</style>
    </section>
  );
}
