"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { B } from "../../lib/brand";

// ── Warm WebGL mesh background ────────────────────────────────────
function WarmMesh() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
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

    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
    const fs = `
precision highp float;
uniform vec2 u_res; uniform float u_t; uniform vec2 u_mouse;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float ar=u_res.x/u_res.y;
  vec2 asp=vec2(uv.x*ar,uv.y);
  
  // Slow organic warm blobs
  float n1=noise(asp*1.8+vec2(u_t*0.08,u_t*0.05));
  float n2=noise(asp*2.4-vec2(u_t*0.06,u_t*0.09));
  float n3=noise(asp*3.2+vec2(u_t*0.04,-u_t*0.07));
  
  // Mouse warm glow
  vec2 m=vec2(u_mouse.x*ar,u_mouse.y);
  float md=length(asp-m);
  float mg=0.06/(md*md+0.08);
  
  // Warm gold tones
  float warmth=(n1*n2*0.6+n3*0.4)*0.09;
  float glow=(n1*0.5+0.5)*0.04;
  
  // Very dark warm palette
  vec3 dark=vec3(0.048,0.043,0.042);
  vec3 warm=vec3(0.2,0.16,0.1);
  vec3 gold=vec3(0.79,0.66,0.49);
  
  vec3 col=mix(dark, warm, warmth);
  col+=gold*mg*0.15;
  col+=gold*glow;
  
  // Vignette
  vec2 v=uv-0.5; float vig=1.0-dot(v*1.4,v*1.4);
  col*=clamp(vig,0.0,1.0);
  
  gl_FragColor=vec4(col,1.0);
}`;

    const mk = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s); gl.compileShader(sh); return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    const draw = (t: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t / 1000);
      gl.uniform2f(uMouse, mouse.x, 1 - mouse.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

// ── Three.js sculptural form ──────────────────────────────────────
function GoldForm() {
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
      renderer.shadowMap.enabled = true;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.z = 3.8;

      // Main sculptural geometry — torus knot (elegant, organic)
      const geoMain = new THREE.TorusKnotGeometry(0.88, 0.26, 180, 20, 2, 3);
      const matMain = new THREE.MeshStandardMaterial({
        color: 0xC9A87C, metalness: 0.82, roughness: 0.18,
        envMapIntensity: 1,
      });
      const mesh = new THREE.Mesh(geoMain, matMain);
      scene.add(mesh);

      // Wireframe overlay for depth
      const geoWire = new THREE.TorusKnotGeometry(0.88, 0.26, 80, 10, 2, 3);
      const matWire = new THREE.MeshBasicMaterial({ color: 0xE2C9A0, wireframe: true, transparent: true, opacity: 0.08 });
      scene.add(new THREE.Mesh(geoWire, matWire));

      // Lighting — warm editorial
      const ambL = new THREE.AmbientLight(0xFFF5E0, 0.4);
      scene.add(ambL);
      const keyL = new THREE.PointLight(0xFFEDD0, 3.5, 12);
      keyL.position.set(2, 3, 2);
      scene.add(keyL);
      const rimL = new THREE.PointLight(0xC9A87C, 1.8, 10);
      rimL.position.set(-3, -1, 1);
      scene.add(rimL);
      const fillL = new THREE.PointLight(0x8B7355, 0.8, 8);
      fillL.position.set(0, -2, -1);
      scene.add(fillL);

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
        mesh.rotation.x = time * 0.09 + my * 0.12;
        mesh.rotation.y = time * 0.14 + mx * 0.12;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(animate);

      const ro = new ResizeObserver(() => {
        const w = mount.offsetWidth, h = mount.offsetHeight;
        renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      });
      ro.observe(mount);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        ro.disconnect(); renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    });
    return () => cleanup?.();
  }, []);

  return (
    <div ref={mountRef} style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", width: "min(52vw,660px)", height: "min(52vw,660px)", pointerEvents: "none" }} className="mob-hide" />
  );
}

