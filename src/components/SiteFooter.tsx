"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, bookUrl, siteUrl } from "../../lib/brand.config";
import TransitionLink from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

const footerNav = [
  { label: "Work",     href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
];

const socials = [
  { label: "LinkedIn",  href: brand.social.linkedin },
  { label: "X",         href: brand.social.x },
  { label: "Instagram", href: brand.social.instagram },
  { label: "YouTube",   href: brand.social.youtube },
  { label: "Facebook",  href: brand.social.facebook },
];

type FooterVariant = "default" | "deep";

export default function SiteFooter({ variant = "default" }: { variant?: FooterVariant }) {
  const deep = variant === "deep";
  const year = new Date().getFullYear();
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);
  const brandColRef  = useRef<HTMLDivElement>(null);
  const colsRef      = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const hasAnimated  = useRef(false);
  const watermarkDrift = useRef<ReturnType<typeof gsap.to> | null>(null);

  /** Match GSAP "from" state before first paint so the footer never flashes the final layout. */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (dividerRef.current) {
        gsap.set(dividerRef.current, { scaleX: 1, transformOrigin: "center center" });
      }
      if (watermarkRef.current) {
        const letters = watermarkRef.current.querySelectorAll(".wm-letter");
        if (letters.length) gsap.set(letters, { opacity: 0.034, y: 0 });
      }
      if (brandColRef.current) gsap.set(brandColRef.current.children, { y: 0, opacity: 1 });
      colsRef.current.filter(Boolean).forEach((col) => gsap.set(col, { y: 0, opacity: 1 }));
      if (bottomRef.current) gsap.set(bottomRef.current, { opacity: 1 });
      return;
    }

    if (dividerRef.current) {
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "center center" });
    }
    if (watermarkRef.current) {
      const letters = watermarkRef.current.querySelectorAll(".wm-letter");
      if (letters.length) gsap.set(letters, { opacity: 0, y: 20 });
    }
    if (brandColRef.current) {
      gsap.set(brandColRef.current.children, { y: 16, opacity: 0 });
    }
    colsRef.current.filter(Boolean).forEach((col) => {
      gsap.set(col, { y: 20, opacity: 0 });
    });
    if (bottomRef.current) {
      gsap.set(bottomRef.current, { opacity: 0 });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const runIntro = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          if (watermarkRef.current && window.innerWidth > 768 && !watermarkDrift.current) {
            watermarkDrift.current = gsap.to(watermarkRef.current, {
              x: "1%",
              duration: 10,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        },
      });

      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "center center" },
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
          0
        );
      }

      if (watermarkRef.current) {
        const letters = watermarkRef.current.querySelectorAll(".wm-letter");
        if (letters.length) {
          tl.fromTo(
            letters,
            { opacity: 0, y: 20 },
            { opacity: 0.034, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
            0.1
          );
        }
      }

      if (brandColRef.current) {
        const children = brandColRef.current.children;
        tl.fromTo(
          children,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out" },
          0.2
        );
      }

      const cols = colsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cols.length) {
        tl.fromTo(
          cols,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" },
          0.35
        );
      }

      if (bottomRef.current) {
        tl.fromTo(bottomRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.7);
      }
    };

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        once: true,
        onEnter: runIntro,
      });
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (!hasAnimated.current && st.progress > 0) runIntro();
      });
    }, sectionRef);

    return () => {
      watermarkDrift.current?.kill();
      watermarkDrift.current = null;
      ctx.revert();
    };
  }, []);

  const watermarkLetters = "UPLEVEL".split("").map((char, i) => (
    <span key={i} className="wm-letter inline-block opacity-0">
      {char}
    </span>
  ));

  const displayDomain = siteUrl.replace(/^https?:\/\//, "");

  return (
    <footer
      ref={sectionRef}
      className={[
        "relative overflow-hidden border-t",
        deep
          ? "border-white/[0.06] bg-[#04060d]"
          : "border-[var(--border)] bg-[var(--surface)]",
      ].join(" ")}
      role="contentinfo"
    >
      {deep && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="footer-deep-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="3"
                stitchTiles="stitch"
                seed="42"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#footer-deep-grain)" />
          </svg>
        </div>
      )}

      {!deep && (
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[80%] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(77,130,255,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {deep && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(45%,320px)] bg-gradient-to-t from-black/25 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Animated divider reference for GSAP */}
      <div
        ref={dividerRef}
        className="absolute left-0 right-0 top-0 h-px bg-[var(--border)]"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      {/* Brand watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          ref={watermarkRef}
          className="font-display font-medium leading-none tracking-[-0.05em] text-[var(--text)] whitespace-nowrap"
          style={{ fontSize: "clamp(4rem,20vw,18rem)" }}
        >
          {watermarkLetters}
        </span>
      </div>

      <div className="relative z-[1] mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10 md:pb-14 md:pt-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div ref={brandColRef}>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--text-dim)]">
              {brand.name}
            </p>
            <p
              className="mt-4 font-display font-medium tracking-[-0.02em] text-[var(--text)]"
              style={{ fontSize: "clamp(1.1rem,2vw,1.45rem)", maxWidth: "26ch" }}
            >
              {brand.shortTagline}
            </p>
            <p className="mt-5 max-w-[38ch] font-body text-[13px] leading-[1.65] text-[var(--text-dim)]">
              Premium websites, AI voice intake, and automation systems for luxury builders, designers, and specialty contractors.
            </p>
          </div>

          {/* Pages */}
          <div ref={(el) => { colsRef.current[0] = el; }}>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-[var(--text-dim)] opacity-50">
              Pages
            </p>
            <nav className="mt-6 flex flex-col gap-4" aria-label="Footer navigation">
              {footerNav.map((link) => (
                <TransitionLink
                  key={link.label}
                  href={link.href}
                  className="font-body text-[13px] text-[var(--text-dim)] transition-colors duration-250 hover:text-[var(--text)]"
                >
                  {link.label}
                </TransitionLink>
              ))}
              <TransitionLink
                href="/privacy"
                className="font-body text-[13px] text-[var(--text-dim)] opacity-40 transition-colors duration-250 hover:opacity-70"
              >
                Privacy Policy
              </TransitionLink>
              <TransitionLink
                href="/terms"
                className="font-body text-[13px] text-[var(--text-dim)] opacity-40 transition-colors duration-250 hover:opacity-70"
              >
                Terms
              </TransitionLink>
            </nav>
          </div>

          {/* Contact */}
          <div ref={(el) => { colsRef.current[1] = el; }}>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-[var(--text-dim)] opacity-50">
              Contact
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  deep
                    ? "font-body text-[13px] text-[var(--text-dim)] transition-colors duration-250 hover:text-[var(--warm)]"
                    : "font-body text-[13px] text-[var(--electric)] transition-opacity duration-250 hover:opacity-70"
                }
              >
                Book a call →
              </a>
              <TransitionLink
                href="/contact"
                className={
                  deep
                    ? "font-body text-[13px] text-[var(--text-dim)] transition-colors duration-250 hover:text-[var(--warm)]"
                    : "font-body text-[13px] text-[var(--electric)] opacity-80 transition-opacity duration-250 hover:opacity-100"
                }
              >
                Fill out our form →
              </TransitionLink>
              <a
                href={`mailto:${brand.email}`}
                className="font-body text-[13px] text-[var(--text-dim)] transition-colors duration-250 hover:text-[var(--text)]"
              >
                {brand.email}
              </a>
            </div>
          </div>

          {/* Social */}
          <div ref={(el) => { colsRef.current[2] = el; }}>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-[var(--text-dim)] opacity-50">
              Connect
            </p>
            <div className="mt-6 flex flex-col gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[13px] text-[var(--text-dim)] transition-colors duration-250 hover:text-[var(--text)]"
                >
                  {s.label} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          ref={bottomRef}
          className="mt-16 flex flex-col gap-3 border-t border-[var(--border)] pt-8 text-[var(--text-dim)] sm:flex-row sm:items-center sm:justify-between md:mt-20"
        >
          <span className="font-body text-[11px]">
            © {year} {brand.legalName}. All rights reserved.
          </span>
          <span className="font-body text-[11px] opacity-50">
            Lead routing automation
          </span>
          <a
            href={siteUrl}
            className="font-body text-[11px] transition-colors duration-250 hover:text-[var(--text)]"
          >
            {displayDomain}
          </a>
        </div>
      </div>
    </footer>
  );
}
