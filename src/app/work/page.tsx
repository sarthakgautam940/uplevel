import type { Metadata } from "next";
import { bookUrl, siteUrl } from "../../../lib/brand.config";
import PageWrapper from "@/components/PageWrapper";
import SiteFooter from "@/components/SiteFooter";
import MagneticButton from "@/components/MagneticButton";
import TransitionLink from "@/components/TransitionLink";
import AccoladesTimeline from "@/components/AccoladesTimeline";
import PortfolioWorkSection from "@/components/PortfolioWorkSection";

export const metadata: Metadata = {
  title: "Work — Creative Discipline, Proven",
  description:
    "Verified competition results and client outcomes. Award-winning design applied to your business.",
  alternates: { canonical: `${siteUrl}/work` },
};

export default function WorkPage() {
  return (
    <PageWrapper>
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-[var(--void)] pb-20 pt-40 md:pb-28 md:pt-52"
          aria-labelledby="work-heading"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="work-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M56 0H0V56" fill="none" stroke="rgba(237,240,247,0.025)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#work-grid)" />
          </svg>
          <div
            className="pointer-events-none absolute right-[0%] top-[10%] h-[70%] w-[60%] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(77,130,255,0.07) 0%, transparent 65%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
            <h1
              id="work-heading"
              className="mx-auto font-display font-medium leading-[0.92] tracking-[-0.038em] text-[var(--text)]"
              style={{ fontSize: "clamp(2.75rem,7.5vw,6rem)", maxWidth: "18ch" }}
            >
              Where standards
              <br />
              <span className="text-[var(--text-dim)]">are proven.</span>
            </h1>
            <p className="mx-auto mt-10 max-w-[50ch] font-body text-[16px] leading-[1.72] text-[var(--text-dim)]">
              Verified competition results and real client work. No stock photography, no mockups, no
              invented case studies.
            </p>
          </div>
        </section>

        {/* ── Accolades Timeline ──────────────────────────── */}
        <AccoladesTimeline />

        <PortfolioWorkSection />

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="bg-[var(--void)] py-24 md:py-36" aria-label="Contact">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <h2
                className="font-display font-medium leading-[1.0] tracking-[-0.025em] text-[var(--text)]"
                style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
              >
                Interested in working with UpLevel?
                <br />
                <span className="text-[var(--text-dim)]">Start with a conversation.</span>
              </h2>
              <div className="flex flex-wrap items-center gap-5">
                <MagneticButton href={bookUrl} variant="primary">
                  Book a fit call →
                </MagneticButton>
                <TransitionLink
                  href="/contact"
                  className="font-body text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
                >
                  Or email us →
                </TransitionLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageWrapper>
  );
}
