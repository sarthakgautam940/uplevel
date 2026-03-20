// ─── BRAND IDENTITY ──────────────────────────────────────────────────────────

export const BRAND = {
  name: 'UpLevel Services',
  tagline: 'Your business. Engineered.',
  email: 'hello@uplevelservices.co',
  location: 'Richmond, VA',
  url: 'https://uplevelservices.co',
} as const

// ─── STATISTICS ──────────────────────────────────────────────────────────────

export const STATS = [
  { value: 47, suffix: '+', label: 'Elite clients' },
  { value: 98, suffix: '%', label: 'Satisfaction rate' },
  { value: 340, suffix: '%', label: 'Average ROI, year one' },
  { value: 48, suffix: 'hr', label: 'Average launch time' },
] as const

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const SERVICES = [
  {
    id: 'website',
    number: '01',
    name: 'Website System',
    headline: 'Not a website. A system.',
    body: 'Custom-engineered, performance-first sites built for conversion. Every pixel, every load time, every CTA placement is deliberate. Your competitors have websites. You will have infrastructure.',
    features: [
      'Custom design, zero templates',
      'Sub-2s load time guarantee',
      'CRO-optimized architecture',
      'Mobile-first, flawless everywhere',
      '48-hour average launch',
    ],
    price: 'From $3,500',
    retainer: '$297/mo',
  },
  {
    id: 'ai-phone',
    number: '02',
    name: 'AI Phone Concierge',
    headline: 'Never miss a job again.',
    body: 'An AI agent that answers every call, qualifies every lead, and books consultations — at 2 AM, on weekends, when your crew is on-site and you are unavailable. Your phone becomes your best salesperson.',
    features: [
      'Answers calls 24/7/365',
      'Qualifies leads in real time',
      'Books consultations automatically',
      'Custom voice trained to your brand',
      'Full transcript + CRM integration',
    ],
    price: 'From $4,500',
    retainer: '$497/mo',
  },
  {
    id: 'seo',
    number: '03',
    name: 'SEO & Growth',
    headline: 'Own your market.',
    body: 'Dominate local and regional search for your exact verticals. Pool builders in Dallas. HVAC in Atlanta. Custom homes in Richmond. We build the search presence that makes your phone ring from people who were never going to call anyone else.',
    features: [
      'Local SEO domination strategy',
      'Technical SEO foundation',
      'Monthly content that converts',
      'Backlink authority building',
      'Rank tracking + monthly reporting',
    ],
    price: 'From $2,000',
    retainer: '$797/mo',
  },
  {
    id: 'brand',
    number: '04',
    name: 'Brand Identity',
    headline: 'Look like what you are.',
    body: 'A brand system built for a contractor who has earned the right to look elite: logo, mark, color system, typography, business collateral, jobsite materials. When your estimate lands on a client\'s desk, it looks like it belongs to a company doing 10 million dollars a year.',
    features: [
      'Primary logo + mark system',
      'Brand color + typography guide',
      'Business card + letterhead',
      'Jobsite signage templates',
      'Vehicle wrap design',
    ],
    price: 'From $4,500',
    retainer: 'One-time project',
  },
] as const

// ─── WORK / CASE STUDIES ─────────────────────────────────────────────────────

export const CASE_STUDIES = [
  {
    id: 'aqua-craft',
    client: 'Aqua Craft Pools',
    vertical: 'Pool Builder · Texas',
    metric: '$340K',
    metricLabel: 'Added revenue, year one',
    story: 'A 23-year pool builder with no digital presence. We built a system that now generates more qualified leads in a week than they previously saw in a quarter.',
    quote: 'We were averaging 3 calls a week. Now we\'re averaging 19. Our close rate went up because the leads are better — they already know our prices and they\'re ready to move.',
    services: ['Website System', 'AI Phone Concierge', 'SEO & Growth'],
    timeframe: '6 weeks to full deployment',
  },
  {
    id: 'frost-hvac',
    client: 'Frost HVAC',
    vertical: 'HVAC Owner · Georgia',
    metric: '287%',
    metricLabel: 'Organic search growth, 8 months',
    story: 'A regional HVAC operator invisible in search results. We rebuilt their digital foundation and within 8 months they were ranking for every primary term in their service area.',
    quote: 'Before UpLevel I was invisible online. Now my competitors are asking who built my site. I have turned down two acquisition offers this year — they found me through the website.',
    services: ['Website System', 'SEO & Growth', 'Brand Identity'],
    timeframe: '8 months',
  },
  {
    id: 'stonegate-homes',
    client: 'Stonegate Custom Homes',
    vertical: 'Custom Home Builder · Virginia',
    metric: '61%',
    metricLabel: 'Close rate, up from 34%',
    story: 'A 15-year custom home builder with a reputation that outpaced their digital presence. Launch-to-results in 48 hours.',
    quote: 'I was skeptical. I\'ve been burned by three agencies before. My close rate went from 34% to 61% in the first quarter. The AI phone agent alone paid for everything by month two.',
    services: ['Website System', 'AI Phone Concierge', 'Brand Identity'],
    timeframe: '48-hour launch',
  },
] as const

