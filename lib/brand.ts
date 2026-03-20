export const brand = {
  name: 'UpLevel',
  fullName: 'UpLevel Services',
  tagline: 'THE WEBSITE YOUR WORK DESERVES.',
  email: 'hello@uplevelservices.co',
  calendly: 'https://calendly.com/uplevelservices/discovery',
  location: 'Richmond, VA',
  entity: 'VA LLC Est. 2024',
  slots: 1,

  stats: {
    clients: 47,
    satisfaction: 98,
    roi: 340,
    avgLaunch: 48,
  },

  hero: {
    eyebrow: 'RICHMOND, VA  ·  DIGITAL GROWTH AGENCY',
    h1: ['THE WEBSITE', 'YOUR WORK', 'DESERVES.'],
    sub: 'UpLevel builds premium website systems, AI phone agents, and automated lead pipelines for elite contractors — live in 48 hours.',
    cta1: 'START A PROJECT',
    cta2: 'SEE OUR WORK',
    badges: ['48-HOUR DELIVERY', 'MONTH-TO-MONTH', 'VA LLC EST. 2024'],
  },

  manifesto: {
    eyebrow: 'OUR BELIEF',
    statement:
      'Every contractor who builds something extraordinary deserves a digital presence that says so.',
    body: 'The best pool builders, custom home crafters, and HVAC engineers in the country are losing clients to inferior competitors with better websites. That ends here.',
    stats: [
      { value: 340, suffix: '%', label: 'Average Year-One ROI' },
      { value: 47, suffix: '+', label: 'Contractor Clients Served' },
      { value: 98, suffix: '%', label: 'Client Satisfaction Rate' },
    ],
  },

  services: [
    {
      id: '01',
      name: 'Website System',
      short: 'WEB',
      description:
        'A conversion-engineered website that turns traffic into booked calls. Not a brochure. A business asset.',
      deliverables: [
        'Full custom design & development',
        'CRM integration & lead capture',
        'Mobile-first, <2s load time',
        'Analytics & conversion tracking',
      ],
      price: '$3,500',
      recurring: '$297/mo',
      accent: '#2F7EFF',
    },
    {
      id: '02',
      name: 'AI Concierge',
      short: 'AI',
      description:
        'An AI phone agent that answers calls, qualifies leads, and books appointments — 24/7, never takes a day off.',
      deliverables: [
        'Custom AI voice agent',
        'Lead qualification logic',
        'CRM sync & appointment booking',
        'Call transcripts & analytics',
      ],
      price: '$6,500',
      recurring: '$497/mo',
      accent: '#78AAFF',
    },
    {
      id: '03',
      name: 'SEO Domination',
      short: 'SEO',
      description:
        "Own the first page in your market. We build the content and technical architecture that makes Google choose you.",
      deliverables: [
        'Local SEO + Google Business optimization',
        'Technical SEO audit & remediation',
        'Monthly content & link building',
        'Ranking reports & strategy calls',
      ],
      price: '$4,800',
      recurring: '$397/mo',
      accent: '#5A7FD4',
    },
    {
      id: '04',
      name: 'Brand Identity',
      short: 'BRAND',
      description:
        'Logo, color system, typography, and visual standards. The foundation that makes every touchpoint look elite.',
      deliverables: [
        'Logo suite & brand mark',
        'Color & typography system',
        'Brand standards guide',
        'Business card & collateral design',
      ],
      price: '$2,800',
      recurring: '$197/mo',
      accent: '#4A6BAA',
    },
  ],

  work: [
    {
      slug: 'palmetto-pools',
      name: 'Palmetto Pools',
      type: 'Pool Builder',
      location: 'Charleston, SC',
      metric: '$340K',
      metricLabel: 'attributed revenue, Q1',
      story:
        'Transformed a word-of-mouth pool builder into the dominant digital presence in Charleston. Booked solid through summer within 6 weeks of launch.',
      accent: '#1E6B9C',
      image: '/work/palmetto.jpg',
    },
    {
      slug: 'summit-hvac',
      name: 'Summit HVAC',
      type: 'HVAC Contractor',
      location: 'Denver, CO',
      metric: '340%',
      metricLabel: 'increase in inbound leads',
      story:
        'New website + AI phone agent combination. Summit went from 3 leads/week to 14 leads/week in 90 days.',
      accent: '#2A5C8A',
      image: '/work/summit.jpg',
    },
    {
      slug: 'vincraft-cellars',
      name: 'VinCraft Cellars',
      type: 'Wine Cellar Builder',
      location: 'Napa, CA',
      metric: '$180K',
      metricLabel: 'single project from website inquiry',
      story:
        'Ultra-premium positioning for a luxury wine cellar builder. The site speaks to collectors, not contractors.',
      accent: '#3D3260',
      image: '/work/vincraft.jpg',
    },
    {
      slug: 'cascade-custom-homes',
      name: 'Cascade Custom Homes',
      type: 'Custom Home Builder',
      location: 'Seattle, WA',
      metric: '$1.2M',
      metricLabel: 'project closed from web contact',
      story:
        "James Whitfield's client said they chose Cascade before they even called — just from the website.",
      accent: '#2E5E4A',
      image: '/work/cascade.jpg',
    },
    {
      slug: 'apex-restoration',
      name: 'Apex Restoration',
      type: 'Restoration Contractor',
      location: 'Atlanta, GA',
      metric: '2.8×',
      metricLabel: 'revenue growth in 12 months',
      story:
        'Full system: website + SEO + AI agent. Apex went from $800K to $2.2M in annual revenue.',
      accent: '#7A2E2E',
      image: '/work/apex.jpg',
    },
  ],

  testimonials: {
    featured: {
      quote:
        '$1.2 million custom build from a website contact form. The client said they chose us before they even called — just from the website.',
      name: 'James Whitfield',
      company: 'Cascade Custom Homes',
      title: 'Owner & Principal Builder',
    },
    cards: [
      {
        quote:
          "We went from 3 leads a week to 14. I didn't realize how much money we were leaving on the table with our old site.",
        name: 'Marcus Chen',
        company: 'Summit HVAC',
        stars: 5,
      },
      {
        quote:
          'UpLevel delivered in 6 days. Six days. My old agency took 4 months and gave me something I was embarrassed to show clients.',
        name: 'Sandra Reeves',
        company: 'Palmetto Pools',
        stars: 5,
      },
      {
        quote:
          'The AI phone agent paid for itself in the first month. I was missing calls at 10pm. Now those calls become booked appointments.',
        name: 'David Okonkwo',
        company: 'Apex Restoration',
        stars: 5,
      },
    ],
  },

  pricing: [
    {
      name: 'Starter',
      price: '$3,500',
      recurring: '$297/mo',
      description: 'A conversion-engineered website to establish your digital presence.',
      features: [
        'Custom 5-page website',
        'Mobile & speed optimized',
        'Lead capture forms',
        'Google Analytics setup',
        'CRM integration',
        '1 revision round',
        '48-hour delivery',
      ],
      cta: 'START STARTER',
      highlight: false,
    },
    {
      name: 'Authority',
      price: '$6,500',
      recurring: '$497/mo',
      description: 'Website + AI Concierge. The full acquisition system that runs itself.',
      features: [
        'Everything in Starter',
        'AI phone agent (24/7)',
        'Lead qualification logic',
        'Appointment booking system',
        'Call analytics dashboard',
        '3 revision rounds',
        'Priority support',
      ],
      cta: 'START AUTHORITY',
      highlight: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Dominator',
      price: '$12,000',
      recurring: '$797/mo',
      description: 'Full system: website + AI + SEO. Own your market completely.',
      features: [
        'Everything in Authority',
        'Full SEO campaign',
        'Google Business optimization',
        'Monthly content & links',
        'Ranking reports',
        'Quarterly strategy calls',
        'Dedicated account manager',
      ],
      cta: 'START DOMINATOR',
      highlight: false,
    },
    {
      name: 'Bespoke',
      price: '$18K–$35K',
      recurring: '$1,200/mo',
      description: 'Fully custom engagement for category-defining contractors.',
      features: [
        'Custom scope & deliverables',
        'Brand identity system',
        'Full digital infrastructure',
        'White-glove onboarding',
        'Executive strategy sessions',
        'Direct founder access',
        'Performance guarantees',
      ],
      cta: 'INQUIRE',
      highlight: false,
    },
  ],

  process: [
    {
      number: '01',
      title: 'Discovery',
      description:
        'We learn your market, your competitors, and your best clients. Everything we build is informed by what actually wins in your specific trade.',
      duration: 'Day 1',
    },
    {
      number: '02',
      title: 'Strategy',
      description:
        'We map the conversion architecture — what pages exist, what each one does, how visitors move through the system toward a booked call.',
      duration: 'Day 1–2',
    },
    {
      number: '03',
      title: 'Design',
      description:
        'Full design in Figma. You see exactly what you get before we write a line of code. One round of feedback, then locked.',
      duration: 'Day 2–3',
    },
    {
      number: '04',
      title: 'Build',
      description:
        "We develop, integrate, and test. Every form works. Every pixel is correct. No 'we'll fix that later' — it's right before we ship.",
      duration: 'Day 3–6',
    },
    {
      number: '05',
      title: 'Launch',
      description:
        'Live on your domain. Analytics tracking from minute one. We monitor performance for 30 days and optimize based on real visitor data.',
      duration: 'Day 6–48',
    },
  ],

  faq: [
    {
      category: 'Process',
      question: 'Do you really deliver in 48 hours?',
      answer:
        'Yes, with conditions. The 48-hour timeline applies to our Starter package for clients who complete onboarding promptly and have their content ready. More complex packages take 5-7 days. Either way, we move faster than any agency you\'ve worked with.',
    },
    {
      category: 'Process',
      question: "What do you need from me to get started?",
      answer:
        'A call, your logo files, and answers to 8 questions about your business. We handle everything else — copywriting, photography direction, and technical setup. You don\'t need to know anything about websites.',
    },
    {
      category: 'Pricing',
      question: "Why is there a monthly fee?",
      answer:
        'The monthly retainer covers hosting (fast, enterprise-grade), security monitoring, software updates, analytics review, and ongoing optimization. It\'s not support ticketing — it\'s active maintenance of a live business asset.',
    },
    {
      category: 'Pricing',
      question: 'Are there contracts?',
      answer:
        'Month-to-month after the first 3 months. We don\'t lock you in because we\'re confident in the results. The 3-month initial term exists because meaningful SEO and lead generation results take time to materialize.',
    },
    {
      category: 'AI',
      question: 'How does the AI phone agent work?',
      answer:
        'It answers your business calls using a trained AI voice that knows your services, pricing, and availability. It qualifies leads, answers common questions, and books appointments directly into your calendar. You get a transcript of every call.',
    },
    {
      category: 'AI',
      question: "Will my clients know they're talking to AI?",
      answer:
        "Your agent can be configured to disclose or not — your call. What we've found is that clients care about getting answers, not who gives them. The agent is more responsive and knowledgeable than most receptionists.",
    },
    {
      category: 'Results',
      question: 'What results can I realistically expect?',
      answer:
        'Our clients average 340% ROI in year one. Concrete examples: Palmetto Pools attributed $340K to the website in Q1. Summit HVAC went from 3 to 14 leads per week. Cascade Custom Homes closed a $1.2M project from a web contact form.',
    },
    {
      category: 'Results',
      question: 'What if I already have a website?',
      answer:
        "Then you have a chance to see exactly what's costing you leads. We'll audit your current site on the discovery call and show you the specific gaps. Most contractors are surprised by how much low-hanging fruit exists.",
    },
  ],
}

export type Service = (typeof brand.services)[0]
export type WorkItem = (typeof brand.work)[0]
export type PricingTier = (typeof brand.pricing)[0]
export type ProcessStep = (typeof brand.process)[0]
export type FaqItem = (typeof brand.faq)[0]
