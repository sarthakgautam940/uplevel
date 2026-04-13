"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useTransitionCtx } from "@/context/TransitionContext";

function normalizePath(value: string) {
  const clean = value.split("?")[0].split("#")[0];
  if (clean === "/") return "/";
  return clean.replace(/\/+$/, "");
}

function formatRouteLabel(href: string | null) {
  if (!href || normalizePath(href) === "/") return "Home";

  const clean = href.split("?")[0].split("#")[0];
  const segment = clean.split("/").filter(Boolean).at(-1) ?? "home";

  return segment
    .split("-")
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(" ");
}

export default function PageTransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  const { pendingHref, setPendingHref } = useTransitionCtx();
  const pathname = usePathname();
  const router = useRouter();

  const prevPathRef = useRef(pathname);
  const isAnimatingRef = useRef(false);
  const failSafeRef = useRef<number | null>(null);
  const [routeLabel, setRouteLabel] = useState(formatRouteLabel(pathname));

  const clearFailSafe = useCallback(() => {
    if (!failSafeRef.current) return;
    window.clearTimeout(failSafeRef.current);
    failSafeRef.current = null;
  }, []);

  const hardReset = useCallback(() => {
    clearFailSafe();
    document.body.classList.remove("transitioning");
    isAnimatingRef.current = false;

    if (!overlayRef.current) return;

    gsap.set(overlayRef.current, { autoAlpha: 0 });
    if (washRef.current) gsap.set(washRef.current, { opacity: 0 });
    if (plateRef.current) gsap.set(plateRef.current, { opacity: 0, scale: 0.965, y: 10 });
    if (sheenRef.current) gsap.set(sheenRef.current, { opacity: 0, xPercent: -16 });
    if (labelRef.current) {
      gsap.set(labelRef.current, {
        opacity: 0,
        y: 8,
        clipPath: "inset(0 100% 0 0)",
        filter: "blur(6px)",
      });
    }
    if (ruleRef.current) {
      gsap.set(ruleRef.current, {
        opacity: 0,
        scaleX: 0.72,
        transformOrigin: "center center",
      });
    }
  }, [clearFailSafe]);

  useLayoutEffect(() => {
    hardReset();
  }, [hardReset]);

  useEffect(() => {
    return () => {
      hardReset();
    };
  }, [hardReset]);

  useEffect(() => {
    if (!pendingHref || !overlayRef.current) return;
    if (isAnimatingRef.current) return;

    const nextPath = normalizePath(pendingHref);
    const currentPath = normalizePath(pathname);

    if (nextPath === currentPath) {
      setPendingHref(null);
      hardReset();
      return;
    }

    isAnimatingRef.current = true;
    setRouteLabel(formatRouteLabel(pendingHref));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push(pendingHref);
      setPendingHref(null);
      isAnimatingRef.current = false;
      return;
    }

    document.body.classList.add("transitioning");
    failSafeRef.current = window.setTimeout(() => {
      setPendingHref(null);
      hardReset();
    }, 2600);

    let timeline: gsap.core.Timeline | null = null;
    let navigated = false;
    const frameId = requestAnimationFrame(() => {
      timeline = gsap.timeline({
        onComplete: () => {
          if (navigated) return;
          navigated = true;
          router.push(pendingHref);
          setPendingHref(null);
        },
      });

      timeline.set(overlayRef.current, { autoAlpha: 1 }, 0);

      if (washRef.current) {
        timeline.to(washRef.current, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0);
      }

      if (plateRef.current) {
        timeline.to(
          plateRef.current,
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0.03,
        );
      }

      if (ruleRef.current) {
        timeline.to(
          ruleRef.current,
          { opacity: 1, scaleX: 1, duration: 0.34, ease: "power3.out" },
          0.13,
        );
      }

      if (labelRef.current) {
        timeline.to(
          labelRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0)",
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power3.out",
          },
          0.11,
        );
      }

      if (sheenRef.current) {
        timeline.to(
          sheenRef.current,
          { opacity: 0.38, xPercent: 12, duration: 0.48, ease: "power2.out" },
          0.08,
        );
      }

      timeline.call(() => {
        if (navigated) return;
        navigated = true;
        router.push(pendingHref);
        setPendingHref(null);
      }, [], 0.25);
    });

    return () => {
      cancelAnimationFrame(frameId);
      timeline?.kill();
    };
  }, [hardReset, pathname, pendingHref, router, setPendingHref]);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;
    setRouteLabel(formatRouteLabel(pathname));

    if (!isAnimatingRef.current || !overlayRef.current) return;
    clearFailSafe();

    const timeline = gsap.timeline({
      onComplete: () => {
        hardReset();
      },
    });

    if (plateRef.current) {
      timeline.to(
        plateRef.current,
        { opacity: 0, y: -8, scale: 0.985, duration: 0.28, ease: "power2.out" },
        0,
      );
    }

    if (washRef.current) {
      timeline.to(washRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.03);
    }

    if (labelRef.current) {
      timeline.to(
        labelRef.current,
        { opacity: 0, y: -6, duration: 0.2, ease: "power2.out" },
        0,
      );
    }

    if (ruleRef.current) {
      timeline.to(
        ruleRef.current,
        { opacity: 0, scaleX: 0.86, duration: 0.2, ease: "power2.out" },
        0,
      );
    }

    timeline.to(
      overlayRef.current,
      { autoAlpha: 0, duration: 0.3, ease: "power2.out" },
      0.05,
    );

    return () => {
      timeline.kill();
    };
  }, [clearFailSafe, hardReset, pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        pointerEvents: "none",
        visibility: "hidden",
      }}
    >
      <div
        ref={washRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(10,14,20,0.14) 0%, rgba(6,8,13,0.38) 58%, rgba(4,6,10,0.54) 100%)",
          backdropFilter: "blur(8px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: "1.5rem",
        }}
      >
        <div
          ref={plateRef}
          style={{
            position: "relative",
            width: "min(460px, calc(100vw - 2.4rem))",
            borderRadius: "26px",
            border: "1px solid rgba(237,240,247,0.1)",
            background:
              "linear-gradient(164deg, rgba(255,255,255,0.05) 0%, rgba(11,15,24,0.74) 52%, rgba(9,12,18,0.84) 100%)",
            boxShadow:
              "0 24px 80px -40px rgba(0,0,0,0.84), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.02)",
            overflow: "hidden",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            ref={sheenRef}
            style={{
              position: "absolute",
              inset: "-30% -10%",
              background:
                "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 68%)",
              filter: "blur(10px)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "1.2rem 1.3rem 1.15rem 1.3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <span
              ref={labelRef}
              style={{
                display: "inline-block",
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 4.8vw, 2.7rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.024em",
                color: "rgba(245,247,251,0.95)",
                whiteSpace: "nowrap",
              }}
            >
              {routeLabel}
            </span>

            <div
              ref={ruleRef}
              style={{
                marginTop: "0.9rem",
                height: "1px",
                width: "min(260px, 72%)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(201,168,76,0.24) 50%, rgba(255,255,255,0.08) 100%)",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
