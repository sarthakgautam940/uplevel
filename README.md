# UpLevel Services v4

## Setup
```bash
npm install
npm run dev   # → http://localhost:3000
```

## Pages
- `/`          Home (hero + all sections)
- `/work`      Horizontal drag-scroll case study gallery
- `/work/[slug]` Individual case study
- `/services`  Full services + process + pricing
- `/contact`   Lead capture form

## Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel (vercel.com/new)
3. Add env vars in Vercel dashboard:
   - `NEXT_PUBLIC_VAPI_KEY`
   - `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
   - `NEXT_PUBLIC_GA_ID`
   - `RESEND_API_KEY`
   - `NOTIFICATION_EMAIL`
4. Deploy

## Rebrand
All content → `lib/brand.ts`
All colors → `src/app/globals.css` `:root` (--gold, --ink, --white)

## Stack
Next.js 15 · Lenis · Three.js · Framer Motion · GSAP-ready · WebGL/GLSL
