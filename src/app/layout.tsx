import type { Metadata } from 'next'
import { Outfit, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { NoiseOverlay } from '@/components/ui/NoiseOverlay'
import Nav from '@/components/ui/Nav'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UpLevel Services — Digital Growth for Elite Contractors',
  description:
    'Premium website systems, AI phone agents, SEO, and brand identity for pool builders, HVAC operators, and custom home contractors. 47+ clients. 340% average ROI year one.',
  keywords: [
    'contractor digital marketing',
    'pool builder website',
    'HVAC marketing agency',
    'custom home builder SEO',
    'AI phone agent contractors',
    'contractor website design',
    'Richmond VA digital agency',
  ],
  openGraph: {
    title: 'UpLevel Services — Digital Growth for Elite Contractors',
    description:
      '47 clients. 98% satisfaction. 340% average ROI year one. We engineer digital systems for contractors who build the extraordinary.',
    url: 'https://uplevelservices.co',
    siteName: 'UpLevel Services',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#05050A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <CustomCursor />
          <NoiseOverlay />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
