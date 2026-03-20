"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { B } from "../../lib/brand";

// ══════════════════════════════════════════════════════════════════
// WEBGL DEEP-FIELD — FBM noise, electric blue light bleeding through
// Very slow mouse influence (~4s delay) — site feels alive but weighted
// ══════════════════════════════════════════════════════════════════
const VERT = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;
const FRAG = `
precision highp float;
uniform vec2  u_res; uniform float u_t; uniform vec2 u_m;

float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){v+=a*n(p);p=p*2.+vec2(1.7,9.2);a*=.5;} return v; }

void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float ar=u_res.x/u_res.y;
  vec2  ap=vec2(uv.x*ar,uv.y);
  vec2  mi=u_m-.5;
  float n1=fbm(ap*1.1+vec2(u_t*.036,u_t*.024)+mi*.1);
  float n2=fbm(ap*2.5-vec2(u_t*.026,u_t*.040)-mi*.05);
  float n3=fbm(ap*5.2+vec2(u_t*.014,-u_t*.020));
  float f=n1*.6+n2*.3+n3*.1;
  vec3  b=vec3(.0196,.0196,.0392);
  vec3  lc=vec3(.184,.494,1.);
  float bl=pow(max(f-.44,0.)*3.8,2.8);
  vec3  c=b+lc*bl*.12+vec3(.008,.006,0.)*n3*.3;
  vec2  mp=vec2(u_m.x*ar,u_m.y); float md=length(ap-mp);
  c+=lc*(.05/(md*md+.32))*.04;
  vec2 v=uv-.5; c*=pow(clamp(1.-dot(v*1.6,v*1.6),0.,1.),.75);
  gl_FragColor=vec4(c,1.);
}`;

function WebGLField({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const gl = canvas.getContext("webgl"); if (!gl) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * Math.min(devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh,s); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog,"p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const uR=gl.getUniformLocation(prog,"u_res"), uT=gl.getUniformLocation(prog,"u_t"), uM=gl.getUniformLocation(prog,"u_m");

    // Very slow lerp — 4s response feel
    const mouse = { tx:.5, ty:.5, cx:.5, cy:.5 };
    const mv = (e: MouseEvent) => { mouse.tx=e.clientX/window.innerWidth; mouse.ty=e.clientY/window.innerHeight; };
    window.addEventListener("mousemove",mv,{passive:true});

    let raf: number;
    const tick = (t: number) => {
      mouse.cx += (mouse.tx-mouse.cx)*.0038;
      mouse.cy += (mouse.ty-mouse.cy)*.0038;
      gl.uniform2f(uR,canvas.width,canvas.height); gl.uniform1f(uT,t/1000); gl.uniform2f(uM,mouse.cx,1-mouse.cy);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",mv); ro.disconnect(); };
  }, [canvasRef]);
  return null;
}

