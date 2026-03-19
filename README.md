# UpLevel Services — Website

Premium digital systems for elite contractors. Richmond, Virginia.

Built with Next.js 15, GSAP, Three.js, and Framer Motion.

---

## Quick Deploy (5 minutes)

### 1. Unzip and Install

```bash
unzip uplevel-services.zip
cd uplevel-services
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_VAPI_KEY` | [vapi.ai](https://vapi.ai) → Account → API Keys |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | vapi.ai → Assistants → copy ID |
| `NEXT_PUBLIC_GA_ID` | Google Analytics → Measurement ID |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `NOTIFICATION_EMAIL` | Your email (e.g. hello@uplevelservices.co) |
| `MAKE_WEBHOOK_URL` | Make.com → Webhooks → copy URL |

> All env vars are optional for dev. The site works without them — form submissions just won't send email.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

#### Option A — Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

#### Option B — GitHub + Vercel Dashboard
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel handles everything

---

## Domain Setup (uplevelservices.co)

1. In Vercel dashboard → Project → Settings → Domains
2. Add `uplevelservices.co` and `www.uplevelservices.co`
3. In your domain registrar (Namecheap, GoDaddy, etc.) update nameservers to Vercel's
4. Or add the CNAME/A records Vercel shows you
5. SSL is automatic — takes ~10 minutes

---

## Rebrand for a Client (under 10 minutes)

All site copy, colors, pricing, and testimonials live in ONE file:

```
src/config/brand.config.ts
```

### Steps:
1. **Company details**: Update `brand` object (name, email, calendly, location)
2. **Colors**: Update `colors` object — change `--accent` to client's brand color
3. **Services**: Update `services` array with client's actual services
4. **Pricing**: Update `pricing` array
5. **Projects/work**: Update `projects` array with client case studies
6. **Testimonials**: Update `testimonials` array
7. **Stats**: Update `stats` array with real numbers
8. **Process steps**: Update `processSteps` if the process differs
9. **FAQ**: Update `faqs` array

Then update `globals.css` — find `:root` and change `--accent` and `--accent-rgb` values.

---

## Architecture

```
src/
  app/
    page.tsx              — Home page (composes all sections)
    layout.tsx            — Root layout with metadata
    globals.css           — Brand token system + all base styles
    api/contact/route.ts  — Contact form API (Resend + Make.com)
    work/[slug]/
      page.tsx            — Case study page (SSG)
      CaseStudyClient.tsx — Client-rendered case study
  components/
    LoadingScreen.tsx     — Alche-style canvas loader + quadrant exit
    Navigation.tsx        — Transparent → frosted glass nav
    LogoMark.tsx          — SVG logo component
    Hero.tsx              — Three.js torus knot + GSAP headline reveal
    TrustMarquee.tsx      — Infinite scroll trust strip
    Manifesto.tsx         — Word-by-word scroll reveal editorial section
    Services.tsx          — 2×2 card grid with 3D tilt + spotlight
    Work.tsx              — Horizontal scroll gallery + clip-path transitions
    Process.tsx           — Sticky left + scrolling right steps
    Stats.tsx             — Count-up numbers on viewport entry
    Pricing.tsx           — 4-tier cards with popular highlight
    Testimonials.tsx      — Featured pullquote + rotated card grid
    FAQ.tsx               — Two-column filtered accordion
    Contact.tsx           — Floating label form + service chips
    Footer.tsx            — Three.js letter animation + footer content
    AIChat.tsx            — ARIA chatbot widget
    CustomCursor.tsx      — Dot + trailing ring with labels
    ScrollProgress.tsx    — Right-edge scroll indicator
  config/
    brand.config.ts       — Single source of truth for ALL content
```

---

## Performance Notes

- All heavy components use `dynamic(() => import(...), { ssr: false })`
- Three.js canvases cleanup `cancelAnimationFrame` + `renderer.dispose()` on unmount
- GSAP ScrollTrigger instances are killed on component unmount
- Images should be added via Next.js `<Image>` component for automatic optimization
- Target: Lighthouse 85+ Performance, 95+ Accessibility

---

## Adding Real Project Images

Replace gradient backgrounds in `Work.tsx` project cards:

```tsx
// In Work.tsx, inside ProjectCard:
background: `url('/images/projects/${project.slug}.jpg') center/cover`
```

Save images to `public/images/projects/[slug].jpg` at 680×960px minimum.

---

## Customizing the AI Chat (ARIA)

The chat widget (`AIChat.tsx`) uses predefined responses for demo. To connect a real AI:

1. Add `NEXT_PUBLIC_VAPI_KEY` and `NEXT_PUBLIC_VAPI_ASSISTANT_ID` to env
2. The Vapi integration can be added to the chat widget's `sendMessage` function
3. Or connect to your own API route that calls Claude/GPT with a system prompt

---

## Contact / Support

hello@uplevelservices.co  
https://calendly.com/uplevelservices/discovery
