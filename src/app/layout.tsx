import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — Premium Digital Systems for Elite Contractors",
  description:
    "UpLevel builds world-class website systems, AI phone agents, and automated lead pipelines for high-ticket contractors. Live in 48 hours. No templates. No lock-in.",
  keywords:
    "website design Richmond VA, contractor website, AI phone agent, local SEO, pool builder website, HVAC website, custom home builder website",
  authors: [{ name: "UpLevel Services LLC" }],
  creator: "UpLevel Services LLC",
  publisher: "UpLevel Services LLC",
  metadataBase: new URL("https://uplevelservices.co"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uplevelservices.co",
    siteName: "UpLevel Services",
    title: "UpLevel Services — The Website Your Work Deserves",
    description:
      "Premium website systems, AI phone agents, and lead pipelines for elite contractors. Live in 48 hours.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UpLevel Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UpLevel Services",
    description: "Premium digital systems for elite contractors.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
