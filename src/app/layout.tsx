import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — We Build the Machine That Fills Your Calendar",
  description: "Premium website systems, AI phone agents, and automated lead pipelines for elite contractors. Live in 48 hours. Based in Richmond, VA.",
  keywords: "web design contractors, AI phone agent, lead generation, pool builder website, HVAC website, Virginia web agency",
  openGraph: {
    title: "UpLevel Services — AI-Powered Web Systems",
    description: "We build the machine that fills your calendar.",
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
