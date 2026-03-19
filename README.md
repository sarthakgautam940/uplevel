# UpLevel Services v3

## Quick Start
```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy
Push to GitHub → connect to Vercel → add env vars → deploy.

## Env Vars (Vercel dashboard)
- NEXT_PUBLIC_VAPI_KEY
- NEXT_PUBLIC_VAPI_ASSISTANT_ID
- NEXT_PUBLIC_GA_ID
- RESEND_API_KEY
- NOTIFICATION_EMAIL

## Rebrand
All content → lib/brand.ts
All colors → src/app/globals.css :root variables (--gold, --bg)

## Stack
Next.js 15 · Lenis smooth scroll · Three.js · Framer Motion · WebGL · Playfair Display
