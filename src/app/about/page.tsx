import type { Metadata } from "next";
import { brand, bookUrl, siteUrl } from "../../../lib/brand.config";
import PageWrapper from "@/components/PageWrapper";
import SiteFooter from "@/components/SiteFooter";
import MagneticButton from "@/components/MagneticButton";
import TransitionLink from "@/components/TransitionLink";
import AboutAnimations from "@/components/AboutAnimations";

export const metadata: Metadata = {
  title: "About — One Operator. Zero Dilution.",
  description:
    "UpLevel Services is a solo operator studio — not an agency. Strategy, design, engineering, and AI configuration all flow through the same person.",
  alternates: { canonical: `${siteUrl}/about` },
};

const principles = [
  {
    n: "01",
    label: "Conversion over decoration.",
    body: "If it doesn't sharpen trust or move the right visitor forward — it doesn't stay. Beautiful is a byproduct of clear. Every element on every page is tested against one question: does this move someone closer to calling?",
  },
  {
    n: "02",
    label: "Clarity as a premium signal.",
    body: "Confusion reads cheap faster than bad taste does. Every element on every page has a reason to be there. If two layouts both work, the one that requires less interpretation wins.",
  },
  {
    n: "03",
    label: "One operator. Zero dilution.",
    body: "No account managers between strategy and execution. Every decision made by the person building it. That constraint is not a limitation — it is the reason quality doesn't dilute.",
  },
  {
    n: "04",
    label: "Proof before promise.",
    body: "Standards are shown through the work, the response time, and the decisions — not through what we claim to be. If it isn't in the work index, it didn't happen.",
  },
  {
    n: "05",
    label: "Technology should disappear.",
    body: "AI is not the product. The buyer's experience is. The best AI integration is the one your clients never notice — it just means they got an answer at 11pm and called you in the morning.",
  },
];

const standards = [
  {
    n: "01",
    title: "Direct communication",
    body: "You reach the person building your site — not an account manager.",
  },
  {
    n: "02",
    title: "Scope precision",
    body: "Every SOW is specific. Additional work beyond scope is invoiced at the agreed rate, never assumed.",
  },
  {
    n: "03",
    title: "No decorative strategy",
    body: "Every recommendation has a revenue rationale.",
  },
  {
    n: "04",
    title: "14-day builds",
    body: "Not because it's rushed — because the system is built to move precisely.",
  },
] as const;

