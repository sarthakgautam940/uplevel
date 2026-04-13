import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { brand, siteUrl } from "../../lib/brand.config";
import { TransitionProvider } from "@/context/TransitionContext";
import LenisProvider from "@/components/LenisProvider";
import GlobalChrome from "@/components/GlobalChrome";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UpLevel Services — Premium Digital + Applied AI",
    template: "%s | UpLevel Services",
  },
  description: brand.tagline,
  keywords: [
    "luxury service website design",
    "high ticket creative agency",
    "conversion focused web design",
    "applied AI for service businesses",
    "premium contractor website",
    "Virginia web studio",
  ],
  authors: [{ name: brand.legalName }],
  openGraph: {
    title: "UpLevel Services — Premium Digital + Applied AI",
    description: brand.tagline,
    type: "website",
    locale: "en_US",
    siteName: brand.legalName,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "UpLevel Services — Premium Digital + Applied AI",
    description: brand.tagline,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.legalName,
  description: brand.tagline,
  url: siteUrl,
  email: brand.email,
  address: {
    "@type": "PostalAddress",
    addressRegion: "VA",
    addressCountry: "US",
  },
  areaServed: "United States",
  priceRange: "$$$",
  serviceType: [
    "Web Design",
    "Web Development",
    "AI Integration",
    "Digital Marketing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <TransitionProvider>
          <LenisProvider>
            {/*
             * SiteNav lives here — persists across all routes, never remounts.
             * First-visit gating handled internally via sessionStorage +
             * 'uplevel:preloader-done' custom event.
             */}

            {/* Page transition overlay — sweeps over route changes */}

            {/* Custom scrollbar thumb */}

            {children}

            {/* Overlays after page content so fixed layers paint above route DOM order */}
            <GlobalChrome />
          </LenisProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
