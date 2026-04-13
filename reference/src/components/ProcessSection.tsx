"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "../../lib/brand.config";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const innerRef     = useRef<HTMLDivElement>(null);
  const hasEntered   = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const inner   = innerRef.current;
    if (!section || !inner) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Reduced motion — instant reveal ─────────────── */
    if (reduced) {
      section.querySelectorAll(".proc-title").forEach((n) => {
        (n as HTMLElement).style.clipPath = "none";
      });
      section.querySelectorAll(".proc-body, .proc-meta, .proc-eyebrow, .proc-sub").forEach((n) => {
        const h = n as HTMLElement;
        h.style.opacity   = "1";
        h.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────────
       * PARALLAX OVERLAY ENTRANCE
       * The white section starts slightly below and slides
       * up to cover the dark section above it. This gives
       * the feel of a new "layer" emerging, not a flat
       * scroll-down-to-next-section transition.
       * ───────────────────────────────────────────────── */
      gsap.set(section, { y: "11vh" });

      ScrollTrigger.create({
        trigger: section,
        start: "top 92%",
        end: "top 8%",
        scrub: 0.85,
        onUpdate: (self) => {
          const y = (1 - self.progress) * 11;
          gsap.set(section, { y: `${y}vh` });
        },
      });

      /* ── Interior animations (once) ─────────────────── */
      const eyebrow = section.querySelector(".proc-eyebrow");
      if (eyebrow) {
        gsap.from(eyebrow, {
          x: -36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
      }

      const stickyHead = section.querySelector(".proc-sticky-head");
      if (stickyHead) {
        gsap.fromTo(stickyHead,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 74%", once: true },
          }
        );
      }

      const subCopy = section.querySelector(".proc-sub");
      if (subCopy) {
        gsap.from(subCopy, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        });
      }

      /* Per-step micro-stagger */
      const items = section.querySelectorAll(".proc-item");
      items.forEach((item) => {
        const title = item.querySelector(".proc-title");
        const body  = item.querySelector(".proc-body");
        const meta  = item.querySelector(".proc-meta");

        if (title) {
          gsap.fromTo(title,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.95,
              ease: "power4.out",
              scrollTrigger: { trigger: item, start: "top 84%", once: true },
            }
          );
        }

        if (body && meta) {
          gsap.from([body, meta], {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.15,
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative z-[15] bg-transparent text-[var(--void)]"
      style={{
        willChange: "transform",
        marginTop: "clamp(-2.75rem, -6vw, -1.25rem)",
      }}
      aria-labelledby="process-heading"
    >
      <div
        ref={innerRef}
        className="relative bg-[var(--text)] py-28 md:py-36"
        style={{
          clipPath: "polygon(0 clamp(40px, 8vw, 80px), 100% 0, 100% 100%, 0 100%)",
          backgroundImage:
            "linear-gradient(180deg, rgba(6,8,15,0.02) 0%, transparent 28%), repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(6,8,15,0.012) 23px, rgba(6,8,15,0.012) 24px)",
        }}
      >
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-24">

          {/* Left — sticky panel */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="proc-eyebrow font-body text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--void)]/50">
              The method
            </p>
            <h2
              id="process-heading"
              className="proc-sticky-head mt-5 font-display leading-[1.02] tracking-[-0.025em] text-[var(--void)]"
              style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", overflow: "hidden" }}
            >
              Fourteen days.
              <br />
              Not fourteen weeks.
            </h2>
            <p className="proc-sub mt-6 max-w-[34ch] font-body text-[15px] leading-[1.65] text-[var(--void)]/65">
              Four steps. Each one earns the next. The industry average for
              custom sites is 8–14 weeks. This is 14 days.
            </p>

            {/* Visual step dots */}
            <div className="mt-10 flex items-center gap-2" aria-hidden="true">
              {brand.process.map((p) => (
                <div
                  key={p.step}
                  className="h-1 rounded-full bg-[var(--void)] opacity-15"
                  style={{ width: p.step === "01" ? "2rem" : "0.5rem" }}
                />
              ))}
            </div>
          </div>

          {/* Right — process steps */}
          <ol className="border-t border-[var(--void)]/10" role="list">
            {brand.process.map((p) => (
              <li
                key={p.step}
                className="proc-item group border-b border-[var(--void)]/10 py-12 md:py-16"
              >
                <div className="flex flex-col gap-5 md:flex-row md:gap-12 md:items-start">
                  <span
                    className="proc-meta shrink-0 font-display leading-none text-[var(--void)]/10 transition-colors duration-400 group-hover:text-[var(--void)]/18"
                    style={{ fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 400 }}
                  >
                    {p.step}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="proc-title font-display tracking-[-0.02em] text-[var(--void)]"
                      style={{ fontSize: "clamp(1.5rem,2.8vw,2.25rem)", fontWeight: 400, overflow: "hidden" }}
                    >
                      {p.title}
                    </h3>
                    <p className="proc-body mt-4 max-w-[44ch] font-body text-[15px] leading-[1.7] text-[var(--void)]/68">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>
    </section>
  );
}
