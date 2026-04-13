"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutAnimations() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(".about-card, .about-card-stripe, .about-principle-row", {
        clearProps: "all",
        opacity: 1,
        y: 0,
        x: 0,
        scaleY: 1,
      });
      return;
    }

    gsap.set(".about-card", { y: 32, opacity: 0 });
    gsap.set(".about-card-stripe", { scaleY: 0, transformOrigin: "center top" });
    gsap.set(".about-principle-row", { opacity: 0, x: -18 });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const wrap = document.querySelector(".about-cards");
      const cards = document.querySelectorAll(".about-card");
      const stripes = document.querySelectorAll(".about-card-stripe");

      if (wrap && cards.length) {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              y: 0,
              opacity: 1,
              duration: 0.72,
              stagger: 0.12,
              ease: "power3.out",
            });
            gsap.to(stripes, {
              scaleY: 1,
              duration: 0.68,
              stagger: 0.12,
              ease: "power3.out",
              delay: 0.06,
            });
          },
        });
      }

      document.querySelectorAll(".about-check path").forEach((check) => {
        gsap.fromTo(
          check,
          { strokeDashoffset: 20 },
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: check.closest(".about-standard"),
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      document.querySelectorAll<HTMLElement>(".about-principle-row").forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 86%",
          once: true,
          onEnter: () =>
            gsap.to(row, {
              opacity: 1,
              x: 0,
              duration: 0.68,
              ease: "power3.out",
              delay: i * 0.06,
            }),
        });
      });

      const nextBand = document.querySelector(".about-next-band");
      const pillars = document.querySelectorAll(".about-next-pillar");
      if (nextBand && pillars.length) {
        ScrollTrigger.create({
          trigger: nextBand,
          start: "top 78%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              pillars,
              { y: 18, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.62,
                stagger: 0.1,
                ease: "power3.out",
              }
            ),
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
