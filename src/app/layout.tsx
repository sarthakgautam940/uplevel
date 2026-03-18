import type { Metadata } from "next";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "UpLevel Services — AI-Powered Sales Systems for Contractors",
  description:
    "We build automated lead engines for high-ticket contractors. AI voice, instant SMS routing, and conversion-optimized design — live in 14 days.",
  keywords: [
    "AI website for contractors",
    "contractor lead generation",
    "AI voice assistant for pool builders",
    "automated lead routing",
    "web design for contractors Virginia",
  ],
  openGraph: {
    title: "UpLevel Services — Your AI-Powered Sales System",
    description:
      "We build automated lead engines for high-ticket contractors. AI voice, instant SMS routing, live in 14 days.",
    url: "https://uplevelservicesllc.com",
    siteName: "UpLevel Services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpLevel Services — AI-Powered Sales Systems",
    description: "AI voice, instant SMS routing, and conversion design for contractors. Live in 14 days.",
  },
  metadataBase: new URL("https://uplevelservicesllc.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to font CDNs */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CustomCursor />
        <NoiseOverlay />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
