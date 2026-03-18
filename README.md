# UpLevel Services

AI-powered sales systems for high-ticket contractors. Built with Next.js 15, Tailwind CSS, and Framer Motion.

## Prerequisites

- **Node.js** 18+ (LTS recommended) — [nodejs.org](https://nodejs.org)
- **npm** (included with Node.js)

Check your setup:

```bash
node --version
npm --version
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and fill in your keys
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `NOTIFICATION_EMAIL` | Email to receive form submissions |
| `MAKE_WEBHOOK_URL` | Make.com webhook for lead automation |
| `NEXT_PUBLIC_VAPI_KEY` | Vapi AI voice assistant (optional) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi assistant ID (optional) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly booking link |

The site works without Vapi keys — the AI widget runs in demo mode.

## Project Structure

```
├── lib/
│   └── brand.config.ts   ← Edit this to rebrand everything
├── src/
│   ├── app/
│   │   ├── globals.css   ← Design system, fonts, CSS variables
│   │   ├── layout.tsx    ← Root HTML shell, metadata
│   │   ├── page.tsx      ← Section order / composition
│   │   └── api/contact/  ← Form submissions → Make.com + Resend
│   ├── hooks/
│   └── components/
└── ...
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Deploy

Vercel auto-detects Next.js. No extra config needed.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
