import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — The Website Your Work Deserves",
  description: "World-class website systems, AI phone agents, and automated lead pipelines for elite contractors. Richmond, VA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden="true" />
        <div id="sp" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
