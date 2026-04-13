"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useTransitionCtx } from "@/context/TransitionContext";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  /** Reference hero styling flag — primary CTA already uses luxe gold treatment */
  luxe?: boolean;
  "aria-label"?: string;
};

export default function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
  luxe: _luxe,
  "aria-label": ariaLabel,
}: Props) {
  void _luxe;
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef  = useRef<HTMLAnchorElement>(null);
  const { setPendingHref } = useTransitionCtx();
  const pathname = usePathname();

  const normalizePath = (value: string) => {
    const clean = value.split("?")[0].split("#")[0];
    if (clean === "/") return "/";
    return clean.replace(/\/+$/, "");
  };

  /* ── Magnetic pull + click spring ──────────────── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const btn  = btnRef.current;
    if (!wrap || !btn) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    const strength = 0.3;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < 130) {
        currentX = dx * strength;
        currentY = dy * strength;
        gsap.to(btn, {
          x: currentX,
          y: currentY,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onLeave = () => {
      currentX = 0;
      currentY = 0;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1,0.5)",
        overwrite: "auto",
      });
    };

    const onDown = () => {
      gsap.to(btn, {
        scale: 0.93,
        duration: 0.1,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    const onUp = () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1.2, 0.5)",
        overwrite: "auto",
      });
    };

    wrap.addEventListener("mousemove", onMove,  { passive: true });
    wrap.addEventListener("mouseleave", onLeave);
    btn.addEventListener("mousedown",  onDown);
    btn.addEventListener("mouseup",    onUp);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("mousedown",  onDown);
      btn.removeEventListener("mouseup",    onUp);
    };
  }, []);

  /* ── Route awareness ──────────────────────────── */
  const isInternal =
    href.startsWith("/") &&
    !href.startsWith("/#") &&
    !href.startsWith("//");
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isInternal) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (normalizePath(pathname) === normalizePath(href)) return;
    setPendingHref(href);
  };

  const base =
    variant === "primary"
      ? "cta-primary magnetic-btn inline-flex items-center justify-center rounded-full border border-[var(--warm)] bg-[var(--warm)] px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--void)] shadow-[0_0_0_1px_rgba(201,168,76,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(201,168,76,0.35)]"
      : "inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-transparent px-6 py-3 font-body text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors duration-300 hover:border-[var(--text-dim)]/60 hover:text-[var(--text)]";

  return (
    <div ref={wrapRef} className="inline-block" suppressHydrationWarning>
      <a
        ref={btnRef}
        href={href}
        onClick={handleClick}
        className={`${base} ${className}`}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        style={{ willChange: "transform" }}
      >
        {children}
      </a>
    </div>
  );
}