// ══════════════════════════════════════════════════════════════════
// THREE.JS CONSTRUCTOR SCENE
// A large tilted "architect board" — a website being built in real time.
// This is what UpLevel does. The visual IS the product.
//
// Board: large PlaneGeometry, tilted. On it: a website wireframe that
// draws itself progressively over 14s then dissolves and resets.
// 
// 160 data particles flow from the LEFT toward the board — representing
// leads approaching the contractor's new digital system.
// Thread lines connect particles to the board (proximity-based opacity).
//
// Ambient geometry (shrunken loader remnant) drifts in top-left.
// Camera: FOV 50, moves on scroll (zoom in 0-35%, pan right 35-100%).
// ══════════════════════════════════════════════════════════════════
function ConstructorScene({
  mountRef,
  scrollRef,
}: {
  mountRef:  React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<number | null>;
}) {
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const W = mount.offsetWidth, H = mount.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
    camera.position.set(0, 0.3, 5.5);

    // ── THE ARCHITECT BOARD ──────────────────────────────────────
    const boardGroup = new THREE.Group();
    boardGroup.position.set(0.8, 0, 0);
    boardGroup.rotation.set(-0.05, 0.22, 0.02);
    scene.add(boardGroup);

    // Board glass fill
    const bGeo  = new THREE.PlaneGeometry(4.4, 2.75);
    const bFill = new THREE.Mesh(bGeo, new THREE.MeshBasicMaterial({
      color: 0x2F7EFF, transparent: true, opacity: 0.022, side: THREE.DoubleSide,
    }));
    boardGroup.add(bFill);

    // Board border
    const bEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(bGeo),
      new THREE.LineBasicMaterial({ color: 0x2F7EFF, transparent: true, opacity: 0.38 })
    );
    boardGroup.add(bEdge);

    // ── Website wireframe that BUILDS ITSELF on the board ────────
    // 24 segments with staggered reveal times (0..1 of the 14s cycle)
    type Seg = { x1:number;y1:number;x2:number;y2:number;t:number };
    const W2 = 4.4 / 2, H2 = 2.75 / 2;
    const segs: Seg[] = [
      // Nav bar top
      { x1:-W2+.1, y1:H2-.14, x2:W2-.1,  y2:H2-.14, t:.04 },
      { x1:-W2+.1, y1:H2-.32, x2:W2-.1,  y2:H2-.32, t:.07 },
      { x1:-W2+.1, y1:H2-.14, x2:-W2+.1, y2:H2-.32, t:.06 },
      { x1:W2-.1,  y1:H2-.14, x2:W2-.1,  y2:H2-.32, t:.08 },
      // Nav items dots
      { x1:1.2,    y1:H2-.22, x2:1.35,   y2:H2-.22, t:.10 },
      { x1:1.4,    y1:H2-.22, x2:1.55,   y2:H2-.22, t:.11 },
      { x1:1.6,    y1:H2-.22, x2:1.75,   y2:H2-.22, t:.12 },
      // Hero headline lines (left half)
      { x1:-W2+.14,y1:H2-.52, x2: .2,    y2:H2-.52, t:.17 },
      { x1:-W2+.14,y1:H2-.68, x2: .0,    y2:H2-.68, t:.20 },
      { x1:-W2+.14,y1:H2-.84, x2: .15,   y2:H2-.84, t:.23 },
      // CTA button
      { x1:-W2+.14,y1:H2-1.05,x2:-W2+.78,y2:H2-1.05,t:.27 },
      { x1:-W2+.14,y1:H2-1.20,x2:-W2+.78,y2:H2-1.20,t:.29 },
      { x1:-W2+.14,y1:H2-1.05,x2:-W2+.14,y2:H2-1.20,t:.28 },
      { x1:-W2+.78,y1:H2-1.05,x2:-W2+.78,y2:H2-1.20,t:.30 },
      // Hero right column box
      { x1:.40,    y1:H2-.40, x2:W2-.10, y2:H2-.40, t:.18 },
      { x1:.40,    y1:-H2+.24,x2:W2-.10, y2:-H2+.24,t:.22 },
      { x1:.40,    y1:H2-.40, x2:.40,    y2:-H2+.24, t:.19 },
      { x1:W2-.10, y1:H2-.40, x2:W2-.10, y2:-H2+.24, t:.21 },
      // Content section divider
      { x1:-W2+.10,y1:-H2+.58,x2:W2-.10, y2:-H2+.58, t:.42 },
      { x1:-W2+.10,y1:-H2+.38,x2:.72,    y2:-H2+.38, t:.46 },
      // Content blocks
      { x1:-W2+.10,y1:-H2+.22,x2:-.38,   y2:-H2+.22, t:.50 },
      { x1:-.26,   y1:-H2+.22,x2:.24,    y2:-H2+.22, t:.53 },
      { x1:.36,    y1:-H2+.22,x2:.86,    y2:-H2+.22, t:.56 },
      { x1:.98,    y1:-H2+.22,x2:W2-.10, y2:-H2+.22, t:.59 },
    ];

    // Single LineSegments geometry — we animate draw range
    const wireVerts = new Float32Array(segs.length * 6);
    segs.forEach((s,i) => {
      wireVerts[i*6+0]=s.x1; wireVerts[i*6+1]=s.y1; wireVerts[i*6+2]=0.01;
      wireVerts[i*6+3]=s.x2; wireVerts[i*6+4]=s.y2; wireVerts[i*6+5]=0.01;
    });
    const wireGeo = new THREE.BufferGeometry();
    wireGeo.setAttribute("position", new THREE.BufferAttribute(wireVerts, 3));
    wireGeo.setDrawRange(0, 0);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x2F7EFF, transparent: true, opacity: 0.62 });
    boardGroup.add(new THREE.LineSegments(wireGeo, wireMat));

    // ── Ambient geometry — loader remnant in top-left ─────────────
    const ambGroup = new THREE.Group();
    ambGroup.position.set(-3.8, 2.2, -1.2);
    ambGroup.scale.set(0.26, 0.26, 0.26);
    scene.add(ambGroup);

    // Tiny outer circle
    const mkCircle = (r: number, col: number, alpha: number) => {
      const pts: number[] = [];
      for (let i=0;i<=72;i++){const a=i/72*Math.PI*2;pts.push(Math.cos(a)*r,Math.sin(a)*r,0);}
      const g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
      return new THREE.Line(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:alpha}));
    };
    ambGroup.add(mkCircle(1, 0xffffff, 0.08));
    ambGroup.add(mkCircle(0.5, 0x2F7EFF, 0.14));

    // Compass lines
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => {
      const g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute([0,0,0,dx*.58,dy*.58,0],3));
      ambGroup.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:0x2F7EFF,transparent:true,opacity:0.22})));
    });

    // ── 160 data particles flowing LEFT → RIGHT toward board ──────
    const N    = 160;
    const pPos = new Float32Array(N * 3);
    const pVel = new Float32Array(N);
    const pPhase = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      pPos[i*3]   = -7 - Math.random() * 5;   // start far left
      pPos[i*3+1] = (Math.random() - .5) * 5;
      pPos[i*3+2] = (Math.random() - .5) * 3;
      pVel[i]     = 0.006 + Math.random() * 0.014;
      pPhase[i]   = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x2F7EFF, transparent: true, opacity: 0.42 });
    pMat.size = 0.022;
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // ── Thread lines: 16 particles → board ──────────────────────
    const THREADS = 16;
    const threads: THREE.Line[] = [];
    for (let i = 0; i < THREADS; i++) {
      const tGeo = new THREE.BufferGeometry();
      const tPos = new Float32Array(6);
      tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
      const tLine = new THREE.Line(tGeo, new THREE.LineBasicMaterial({ color: 0x2F7EFF, transparent: true, opacity: 0.04 }));
      scene.add(tLine);
      threads.push(tLine);
    }

    // ── Mouse ─────────────────────────────────────────────────────
    let mx = 0, my = 0;
    const mv = (e: MouseEvent) => {
      mx = (e.clientX/window.innerWidth  - .5) * 2;
      my = -(e.clientY/window.innerHeight - .5) * 2;
    };
    window.addEventListener("mousemove", mv, { passive: true });

    // ── Resize ───────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = mount.offsetWidth, h = mount.offsetHeight;
      renderer.setSize(w, h); camera.aspect = w/h; camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    // ── Construction state ────────────────────────────────────────
    const LOOP_DUR = 14000; // ms
    let constructT = 0;

    let raf: number;
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      const sp = scrollRef.current || 0;

      // ── Board mouse parallax ──────────────────────────────────
      boardGroup.rotation.y = 0.22 + mx * 0.065 + Math.sin(now * .0003) * .008;
      boardGroup.rotation.x = -0.05 + my * 0.042;
      boardGroup.position.y = Math.sin(now * .00085) * .045;

      // ── Camera moves with scroll ─────────────────────────────
      if (sp < 0.35) {
        // Phase 1: zoom in
        camera.position.z = 5.5 - sp / 0.35 * 2.4;
        camera.position.y = 0.3  - sp / 0.35 * 0.35;
        camera.position.x = 0;
      } else {
        // Phase 2: pan right, flatten panels
        const sp2 = (sp - 0.35) / 0.65;
        camera.position.x = sp2 * 2.2;
        camera.position.z = 3.1  - sp2 * 0.6;
        camera.position.y = -0.05;
        boardGroup.rotation.y = 0.22 + mx * 0.065 * (1 - sp2) - sp2 * 0.45;
      }

      // ── Wire construction progress ────────────────────────────
      constructT = (constructT + 16) % LOOP_DUR;
      const cp = constructT / LOOP_DUR;
      let drawCount = 0;
      segs.forEach(s => { if (s.t <= cp) drawCount++; });
      wireGeo.setDrawRange(0, drawCount * 2);
      // Dissolve near end of cycle
      wireMat.opacity = cp > 0.88 ? 0.62 * (1 - (cp - 0.88) / 0.12) : 0.62;

      // ── Particle flow ────────────────────────────────────────
      const posArr = pGeo.getAttribute("position") as THREE.BufferAttribute;
      const arr = posArr.array as Float32Array;
      for (let i = 0; i < N; i++) {
        arr[i*3]   += pVel[i];
        arr[i*3+1] += Math.sin(now * .001 + pPhase[i]) * 0.0004;
        if (arr[i*3] > 3.5) {
          arr[i*3]   = -7 - Math.random() * 3;
          arr[i*3+1] = (Math.random() - .5) * 5;
          arr[i*3+2] = (Math.random() - .5) * 3;
        }
      }
      posArr.needsUpdate = true;

      // ── Thread lines opacity based on particle proximity ──────
      threads.forEach((tl, ti) => {
        const src = (ti * 10) % N;
        const tPos = (tl.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
        tPos[0]=arr[src*3]; tPos[1]=arr[src*3+1]; tPos[2]=arr[src*3+2];
        // Target: random point on board
        const bx = boardGroup.position.x;
        tPos[3]=bx+(-2.0+Math.random()*4.0); tPos[4]=(-1.2+Math.random()*2.4); tPos[5]=0;
        (tl.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
        const dist = Math.abs(arr[src*3] - bx);
        (tl.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.07 - dist * 0.012);
      });

      // ── Ambient rotation ─────────────────────────────────────
      ambGroup.rotation.z = now * .00008;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", mv);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [mountRef, scrollRef]);

  return null;
}

// ══════════════════════════════════════════════════════════════════
// MAGNETIC BUTTON
// ══════════════════════════════════════════════════════════════════
function MagBtn({
  href, className, label, otherActive, onActive, onInactive, children,
}: {
  href: string; className: string; label: string;
  otherActive: boolean; onActive: ()=>void; onInactive: ()=>void;
  children: React.ReactNode;
}) {
  const ref    = useRef<HTMLAnchorElement>(null);
  const active = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = (e: MouseEvent) => {
      if (otherActive) { el.style.transform = ""; return; }
      const r  = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 80) {
        if (!active.current) { active.current = true; onActive(); }
        el.style.transform = `translate(${dx*.28}px,${dy*.28}px)`;
      } else if (active.current) {
        active.current = false; onInactive();
        el.style.transform = "";
      }
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [otherActive, onActive, onInactive]);

  return (
    <a ref={ref} href={href} onClick={e=>{ e.preventDefault(); window.location.href=href; }}
      className={className} data-cursor={label}
      style={{ transition:"transform .3s var(--spring)" }}>
      {children}
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════
// COUNT UP hook
// ══════════════════════════════════════════════════════════════════
function useCount(target: number, run: boolean, delay = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => {
      const t0 = performance.now(), dur = 2200;
      let raf: number;
      const tick = () => {
        const prog = Math.min((performance.now()-t0)/dur, 1);
        setN(Math.round((1-Math.pow(1-prog,4))*target));
        if (prog < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(id);
  }, [run, target, delay]);
  return n;
}

// ══════════════════════════════════════════════════════════════════
// HERO — main export
// ══════════════════════════════════════════════════════════════════
export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const glCanvas   = useRef<HTMLCanvasElement>(null);
  const mountRef   = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef(0);

  const [run,  setRun]  = useState(false);
  const [btnA, setBtnA] = useState(false);
  const [btnB, setBtnB] = useState(false);

  const c0 = useCount(B.stats.clients,      run, 1200);
  const c1 = useCount(B.stats.satisfaction, run, 1350);
  const c2 = useCount(48,                   run, 1500);

  useEffect(() => { if (ready) setTimeout(()=>setRun(true), 80); }, [ready]);

  // GSAP scroll pin
  useEffect(() => {
    if (!ready) return;
    let cleanup: ()=>void;
    (async () => {
      const [{ default:gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: sectionRef.current, start:"top top", end:"+=120%",
        pin: true, scrub: 1.5,
        onUpdate: self => { scrollRef.current = self.progress; },
      });
      cleanup = () => st.kill();
    })();
    return () => cleanup?.();
  }, [ready]);

  const EV = [0.16,1,0.3,1] as const;
  const tr = (d: number, t = 0.95) => ({ delay:d, duration:t, ease:EV });

  return (
    <section ref={sectionRef} id="hero" style={{
      position:"relative", minHeight:"100svh",
      display:"flex", alignItems:"center",
      overflow:"hidden", background:"var(--void)",
    }}>

      {/* ── WebGL background — full bleed ── */}
      <canvas ref={glCanvas} style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0 }} />
      <WebGLField canvasRef={glCanvas} />

      {/* ── Three.js Constructor scene — full bleed, over WebGL ── */}
      <div ref={mountRef} style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none" }} />
      <ConstructorScene mountRef={mountRef} scrollRef={scrollRef} />

      {/* ── Left vignette — darkens left edge so text reads clearly ── */}
      <div style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:"linear-gradient(to right, rgba(5,5,10,0.75) 0%, rgba(5,5,10,0.35) 42%, transparent 62%)",
      }} />
      {/* ── Bottom gradient — fades into next section ── */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"45%", zIndex:2, pointerEvents:"none",
        background:"linear-gradient(to bottom, transparent, var(--void))",
      }} />

      {/* ── Hairline below nav ── */}
      {run && <div style={{
        position:"absolute", top:64, left:0, right:0, height:1, zIndex:4, pointerEvents:"none",
        background:"linear-gradient(90deg, transparent 0%, var(--bd) 30%, var(--bd) 70%, transparent 100%)",
        animation:"fadeHairline .8s 1.1s var(--expo) both",
      }} />}

      {/* ── System readout — top right (desktop) ── */}
      <div className="desk" style={{
        position:"absolute", top:80, right:"clamp(20px,4vw,64px)", zIndex:5,
        display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end",
        opacity:run?1:0, transform:run?"translateX(0)":"translateX(16px)",
        transition:"opacity .7s 1.4s var(--expo), transform .7s 1.4s var(--expo)",
      }}>
        {[
          { dot:true,  lbl:"SYS.ONLINE",    val:"" },
          { dot:false, lbl:"CLIENTS ACTIVE", val:`${B.stats.clients}+` },
          { dot:false, lbl:"SLOT AVAILABLE", val:`${B.slots}` },
          { dot:false, lbl:"AVG.ROI YR1",   val:`${B.stats.roi}%` },
        ].map((row,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            {row.dot && <div style={{ width:4, height:4, borderRadius:"50%", background:"var(--el)", animation:"elPulse 2.5s ease-in-out infinite" }} />}
            {row.val && <span style={{ fontFamily:"var(--f-mono)", fontSize:9, letterSpacing:"0.12em", color:"var(--t1)" }}>{row.val}</span>}
            <span style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:row.dot?"var(--el)":"var(--t2)" }}>{row.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── Corner brackets ── */}
      {([
        { s:{top:0,left:0},    bt:true,bl:true },
        { s:{top:0,right:0},   bt:true,br:true },
        { s:{bottom:0,left:0}, bb:true,bl:true },
        { s:{bottom:0,right:0},bb:true,br:true },
      ] as Array<{s:React.CSSProperties;bt?:boolean;bb?:boolean;bl?:boolean;br?:boolean}>)
      .map((c,i) => (
        <div key={i} style={{
          position:"absolute", width:18, height:18, zIndex:4, ...c.s,
          borderTop:    c.bt?"1px solid rgba(47,126,255,0.32)":"none",
          borderBottom: c.bb?"1px solid rgba(47,126,255,0.32)":"none",
          borderLeft:   c.bl?"1px solid rgba(47,126,255,0.32)":"none",
          borderRight:  c.br?"1px solid rgba(47,126,255,0.32)":"none",
          opacity:run?1:0, transition:`opacity .6s ${1.2+i*.04}s`,
        }} />
      ))}

      {/* ── MAIN CONTENT — left column floated over 3D world ── */}
      <div className="pad" style={{ position:"relative", zIndex:3, width:"100%", paddingTop:108, paddingBottom:80 }}>
        <div style={{ maxWidth:1440, margin:"0 auto" }}>
          <div style={{ maxWidth:"min(580px,50vw)" }} className="hero-left">

            {/* Eyebrow */}
            <div style={{
              marginBottom:30,
              opacity:run?1:0, transform:run?"translateX(0)":"translateX(-20px)",
              transition:"opacity .6s .05s var(--expo), transform .6s .05s var(--expo)",
            }}>
              <span className="eyebrow" style={{ fontSize:8, letterSpacing:"0.28em" }}>
                {B.hero.eyebrow}
              </span>
            </div>

            {/* Headline — 3 lines, each clips upward */}
            <div style={{ marginBottom:42 }}>
              {B.hero.h1.map((line, i) => (
                <div key={i} style={{ overflow:"hidden" }}>
                  <div style={{
                    display:"block",
                    fontFamily:"var(--f-disp)", fontWeight:900,
                    fontSize:"clamp(50px,8.5vw,136px)",
                    lineHeight:.91, letterSpacing:"-.036em", color:"var(--t1)",
                    fontStyle: i===2 ? "italic" : "normal",
                    transform:  run?"translateY(0%) skewY(0deg)":"translateY(108%) skewY(1.2deg)",
                    transition:`transform 1.1s ${.16+i*.11}s cubic-bezier(0.16,1,0.3,1)`,
                  }}>{line}</div>
                </div>
              ))}
            </div>

            {/* Sub copy */}
            <p className="t-body" style={{
              maxWidth:445, marginBottom:42, fontSize:"clamp(13px,1.05vw,15px)",
              opacity:run?1:0, transform:run?"translateY(0)":"translateY(20px)",
              transition:"opacity .95s .62s var(--expo), transform .95s .62s var(--expo)",
            }}>
              {B.hero.sub}
            </p>

            {/* CTA buttons — magnetic */}
            <div style={{
              display:"flex", flexWrap:"wrap", gap:12, marginBottom:46,
              opacity:run?1:0, transform:run?"translateY(0)":"translateY(18px)",
              transition:"opacity .7s .82s var(--expo), transform .7s .82s var(--expo)",
            }}>
              <MagBtn href="/contact" className="btn btn-el" label="START"
                otherActive={btnB} onActive={()=>setBtnA(true)} onInactive={()=>setBtnA(false)}>
                {B.hero.cta1} →
              </MagBtn>
              <MagBtn href="/work" className="btn btn-ghost" label="VIEW"
                otherActive={btnA} onActive={()=>setBtnB(true)} onInactive={()=>setBtnB(false)}>
                {B.hero.cta2}
              </MagBtn>
            </div>

            {/* Stats row */}
            <div style={{
              display:"flex", flexWrap:"wrap", gap:36,
              paddingTop:26, borderTop:"1px solid var(--bd)",
              opacity:run?1:0, transition:"opacity .7s 1.0s",
            }}>
              {[
                { n:c0, suf:"+", lbl:"Clients Served" },
                { n:c1, suf:"%", lbl:"Satisfaction"   },
                { n:c2, suf:"hr",lbl:"Avg Launch"      },
              ].map((st,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <div style={{
                    fontFamily:"var(--f-disp)", fontWeight:900,
                    fontSize:"clamp(22px,2.6vw,34px)", lineHeight:1,
                    letterSpacing:"-.030em", color:"var(--t1)",
                  }}>{st.n}{st.suf}</div>
                  <div style={{ fontFamily:"var(--f-mono)", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--t2)" }}>{st.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{
        position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
        zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:8,
        opacity:run?.55:0, transition:"opacity .8s 1.6s",
      }}>
        <div style={{ width:1, height:52, background:"var(--el)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"var(--el)", animation:"scrollDot 2s ease-in-out infinite" }} />
        </div>
        <span style={{ fontFamily:"var(--f-mono)", fontSize:7, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--t2)" }}>SCROLL</span>
      </div>

      <style>{`
        @keyframes fadeHairline{from{opacity:0}to{opacity:1}}
        @media(max-width:860px){.hero-left{max-width:100%!important}}
      `}</style>
    </section>
  );
}
