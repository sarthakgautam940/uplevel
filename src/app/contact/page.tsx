import type { Metadata } from "next";
import { brand, bookUrl, siteUrl } from "../../../lib/brand.config";
import PageWrapper from "@/components/PageWrapper";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Let's see if it fits",
  description:
    "Use the brief form or book a 30-minute fit call. Honest assessment of whether UpLevel is the right fit — no pitch.",
  alternates: { canonical: `${siteUrl}/contact` },
};

const TRUST = [
  {
    title: "30-minute fit call.",
    body: "No script. An honest assessment of whether UpLevel is the right fit — and if not, what would need to be true to get there.",
  },
  {
    title: "Straight answers.",
    body: "If the scope, timing, or model isn't a match, you will hear that clearly — along with what would need to change.",
  },
  {
    title: "Response within 1 business day.",
    body: "Usually same day.",
  },
] as const;

export default function ContactPage() {
  return (
    <PageWrapper>
      <main>
        <section
          className="relative overflow-hidden bg-[var(--void)] pb-28 pt-36 md:pb-40 md:pt-48"
          aria-labelledby="contact-heading"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 70% 0%, rgba(201,168,76,0.045) 0%, transparent 50%), linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 35%)",
            }}
          />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="contact-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0V64" fill="none" stroke="rgba(237,240,247,0.022)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>

          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span
                    className="h-px w-8 shrink-0 bg-gradient-to-r from-[var(--warm)]/80 to-transparent md:w-10"
                    aria-hidden="true"
                  />
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                    Start here
                  </p>
                </div>
                <h1
                  id="contact-heading"
                  className="mt-8 font-display font-medium leading-[0.92] tracking-[-0.036em] text-[var(--text)] md:mt-10"
                  style={{ fontSize: "clamp(2.5rem,7vw,4.75rem)" }}
                >
                  Let&apos;s see
                  <br />
                  <span className="text-[var(--text-dim)]">if it fits.</span>
                </h1>
                <p className="mt-8 max-w-[46ch] font-body text-[15px] leading-[1.72] text-[var(--text-dim)]">
                  Book a call to talk it through, or send a brief if you already know the gap. Either
                  path gets the same standard: direct answers, no pitch.
                </p>

                <div className="mt-14 border-t border-[var(--border)] pt-12 md:mt-16 md:pt-14" aria-label="Contact options">
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-dim)]">
                    How we work with you
                  </p>
                  <div className="mt-8 flex flex-col gap-10">
                    {TRUST.map((item) => (
                      <div
                        key={item.title}
                        className="border-l-2 border-[color-mix(in_srgb,var(--warm)_28%,var(--border))] pl-6 transition-[border-color] duration-300 hover:border-[color-mix(in_srgb,var(--warm)_45%,var(--border))]"
                      >
                        <p className="font-display text-[15px] font-medium tracking-[-0.02em] text-[var(--text)]">
                          {item.title}
                        </p>
                        <p className="mt-2 max-w-[40ch] font-body text-[14px] leading-[1.7] text-[var(--text-dim)]">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 border-t border-[var(--border)] pt-10">
                    <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-dim)]">
                      Paths
                    </p>
                    <ul className="mt-5 flex flex-col gap-4 font-body text-[14px]">
                      <li>
                        <a
                          href={bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--text)] transition-colors hover:text-[var(--warm)]"
                        >
                          Book a fit call →
                          <span className="text-[var(--text-dim)]" aria-hidden="true">
                            →
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#project-brief"
                          className="inline-flex items-center gap-1 text-[var(--text)] transition-colors hover:text-[var(--warm)]"
                        >
                          Send a brief →
                          <span className="text-[var(--text-dim)]" aria-hidden="true">
                            →
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`mailto:${brand.email}`}
                          className="text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
                        >
                          {brand.email}
                        </a>
                      </li>
                    </ul>
                    <p className="mt-8 font-body text-[11px] tracking-[0.04em] text-[var(--text-dim)]/55">
                      {brand.jurisdiction}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col lg:col-span-7 lg:min-w-0 lg:sticky lg:top-28 lg:self-start">
                {/* Lead-the-eye: converging rails + center spine into the brief */}
                <div
                  className="pointer-events-none relative -mb-1 flex h-[3.5rem] w-full items-end justify-center sm:h-16 lg:mb-0 lg:h-[4.25rem]"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full max-w-xl text-[var(--warm)]"
                    viewBox="0 0 520 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMax meet"
                  >
                    <defs>
                      <linearGradient id="contact-brief-lead-warm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                        <stop offset="55%" stopColor="currentColor" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.72" />
                      </linearGradient>
                      <linearGradient id="contact-brief-lead-mist" x1="0" y1="0.5" x2="1" y2="0.5">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 32 6 L 32 36 C 32 92 200 124 258 132"
                      stroke="url(#contact-brief-lead-warm)"
                      strokeWidth="1.15"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M 488 6 L 488 36 C 488 92 320 124 262 132"
                      stroke="url(#contact-brief-lead-warm)"
                      strokeWidth="1.15"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M 260 0 L 260 118"
                      stroke="url(#contact-brief-lead-warm)"
                      strokeWidth="1.35"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M 248 126 L 260 138 L 272 126"
                      stroke="currentColor"
                      strokeOpacity="0.55"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="96"
                      y1="134"
                      x2="424"
                      y2="134"
                      stroke="url(#contact-brief-lead-mist)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                <div
                  id="project-brief"
                  className="relative isolate scroll-mt-28 overflow-hidden rounded-2xl border border-white/60 bg-white/[0.88] px-8 pb-8 pt-6 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.55)] ring-1 ring-white/45 backdrop-blur-xl backdrop-saturate-150 md:rounded-3xl md:px-11 md:pb-11 md:pt-8"
                >
                  <div
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent md:inset-x-8"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <ContactForm tone="glass" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageWrapper>
  );
}
