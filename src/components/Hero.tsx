"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { B } from "../../lib/brand";

// ══════════════════════════════════════════════════════
// WEBGL: Dark reflective surface — thin gold light planes
// This replaces the brown blob with something architecturally beautiful
// ══════════════════════════════════════════════════════
function GoldSurface() {
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

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float ar=u_res.x/u_res.y;
  vec2 asp=vec2(uv.x*ar,uv.y);
  
  // Slow noise field
  float n1=noise(asp*1.4+vec2(u_t*0.06,u_t*0.04));
  float n2=noise(asp*2.8-vec2(u_t*0.05,u_t*0.07));
  float n3=noise(asp*5.5+vec2(u_t*0.02,-u_t*0.05));
  
  // Gold light planes at angles — thin diagonal bands
  float plane1 = abs(sin((asp.x*0.6+asp.y*1.2+u_t*0.12)*3.14159));
  float plane2 = abs(sin((asp.x*1.1-asp.y*0.4+u_t*0.08)*2.71828));
  float planes = (pow(plane1,12.0) + pow(plane2,16.0)) * 0.15;

  // Mouse proximity warm glow
  vec2 m=vec2(u_mouse.x*ar,u_mouse.y);
  float md=length(asp-m);
  float mglow=0.08/(md*md+0.12);
  
  // Base: deep near-black with microscopic warm variation
  vec3 base=mix(vec3(0.019,0.018,0.019),vec3(0.028,0.026,0.024),n1*n2*0.4);
  
  // Gold light color
  vec3 gold=vec3(0.784,0.663,0.318);
  vec3 goldB=vec3(0.906,0.796,0.447);
  
  vec3 col=base;
  col+=gold*(planes*0.6+mglow*0.18);
  col+=goldB*n3*0.025;
  
  // Very subtle grid impression
  float gx=abs(fract(asp.x*8.0)-0.5);
  float gy=abs(fract(asp.y*8.0)-0.5);
  float grid=max(0.0,1.0-min(gx,gy)*40.0);
  col+=vec3(0.784,0.663,0.318)*grid*0.015;
  
  // Vignette
  vec2 vig=uv-0.5;
  float v=1.0-dot(vig*1.6,vig*1.6);
  col*=clamp(v,0.0,1.0)*0.95+0.05;
  
  gl_FragColor=vec4(col,1.0);
}`;
    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s,src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog,mk(gl.VERTEX_SHADER,vs));
    gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(prog,"p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const uR=gl.getUniformLocation(prog,"u_res");
    const uT=gl.getUniformLocation(prog,"u_t");
    const uM=gl.getUniformLocation(prog,"u_mouse");
    const mouse={x:0.5,y:0.5};
    const mv=(e:MouseEvent)=>{mouse.x=e.clientX/window.innerWidth;mouse.y=e.clientY/window.innerHeight;};
    window.addEventListener("mousemove",mv,{passive:true});
    let raf:number;
    const draw=(t:number)=>{
      gl.uniform2f(uR,canvas.width,canvas.height);
      gl.uniform1f(uT,t/1000);
      gl.uniform2f(uM,mouse.x,1-mouse.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",mv);ro.disconnect();};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

// ══════════════════════════════════════════════════════
// THREE.JS: Floating SCREEN PANELS showing work
// More purposeful than a random shape — represents our actual deliverable
// ══════════════════════════════════════════════════════
function FloatingPanels() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cleanup: (()=>void)|undefined;
    import("three").then((THREE) => {
      const W=mount.offsetWidth, H=mount.offsetHeight;
      const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setSize(W,H);
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.setClearColor(0,0);
      mount.appendChild(renderer.domElement);
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(52,W/H,0.1,100);
      camera.position.set(0,0,5);

      // Create 3 floating panels at different depths/rotations
      const panels: any[] = [];
      const panelData = [
        { x:-1.1, y:0.6,  z:0,   rx:-0.08, ry:0.18,  s:1.3 },
        { x: 0.4, y:-0.3, z:0.8, rx: 0.04, ry:-0.12, s:1.0 },
        { x: 1.4, y:0.5,  z:-0.5,rx:-0.06, ry: 0.22, s:0.85 },
      ];
      const panelColors = [0xC8A951, 0x92BDD4, 0xF7F4EE];

      panelData.forEach((d, i) => {
        const geo = new THREE.PlaneGeometry(d.s * 1.4, d.s * 0.9, 1, 1);
        // Wireframe outline
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: panelColors[i], transparent: true, opacity: 0.35
        });
        const edges = new THREE.LineSegments(edgeGeo, edgeMat);

        // Inner glow fill
        const fillMat = new THREE.MeshBasicMaterial({
          color: panelColors[i], transparent: true, opacity: 0.04, side: THREE.DoubleSide
        });
        const fill = new THREE.Mesh(geo, fillMat);
        const group = new THREE.Group();
        group.add(fill); group.add(edges);
        group.position.set(d.x, d.y, d.z);
        group.rotation.set(d.rx, d.ry, 0);
        scene.add(group);
        panels.push(fill);
      });

      // Floating particles
      const pCount = 120;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i*3]   = (Math.random()-0.5)*6;
        pPos[i*3+1] = (Math.random()-0.5)*4;
        pPos[i*3+2] = (Math.random()-0.5)*3;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));
      const pMat = new THREE.PointsMaterial({color:0xC8A951,size:0.018,transparent:true,opacity:0.45});
      scene.add(new THREE.Points(pGeo,pMat));

      let mx=0,my=0;
      const onMv=(e:MouseEvent)=>{
        mx=(e.clientX/window.innerWidth-0.5)*2;
        my=-(e.clientY/window.innerHeight-0.5)*2;
      };
      window.addEventListener("mousemove",onMv,{passive:true});

      let raf:number;
      const anim=(t:number)=>{
        raf=requestAnimationFrame(anim);
        const time=t/1000;
        panels.forEach((p,i)=>{
          const g=p.parent!;
          g.rotation.y=panelData[i].ry + Math.sin(time*0.3+i*1.1)*0.04 + mx*0.06;
          g.rotation.x=panelData[i].rx + Math.cos(time*0.2+i*0.8)*0.02 + my*0.04;
          g.position.y=panelData[i].y + Math.sin(time*0.4+i*2.1)*0.06;
          // Pulse opacity
          const mat = g.children[0] as any;
          (mat.material as any).opacity = 0.04 + Math.abs(Math.sin(time*0.5+i))*0.04;
        });
        renderer.render(scene,camera);
      };
      raf=requestAnimationFrame(anim);

      const ro=new ResizeObserver(()=>{
        const w=mount.offsetWidth,h=mount.offsetHeight;
        renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
      });
      ro.observe(mount);
      cleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",onMv);ro.disconnect();renderer.dispose();if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement);};
    });
    return ()=>cleanup?.();
  },[]);

  return (
    <div ref={mountRef} style={{position:"absolute",right:"0",top:"50%",transform:"translateY(-50%)",width:"min(56vw,700px)",height:"min(56vw,700px)",pointerEvents:"none"}} className="mob-off" />
  );
}

// ══════════════════════════════════════════════════════
// Scramble text
// ══════════════════════════════════════════════════════
const G="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·◆■×▲";
function Scramble({text,run}:{text:string;run:boolean}){
  const [chars,setChars]=useState(text.split("").map(c=>({c,done:false})));
  useEffect(()=>{
    if(!run)return;
    let raf:number;
    const t0=performance.now();
    const tick=()=>{
      const now=performance.now()-t0;
      setChars(text.split("").map((f,i)=>{
        const s=i*36,e=s+480;
        if(now<s)return{c:" ",done:false};
        if(now>=e)return{c:f,done:true};
        return{c:f===" "?" ":G[Math.floor(Math.random()*G.length)],done:false};
      }));
      if(now<(text.length-1)*36+480+50)raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[run,text]);
  return(
    <span>
      {chars.map((g,i)=>(
        <span key={i} style={{color:g.done?"var(--gold)":"rgba(200,169,81,0.3)",fontFamily:"var(--mono)",display:"inline-block",minWidth:g.c===" "?"0.3em":undefined}}>{g.c}</span>
      ))}
    </span>
  );
}

// ══════════════════════════════════════════════════════
// Headline — clip reveal per line
// ══════════════════════════════════════════════════════
function HLine({text,delay,run,italic}:{text:string;delay:number;run:boolean;italic?:boolean}){
  return(
    <div style={{overflow:"hidden"}}>
      <motion.div
        className={italic?"t-display-i":"t-display"}
        initial={{y:"108%",skewY:1.2}}
        animate={run?{y:"0%",skewY:0}:{}}
        transition={{delay,duration:1.05,ease:[0.16,1,0.3,1]}}
        style={{display:"block",color:"var(--white)"}}
      >{text}</motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// LIVE COUNTER — each number counts up independently
// ══════════════════════════════════════════════════════
function LiveStat({val,suf,label,run,delay}:{val:number;suf:string;label:string;run:boolean;delay:number}){
  const [n,setN]=useState(0);
  useEffect(()=>{
    if(!run)return;
    const t=setTimeout(()=>{
      const dur=2200,t0=performance.now();
      let raf:number;
      const tick=()=>{
        const elapsed=Math.min((performance.now()-t0)/dur,1);
        const e=1-Math.pow(1-elapsed,4);
        setN(Math.round(e*val));
        if(elapsed<1)raf=requestAnimationFrame(tick);
      };
      raf=requestAnimationFrame(tick);
      return()=>cancelAnimationFrame(raf);
    },delay*1000);
    return()=>clearTimeout(t);
  },[run,val,delay]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:"clamp(24px,2.8vw,38px)",lineHeight:1,color:"var(--white)",letterSpacing:"-0.02em"}}>
        {n}{suf}
      </div>
      <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--white-3)"}}>{label}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN HERO
// ══════════════════════════════════════════════════════
export default function Hero({ready}:{ready?:boolean}){
  const sectionRef=useRef<HTMLElement>(null);
  const [run,setRun]=useState(false);
  const {scrollYProgress}=useScroll({target:sectionRef,offset:["start start","end start"]});
  const y=useTransform(scrollYProgress,[0,1],["0%","18%"]);
  const op=useTransform(scrollYProgress,[0,0.7],[1,0]);

  useEffect(()=>{if(ready)setTimeout(()=>setRun(true),60);},[ready]);

  const goContact=()=>window.location.href="/contact";
  const goWork=()=>window.location.href="/work";

  return(
    <section ref={sectionRef} id="hero" style={{position:"relative",minHeight:"100svh",display:"flex",alignItems:"center",overflow:"hidden",background:"var(--ink)"}}>
      {/* Full-bleed WebGL background */}
      <GoldSurface/>

      {/* Three.js floating panels — right side */}
      <FloatingPanels/>

      {/* Bottom gradient */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45%",background:"linear-gradient(to bottom,transparent,var(--ink))",pointerEvents:"none",zIndex:1}}/>

      {/* Top bar accent line */}
      <motion.div initial={{scaleX:0}} animate={run?{scaleX:1}:{}} transition={{delay:1.2,duration:1.4,ease:[0.16,1,0.3,1]}}
        style={{position:"absolute",top:64,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent 0%,rgba(200,169,81,0.12) 30%,rgba(200,169,81,0.12) 70%,transparent 100%)",transformOrigin:"left",zIndex:2}}/>

      {/* System status — top right (alche-style readout) */}
      <motion.div initial={{opacity:0,x:16}} animate={run?{opacity:1,x:0}:{}} transition={{delay:1.55,duration:0.7}}
        style={{position:"absolute",top:80,right:"clamp(20px,4vw,64px)",zIndex:3,display:"flex",flexDirection:"column",gap:7,alignItems:"flex-end"}} className="mob-off">
        {[
          {dot:true,  label:"SYS.ONLINE",       val:""},
          {dot:false, label:"CLIENTS ACTIVE",    val:`${B.stats.clients}+`},
          {dot:false, label:"SLOT AVAILABLE",    val:`${B.slots}`},
          {dot:false, label:"AVG.ROI YR1",       val:`${B.stats.roi}%`},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            {r.dot&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",animation:"dot-pulse 2.5s ease-in-out infinite"}}/>}
            {r.val&&<span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.12em",color:"var(--white)"}}>{r.val}</span>}
            <span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:r.dot?"var(--gold)":"var(--white-3)"}}>{r.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Corner brackets — refined version */}
      {([
        {s:{top:0,left:0},   lines:{bt:true, bl:true}},
        {s:{top:0,right:0},  lines:{bt:true, br:true}},
        {s:{bottom:0,left:0},lines:{bb:true, bl:true}},
        {s:{bottom:0,right:0},lines:{bb:true, br:true}},
      ] as {s:object;lines:Record<string,boolean>}[]).map((c,i)=>(
        <motion.div key={i} initial={{opacity:0}} animate={run?{opacity:1}:{}} transition={{delay:1.3+i*0.04,duration:0.7}}
          style={{position:"absolute",width:20,height:20,...c.s as object,
            borderTop:c.lines.bt?"1px solid rgba(200,169,81,0.22)":"none",
            borderBottom:c.lines.bb?"1px solid rgba(200,169,81,0.22)":"none",
            borderLeft:c.lines.bl?"1px solid rgba(200,169,81,0.22)":"none",
            borderRight:c.lines.br?"1px solid rgba(200,169,81,0.22)":"none"}}/>
      ))}

      {/* MAIN CONTENT — with parallax */}
      <motion.div style={{y,opacity:op,position:"relative",zIndex:2,width:"100%"}}>
        <div style={{padding:"110px clamp(20px,4vw,64px) 80px",maxWidth:1400,margin:"0 auto"}}>

          {/* Eyebrow scramble */}
          <motion.div initial={{opacity:0,x:-14}} animate={run?{opacity:1,x:0}:{}} transition={{delay:0.05,duration:0.7,ease:[0.16,1,0.3,1]}} style={{marginBottom:28}}>
            <span className="eyebrow" style={{fontSize:8}}>
              <Scramble text={B.hero.eyebrow} run={run}/>
            </span>
          </motion.div>

          {/* Giant headline — each line clips up individually */}
          <div style={{maxWidth:"min(820px,65vw)",marginBottom:44}}>
            <HLine text={B.hero.h1[0]} delay={0.18} run={run}/>
            <HLine text={B.hero.h1[1]} delay={0.29} run={run}/>
            <HLine text={B.hero.h1[2]} delay={0.40} run={run} italic/>
          </div>

          {/* Sub */}
          <motion.p initial={{opacity:0,y:20}} animate={run?{opacity:1,y:0}:{}} transition={{delay:0.68,duration:0.85,ease:[0.16,1,0.3,1]}}
            className="t-body" style={{maxWidth:480,marginBottom:44,fontSize:"clamp(13px,1.05vw,15px)"}}>
            {B.hero.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:20}} animate={run?{opacity:1,y:0}:{}} transition={{delay:0.86,duration:0.7,ease:[0.16,1,0.3,1]}}
            style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:52}}>
            <button onClick={goContact} className="btn btn-gold" data-cursor="START">{B.hero.cta1} →</button>
            <button onClick={goWork}    className="btn btn-ghost" data-cursor="VIEW" >{B.hero.cta2}</button>
          </motion.div>

          {/* Live stats row */}
          <motion.div initial={{opacity:0}} animate={run?{opacity:1}:{}} transition={{delay:1.0,duration:0.8}}
            style={{display:"flex",flexWrap:"wrap",gap:40,paddingTop:28,borderTop:"1px solid var(--bd)"}}>
            <LiveStat val={B.stats.clients} suf="+" label="Clients Served"   run={run} delay={1.1}/>
            <LiveStat val={B.stats.satisfaction} suf="%" label="Satisfaction"  run={run} delay={1.2}/>
            <LiveStat val={48} suf="hr" label="Avg. Launch"                   run={run} delay={1.3}/>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{opacity:0}} animate={run?{opacity:1}:{}} transition={{delay:1.65,duration:0.8}}
        style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,zIndex:3,cursor:"none"}}
        data-cursor="">
        <div style={{width:1,height:52,background:"linear-gradient(to bottom,rgba(200,169,81,0.4),transparent)",animation:"sLine 2.2s ease-in-out infinite"}}/>
        <span style={{fontFamily:"var(--mono)",fontSize:7,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--white-3)"}}>SCROLL</span>
      </motion.div>

      {/* Floating badge — clients count */}
      <motion.div initial={{opacity:0,scale:0.7,rotate:-8}} animate={run?{opacity:1,scale:1,rotate:0}:{}} transition={{delay:1.35,duration:0.65,ease:[0.34,1.56,0.64,1]}}
        style={{position:"absolute",right:"clamp(20px,4vw,64px)",bottom:80,zIndex:3}} className="mob-off">
        <div style={{width:88,height:88,borderRadius:"50%",border:"1px solid rgba(200,169,81,0.2)",background:"rgba(5,5,6,0.85)",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
          <span style={{fontFamily:"var(--serif)",fontWeight:800,fontSize:26,lineHeight:1,color:"var(--white)"}}>{B.stats.clients}</span>
          <span style={{fontFamily:"var(--mono)",fontSize:7,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--white-3)",textAlign:"center"}}>CLIENTS<br/>SERVED</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes sLine{0%,100%{opacity:.3;transform:scaleY(1);}50%{opacity:.9;transform:scaleY(.6);}}
      `}</style>
    </section>
  );
}
