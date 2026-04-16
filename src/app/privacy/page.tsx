import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-[var(--text)]">
      <h1 className="font-display text-4xl">Privacy Policy</h1>
      <p className="mt-6 font-body text-[var(--text-dim)]">
        This page outlines how UpLevel Services handles personal data, contact information, and communication
        records for business inquiries.
      </p>
    </main>
  );
}
