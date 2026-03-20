# UpLevel Services — Homepage

**Blueprint Zero** · A cinematic 3D scroll-driven website for UpLevel Services LLC.

## Stack
- Next.js 15 (App Router) · React 19 · TypeScript strict
- Three.js 0.169 · GSAP 3.12 · Lenis 1.0.42 · Framer Motion 11

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (all sections)
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Design tokens + global styles
│   ├── work/page.tsx         # Work page (placeholder)
│   ├── services/page.tsx     # Services page (placeholder)
│   └── contact/page.tsx      # Contact page with form
├── components/
│   ├── intro/
│   │   └── IntroAnimation.tsx   # 3-second cinematic intro
│   ├── world/
│   │   ├── WorldScene.tsx       # Three.js Blueprint Zero world
│   │   └── shaders.ts           # All GLSL shader strings
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ManifestoSection.tsx
│   │   ├── KineticBand.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WorkSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── CustomCursor.tsx
│   │   ├── Nav.tsx
│   │   └── NoiseOverlay.tsx
│   └── providers/
│       └── Providers.tsx        # Lenis + GSAP ScrollTrigger
└── lib/
    ├── brand.ts                 # All company content + design tokens
    └── scroll.ts                # Shared scroll + mouse state singletons
```

## Notes
- `reactStrictMode: false` — required for Three.js single-renderer pattern
- Three.js WorldScene is dynamically imported (SSR disabled)
- Custom cursor hidden on mobile (≤480px)
- Lenis smooth scroll; GSAP ScrollTrigger reads from Lenis RAF
