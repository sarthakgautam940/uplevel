import type { Metadata } from "next";
import { brand, bookUrl, siteUrl } from "../../../lib/brand.config";
import PageWrapper from "@/components/PageWrapper";
import SiteFooter from "@/components/SiteFooter";
import MagneticButton from "@/components/MagneticButton";
import FAQAccordion from "@/components/FAQAccordion";
import ServiceTierCards from "@/components/ServiceTierCards";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Three engagement tiers built for luxury service businesses. Custom Next.js sites, embedded AI intake, and full analytics — no templates.",
  alternates: { canonical: `${siteUrl}/services` },
};

export default function ServicesPage() {
  return (
    <PageWrapper>
      <main>
        <section
          className="relative overflow-hidden bg-[var(--void)] pb-24 pt-36 md:pb-32 md:pt-48"
          aria-labelledby="services-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.85]"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 42%), radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.035), transparent 55%)",
            }}
          />

          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="flex items-center gap-4">
              <span
                className="h-px w-8 shrink-0 bg-gradient-to-r from-[var(--warm)]/80 to-transparent md:w-10"
                aria-hidden="true"
              />
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                Engagement tiers
              </p>
            </div>

            <h1
              id="services-heading"
              className="mt-8 max-w-[18ch] font-display font-medium leading-[0.94] tracking-[-0.036em] text-[var(--text)] md:mt-10"
              style={{ fontSize: "clamp(2.65rem,6.5vw,4.75rem)" }}
            >
              The right layer
              <br />
              <span className="text-[var(--text-dim)]">for your business.</span>
            </h1>
            <p className="mt-8 max-w-[48ch] font-body text-[15px] leading-[1.72] text-[var(--text-dim)]">
              Every engagement starts with a 20-minute fit call. If we are not the right match, you
              will know before you commit a dollar.
            </p>
          </div>
        </section>

        <section
          data-cursor-light
          className="border-t border-black/[0.06] bg-[#e8e5df] pb-24 pt-20 md:pb-32 md:pt-28"
          aria-label="Service tiers"
        >
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <p className="max-w-[48ch] font-body text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Pricing
            </p>
            <p className="mt-3 max-w-[40ch] font-display text-[clamp(1.15rem,2vw,1.45rem)] font-medium leading-snug tracking-[-0.02em] text-neutral-800">
              Three retainers. One standard of build quality.
            </p>
            <div className="mt-12">
              <ServiceTierCards variant="paper" />
            </div>
            <p className="mt-10 max-w-[52ch] font-body text-[12px] leading-relaxed text-neutral-600">
              All pricing USD. Monthly retainer begins after launch. Payment schedules available.
            </p>
          </div>
        </section>

        <section className="bg-[var(--surface)] py-24 md:py-36" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="flex items-center gap-4">
                  <span
                    className="h-px w-8 shrink-0 bg-gradient-to-r from-[var(--warm)]/70 to-transparent"
                    aria-hidden="true"
                  />
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                    FAQ
                  </p>
                </div>
                <h2
                  id="faq-heading"
                  className="mt-6 font-display leading-[1.06] tracking-[-0.022em] text-[var(--text)]"
                  style={{ fontSize: "clamp(1.65rem,3.2vw,2.65rem)" }}
                >
                  What operators
                  <br />
                  <span className="text-[var(--text-dim)]">ask before they book.</span>
                </h2>
                <p className="mt-5 max-w-[34ch] font-body text-[14px] leading-[1.65] text-[var(--text-dim)]">
                  If yours is not listed, the fit call is the right place to ask.
                </p>
              </div>
              <FAQAccordion items={brand.faq} />
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-[var(--void)] py-24 md:py-36"
          aria-label="Book a call"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 100% 0%, rgba(201,168,76,0.07) 0%, transparent 55%), linear-gradient(165deg, rgba(77,130,255,0.04) 0%, transparent 38%)",
            }}
          />
          <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10 lg:items-stretch">
              <div className="border-l border-[color-mix(in_srgb,var(--warm)_35%,var(--border))] pl-6 md:pl-8 lg:col-span-7 lg:pr-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[var(--warm)]/70" aria-hidden="true" />
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                    Twenty minutes
                  </p>
                </div>
                <h2
                  className="mt-6 font-display font-medium leading-[1.02] tracking-[-0.032em] text-[var(--text)]"
                  style={{ fontSize: "clamp(2.1rem,4.8vw,3.85rem)" }}
                >
                  Not sure
                  <br />
                  <span className="text-[var(--text-dim)]">which tier?</span>
                </h2>
                <p className="mt-6 max-w-[40ch] font-body text-[15px] leading-[1.75] text-[var(--text-dim)]">
                  The fit call is how we map scope, timing, and model — without a pitch deck. If we are
                  not the right match, you will hear that clearly.
                </p>
                <p className="mt-8 font-display text-[clamp(1.35rem,2.8vw,2rem)] font-medium leading-snug tracking-[-0.02em] text-[var(--warm)]">
                  The call decides.
                </p>
              </div>

              <aside className="flex flex-col justify-between gap-10 rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-10 lg:col-span-5">
                <div>
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-dim)]">
                    Reserve
                  </p>
                  <p className="mt-3 font-body text-[14px] leading-[1.65] text-[var(--text-dim)]">
                    Pick a time that works. You will get a calendar invite and a single point of contact
                    — no handoffs.
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <MagneticButton href={bookUrl} variant="primary">
                    Book the fit call
                  </MagneticButton>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)] opacity-60">
                      Or write directly
                    </p>
                    <a
                      href={`mailto:${brand.email}`}
                      className="mt-2 inline-block font-body text-[14px] text-[var(--text)] transition-colors duration-300 hover:text-[var(--warm)]"
                    >
                      {brand.email}
                      <span className="ml-1 text-[var(--text-dim)]" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="deep" />
    </PageWrapper>
  );
}