// ─── PROCESS ─────────────────────────────────────────────────────────────────

export const PROCESS_STEPS = [
  {
    id: 'discovery',
    number: '01',
    name: 'Discovery',
    timeline: '24 hours',
    body: 'A focused conversation about your business — your verticals, your market, your current digital presence, your growth goals. We come prepared with research on your competitors, your local search landscape, and your ideal client profile. By the end of this call, we know exactly what to build and why.',
    youDo: 'Show up and tell us what\'s working and what\'s not.',
    weDo: 'Audit your market, your competitors, your existing presence. Deliver a clear system scope.',
    checklist: [
      'Competitor digital audit',
      'Local SEO gap analysis',
      'Current conversion rate assessment',
      'System scope finalized',
    ],
  },
  {
    id: 'build',
    number: '02',
    name: 'Build',
    timeline: '24–48 hours',
    body: 'Our team executes the build. No handoffs, no contractor chains, no waiting. The designer and developer who scoped your system are the ones building it. Every component is purpose-built for your verticals and your client.',
    youDo: 'Send us your logo, brand assets, project photography, and service details.',
    weDo: 'Build the complete system — site, AI agent, SEO foundation, brand assets.',
    checklist: [
      'Custom design, zero templates',
      'AI agent training on your services',
      'SEO technical foundation installed',
      'Content populated and optimized',
    ],
  },
  {
    id: 'review',
    number: '03',
    name: 'Review',
    timeline: '12 hours',
    body: 'One review round. Not five. One. We send the build. You tell us what to adjust. We adjust it. This works because the build was right the first time — the review is refinement, not reconstruction.',
    youDo: 'Review the build and give us a consolidated list of changes.',
    weDo: 'Execute revisions same day.',
    checklist: [
      'Full site walkthrough delivered',
      'Revision request window: 12 hours',
      'Changes executed: same day',
      'Final approval before launch',
    ],
  },
  {
    id: 'launch',
    number: '04',
    name: 'Launch',
    timeline: '1 hour',
    body: 'Domain pointed, DNS propagated, SSL secured, analytics installed, tracking configured. The system goes live and is immediately operational. Your AI agent is trained. Your site is indexed. You are in market.',
    youDo: 'Provide domain access and press go.',
    weDo: 'Handle every technical element of launch.',
    checklist: [
      'DNS configuration and SSL',
      'Google Analytics + Search Console',
      'AI agent live and taking calls',
      'Initial indexing submitted',
    ],
  },
  {
    id: 'optimize',
    number: '05',
    name: 'Optimize',
    timeline: 'Ongoing',
    body: 'Your retainer is not a maintenance fee. It is a growth engine. Every month: search rankings reviewed, content added, conversion data analyzed, AI agent performance tuned, new opportunities identified. The system improves because we are operators, not handoff artists.',
    youDo: 'Review monthly reporting and flag business changes.',
    weDo: 'Execute the monthly growth agenda.',
    checklist: [
      'Monthly ranking + traffic report',
      'Content additions for new keywords',
      'Conversion rate review',
      'AI agent performance audit',
    ],
  },
] as const

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: 'tx-pool',
    quote: 'We were averaging 3 calls a week. Now we\'re averaging 19. Our close rate went up because the leads are better — they already know our prices and they\'re ready to move.',
    author: 'J. Marcus',
    role: 'Owner, Pool Builder',
    market: 'Dallas–Fort Worth',
    metric: '19 calls/wk',
  },
  {
    id: 'ga-hvac',
    quote: 'Before UpLevel I was invisible online. Now my competitors are asking who built my site. I have turned down two acquisition offers this year.',
    author: 'R. Frost',
    role: 'Owner, HVAC',
    market: 'Atlanta Metro',
    metric: '287% SEO growth',
  },
  {
    id: 'va-homes',
    quote: 'I was skeptical. I\'ve been burned by three agencies before. My close rate went from 34% to 61% in the first quarter. The AI phone agent alone paid for everything by month two.',
    author: 'D. Stone',
    role: 'Owner, Custom Homes',
    market: 'Richmond, VA',
    metric: '61% close rate',
  },
] as const

// ─── PRICING ─────────────────────────────────────────────────────────────────

