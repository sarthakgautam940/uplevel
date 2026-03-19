import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — The Website Your Work Deserves",
  description: "World-class website systems, AI phone agents, and automated lead pipelines for high-ticket contractors. Live in 48 hours. Based in Richmond, VA.",
  openGraph: {
    title: "UpLevel Services — The Website Your Work Deserves",
    description: "World-class digital growth infrastructure for elite contractors.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
