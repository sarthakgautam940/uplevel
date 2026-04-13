"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { brand, bookUrl } from "../../lib/brand.config";
import TransitionLink from "./TransitionLink";
import MagneticButton from "./MagneticButton";
import { useTransitionCtx } from "@/context/TransitionContext";

const PRELOADER_DONE_EVENT = "uplevel:preloader-done";

const navLinks = [
  { label: "Work",     href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
];

export default function SiteNav() {
  const pathname           = usePathname();
  const { pendingHref }    = useTransitionCtx();
  const headerRef          = useRef<HTMLElement>(null);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready,      setReady]      = useState(false);
  const hasAnimatedRef = useRef(false);
  const lastScrollY    = useRef(0);
  const navHiddenRef   = useRef(false);
  const mobileLinksRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const introWindow = window as typeof window & {
      __UPLEVEL_INITIAL_PATH__?: string;
      __UPLEVEL_HOME_INTRO_ACTIVE__?: boolean;
    };
    const initialPath = introWindow.__UPLEVEL_INITIAL_PATH__ ?? window.location.pathname;
    const introActive =
      initialPath === "/" && introWindow.__UPLEVEL_HOME_INTRO_ACTIVE__ !== false;

    if (!introActive) {
      setReady(true);
      return;
    }

    const handler = () => setReady(true);
    window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true });

    const timeoutId = window.setTimeout(() => setReady(true), 9000);
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, handler);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!ready || hasAnimatedRef.current || !headerRef.current) return;
    hasAnimatedRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(headerRef.current, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      headerRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
    );
  }, [ready]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 28);

      if (!headerRef.current) return;

      const delta = y - lastScrollY.current;
      const isDown = delta > 0;
      const isUp   = delta < 0;
      lastScrollY.current = y;

      if (isDown && y > 80 && !navHiddenRef.current) {
        gsap.to(headerRef.current, { yPercent: -110, duration: 0.3, ease: "power2.in" });
        navHiddenRef.current = true;
      } else if (isUp && navHiddenRef.current) {
        gsap.to(headerRef.current, { yPercent: 0, duration: 0.35, ease: "power2.out" });
        navHiddenRef.current = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const animateMobileLinks = useCallback((open: boolean) => {
    const els = mobileLinksRef.current.filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (open) {
      gsap.fromTo(els,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  useEffect(() => {
    if (mobileOpen) animateMobileLinks(true);
  }, [mobileOpen, animateMobileLinks]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-[100] transition-[background,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "border-b border-[rgba(237,240,247,0.06)] bg-[rgba(6,8,15,0.72)] backdrop-blur-[14px] backdrop-saturate-[1.6]"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{
        opacity: ready ? 1 : 0,
        pointerEvents: pendingHref ? "none" : "auto",
        willChange: "transform, opacity",
      }}
      aria-hidden={!ready}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10 md:py-5">

        {/* Wordmark */}
        <TransitionLink
          href="/"
          className="group relative flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-dim)] transition-colors duration-300 hover:text-[var(--text)]"
          aria-label="UpLevel Services — Home"
        >
          {brand.name}
          <span className="hidden text-[var(--text-dim)]/40 transition-colors duration-300 group-hover:text-[var(--text-dim)]/60 sm:inline">
            Services
          </span>
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--electric)] opacity-40 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        </TransitionLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <TransitionLink
                key={link.label}
                href={link.href}
                className={`nav-link group relative font-body text-[11px] uppercase tracking-[0.16em] transition-colors duration-250 hover:text-[var(--text)] active:scale-[0.96] ${
                  active
                    ? "font-semibold text-[var(--text)]"
                    : "font-medium text-[var(--text-dim)]"
                }`}
              >
                {link.label}
                {active ? (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--electric)] opacity-60"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="absolute -bottom-1 left-1/2 right-1/2 h-px bg-[var(--electric)] opacity-50 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-0 group-hover:right-0"
                    aria-hidden="true"
                  />
                )}
              </TransitionLink>
            );
          })}
          <MagneticButton href={bookUrl} variant="primary" aria-label="Book a strategy call">
            Book a call
          </MagneticButton>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-[5px] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          style={{ cursor: "none" }}
        >
          <span
            className="block h-[1px] w-5 bg-[var(--text-dim)] transition-all duration-300"
            style={{ transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-[1px] w-5 bg-[var(--text-dim)] transition-opacity duration-300"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="block h-[1px] w-5 bg-[var(--text-dim)] transition-all duration-300"
            style={{ transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 md:hidden ${
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "var(--surface)",
          borderBottom: mobileOpen ? "1px solid var(--border)" : "none",
        }}
      >
        <nav className="flex flex-col px-5 pb-8 pt-2" aria-label="Mobile navigation">
          {navLinks.map((link, i) => (
            <div key={link.label} ref={(el) => { mobileLinksRef.current[i] = el; }}>
              <TransitionLink
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block border-b border-[var(--border)] py-4 font-body text-[14px] uppercase tracking-[0.16em] transition-colors hover:text-[var(--text)] ${
                  isActive(link.href)
                    ? "font-semibold text-[var(--text)]"
                    : "font-medium text-[var(--text-dim)]"
                }`}
              >
                {link.label}
              </TransitionLink>
            </div>
          ))}
          <div className="mt-6">
            <MagneticButton href={bookUrl} variant="primary">
              Book a call
            </MagneticButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