const purposeCards = [
  {
    label: "What we do",
    statement:
      "To build digital systems that make premium service businesses look and perform as well online as they do in real life — and close the gap between attention and action.",
  },
  {
    label: "What we're working toward",
    statement:
      "A market where the best operators are not hidden behind weak digital first impressions. Where craft is visible. Where quality finds its audience.",
  },
  {
    label: "Why it matters",
    statement:
      "To remove the friction, doubt, and dead space that cost high-value businesses trust before the first conversation ever starts.",
  },
] as const;

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 shrink-0 bg-gradient-to-r from-[var(--warm)]/85 to-transparent md:w-10" aria-hidden="true" />
      <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
        {children}
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageWrapper>
      <main>
        <AboutAnimations />

        {/* ── Hero ───────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-[var(--void)] pb-28 pt-36 md:pb-36 md:pt-48"
          aria-labelledby="about-heading"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.65]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="about-hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0V64" fill="none" stroke="rgba(237,240,247,0.022)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-hero-grid)" />
          </svg>
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(185deg, rgba(255,255,255,0.03) 0%, transparent 42%), radial-gradient(ellipse 75% 55% at 90% -5%, rgba(201,168,76,0.07) 0%, transparent 52%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(77,130,255,0.04) 0%, transparent 55%)",
            }}
          />

          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <Eyebrow>The operating model</Eyebrow>

            <h1
              id="about-heading"
              className="mt-8 max-w-[14ch] font-display font-medium leading-[0.92] tracking-[-0.038em] text-[var(--text)] md:mt-10"
              style={{ fontSize: "clamp(2.65rem,7vw,5.25rem)" }}
            >
              One operator.
              <br />
              <span className="text-[var(--warm)]">Zero dilution.</span>
            </h1>

            <div className="mt-14 grid grid-cols-1 gap-12 border-l border-[color-mix(in_srgb,var(--warm)_30%,var(--border))] pl-6 md:mt-16 md:grid-cols-2 md:gap-16 md:pl-8 lg:max-w-[88%]">
              <p className="font-body text-[15px] leading-[1.75] text-[var(--text-dim)]">
                UpLevel is not structured like an agency. Strategy, architecture, design, engineering,
                and AI configuration all flow through the same person. What you discuss in the first call
                is what gets built. Not briefed. Not handed off. Built.
              </p>
              <p className="font-body text-[15px] leading-[1.75] text-[var(--text-dim)]">
                The businesses we work with pay premium fees for premium outcomes. Inserting account
                managers and junior designers between the client and the result is how agencies justify
                overhead. We do not have overhead. We have accountability.
              </p>
            </div>
          </div>
        </section>

        {/* ── Purpose — paper runway ─────────────────────────── */}
        <section
          className="border-t border-black/[0.05] bg-[#e8e5df] py-24 md:py-28"
          aria-labelledby="purpose-heading"
        >
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 lg:items-end">
              <div className="lg:col-span-5">
                <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Why this exists
                </p>
                <h2
                  id="purpose-heading"
                  className="mt-4 font-display font-medium leading-[1.02] tracking-[-0.03em] text-neutral-900"
                  style={{ fontSize: "clamp(1.85rem,3.8vw,3.15rem)" }}
                >
                  Most excellent businesses
                  <br />
                  <span className="text-neutral-500">are invisible online.</span>
                </h2>
              </div>
              <p className="font-body text-[14px] leading-[1.75] text-neutral-600 lg:col-span-7 lg:max-w-[54ch] lg:pb-1">
                The gap between the quality of what premium service businesses do and the quality of how
                they appear online is not an oversight. It is the result of an industry that prioritizes
                visual templates over conversion systems, and beautiful screenshots over measurable business
                outcomes. UpLevel exists to close that gap — specifically for businesses whose work has
                already earned the right to look as good as it is.
              </p>
            </div>

            <div className="about-cards mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
              {purposeCards.map((item) => (
                <article
                  key={item.label}
                  className="about-card group relative overflow-hidden rounded-sm border border-neutral-200/90 bg-white p-7 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.12)] md:p-8"
                >
                  <div
                    className="about-card-stripe pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top bg-[var(--warm)]"
                    aria-hidden="true"
                  />
                  <p className="pl-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                    {item.label}
                  </p>
                  <p
                    className="mt-5 pl-4 font-display font-normal leading-[1.45] tracking-[-0.018em] text-neutral-900"
                    style={{ fontSize: "clamp(1rem,1.35vw,1.2rem)" }}
                  >
                    {item.statement}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Standards — split editorial + bento cards ─────── */}
        <section
          className="relative overflow-hidden bg-[var(--void)] py-24 md:py-32"
          aria-labelledby="standards-heading"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="about-standards-grid" width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M52 0H0V52" fill="none" stroke="rgba(237,240,247,0.02)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-standards-grid)" />
          </svg>
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 0% 45%, rgba(77,130,255,0.06) 0%, transparent 52%), radial-gradient(ellipse 45% 42% at 100% 20%, rgba(201,168,76,0.045) 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 xl:gap-x-12">
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>What to expect</Eyebrow>
                <h2
                  id="standards-heading"
                  className="mt-6 max-w-[14ch] font-display font-medium leading-[1.05] tracking-[-0.028em] text-[var(--text)] md:mt-7"
                  style={{ fontSize: "clamp(1.65rem,3.2vw,2.65rem)" }}
                >
                  The working
                  <br />
                  <span className="text-[var(--text-dim)]">agreement.</span>
                </h2>
                <p className="mt-8 max-w-[36ch] border-l border-[color-mix(in_srgb,var(--warm)_35%,var(--border))] pl-5 font-body text-[14px] leading-[1.75] text-[var(--text-dim)] md:mt-9 md:pl-6 md:text-[15px]">
                  Four commitments, written in plain language — the same terms you&apos;d get in scope, just
                  legible up front.
                </p>
              </div>

              <div className="relative min-h-0 lg:col-span-7 xl:col-span-8">
                <p
                  className="pointer-events-none absolute -right-2 top-0 select-none font-display font-medium leading-none tracking-[-0.06em] text-[var(--text)] opacity-[0.06] sm:-right-4 md:top-4"
                  style={{ fontSize: "clamp(4.5rem,16vw,11rem)" }}
                  aria-hidden="true"
                >
                  IV
                </p>
                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  {standards.map((item) => (
                    <article
                      key={item.n}
                      className="about-standard group relative overflow-hidden rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-5 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.45)] transition-[border-color,background-color] duration-300 hover:border-[color-mix(in_srgb,var(--warm)_38%,var(--border))] hover:bg-[rgba(77,130,255,0.04)] md:p-6"
                    >
                      <div
                        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top bg-[var(--warm)] opacity-90 transition-transform duration-500 group-hover:scale-y-110"
                        aria-hidden="true"
                      />
                      <div className="relative flex gap-4 pl-3.5 md:gap-4 md:pl-4">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="about-check mt-0.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 8.5L6.5 12.5L13.5 4.5"
                            stroke="var(--warm)"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="20"
                            strokeDashoffset="20"
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-dim)]">
                            {item.n}
                          </p>
                          <h3
                            className="mt-2 font-display font-medium tracking-[-0.02em] text-[var(--text)]"
                            style={{ fontSize: "clamp(1.02rem,1.35vw,1.18rem)" }}
                          >
                            {item.title}
                          </h3>
                          <p className="mt-2.5 font-body text-[13px] leading-[1.72] text-[var(--text-dim)] md:text-[14px]">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Principles (surface) ───────────────────────────── */}
        <section className="bg-[var(--surface)] py-24 md:py-36" aria-labelledby="principles-heading">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-2 md:items-end md:gap-12 md:pb-20">
              <div>
                <Eyebrow>Core values — expanded</Eyebrow>
                <h2
                  id="principles-heading"
                  className="mt-5 font-display font-medium leading-[1.04] tracking-[-0.026em] text-[var(--text)]"
                  style={{ fontSize: "clamp(1.65rem,3.5vw,2.85rem)" }}
                >
                  How decisions
                  <br />
                  <span className="text-[var(--text-dim)]">get made.</span>
                </h2>
              </div>
              <p className="max-w-[42ch] font-body text-[14px] leading-[1.72] text-[var(--text-dim)] md:justify-self-end md:text-right">
                Not a values slide. The actual criteria used when a design choice has two reasonable paths.
              </p>
            </div>

            <div className="border-t border-[var(--border)]">
              {principles.map((p) => (
                <div
                  key={p.n}
                  className="about-principle-row group grid grid-cols-1 gap-4 border-b border-[var(--border)] py-8 transition-colors duration-300 hover:bg-[rgba(77,130,255,0.035)] md:grid-cols-[72px_minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-10"
                >
                  <span
                    className="font-display tabular-nums text-[var(--text-dim)] transition-opacity duration-300 group-hover:opacity-50"
                    style={{ fontSize: "clamp(0.8rem,1.05vw,0.95rem)", opacity: 0.2, fontWeight: 400 }}
                  >
                    {p.n}
                  </span>
                  <h3
                    className="font-display font-normal tracking-[-0.02em] text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--electric)]"
                    style={{ fontSize: "clamp(1.02rem,1.5vw,1.2rem)" }}
                  >
                    {p.label}
                  </h3>
                  <p className="font-body text-[13px] leading-[1.75] text-[var(--text-dim)] md:text-[14px]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Operator ───────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-[var(--void)] py-24 md:py-32"
          aria-labelledby="operator-heading"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.4]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="about-operator-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M56 0H0V56" fill="none" stroke="rgba(237,240,247,0.022)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-operator-grid)" />
          </svg>
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(201,168,76,0.055) 0%, transparent 50%)",
            }}
          />

          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-5 lg:gap-y-0 xl:gap-x-6">
              <div className="text-left lg:col-span-8">
                <Eyebrow>{`Founded ${brand.foundingYear}`}</Eyebrow>
                <h2
                  id="operator-heading"
                  className="mt-4 font-display font-medium tracking-[-0.024em] text-[var(--text)] md:mt-5"
                  style={{ fontSize: "clamp(1.5rem,2.8vw,2.15rem)" }}
                >
                  {brand.operator}
                  <span className="text-[var(--text-dim)]"> — </span>
                  {brand.operatorTitle}
                </h2>
                <p className="mt-6 max-w-[58ch] font-body text-[15px] leading-[1.78] text-[var(--text-dim)] md:mt-7 md:text-[16px]">
                  I started UpLevel after too many conversations where serious operators thought they were
                  hiring the person with the judgment — and got a conveyor belt instead. The commitment is
                  plain: the same person on the first call builds the work, answers when it needs attention,
                  and stays accountable long after launch. I keep the roster small on purpose, not as a flex,
                  but because good work doesn&apos;t happen at arm&apos;s length. I care whether clients are
                  proud to send a prospect to their site, and I stay stubborn about the details that earn that
                  trust. If the fit isn&apos;t right, I&apos;ll say so before anyone asks for a commitment.
                  What I&apos;m building is work that still holds up years later, relationships that stay
                  human, and a practice I&apos;m willing to be judged on — that&apos;s the bar I hold for myself
                  first.
                </p>
              </div>

              <div className="flex w-full justify-center lg:col-span-4 lg:justify-end lg:pl-1">
                <blockquote className="w-full rounded-sm border border-[var(--border)] border-l-[3px] border-l-[color-mix(in_srgb,var(--warm)_55%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_75%,transparent)] px-5 py-6 text-left md:px-6 md:py-7 lg:sticky lg:top-28">
                  <p className="font-display text-[clamp(1rem,1.55vw,1.15rem)] font-normal leading-snug tracking-[-0.015em] text-[var(--text)]">
                    &ldquo;Selective by design. Serious by default.&rdquo;
                  </p>
                  <footer className="mt-4 font-body text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
                    Operating posture
                  </footer>
                  <div className="mt-5 flex flex-col gap-3 border-t border-[var(--border)] pt-5">
                    <TransitionLink
                      href="/services"
                      className="font-body text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
                    >
                      View services →
                    </TransitionLink>
                    <TransitionLink
                      href="/contact"
                      className="font-body text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
                    >
                      Send a note →
                    </TransitionLink>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA — light band, filled layout, cursor split ─ */}
        <section
          data-cursor-light
          className="about-next-band relative overflow-hidden border-t border-neutral-200/90 bg-[#f4f2ed] py-14 md:py-20"
          aria-label="Next step"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.45]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="about-next-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="rgba(15,23,42,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-next-grid)" />
          </svg>
          <div
            className="pointer-events-none absolute -right-[20%] top-0 h-[min(70%,420px)] w-[min(55vw,520px)] rounded-full opacity-45"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(201,168,76,0.12) 0%, transparent 62%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-[1] mx-auto max-w-[1600px] px-5 md:px-10">
            {/* Intro + pillars (left) share one column; reserve card spans both rows (magazine lockup) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-x-6 lg:gap-y-5">
              <div className="lg:col-span-8 lg:row-start-1 lg:self-start lg:pr-1">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-[var(--warm)]/90 to-transparent" aria-hidden="true" />
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Next step
                  </p>
                </div>
                <h2
                  className="mt-2 font-display font-medium leading-[0.98] tracking-[-0.032em] text-neutral-900 md:mt-2.5"
                  style={{ fontSize: "clamp(2.15rem,4.8vw,3.65rem)" }}
                >
                  When you&apos;re ready,
                  <br />
                  <span className="text-neutral-500">start with a call.</span>
                </h2>
                <p className="mt-6 max-w-[54ch] font-body text-[15px] leading-[1.72] text-neutral-600 lg:max-w-none md:mt-7 md:text-[16px]">
                  Twenty minutes, no pitch deck — just a straight conversation about whether this is the
                  right fit.
                </p>
              </div>

              <aside className="flex min-h-0 h-full w-full lg:col-span-4 lg:row-span-2 lg:row-start-1 lg:col-start-9 lg:justify-end">
                <div className="relative mx-auto flex h-full min-h-[260px] w-full max-w-[400px] flex-col overflow-hidden rounded-sm border border-neutral-200/90 bg-white p-5 shadow-[0_16px_48px_-28px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.03] md:min-h-0 md:p-6 lg:mx-0 lg:max-w-none">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--warm)_50%,transparent)] to-transparent"
                    aria-hidden="true"
                  />
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Reserve
                  </p>
                  <p className="mt-3 font-body text-[13px] leading-[1.65] text-neutral-600 md:text-[14px]">
                    Pick a slot that works. You&apos;ll get a calendar invite and one thread — no
                    handoffs.
                  </p>
                  <div className="mt-6 flex flex-col gap-4">
                    <MagneticButton href={bookUrl} variant="primary" className="shadow-sm">
                      Book the fit call
                    </MagneticButton>
                    <div className="h-px bg-neutral-200/90" />
                    <div className="w-full min-w-0">
                      <p className="font-body text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                        Prefer email first
                      </p>
                      <a
                        href={`mailto:${brand.email}`}
                        className="mt-1.5 block w-full min-w-0 break-words font-body text-[12px] font-medium leading-snug text-neutral-800 transition-colors hover:text-[var(--warm)] md:text-[13px]"
                      >
                        {brand.email}
                        <span className="ml-1 text-neutral-400" aria-hidden="true">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                  <p className="mt-auto border-t border-neutral-100 pt-4 font-body text-[10px] leading-relaxed text-neutral-400">
                    {brand.jurisdiction}. Same response standard on the calendar or in the inbox.
                  </p>
                </div>
              </aside>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:col-span-8 lg:row-start-2 lg:col-start-1">
              {[
                {
                  k: "Time",
                  t: "20 minutes",
                  d: "A real calendar block — not an open-ended sales hour.",
                },
                {
                  k: "Format",
                  t: "No deck",
                  d: "Talk through your situation, not a template walkthrough.",
                },
                {
                  k: "Outcome",
                  t: "Clear next step",
                  d: "You leave knowing if we should work together — or not.",
                },
              ].map((item) => (
                <div
                  key={item.k}
                  className="about-next-pillar rounded-sm border border-neutral-200/90 bg-white/95 p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.06)] md:p-5"
                >
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                    {item.k}
                  </p>
                  <p className="mt-2.5 font-display text-[16px] font-medium tracking-[-0.02em] text-neutral-900 md:text-[17px]">
                    {item.t}
                  </p>
                  <p className="mt-1.5 font-body text-[12px] leading-[1.55] text-neutral-600 md:text-[13px]">
                    {item.d}
                  </p>
                </div>
              ))}
              </div>
            </div>

            {/* Closing strip — headline left, supporting copy right on large screens */}
            <div className="mt-8 grid grid-cols-1 gap-5 border-t border-neutral-200/70 pt-8 md:mt-9 md:gap-6 md:pt-8 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:gap-y-4">
              <p
                className="max-w-[14ch] font-display font-medium leading-[1.08] tracking-[-0.03em] text-neutral-500 lg:col-span-5"
                style={{ fontSize: "clamp(1.65rem,3vw,2.45rem)" }}
              >
                One thread.
                <br />
                <span className="text-neutral-400">Zero handoffs.</span>
              </p>
              <p className="max-w-[52ch] font-body text-[14px] leading-[1.75] text-neutral-600 md:text-[15px] lg:col-span-7 lg:max-w-none">
                If we move forward, the person on the call is the person in the repo. If we don&apos;t,
                you still leave with an honest read on what would have to change — no pressure, no
                nurture sequence.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageWrapper>
  );
}
