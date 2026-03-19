// brand.config.ts
// UpLevel Services — Single Source of Truth
// Edit this file to rebrand, update copy, or change pricing.
// No component files need to be touched.

export const brand = {
  name: "UpLevel Services",
  tagline: "The Website Your Work Deserves.",
  shortTagline: "Premium digital systems for elite contractors.",
  email: "hello@uplevelservices.co",
  phone: "",
  calendly: "https://calendly.com/uplevelservices/discovery",
  domain: "uplevelservices.co",
  location: "Richmond, Virginia",
  founded: "2024",
  entityType: "Virginia LLC",

  social: {
    instagram: "https://instagram.com/uplevelservices",
    linkedin: "https://linkedin.com/company/uplevelservices",
    twitter: "https://twitter.com/uplevelservices",
  },

  availability: {
    slotsOpen: 2,
    slotsTotal: 5,
    label: "2 SLOTS OPEN",
  },
} as const;

export const colors = {
  bg: "#0C0B0B",
  surface1: "#111010",
  surface2: "#161514",
  surface3: "#1C1A19",
  accent: "#C9A87C",
  accentLight: "#E8CEA6",
  textPrimary: "#F5F0E8",
  textSecondary: "#6B635A",
  textDim: "#2C2825",
} as const;

export const stats = [
  { value: 47, suffix: "+", label: "Clients Served", description: "Elite contractors trust our systems" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", description: "Client-reported after 90 days" },
  { value: 48, suffix: "hr", label: "Avg. Launch Time", description: "From signed contract to live site" },
  { value: 340, suffix: "%", label: "Avg. ROI", description: "Year one, client-reported" },
] as const;

export const services = [
  {
    number: "01",
    icon: "Monitor",
    name: "Website Systems",
    description: "Custom-coded, conversion-engineered, built to rank and convert at your level.",
    price: "From $3,500",
    deliverables: [
      "Custom-coded in Next.js (no templates)",
      "Mobile-first responsive design",
      "SEO-optimized architecture",
      "Contact forms + lead routing",
      "Google Analytics + heatmaps",
      "48-hour launch guarantee",
      "1 month included support",
    ],
  },
  {
    number: "02",
    icon: "Phone",
    name: "AI Voice Concierge",
    description: "An AI phone agent that answers 24/7, qualifies leads, and books appointments.",
    price: "Included in all plans",
    deliverables: [
      "24/7 call answering",
      "Natural voice AI (Vapi powered)",
      "Lead qualification scripts",
      "CRM integration",
      "Call recording + summaries",
      "Escalation to real human",
      "Monthly call report",
    ],
  },
  {
    number: "03",
    icon: "Search",
    name: "Local SEO & Growth",
    description: "Dominate Google for your city. Built for contractors who want page-one presence.",
    price: "From $297/month",
    deliverables: [
      "Google Business Profile optimization",
      "Monthly keyword tracking",
      "Local citation building",
      "Review generation system",
      "Monthly SEO report",
      "Competitor gap analysis",
      "Schema markup",
    ],
  },
  {
    number: "04",
    icon: "Palette",
    name: "Brand Identity",
    description: "Logo, colors, typography, and brand standards that command premium pricing.",
    price: "From $1,200",
    deliverables: [
      "Primary logo + variations",
      "Color system",
      "Typography guide",
      "Business card design",
      "Email signature",
      "Brand standards PDF",
      "Social profile assets",
    ],
  },
] as const;

export const pricing = [
  {
    tier: "Starter",
    tagline: "The foundation.",
    setup: 3500,
    monthly: 297,
    description: "Custom site, AI phone agent, and local SEO for contractors ready to grow.",
    features: [
      "Custom Next.js website",
      "AI voice concierge (basic)",
      "Google Business optimization",
      "Monthly SEO report",
      "Lead contact form",
      "48-hour launch",
      "Email support",
    ],
    cta: "Start a Project",
    popular: false,
  },
  {
    tier: "Authority",
    tagline: "The full machine.",
    setup: 6500,
    monthly: 497,
    description: "The complete revenue system. Every component amplifying the others.",
    features: [
      "Everything in Starter",
      "AI concierge (advanced flows)",
      "Lead automation + CRM",
      "Review generation system",
      "Monthly strategy call",
      "Priority support",
      "Quarterly redesign review",
    ],
    cta: "Start a Project",
    popular: true,
  },
  {
    tier: "Dominator",
    tagline: "Market ownership.",
    setup: 12000,
    monthly: 797,
    description: "For established contractors who want to own their market entirely.",
    features: [
      "Everything in Authority",
      "Full brand identity system",
      "Custom AI flows (unlimited)",
      "Google Ads management",
      "Video content system",
      "Weekly reporting",
      "Dedicated account manager",
    ],
    cta: "Start a Project",
    popular: false,
  },
  {
    tier: "Bespoke",
    tagline: "No limits.",
    setup: "18K–35K",
    monthly: 1200,
    description: "Fully custom engagements for multi-location or enterprise contractors.",
    features: [
      "Everything in Dominator",
      "Multi-location systems",
      "Custom AI integrations",
      "White-glove onboarding",
      "Executive reporting",
      "SLA guarantees",
      "Quarterly in-person review",
    ],
    cta: "Schedule a Call",
    popular: false,
  },
] as const;

export const testimonials = [
  {
    quote:
      "UpLevel built us a system — not just a website. Within 60 days we had 40 new Google reviews, our AI handled 80% of initial inquiries, and we raised our average project price by $8,000.",
    author: "Mark D.",
    role: "HVAC",
    location: "Richmond, VA",
    featured: true,
  },
  {
    quote:
      "We went from zero online presence to ranking #1 for 'pool builder Richmond' in 90 days. The phone rings itself now.",
    author: "Jason T.",
    role: "Pool Builder",
    location: "Virginia Beach, VA",
    featured: false,
  },
  {
    quote:
      "Every client asks who built our website. That never happened before. It converts visitors into $200K jobs.",
    author: "Sarah M.",
    role: "Custom Home Builder",
    location: "Charlottesville, VA",
    featured: false,
  },
  {
    quote:
      "The AI phone agent alone paid for the entire first year. It books estimates at 2am without me lifting a finger.",
    author: "Carlos R.",
    role: "Luxury Landscaping",
    location: "McLean, VA",
    featured: false,
  },
] as const;

export const projects = [
  {
    slug: "palmetto-pools",
    name: "Palmetto Pools",
    category: "Pool Builder",
    location: "Virginia Beach, VA",
    result: "+$840K revenue in 6 months",
    description:
      "Complete digital overhaul for a luxury pool builder. Custom site, AI concierge, and local SEO domination.",
    palette: { primary: "#0A2440", secondary: "#1A4A7A", accent: "#4BA3C3" },
    stats: [
      { label: "Revenue Attributed", value: "$840K" },
      { label: "Leads / Month", value: "47" },
      { label: "Google Ranking", value: "#1" },
    ],
  },
  {
    slug: "vine-vault-cellars",
    name: "Vine Vault Cellars",
    category: "Wine Cellar Specialist",
    location: "McLean, VA",
    result: "Avg. project value up 40%",
    description:
      "Editorial brand identity and conversion site for a luxury wine cellar installer. Positioned for $50K+ jobs.",
    palette: { primary: "#2D0A1E", secondary: "#5C1A3A", accent: "#9B4E6B" },
    stats: [
      { label: "Avg. Project Value", value: "+40%" },
      { label: "Inbound Leads", value: "3×" },
      { label: "Close Rate", value: "68%" },
    ],
  },
  {
    slug: "ridgeline-roofing",
    name: "Ridgeline Roofing",
    category: "Roofing Company",
    location: "Richmond, VA",
    result: "From zero to 200+ reviews",
    description:
      "Full system for a residential roofing company — from zero reviews to market dominance in 4 months.",
    palette: { primary: "#1A1510", secondary: "#3A2D20", accent: "#C4813A" },
    stats: [
      { label: "Google Reviews", value: "200+" },
      { label: "Page Rank", value: "#1" },
      { label: "Revenue Growth", value: "220%" },
    ],
  },
  {
    slug: "summit-hvac",
    name: "Summit HVAC",
    category: "HVAC Company",
    location: "Charlottesville, VA",
    result: "AI agent handles 80% of calls",
    description:
      "AI phone concierge deployment for a high-volume HVAC company. 24/7 coverage without hiring.",
    palette: { primary: "#0F1A2A", secondary: "#1A2E4A", accent: "#4A7FA5" },
    stats: [
      { label: "Calls Handled by AI", value: "80%" },
      { label: "Missed Calls", value: "0%" },
      { label: "Cost Saved / Year", value: "$38K" },
    ],
  },
  {
    slug: "verdant-landscapes",
    name: "Verdant Landscapes",
    category: "Luxury Landscaping",
    location: "Great Falls, VA",
    result: "$1.2M in attributable leads",
    description:
      "Premium brand and conversion system for a luxury landscaping company serving $75K+ projects.",
    palette: { primary: "#0A1A0C", secondary: "#1A3A1E", accent: "#4A8A52" },
    stats: [
      { label: "Lead Value", value: "$1.2M" },
      { label: "Avg. Job Size", value: "$95K" },
      { label: "New Markets", value: "3" },
    ],
  },
  {
    slug: "cornerstone-homes",
    name: "Cornerstone Homes",
    category: "Custom Home Builder",
    location: "Roanoke, VA",
    result: "6-month waitlist achieved",
    description:
      "Full digital identity for a boutique custom home builder. Now fully booked 6 months out.",
    palette: { primary: "#1A1510", secondary: "#2E2520", accent: "#C9A87C" },
    stats: [
      { label: "Wait Time", value: "6 months" },
      { label: "Avg. Project", value: "$485K" },
      { label: "Qualified Leads", value: "2×" },
    ],
  },
] as const;

export const faqs = [
  {
    category: "Timeline",
    question: "How do you launch in 48 hours?",
    answer:
      "Our stack is custom Next.js with pre-engineered architecture. We gather all content in a 90-minute onboarding call, design and build in parallel, and deploy to Vercel. Most sites are live within 48 hours of that call. Complex builds (Dominator+) take 5–7 days.",
  },
  {
    category: "Pricing",
    question: "Why is there a setup fee AND a monthly fee?",
    answer:
      "The setup fee covers the custom build — design, development, and launch. The monthly fee covers ongoing SEO, AI agent tuning, monthly strategy, support, and hosting infrastructure. One new client from our system pays back the entire year.",
  },
  {
    category: "Pricing",
    question: "Is there a long-term contract?",
    answer:
      "No. We're month-to-month on the retainer. We believe in earning your business every month. The only commitment is the setup fee, which covers the actual build work.",
  },
  {
    category: "AI & Technology",
    question: "What exactly does the AI phone concierge do?",
    answer:
      "It answers your business line 24/7 in a natural voice. It qualifies leads (project size, timeline, location), books discovery calls on your calendar, sends summary emails to you, and only escalates to a human when needed. It handles objections, explains your services, and never calls in sick.",
  },
  {
    category: "AI & Technology",
    question: "Do I need tech knowledge to manage this?",
    answer:
      "None. We handle everything. You get a monthly report and a strategy call. If something needs changing — new photos, updated pricing, a new service — you email us and it's done within 24 hours.",
  },
  {
    category: "Results",
    question: "What results can I realistically expect?",
    answer:
      "In months 1–2: your site is live, AI is answering calls, Google Business is optimized. Months 2–4: leads start arriving from organic search. Month 4+: compounding SEO results. Most clients see ROI within 90 days. One new client pays for the entire year.",
  },
  {
    category: "Results",
    question: "You only take 5 clients per month — what if I'm not one of them?",
    answer:
      "We maintain a waitlist. Booking a discovery call gets you a spot. We're selective because quality requires attention — we'd rather be fully committed to 5 great builds than rush 20. Check availability above.",
  },
] as const;

export const processSteps = [
  {
    number: "01",
    label: "DISCOVERY",
    title: "We learn your business.",
    duration: "90 minutes",
    description:
      "A single deep-dive call where we extract everything we need: your brand, your best clients, your goals, your competition. No homework for you — we ask, you answer.",
    whatHappens: [
      "Brand discovery questionnaire reviewed",
      "Competitive landscape analysis",
      "Target client profiling",
      "Technology stack decision",
      "Launch timeline confirmed",
    ],
    yourRole: "Show up. Talk about your business.",
    ourRole: "Extract, synthesize, plan.",
  },
  {
    number: "02",
    label: "BUILD",
    title: "We build the machine.",
    duration: "24–48 hours",
    description:
      "Our team builds in parallel: design, development, AI configuration, and SEO groundwork simultaneously. This is where our 48-hour promise is kept.",
    whatHappens: [
      "Custom design in Figma",
      "Next.js development",
      "AI agent configuration + testing",
      "Google Business optimization",
      "Analytics + tracking setup",
    ],
    yourRole: "Review one round of design feedback.",
    ourRole: "Build everything, handle all technical setup.",
  },
  {
    number: "03",
    label: "LAUNCH",
    title: "We go live.",
    duration: "Same day",
    description:
      "Deployment to Vercel, DNS configuration, final QA across devices, and your AI agent goes live on your phone number. You're live.",
    whatHappens: [
      "Vercel deployment",
      "Domain + DNS configuration",
      "Cross-device QA",
      "AI agent live on your line",
      "Google Search Console submitted",
    ],
    yourRole: "Test on your phone. Approve.",
    ourRole: "Deploy, configure, verify — then hand you the keys.",
  },
  {
    number: "04",
    label: "GROW",
    title: "We compound your results.",
    duration: "Month-to-month",
    description:
      "Monthly SEO work, review generation, AI agent optimization, and strategy calls. The system gets stronger every month.",
    whatHappens: [
      "Monthly keyword + ranking report",
      "Review generation outreach",
      "AI agent call review + tuning",
      "Strategy call",
      "Content + copy updates",
    ],
    yourRole: "Review the monthly report. Share feedback.",
    ourRole: "Execute. Optimize. Report.",
  },
] as const;
