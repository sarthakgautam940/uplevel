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
      layer: "Complete System",
      name: "Full Stack",
      price: "$18,000",
      monthly: "$1,497 / mo",
      headline: "Full Layers 1 + 2 + 3. Site + AI + Automation — complete.",
      roiLine: "At $180K average job, one client per month = 10× annual return.",
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
      name: "Digital Presence",
      price: "$9,500",
      monthly: "$997 / mo",
      headline: "Full Layers 1 + 2. Site + AI intake. The standard engagement.",
      roiLine: "At $120K average job, less than one job covers the year.",
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
      price: "$4,500",
      monthly: "$497 / mo",
      headline: "Layer 1 only. For sites that are close — but not converting.",
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
