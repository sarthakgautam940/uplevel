/**
 * UpLevel Services LLC — single source of truth for all public business content.
 * Set NEXT_PUBLIC_BOOK_URL in env for the live scheduling link.
 * Set NEXT_PUBLIC_SITE_URL in env for the canonical domain.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uplevelservicesllc.com";

export const bookUrl =
  process.env.NEXT_PUBLIC_BOOK_URL ??
  "https://calendly.com/admin-uplevelservicesllc/30min";

export const brand = {
  legalName: "UpLevel Services LLC",
  name: "UpLevel",
  shortTagline: "Precision-built for premium operators.",
  tagline:
    "Premium digital experiences and embedded AI intelligence for luxury service businesses.",
  jurisdiction: "Virginia, United States",
  operator: "Sarthak Gautam",
  operatorTitle: "Founder & Manager",
  email: "admin@uplevelservicesllc.com",
  bookUrl,
  foundingYear: 2025,

  social: {
    linkedin: "https://www.linkedin.com/company/uplevel-services-llc",
    x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "#",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "#",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "#",
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "#",
  },

  stats: [
    {
      value: 4,
      suffix: "s",
      label: "Seconds",
      note: "Before first impression is formed",
    },
    {
      value: 14,
      suffix: " days",
      label: "Build timeline",
      note: "From signed contract to launch",
    },
  ],

  /**
   * Competition accolades — Technology Student Association (TSA).
   * Used in AccoladesStrip + /accolades page. Verified results only.
   */
  accolades: [
    {
      year: 2026,
      event: "TSA Regional",
      category: "Digital Video Production",
      placement: "1st",
      placementNum: 1,
      note: "Most recent. Current standard.",
      imageSrc: "/accolades/dvp-2026-regionals-1st.jpg",
    },
    {
      year: 2025,
      event: "TSA States",
      category: "Promotional Design",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/accolades/promo-design-2025-states-3rd.jpg",
    },
    {
      year: 2025,
      event: "TSA States",
      category: "Digital Video Production",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/accolades/dvp-2025-states-3rd.jpg",
    },
    {
      year: 2025,
      event: "TSA Regional",
      category: "Digital Video Production",
      placement: "2nd",
      placementNum: 2,
      note: "",
      imageSrc: "/accolades/dvp-2025-regionals-2nd.jpg",
    },
    {
      year: 2025,
      event: "TSA Regional",
      category: "Promotional Design",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/accolades/promo-design-2025-regionals-3rd.jpg",
    },
  ],

  work: [] as readonly { id: string; name: string; niche: string; location: string; outcome: string; meta: string; status: "Complete" | "In build" | "Waitlist" }[],

  process: [
    {
      step: "01",
      title: "Understand the gap",
      body: "One focused 30-minute call. No questionnaire. No kickoff deck. We learn what the site is losing today — and map the revenue cost of the current state.",
    },
    {
      step: "02",
      title: "Map the system",
      body: "Site structure, AI configuration, automation flow. Every decision made before a single pixel is placed. You see the full plan before anything is built.",
    },
    {
      step: "03",
      title: "Build at the standard",
      body: "Front-end built in Next.js. Vapi AI configured for your niche. Make.com connects lead capture to your phone within 30 seconds of a call.",
    },
    {
      step: "04",
      title: "Live in 14 days",
      body: "Deployed, tested, and handed off with full context. Monthly optimization from day 15 onward — the site improves every month without you thinking about it.",
    },
  ],

  services: [
    {
      tier: "T3",
      layer: "Pillar 1 · AI Growth System",
      name: "Anchor + Premium",
      price: "$18,000",
      monthly: "$1,497 / mo",
      headline:
        "High-converting site with custom interactive sections, SEO foundation, permanent review automation, social kit, and 300 Vapi mins/mo.",
      roiLine:
        "Price is business infrastructure — frame ROI with client ticket and LTV, not line-item defense.",
      items: [
        "High-converting site + custom interactive sections",
        "SEO foundation (schema + pages)",
        "Permanent review automation",
        "Social kit",
        "300 Vapi mins/mo",
      ],
      highlight: false,
      cta: "Book a call",
    },
    {
      tier: "T2",
      layer: "Pillar 1 · AI Growth System",
      name: "Growth System",
      price: "$9,500",
      monthly: "$997 / mo",
      headline:
        "Default pitch: high-converting site, 24/7 Vapi voice, full Make.com automation, GBP optimization, and 90-day review automation.",
      roiLine:
        "Strengthen value before price — one solid month against ticket/LTV usually tells the story.",
      items: [
        "High-converting site",
        "Vapi AI voice (24/7)",
        "Make.com full automation (lead → SMS/email/sheet)",
        "GBP optimization",
        "Review automation (90 days)",
      ],
      highlight: true,
      cta: "Book a call",
    },
    {
      tier: "T1",
      layer: "Pillar 1 · AI Growth System",
      name: "Downstep",
      price: "$4,500",
      monthly: "$497 / mo",
      headline: "Basic site only — no AI layer, no automation. The footprint when you are not ready for the full system.",
      roiLine:
        "Never discount first — upgrade into Tier 2 when the math is obvious from ticket and LTV.",
      items: [
        "Basic site deliverable",
        "No AI and no automation (by design)",
        "Clear upgrade path into Tier 2 when you are ready",
      ],
      highlight: false,
      cta: "Book a call",
    },
  ],

  faq: [
    {
      q: "Who is this for?",
      a: "Service businesses where a single closed job pays back the site investment. Think legal, financial, medical, aviation, luxury trades. If your average client is worth $5K+, the math works.",
    },
    {
      q: "How is UpLevel different from a freelancer or agency?",
      a: "No account managers, no bloated team, no six-week discovery phase. You work directly with the operator — the person building your site is the person on your calls. Capped at 12 clients total so quality doesn't dilute.",
    },
    {
      q: "What does the AI component actually do?",
      a: "It captures leads 24/7 — qualifying, answering questions, and routing appointments — without a human on call. The most expensive missed lead is the one at 9pm on a Sunday.",
    },
    {
      q: "How long does a build take?",
      a: "14 days from signed contract to launched site. Retainer work (monthly SEO, conversion refinement) continues after.",
    },
    {
      q: "Do you work with businesses outside Virginia?",
      a: "Yes. UpLevel is fully remote. Clients are across the US.",
    },
  ],
} as const;

export type Brand = typeof brand;
export type WorkItem = (typeof brand.work)[number];
export type ProcessStep = (typeof brand.process)[number];
export type ServiceTier = (typeof brand.services)[number];
export type Accolade = (typeof brand.accolades)[number];