export const PRICING_TIERS = [
  {
    id: 'foundation',
    name: 'Foundation System',
    description: 'For contractors ready to establish a serious digital presence.',
    setup: '$3,500',
    retainer: '$297/mo',
    ideal: 'Best for contractors under $750K/year',
    services: [
      'Website System (custom design)',
      'Core SEO technical foundation',
      'Google Analytics + Search Console',
      'Monthly performance report',
      '1 content piece per month',
    ],
    cta: 'Start the Foundation',
    featured: false,
  },
  {
    id: 'growth',
    name: 'Growth System',
    description: 'Website + AI agent. The combination that changes your call volume.',
    setup: '$8,500',
    retainer: '$697/mo',
    ideal: 'Best for contractors at $750K–$2M/year',
    services: [
      'Everything in Foundation',
      'AI Phone Concierge (full setup)',
      'Call qualification + booking',
      'CRM integration',
      '2 content pieces per month',
    ],
    cta: 'Start the Growth System',
    featured: true,
  },
  {
    id: 'authority',
    name: 'Authority System',
    description: 'The full system. Website + AI + SEO domination.',
    setup: '$14,500',
    retainer: '$1,197/mo',
    ideal: 'Best for contractors at $2M+/year',
    services: [
      'Everything in Growth',
      'Full SEO domination campaign',
      'Local + regional rank strategy',
      'Competitive keyword conquest',
      '4 content pieces per month',
    ],
    cta: 'Start the Authority System',
    featured: false,
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Build',
    description: 'Brand identity + full system. For operators who want everything done right the first time.',
    setup: 'From $24,500',
    retainer: 'From $1,200/mo',
    ideal: 'Best for new ventures or complete rebrands',
    services: [
      'Everything in Authority',
      'Full brand identity system',
      'Logo + mark + style guide',
      'Business + jobsite collateral',
      'Dedicated account management',
    ],
    cta: 'Discuss Full Stack',
    featured: false,
  },
] as const

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    category: 'Process',
    q: 'How is your 48-hour launch possible?',
    a: 'Because we have a proven build system for contractor verticals specifically — not a general-purpose agency workflow. We have built enough pool builder sites, HVAC sites, and custom home builder sites that the architecture is fast and the decisions are already made. The 48 hours is for the build, not the discovery. Full timeline including discovery and review is typically 5–7 business days.',
  },
  {
    category: 'Process',
    q: 'What do I need to provide to get started?',
    a: 'Your logo files (or we build your brand from scratch if that\'s part of your package), project photography (your best 8–15 images of completed work), a list of your services and service areas, and whatever testimonials you have. We handle all writing, design, development, and technical configuration.',
  },
  {
    category: 'Process',
    q: 'How many revision rounds do I get?',
    a: 'One. Not because we are rigid — because we build it right the first time. Our discovery process is thorough specifically so the review round is refinement, not reconstruction. Every client we have had who needed more than one round did so because they sent us their revision requests in multiple batches. Send them all at once and we turn it in one pass.',
  },
  {
    category: 'Pricing',
    q: 'Why no hourly rates or project-by-project quoting?',
    a: 'Because you don\'t hire a framing crew by the nail. You hire them for the frame. Our packages are scoped to deliver complete, performing systems — not deliverables you then have to figure out how to use. The setup fee builds the system. The retainer runs and grows it.',
  },
  {
    category: 'Pricing',
    q: 'Is the retainer month-to-month?',
    a: 'Yes. Month-to-month after an initial 3-month commitment. The 3-month minimum is because SEO and conversion optimization require a baseline period to show real data. Clients who have left have done so with better results than when they arrived — but almost none have left.',
  },
  {
    category: 'AI',
    q: 'What exactly does the AI Phone Concierge do?',
    a: 'It answers every call your business receives, 24 hours a day. It introduces itself as your business, qualifies the lead (What service are you looking for? Where is the property? What is your timeline?), answers common service and pricing questions using information we train it on, and either books a consultation into your calendar or routes hot leads to your mobile. Full call transcripts are sent to your CRM or email after every call.',
  },
  {
    category: 'AI',
    q: 'Will callers know they\'re talking to an AI?',
    a: 'If they ask directly, it will tell them. We believe in that. What we have found is that when the AI is trained correctly on your services and speaks with confidence, most callers don\'t ask — they just get their questions answered and schedule their consultation. The goal is not deception; it is qualification and service.',
  },
  {
    category: 'Results',
    q: 'What results can I realistically expect?',
    a: 'In year one: average organic search traffic increase of 180–340%. Average call volume increase of 4–8x for clients who add the AI phone agent. Close rate improvement of 15–25 percentage points for clients whose previous site was doing the qualification work poorly. These are averages across 47 clients, not best-case projections.',
  },
  {
    category: 'Results',
    q: 'What if I\'m not happy with the results?',
    a: 'We have never had a client leave because of poor results — our 98% satisfaction rate reflects that. If results are not tracking correctly in the first 90 days, we rebuild whatever is not performing at no additional cost. The retainer is month-to-month for a reason: we earn your business every month.',
  },
] as const

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/contact' },
] as const

// ─── DESIGN TOKENS (for use in non-Tailwind contexts) ─────────────────────────

export const COLORS = {
  void: '#05050A',
  surface1: '#0C0D14',
  surface2: '#13141E',
  accent: '#2F7EFF',
  accentGlow: 'rgba(47,126,255,0.12)',
  alert: '#FF3D2E',
  primary: '#F1F2FF',
  secondary: '#5C6278',
  ghost: '#21222E',
} as const

export const TIMING = {
  introTotal: 3200,
  gridReveal: 400,
  crosshairAppear: 200,
  crosshairComplete: 680,
  wordmarkStart: 600,
  wordmarkComplete: 1080,
  statusStart: 980,
  progressComplete: 1900,
  worldReveal: 1600,
  scrollEnable: 3000,
  exitDuration: 880,
} as const
