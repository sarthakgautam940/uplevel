export const brand = {
  name: "UpLevel Services",
  tagline: "Your AI-powered sales system, live in 14 days.",
  taglineSecondary: "We build systems that generate leads while you sleep.",
  location: "Virginia",
  phone: "(571) 000-0000",
  email: "hello@uplevelservicesllc.com",
  website: "uplevelservicesllc.com",
  founded: 2024,
  instagram: "https://instagram.com/uplevelservices",
  linkedin: "https://linkedin.com/in/uplevelservices",

  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/uplevelservices/15min",

  aiConcierge: {
    name: "Atlas",
    greeting:
      "Hey — welcome to UpLevel. Are you a contractor looking to generate more leads online, or just checking us out?",
  },

  availability: {
    currentQuarter: "Q2 2025",
    slotsTotal: 4,
    slotsTaken: 2,
  },

  colors: {
    electric: "#2461E8",
    electricRgb: "36, 97, 232",
    glow: "#4D7EFF",
    warm: "#E8A020",
    warmRgb: "232, 160, 32",
    void: "#050709",
    surface: "#0A0D14",
    surface2: "#0F1420",
  },

  hero: {
    eyebrow: "UPLEVEL SERVICES  ·  VIRGINIA  ·  EST. 2024",
    headlineLines: ["YOUR AI-POWERED", "SALES SYSTEM", "LIVE IN 14 DAYS."],
    subtext:
      "We build automated lead engines for high-ticket contractors. AI voice, instant SMS routing, and conversion-optimized design — done for you in two weeks.",
    ctaPrimary: "See Our Work",
    ctaSecondary: "Book 15 Min",
  },

  problem: {
    headline: "The gap between your website and your competition",
    items: [
      {
        number: "01",
        title: "No after-hours coverage",
        body: "Someone visits at 9pm on a Sunday. No one answers. No form follow-up. They call your competitor Monday morning while you're on a job site.",
        stat: "53% of leads convert within the hour",
      },
      {
        number: "02",
        title: "No lead qualification",
        body: "You answer every inquiry yourself — good fits, bad fits, wrong service area. Your time is wasted on leads that were never going to close.",
        stat: "72% of calls are unqualified",
      },
      {
        number: "03",
        title: "No automated follow-up",
        body: "A lead submits a form on Friday. You call Monday. They already signed with someone else. The job was $90K.",
        stat: "Response time is the #1 close factor",
      },
    ],
  },

  stats: [
    { value: 97, suffix: "%", label: "Client Satisfaction", description: "Across all delivered builds" },
    { value: 14, suffix: " days", label: "Delivery Timeline", description: "From deposit to live" },
    { value: 24, suffix: "/7", label: "AI Always On", description: "No breaks, no missed leads" },
    { value: 0, suffix: "", label: "Ad Spend Required", description: "System generates organic leads" },
  ],

  process: [
    {
      step: "01",
      label: "DISCOVERY",
      title: "15 Minutes",
      body: "We understand your business, service area, average ticket, and exactly where your current site is losing you money. You talk, we listen.",
      duration: "Day 0",
      detail: "Calendly call — 15 min. No sales pressure. We tell you immediately if you're a fit.",
    },
    {
      step: "02",
      label: "BUILD",
      title: "Days 1 — 10",
      body: "AI assistant configured for your business. Make.com automation routing leads to your phone. Brand intake, image pipeline, full site build. You do nothing except send us your logo and photos.",
      duration: "10 days",
      detail: "You receive a preview URL on Day 3 so you can track progress in real time.",
    },
    {
      step: "03",
      label: "REVIEW",
      title: "Days 11 — 13",
      body: "Three rounds of revisions. Your feedback is implemented the same day. Copy, colors, layout — whatever needs to change, we change it. No scope arguments.",
      duration: "3 days",
      detail: "Most clients use fewer than 1.5 revision rounds. The intake process prevents surprises.",
    },
    {
      step: "04",
      label: "LAUNCH",
      title: "Day 14",
      body: "Live on your domain. AI active. Leads routing to your phone. Google Analytics tracking from day one. Monthly performance report starts 30 days later.",
      duration: "Day 14",
      detail: "You receive a confirmation text when your first lead comes through the new system.",
    },
  ],

  caseStudies: [
    {
      client: "Palmetto Pools",
      location: "Park City, UT",
      niche: "Custom Pool Builder",
      headline: "AI voice + instant SMS routing for a luxury pool builder",
      result: "AI concierge handles after-hours inquiries 24/7. Lead notification within 30 seconds.",
      metrics: [
        { label: "Load Time", value: "1.4s" },
        { label: "Delivery", value: "14 days" },
        { label: "AI Voice", value: "Active 24/7" },
      ],
      tier: "Conversion Engine",
      year: "2025",
      featured: true,
      tags: ["AI Voice", "SMS Routing", "Google Analytics"],
    },
    {
      client: "Northern Virginia HVAC Co.",
      location: "Fairfax, VA",
      niche: "HVAC Contractor",
      headline: "AI lead system for a $4M HVAC company",
      result: "Coming Q2 2025",
      metrics: [
        { label: "Status", value: "In Build" },
        { label: "Tier", value: "Authority" },
        { label: "Timeline", value: "14 days" },
      ],
      tier: "Authority Build",
      year: "2025",
      featured: false,
      tags: ["AI Voice", "SEO", "Review Automation"],
    },
    {
      client: "Landscape Studio",
      location: "Loudoun County, VA",
      niche: "Hardscape & Landscape",
      headline: "Full-service AI site for a Northern Virginia landscaper",
      result: "Coming Q2 2025",
      metrics: [
        { label: "Status", value: "Booked" },
        { label: "Tier", value: "Conversion" },
        { label: "Timeline", value: "14 days" },
      ],
      tier: "Conversion Engine",
      year: "2025",
      featured: false,
      tags: ["AI Voice", "Instagram", "SMS"],
    },
  ],

  pricing: [
    {
      tier: "Authority Build",
      tierNumber: 3,
      price: 12000,
      monthly: 797,
      badge: null,
      description: "The complete digital operation for established contractors.",
      features: [
        "Everything in Conversion Engine",
        "SEO foundation: 3 optimized service pages + schema",
        "Review automation ($149/mo value, included)",
        "Social media starter kit — 30 Canva templates",
        "Quarterly 30-min strategy call",
        "Priority support — 4-hour response",
        "Google Business profile optimization",
        "300 Vapi minutes/month",
      ],
      cta: "Get Started",
      highlight: false,
      note: "Best for $2M+ contractors",
    },
    {
      tier: "Conversion Engine",
      tierNumber: 2,
      price: 6500,
      monthly: 497,
      badge: "RECOMMENDED",
      description: "The AI lead system. Most clients choose this.",
      features: [
        "AI voice assistant (24/7, configured for your business)",
        "Instant SMS to your phone on every new lead",
        "Make.com automation — lead → SMS → Google Sheet",
        "Mobile-optimized site, loads under 2 seconds",
        "Google Analytics from day one",
        "Animated gallery / portfolio section",
        "3 revision rounds",
        "Monthly 1-page performance report",
        "90-day review automation included free",
      ],
      cta: "Get Started",
      highlight: true,
      note: "Most popular. 4 slots/month max.",
    },
    {
      tier: "Starter",
      tierNumber: 1,
      price: 3500,
      monthly: 297,
      badge: null,
      description: "The foundation. No AI, no automation.",
      features: [
        "Next.js site, brand-configured",
        "Mobile-optimized, sub-2s load time",
        "Contact form → email notification",
        "Google Analytics",
        "SSL + Vercel hosting",
        "Domain connection",
        "1 revision round",
      ],
      cta: "Get Started",
      highlight: false,
      note: "For referrals and price-sensitive clients",
    },
  ],

  testimonials: [
    {
      quote:
        "The AI widget picked up 3 calls while I was at a job site last week. All three left their name and number. I called back the same night and two of them want to move forward. That's probably $180K in new business from leads I would have missed.",
      name: "Brian C.",
      company: "Palmetto Pools",
      location: "Park City, UT",
      initials: "BC",
      featured: true,
    },
    {
      quote:
        "I was skeptical about the 14-day promise. They delivered in 11. The site looks better than anything I've seen from a contractor in my market. My competitor called me to ask who built it.",
      name: "Marcus W.",
      company: "Premium Landscape & Hardscape",
      location: "Northern Virginia",
      initials: "MW",
      featured: false,
    },
    {
      quote:
        "I got a text at 7:30am on a Saturday from the AI system. A homeowner had left their info at midnight looking for a pool quote. That's a $95K job I didn't have to chase. It came to me.",
      name: "David K.",
      company: "Mountain Custom Pools",
      location: "Denver, CO",
      initials: "DK",
      featured: false,
    },
  ],

  faq: [
    {
      q: "What kind of contractors do you work with?",
      a: "Pool builders, landscapers, hardscape contractors, HVAC companies, roofing contractors, and other high-ticket home service businesses. Ideal clients have an average job value of $10K+ and at least 20 Google reviews. We do not work with general handymen, single-trade low-ticket services, or franchises.",
    },
    {
      q: "How is this different from a normal web design agency?",
      a: "Most agencies build a site and hand it off. We build and run a lead capture system — AI that answers after hours, automation that routes leads to your phone in 30 seconds, and monthly reporting that tells you what's working. The site is the front end. The system is the point.",
    },
    {
      q: "What if I already have a website?",
      a: "We look at it before the call. If it's genuinely working — fast, mobile, converting leads consistently — we'll tell you. If it's losing you money (most are), we'll show you exactly how. We can also add the AI and automation stack on top of an existing domain without rebuilding from scratch in some cases.",
    },
    {
      q: "Can you actually deliver in 14 days?",
      a: "Yes. Our builds are based on a refined Next.js template system that we configure to your brand in a fraction of the time of traditional custom development. The 14-day promise requires your brand intake form and photos within 48 hours of signing. Delays on your end extend the timeline proportionally.",
    },
    {
      q: "What is the AI voice assistant, exactly?",
      a: "It's a Vapi-powered AI assistant embedded in your site. When someone clicks it, they can speak to it like a phone call. It's configured with your business name, service area, FAQs, and pricing guidance. It collects their name and number, gives them a timeline on when they'll hear from you, and sends you a text within 30 seconds. It runs 24/7 with no additional cost up to your plan's minute limit.",
    },
    {
      q: "What does the $497/month retainer cover?",
      a: "Hosting (Vercel), AI voice (Vapi), automation (Make.com), monthly performance report, 2 hours of updates per month, and ongoing support. We handle all platform maintenance, deployments, and fixes. If something breaks, we fix it. If you want to add a page or update copy, that's included up to the monthly hour limit.",
    },
    {
      q: "What happens if I cancel?",
      a: "You can cancel with 30 days' notice at any time. Upon cancellation with no outstanding balance, you receive a static HTML export of your site content. The AI, automations, and hosting terminate within 30 days. You can purchase full source code ownership for three times the original setup fee if you want to take the codebase to another developer.",
    },
    {
      q: "Why only 4 clients per month?",
      a: "Every build gets personal attention. We configure the AI specifically for your business, review your market, and build something that's actually different from your competitors — not a generic template with your logo on it. That takes time. Four per month is the maximum that lets us do this without cutting corners.",
    },
    {
      q: "What's the minimum commitment?",
      a: "There's no minimum contract term. Month-to-month from day one. The 50% deposit at signing is the only upfront commitment. The remaining 50% is due on launch day. Monthly retainer starts after launch.",
    },
    {
      q: "Do you work with businesses outside Virginia?",
      a: "Yes. We work with contractors across the US. All communication is remote — Calendly for the discovery call, Slack for build updates, email for reporting. Our case study clients span Utah, Virginia, Colorado, and Texas.",
    },
  ],

  trustItems: [
    "Completed builds in 4 states",
    "AI voice rated 4.9★ by clients",
    "14-day delivery guaranteed",
    "Month-to-month — no lock-in",
  ],

  addOns: [
    { name: "SEO Blog Content", price: 400, period: "mo", desc: "4 keyword-targeted posts/month" },
    { name: "Review Automation", price: 149, period: "mo", desc: "Auto-SMS after job completion" },
    { name: "SMS Lead Nurture", price: 197, period: "mo", desc: "3-touch automated follow-up" },
    { name: "Social Media Mgmt", price: 500, period: "mo", desc: "12 posts/month, designed + scheduled" },
    { name: "Logo & Brand Kit", price: 600, period: "one-time", desc: "Logo, colors, fonts, business card" },
    { name: "Full Brand Identity", price: 1200, period: "one-time", desc: "Kit + style guide + 10 social templates" },
  ],
};
