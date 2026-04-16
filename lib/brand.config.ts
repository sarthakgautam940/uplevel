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
  shortTagline: "Precision-built for luxury service businesses.",
  tagline:
    "Premium websites, AI voice intake, and automation for luxury builders, designers, and specialty contractors.",
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
      imageSrc: "/awards/first-place-dvp-2026-regionals.jpg",
      // 1179×1799 portrait — container taller so image fills well, side glow
      imageAspect: "aspect-[3/4]",
      imageGlow: "rgba(201,168,76,0.30)",   // gold
    },
    {
      year: 2025,
      event: "TSA States",
      category: "Promotional Design",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/awards/third-place-promotional-states-2025.jpg",
      // 1179×1929 portrait
      imageAspect: "aspect-[3/4]",
      imageGlow: "rgba(155,180,210,0.26)",  // silverish-blue
    },
    {
      year: 2025,
      event: "TSA States",
      category: "Digital Video Production",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/awards/third-place-dvp-states-2025.jpg",
      // 1888×1179 landscape — wider container, top/bottom glow
      imageAspect: "aspect-[16/10]",
      imageGlow: "rgba(155,180,210,0.26)",  // silverish-blue
    },
    {
      year: 2025,
      event: "TSA Regional",
      category: "Digital Video Production",
      placement: "2nd",
      placementNum: 2,
      note: "",
      imageSrc: "/awards/second-place-dvp-regionals-2025.jpg",
      // 1179×1929 portrait, lighter blue per spec
      imageAspect: "aspect-[3/4]",
      imageGlow: "rgba(120,190,255,0.26)",  // lighter blue
    },
    {
      year: 2025,
      event: "TSA Regional",
      category: "Promotional Design",
      placement: "3rd",
      placementNum: 3,
      note: "",
      imageSrc: "/awards/third-place-promotional-regionals-2025.jpg",
      // 1179×1932 portrait
      imageAspect: "aspect-[3/4]",
      imageGlow: "rgba(155,180,210,0.26)",  // silverish-blue
    },
  ],

  work: [] as readonly { id: string; name: string; niche: string; location: string; outcome: string; meta: string; status: "Complete" | "In build" | "Waitlist" }[],

  process: [
    {
      step: "01",
      title: "Understand the gap",
      body: "One focused 30-minute call. No questionnaire, no kickoff deck. We map what your current digital system is costing in lost inquiries — and what it would take to close that gap.",
    },
    {
      step: "02",
      title: "Map the system",
      body: "Site structure, AI configuration, automation flow — every decision locked before a pixel is placed. You see the complete system before anything is built.",
    },
    {
      step: "03",
      title: "Build at the standard",
      body: "Frontend in Next.js. Vapi AI configured for your specific niche. Make.com delivers qualified leads to your phone within 30 seconds of every call.",
    },
    {
      step: "04",
      title: "Deployed in 14 days",
      body: "Deployed, tested, and handed off with full context. Monthly optimization begins on day 15 — the system improves continuously without you managing it.",
    },
  ],

  services: [
    {
      tier: "T3",
      layer: "Complete System",
      name: "Market Domination",
      price: "$55,000",
      monthly: "$6,500 / mo",
      headline: "Site + AI + SEO + automation + social kit — the complete system.",
      roiLine: "At $200K average project, one recovered client relationship covers the year's investment twice over.",
      items: [
        "Custom Next.js site (no templates)",
        "Embedded AI voice or chat intake",
        "Full analytics stack with revenue attribution",
        "SEO foundation — schema + 8 target pages",
        "300 Vapi minutes/month",
        "Quarterly strategy calls",
      ],
      highlight: false,
      cta: "Book a call",
    },
    {
      tier: "T2",
      layer: "Most Selected",
      name: "Growth Partner",
      price: "$25,000",
      monthly: "$3,500 / mo",
      headline: "Site + AI voice intake + full automation. The standard engagement.",
      roiLine: "At $120K average job, one recovered lead covers most of the year's investment.",
      items: [
        "Custom Next.js site (no templates)",
        "Embedded AI lead intake (Vapi or chat)",
        "Core Web Vitals optimized (LCP < 1.5s target)",
        "90-day review automation",
        "100 Vapi minutes/month",
        "Monthly performance check-in",
      ],
      highlight: true,
      cta: "Book a call",
    },
    {
      tier: "T1",
      layer: "Foundation",
      name: "Audit + Rebuild",
      price: "$12,000",
      monthly: "$1,497 / mo",
      headline: "For sites that are close — but not converting. Site strategy, custom rebuild, analytics foundation.",
      roiLine: "Can be upgraded to include AI at any time.",
      items: [
        "Full site audit + conversion map",
        "Custom Next.js rebuild of high-drop pages",
        "Mobile and speed optimization",
        "Monthly check-in call",
      ],
      highlight: false,
      cta: "Book a call",
    },
  ],

  faq: [
    {
      q: "Who is this for?",
      a: "Luxury service businesses — custom pool builders, wine cellar designers, custom home builders, luxury outdoor living companies, and premium interior designers — whose work commands high project values but whose digital presence doesn't reflect that quality.",
    },
    {
      q: "Why are your projects priced higher than typical web design?",
      a: "Because the work is not just design. Each engagement rebuilds positioning, conversion flow, AI intake systems, and lead-response automation. The price reflects the commercial infrastructure being built, not the hours spent on pixels.",
    },
    {
      q: "Will AI make our brand feel impersonal?",
      a: "Not if it is deployed correctly. The AI handles triage and missed opportunities — answering calls at 11pm, qualifying leads, routing summaries to your phone. Your team still owns every relationship and every close.",
    },
    {
      q: "How involved do we need to be?",
      a: "Very involved during discovery — your input shapes everything. Intentionally less burdened during build. Aligned on key decision points throughout. After launch, monthly optimization runs without requiring your time.",
    },
    {
      q: "What happens after launch?",
      a: "Monthly optimization, AI performance monitoring, lead routing improvements, and site refinements continue under the retainer. The system improves every month. You receive a performance report by the 10th of each month.",
    },
  ],
} as const;

export type Brand = typeof brand;
export type WorkItem = (typeof brand.work)[number];
export type ProcessStep = (typeof brand.process)[number];
export type ServiceTier = (typeof brand.services)[number];
export type Accolade = (typeof brand.accolades)[number];
