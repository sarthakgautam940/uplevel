"use client";

import { useEffect, useRef } from "react";
import { brand } from "@/config/brand.config";
import LogoMark from "./LogoMark";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Services: [
    "Website Systems",
    "AI Concierge",
    "SEO & Growth",
    "Brand Identity",
  ],
  Company: ["About", "Process", "Pricing", "Case Studies"],
  Legal: ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

export default function Footer() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Three.js footer animation — morphing gold form
  useEffect(() => {
    let renderer: import("three").WebGLRenderer;
    let animId: number;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let group: import("three").Group;
    let scrollProgress = 0;

    const init = async () => {
      const THREE = await import("three");
      const container = canvasRef.current;
      if (!container) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      group = new THREE.Group();
      scene.add(group);

      // Create letter-like 3D boxes for UPLEVEL
      const letters = "UPLEVEL".split("");
      const spacing = 1.2;
      const totalWidth = letters.length * spacing;

      letters.forEach((letter, i) => {
        const geo = new THREE.BoxGeometry(0.8, 1.1, 0.15);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#C9A87C"),
          metalness: 0.8,
          roughness: 0.25,
        });
        const box = new THREE.Mesh(geo, mat);

        box.position.x = i * spacing - totalWidth / 2 + spacing / 2;
        // Start rotated in random direction
        box.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
        box.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
        box.userData.targetRotX = 0;
        box.userData.targetRotY = 0;
        box.userData.delay = i * 0.12;
        box.userData.index = i;
        group.add(box);
      });

      // Lights
      const ambient = new THREE.AmbientLight(0xFFF5E0, 0.5);
      scene.add(ambient);

      const key = new THREE.PointLight(0xFFF5E0, 4, 20);
      key.position.set(4, 4, 4);
      scene.add(key);

      const fill = new THREE.PointLight(0xC9A87C, 2, 15);
      fill.position.set(-4, -2, 3);
      scene.add(fill);

      // Particles
      const pGeo = new THREE.BufferGeometry();
      const pCount = 80;
      const positions = new Float32Array(pCount * 3);
      for (let j = 0; j < pCount; j++) {
        positions[j * 3] = (Math.random() - 0.5) * 14;
        positions[j * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[j * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xC9A87C,
        size: 0.025,
        transparent: true,
        opacity: 0.4,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Track scroll into footer
      const handleScroll = () => {
        const el = container.closest("footer");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
        );
        scrollProgress = progress;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = Date.now() * 0.001;

        group.children.forEach((child, i) => {
          const mesh = child as import("three").Mesh;
          const delay = mesh.userData.delay as number;
          const localProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 3));

          // Lerp rotation to target (settled) position
          mesh.rotation.x +=
            (mesh.userData.targetRotX - mesh.rotation.x) * 0.08 * localProgress;
          mesh.rotation.y +=
            (mesh.userData.targetRotY - mesh.rotation.y) * 0.08 * localProgress;

          // Float gently
          mesh.position.y = Math.sin(t * 0.5 + i * 0.8) * 0.06 * localProgress;

          // Scale in
          const scale = 0.3 + localProgress * 0.7;
          mesh.scale.setScalar(scale);
        });

        // Drift particles upward
        const posAttr = particles.geometry.attributes
          .position as import("three").BufferAttribute;
        for (let j = 0; j < pCount; j++) {
          posAttr.array[j * 3 + 1] += 0.003;
          if (posAttr.array[j * 3 + 1] > 2.5) {
            posAttr.array[j * 3 + 1] = -2.5;
          }
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanup = init();
    return () => {
      cancelAnimationFrame(animId);
      cleanup.then((fn) => fn && fn());
      if (renderer) {
        renderer.dispose();
        renderer.domElement?.remove();
      }
    };
  }, []);

  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-dim)",
      }}
    >
      {/* Three.js animated element */}
      <div
        ref={canvasRef}
        style={{
          height: "320px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          borderBottom: "1px solid var(--border-dim)",
        }}
      />

      {/* Footer content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) clamp(32px, 4vw, 48px)",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "60px",
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <LogoMark size={32} />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  UP<span style={{ color: "var(--accent)" }}>LEVEL</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "6px",
                    letterSpacing: "0.35em",
                    color: "var(--text-dim)",
                    marginTop: "2px",
                  }}
                >
                  SERVICES
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 300,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "240px",
                marginBottom: "24px",
              }}
            >
              Premium digital systems for elite contractors. Richmond, Virginia.
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              {[
                { icon: Instagram, href: brand.social.instagram, label: "Instagram" },
                { icon: Linkedin, href: brand.social.linkedin, label: "LinkedIn" },
                { icon: Twitter, href: brand.social.twitter, label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "1px solid var(--border-dim)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(201,168,124,0.3)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border-dim)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-secondary)";
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <a
              href={`mailto:${brand.email}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-secondary)")
              }
            >
              {brand.email}
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: "20px",
                }}
              >
                {heading}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {links.map((link) => (
                  <a key={link} href="#" className="footer-link">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="hr-accent" style={{ marginBottom: "24px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.14em",
              color: "var(--text-dim)",
            }}
          >
            © {new Date().getFullYear()} UpLevel Services LLC · Virginia LLC · Est. 2024
          </div>

          <div className="availability-badge" style={{ display: "inline-flex" }}>
            <span className="availability-dot" />
            {brand.availability.label} This Month
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:last-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
