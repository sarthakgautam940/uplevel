import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UpLevel Services — The Website Your Work Deserves',
  description:
    'UpLevel builds premium website systems, AI phone agents, and automated lead pipelines for elite contractors — live in 48 hours.',
  keywords: ['contractor website', 'digital agency', 'AI phone agent', 'SEO', 'Richmond VA'],
  openGraph: {
    title: 'UpLevel Services',
    description: 'The website your work deserves.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
