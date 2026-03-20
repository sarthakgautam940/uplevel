import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — The Website Your Work Deserves",
  description: "Premium website systems, AI phone agents, and automated lead pipelines for elite contractors. Richmond, VA. Live in 48 hours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden />
        <div id="scroll-progress" aria-hidden />
        {children}
      </body>
    </html>
  );
}