// ── Scramble eyebrow ──────────────────────────────────────────────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·×◆";
function Scramble({ text, run }: { text: string; run: boolean }) {
  const [chars, setChars] = useState(text.split("").map(c => ({ c, done: false })));
  useEffect(() => {
    if (!run) return;
    let raf: number;
    const t0 = performance.now();
    const S = 36, C = 480;
    const tick = () => {
      const now = performance.now() - t0;
      setChars(text.split("").map((f, i) => {
        const s = i * S, e = s + C;
        if (now < s) return { c: " ", done: false };
        if (now >= e) return { c: f, done: true };
        return { c: f === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false };
      }));
      if (now < (text.length - 1) * S + C + 50) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, text]);
  return (
    <span>
      {chars.map((g, i) => (
        <span key={i} style={{ color: g.done ? "var(--gold)" : "rgba(201,168,124,0.35)", fontFamily: "var(--mono)", display: "inline-block", minWidth: g.c === " " ? "0.3em" : undefined }}>{g.c}</span>
      ))}
    </span>
  );
}

// ── Headline line reveal ──────────────────────────────────────────
function Line({ text, delay, run, italic }: { text: string; delay: number; run: boolean; italic?: boolean }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        className={italic ? "t-xl-i" : "t-xl"}
        initial={{ y: "108%", skewY: 1.5 }}
        animate={run ? { y: "0%", skewY: 0 } : {}}
        transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "block", color: "var(--t1)" }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────
export default function Hero({ ready }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const op = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => { if (ready) setTimeout(() => setRun(true), 60); }, [ready]);

  const go = (h: string) => document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} id="hero" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--bg)" }}>
      <WarmMesh />
      <GoldForm />

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to bottom, transparent, var(--bg))", pointerEvents: "none", zIndex: 1 }} />

      {/* Corner brackets */}
      {([{s:{top:0,left:0},bt:true,bl:true},{s:{top:0,right:0},bt:true,br:true},{s:{bottom:0,left:0},bb:true,bl:true},{s:{bottom:0,right:0},bb:true,br:true}] as any[]).map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}} transition={{ delay: 1.3 + i * 0.04 }}
          style={{ position: "absolute", width: 18, height: 18, ...c.s, borderTop: c.bt ? "1px solid rgba(201,168,124,0.2)" : "none", borderBottom: c.bb ? "1px solid rgba(201,168,124,0.2)" : "none", borderLeft: c.bl ? "1px solid rgba(201,168,124,0.2)" : "none", borderRight: c.br ? "1px solid rgba(201,168,124,0.2)" : "none" }}
        />
      ))}

      {/* System readout */}
      <motion.div initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
        style={{ position: "absolute", top: 76, right: "clamp(20px,4vw,64px)", zIndex: 3, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }} className="mob-hide">
        {[{ l: "SYS.ONLINE", val: "", dot: true }, { l: "CLIENTS", val: `${B.stats.clients}+` }, { l: "SLOTS OPEN", val: `${B.slots}` }].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {r.dot && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", animation: "badge-pulse 2.5s ease-in-out infinite" }} />}
            {r.val && <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--t1)" }}>{r.val}</span>}
            <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: r.dot ? "var(--gold)" : "var(--t3)" }}>{r.l}</span>
          </div>
        ))}
      </motion.div>

      {/* Content with parallax */}
      <motion.div style={{ y, opacity: op, position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ padding: "100px clamp(20px,4vw,64px) 80px", maxWidth: 1400, margin: "0 auto" }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={run ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.06, duration: 0.7, ease: [0.16,1,0.3,1] }} style={{ marginBottom: 28 }}>
            <span className="eyebrow" style={{ fontSize: 8 }}>
              <Scramble text={B.hero.eyebrow} run={run} />
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ maxWidth: "min(780px,65vw)", marginBottom: 40 }}>
            <Line text={B.hero.h1[0]} delay={0.2} run={run} />
            <Line text={B.hero.h1[1]} delay={0.31} run={run} />
            <Line text={B.hero.h1[2]} delay={0.42} run={run} italic />
          </div>

          {/* Body */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={run ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.85, ease: [0.16,1,0.3,1] }}
            className="t-body" style={{ maxWidth: 460, marginBottom: 44, fontSize: "clamp(13px,1.05vw,15px)" }}>
            {B.hero.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 22 }} animate={run ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.88, duration: 0.7, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            <button onClick={() => go("#contact")} className="btn btn-gold" data-cursor="START">{B.hero.cta1} →</button>
            <button onClick={() => go("#work")} className="btn btn-outline" data-cursor="VIEW">{B.hero.cta2}</button>
          </motion.div>

          {/* Trust row */}
          <motion.div initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}} transition={{ delay: 1.1 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
            {["48-HOUR DELIVERY", "MONTH-TO-MONTH", "VA LLC EST. 2024"].map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: 0.35, flexShrink: 0, display: "block" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.16em", color: "var(--t3)" }}>{b}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}} transition={{ delay: 1.6 }}
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3, cursor: "none" }}
        onClick={() => go("#marquee")} data-cursor="">
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(201,168,124,0.35), transparent)", animation: "scrollLine 2.2s ease-in-out infinite" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--t3)" }}>SCROLL</span>
      </motion.div>

      <style>{`
        @keyframes scrollLine{0%,100%{opacity:0.3;transform:scaleY(1);}50%{opacity:0.9;transform:scaleY(0.6);}}
      `}</style>
    </section>
  );
}
