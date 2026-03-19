"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { brand } from "@/config/brand.config";

interface HeroProps {
  loaderComplete: boolean;
}

export default function Hero({ loaderComplete }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const headline3Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  // Three.js setup
  useEffect(() => {
    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let animId: number;
    let mesh: import("three").Mesh;
    let mouseX = 0;
    let mouseY = 0;

    const initThree = async () => {
      const THREE = await import("three");
      const container = threeContainerRef.current;
      if (!container) return;

      // Scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        55, container.clientWidth / container.clientHeight, 0.1, 100
      );
      camera.position.z = 3.5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Torus knot — sculptural, organic, burnished gold
      const geometry = new THREE.TorusKnotGeometry(0.9, 0.3, 200, 32, 2, 3);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#C9A87C"),
        metalness: 0.85,
        roughness: 0.18,
        envMapIntensity: 1.2,
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Glow duplicate (soft bloom fake)
      const glowGeo = new THREE.TorusKnotGeometry(0.95, 0.34, 80, 24, 2, 3);
      const glowMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#C9A87C"),
        metalness: 0.5,
        roughness: 0.6,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glowMesh);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xFFF5E0, 0.4);
      scene.add(ambientLight);

      const keyLight = new THREE.PointLight(0xFFF5E0, 3.5, 20);
      keyLight.position.set(3, 3, 3);
      scene.add(keyLight);

      const fillLight = new THREE.PointLight(0xC9A87C, 1.5, 15);
      fillLight.position.set(-3, -1, 2);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0xE8CEA6, 1, 10);
      rimLight.position.set(0, -3, -2);
      scene.add(rimLight);

      // Mouse parallax
      const handleMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouse);

      // Resize
      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (!mesh) return;

        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.006;
        glowMesh.rotation.x = mesh.rotation.x;
        glowMesh.rotation.y = mesh.rotation.y;

        // Mouse parallax — subtle
        mesh.position.x += (-mouseX * 0.15 - mesh.position.x) * 0.04;
        mesh.position.y += (mouseY * 0.1 - mesh.position.y) * 0.04;

        keyLight.position.x = 3 + Math.sin(Date.now() * 0.0005) * 1.5;

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener("mousemove", handleMouse);
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanup = initThree();

    return () => {
      cancelAnimationFrame(animId);
      cleanup.then((fn) => fn && fn());
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  // GSAP headline reveal after loader
  useEffect(() => {
    if (!loaderComplete) return;

    const lines = [headline1Ref.current, headline2Ref.current, headline3Ref.current];
    const others = [eyebrowRef.current, subtextRef.current, ctaRef.current, trustRef.current];

    gsap.fromTo(
      lines,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.3,
      }
    );

    gsap.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.1 }
    );

    gsap.fromTo(
      others.slice(1),
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "expo.out",
        delay: 0.7,
      }
    );
  }, [loaderComplete]);

  // Scroll parallax
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (scrollY < vh) {
        const progress = scrollY / vh;
        gsap.set(section.querySelector(".hero-content"), {
          y: scrollY * 0.25,
          opacity: 1 - progress * 1.6,
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Warm ambient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(15,12,9,0.9) 0%, var(--bg) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Three.js canvas — right side */}
      <div
        ref={threeContainerRef}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Gradient overlay to blend 3D with content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, var(--bg) 30%, rgba(12,11,11,0.2) 60%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Hero Content */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 clamp(24px, 5vw, 80px)",
          maxWidth: "680px",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            opacity: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "28px",
          }}
        >
          {brand.location}&nbsp; · &nbsp;Digital Growth Agency
        </div>

        {/* Headline */}
        <div
          style={{
            overflow: "hidden",
            marginBottom: "4px",
          }}
        >
          <div
            ref={headline1Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 7.5vw, 108px)",
              fontWeight: 700,
              lineHeight: 0.92,
              color: "var(--text-primary)",
              opacity: 0,
            }}
          >
            The Website
          </div>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "4px" }}>
          <div
            ref={headline2Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 7.5vw, 108px)",
              fontWeight: 700,
              lineHeight: 0.92,
              color: "var(--text-primary)",
              opacity: 0,
            }}
          >
            Your Work
          </div>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "40px" }}>
          <div
            ref={headline3Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 7.5vw, 108px)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 0.92,
              color: "var(--accent)",
              opacity: 0,
            }}
          >
            Deserves.
          </div>
        </div>

        {/* Body */}
        <div
          ref={subtextRef}
          style={{
            opacity: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: "420px",
            marginBottom: "40px",
          }}
        >
          UpLevel builds premium website systems, AI phone agents, and automated lead pipelines for elite contractors.{" "}
          <span style={{ color: "var(--text-primary)" }}>
            Live in 48 hours. No templates. No lock-in.
          </span>
        </div>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{
            opacity: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}
        >
          <a
            href={brand.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-cursor="BOOK"
          >
            <span>Start a Project</span>
          </a>
          <button
            className="btn-ghost"
            onClick={() => {
              document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
            }}
            data-cursor="VIEW"
          >
            See Our Work →
          </button>
        </div>

        {/* Trust micro-row */}
        <div
          ref={trustRef}
          style={{
            opacity: 0,
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {["48-Hour Delivery", "Month-to-Month", "VA LLC Est. 2024"].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "7px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
              }}
            >
              <span style={{ color: "var(--accent)", fontSize: "8px" }}>⬥</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.35,
          animation: "bounce 2s ease-in-out infinite",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "7px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          Scroll
        </div>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, var(--accent), transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 768px) {
          .hero-content { max-width: 100% !important; padding: 0 24px !important; }
        }
      `}</style>
    </section>
  );
}
